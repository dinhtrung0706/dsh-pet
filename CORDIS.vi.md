# Dịch vụ Cordis công khai của dsh-pet

Dịch vụ cùng tên `petApi7340` có một bản ở mỗi nửa, thuộc các container khác nhau (tiến trình host / trang DSH web) và không nhìn thấy lẫn nhau.

Tài liệu này là **hợp đồng đầy đủ** (tham số, trường trả về, trường hợp biên và ví dụ); để xem trước một câu mô tả cho từng thành viên, xem [`CORDIS-API.vi.md`](CORDIS-API.vi.md).

```js
ctx.get('petApi7340')
```

Không lấy được nhóm tương ứng nghĩa là bạn đang ở nửa bên kia, hoặc dsh-pet chưa bật / phiên bản quá cũ.

## Nửa client (bên trong trang DSH web, chỉ có hiệu lực trong trang đó)

Entry trả về `{ getState, menuEvents, pose, progress }`.

### pose

**Tham số**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `petId` | string | ID thú cưng |

**Giá trị trả về**: `{ x, y, facing } \| null`

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `x` | number | Tọa độ ngang của tâm, chuẩn hóa theo viewport trong khoảng 0–1 |
| `y` | number | Tọa độ dọc của tâm, chuẩn hóa theo viewport trong khoảng 0–1 |
| `facing` | `left` \| `right` | Hướng |

`null`: trang này không có thú cưng đó.

```js
ctx.get('petApi7340').pose('main');
// { x: 0.8467, y: 0.2438, facing: 'left' }
```

### progress

**Tham số**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `petId` | string | ID thú cưng |

**Giá trị trả về**: `{ playbackId, anim, currentTime, duration, paused, buffering } \| null`

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `playbackId` | `string \| null` | ID lần phát này; hoạt ảnh tự phát (di chuyển ngẫu nhiên / nhấp / lẩm bẩm…) có giá trị `null` |
| `anim` | string | Hoạt ảnh hiện tại: hành động trong pool trả tên (ví dụ `walk`), phát bằng `url` trả địa chỉ đó |
| `currentTime` | number | Vị trí phát hiện tại, tính bằng giây |
| `duration` | number | Tổng thời lượng video, tính bằng giây; là `0` khi metadata chưa sẵn sàng |
| `paused` | boolean | Có đang tạm dừng hay không; phát xong cũng là `true` |
| `buffering` | boolean | Có đang đệm hay không (`readyState < 3` hoặc đang seek) |

`null`: trang này không có thú cưng đó.

```js
ctx.get('petApi7340').progress('main');
// { playbackId: 'pb_1755...', anim: 'walk', currentTime: 3.42, duration: 10.09, paused: false, buffering: false }
```

### getState

**Tham số**: không có.

**Giá trị trả về**: `PollState | null` — trạng thái thăm dò gần nhất của trang này, cùng cấu trúc với nội dung phản hồi `GET /state`; là `null` nếu nhịp đầu tiên của `/state` chưa trả về.

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `counter` | number | Số phiên bản của toàn bộ trạng thái; tăng mỗi khi bất kỳ lá nào được ghi |
| `sections` | `Record<SectionName, StateLeaf>` | Các phần toàn cục: `balance` / `workStatus` / `notify` / `config` / `menu` |
| `pets` | `Record<petId, Record<PetLeafName, StateLeaf>>` | Các lá riêng của từng thú cưng: `say` / `anim` / `position` / `throw` / `lock` |

Mỗi lá có dạng `{ counter, data }`: khi `counter` thay đổi, mục đó đã thay đổi; `data` là giá trị hiện tại (`null` = chưa từng được ghi).

Điểm cần lưu ý khi sử dụng:

- Giá trị trả về là **tham chiếu tới ảnh chụp**, chỉ đọc; sửa nó sẽ ảnh hưởng đến kết xuất của trang thú cưng.
- Mỗi nhịp thay thế toàn bộ gói trạng thái, vì vậy đối tượng cũ đang giữ sẽ không bị các lần ghi sau sửa đổi.
- Trước nhịp đầu tiên, giá trị là `null`; đây là dữ liệu cấp trang, tab khác không đọc được.
- Không phát sinh yêu cầu: dữ liệu được đọc từ bộ nhớ, có thể đọc khi kết xuất hoặc trong `requestAnimationFrame` khi cần.

```js
const s = ctx.get('petApi7340').getState();
if (s) {
  console.log('版本', s.counter, '这只宠物最近说：', s.pets.main?.say?.data);
}
```

### menuEvents

**Tham số**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `owner` | string | `owner` đã dùng khi đăng ký mục menu |

**Giá trị trả về**: cùng cấu trúc với nội dung phản hồi của `GET /menu/events`.

| Dạng | Nội dung |
| --- | --- |
| Thành công | `{ ok: true, events: Record<label, petId \| null> }` |
| `owner` không xác định | `{ ok: false, reason: 'unknown-owner' }` |

`events` bao gồm toàn bộ mục menu hiển thị trên trang này: giá trị `petId` nghĩa là mục đó đã được nhấp (trên thú cưng nào), `null` nghĩa là chưa được nhấp.

**Đọc là tiêu thụ**: sau khi đọc, mọi dấu sự kiện được đặt lại thành `null`; lần đọc tiếp theo chỉ nhận các lượt nhấp mới. Nếu nhấp liên tiếp cùng một mục thì chỉ giữ lượt cuối. Nếu `owner` này không có mục nào hiển thị trên trang hiện tại (chưa đăng ký, đã xóa hoặc chỉ đăng ký cho `desktop`) thì trả `unknown-owner`.

```js
const res = ctx.get('petApi7340').menuEvents('my-plugin');
if (res.ok) {
  for (const [label, petId] of Object.entries(res.events)) {
    if (petId !== null) console.log(label, '被点了，点在', petId);
  }
}
```

## Nửa host (bên trong tiến trình plugin host)

Entry trả về `{ balance, voice }`.

### balance.register

Cho phép plugin bên thứ ba đăng ký chức năng truy vấn số dư của riêng mình. Host không cần sửa mã cho từng nhà cung cấp.

**Tham số**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `id` | string | ID nhà cung cấp, phải khớp với provider mà DSH báo cáo |
| `fetch` | function | Lấy dữ liệu; đối số chỉ có `{ provider }` (không có key, không có resolveAccount) |

**Giá trị trả về**: `() => void`, hàm hủy đăng ký. Dùng cùng `ctx.effect` để plugin tự hủy đăng ký khi gỡ.

**Ném lỗi khi**: `id` rỗng, `fetch` không phải hàm, xung đột với ID tích hợp hoặc đã được bên thứ ba khác đăng ký.

**Giá trị `fetch` trả về**: `ok` luôn là `true`; mọi lỗi đều phải `throw` (host chuẩn hóa thành `fetch-error`).

| shape | data |
| --- | --- |
| `windows` | `{ monthly, rolling?, weekly?, *CapUsd?, *ResetsAt?, rollingLabel? }` |
| `money` | `{ wallets: [{ currency, total, granted, toppedUp, fullBalance? }], tier? }` |
| `points` | `{ unit, total, full? }` |
| `custom` | Cây nút: `{ views: CustomNode[], percent? }` hoặc `{ rows: CustomNode, detailRows?: CustomNode, percent? }`, xem phần dưới |

```js
export const inject = ['petApi7340'];

export function apply(ctx) {
  ctx.effect(() =>
    ctx.get('petApi7340').balance.register({
      id: 'my-gateway',
      async fetch({ provider }) {
        const res = await fetch('http://127.0.0.1:8080/v1/credits', { signal: AbortSignal.timeout(20_000) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const j = await res.json();
        return { ok: true, provider, shape: 'points', data: { unit: '积分', total: String(j.remaining), full: String(j.limit) } };
      },
    }),
  );
}
```

Host không tự thêm timeout hoặc thử lại cho `fetch`.

#### Dạng `custom`: tự vẽ bong bóng

`data` cung cấp một cây nút; host và hai phía dùng chung một trình kết xuất — bạn hoàn toàn quyết định hình thức bong bóng, không cần sửa mã plugin cho từng nhà cung cấp.

Có hai cách khai báo (`views` được ưu tiên; nếu cung cấp cả hai thì `rows` bị bỏ qua):

| Cách khai báo | Cấu trúc | Số trang |
| --- | --- | --- |
| Nhiều trang | `{ views: CustomNode[], percent? }` | Tối đa 4 trang; nhấp để chuyển trang theo vòng, trang cuối quay về trang đầu |
| Cũ, hai trang | `{ rows: CustomNode, detailRows?: CustomNode, percent? }` | Hợp thành 1–2 trang; nếu chỉ có một trang thì không thể nhấp vào bong bóng |

`percent` là phần trăm đã sử dụng, dùng để điều khiển hoạt ảnh theo bậc số dư: giá trị ngoài phạm vi được giới hạn về 0–100; nếu bỏ trống hoặc không phải số hữu hạn thì không phát hoạt ảnh.

Các trường nút:

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `tag` | `div` \| `span` \| `i` \| `b` \| `strong` \| `em` \| `img` | Thẻ ngoài danh sách cho phép làm toàn bộ trang không hợp lệ |
| `text` | string | Đoạn văn bản, kết xuất trước các nút con |
| `src` | string | Chỉ có hiệu lực với `img`, chỉ chấp nhận `http` / `https` |
| `style` | `Record<string, string>` | Kiểu nội tuyến, khóa dùng camelCase; lớp phân tích lọc theo danh sách cho phép |
| `children` | `CustomNode[]` | Các nút con |

Giới hạn (vượt quá sẽ làm toàn bộ trang không hợp lệ): độ sâu 6, tổng cộng 200 nút trên cả cây, tối đa 24 nút con mỗi nút, tối đa 4 trang. Văn bản của một đoạn dài hơn 120 ký tự sẽ **bị cắt ngắn**; giá trị kiểu của một thuộc tính dài hơn 64 ký tự chỉ làm mất thuộc tính đó; `src` dài hơn 512 ký tự không hợp lệ.

Quy tắc lỗi: `fetch` ném lỗi → bong bóng hiển thị `fetch-error`; `shape: 'custom'` nhưng có trang bất kỳ không hợp lệ → bỏ qua toàn bộ dữ liệu trong nhịp này, không tạo trạng thái nửa lỗi kiểu “các trang đầu bình thường, lật đến trang sau thì hỏng”.

```js
ctx.effect(() =>
  ctx.get('petApi7340').balance.register({
    id: 'my-gateway',
    async fetch({ provider }) {
      return {
        ok: true,
        provider,
        shape: 'custom',
        data: {
          percent: 42,
          views: [
            {
              tag: 'div',
              style: { display: 'flex', gap: '6px' },
              children: [
                { tag: 'span', text: '积分' },
                { tag: 'b', text: '420 / 1000' },
              ],
            },
            { tag: 'div', children: [{ tag: 'span', text: '下次刷新 5 分钟后' }] },
          ],
        },
      };
    },
  }),
);
```

Ví dụ hoàn chỉnh với 4 và 3 trang xem trong `lib/mock-balance.js` thuộc [`tools/cordis-probe`](tools/cordis-probe/README.vi.md) (`mock-custom-kinds` / `mock-custom-fancy`).

### balance.list

**Tham số**: không có.

**Giá trị trả về**: `{ builtin, external }`

| Trường | Kiểu | Mô tả |
| --- | --- | --- |
| `builtin` | string[] | ID nhà cung cấp tích hợp |
| `external` | string[] | ID đã đăng ký từ bên thứ ba |

```js
ctx.get('petApi7340').balance.list();
// { builtin: ['opencode-go', 'commandcode', 'deepseek-official', 'deepseek-account'], external: ['my-gateway'] }
```

### voice.register

Cho phép plugin bên thứ ba đăng ký triển khai tổng hợp giọng nói của riêng mình. Có thể đăng ký nhiều triển khai; mỗi triển khai xuất hiện trong danh mục `GET /voice/voices`. Giọng người dùng chọn sẽ quyết định triển khai nào được gọi.

**Tham số**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `id` | string | Định danh duy nhất, dùng kebab-case; tham gia khóa bộ nhớ đệm; đăng ký trùng sẽ báo lỗi, không ghi đè |
| `name` | string | Tên hiển thị, dùng làm tiêu đề nhóm trên trang cài đặt |
| `voices` | array | Các giọng mà triển khai hỗ trợ, ít nhất một giọng: `{ id, name, tag? }`; `id` chỉ cần duy nhất trong triển khai đó |
| `format` | string? | Định dạng đầu ra `mp3` / `wav`, mặc định `mp3`; quyết định phần mở rộng bộ nhớ đệm và `Content-Type` phản hồi |
| `timeoutMs` | number? | Thời gian tối đa cho một lần tổng hợp (ms), mặc định 15000 |
| `synthesize` | function | Nhận `{ text, voice, rate, signal }`, trả về byte âm thanh (`Uint8Array`) |

`voice` nhận bởi `synthesize` là ID giọng đã **bỏ tiền tố provider**, bảo đảm thuộc `voices` của triển khai này; `rate` là phần trăm dạng số (`0` = tốc độ gốc, `-10` = chậm 10%, phạm vi -50..100).

**Giá trị trả về**: `() => void`, hàm hủy đăng ký. Dùng cùng `ctx.effect` để plugin tự hủy đăng ký khi gỡ.

**Ném lỗi khi**: định nghĩa không phải đối tượng, `id` không ở dạng kebab-case, `name` rỗng, `voices` rỗng hoặc có ID trùng trong nhóm, `format` không phải mp3/wav, `timeoutMs` không phải số dương, `synthesize` không phải hàm hoặc `id` đã được đăng ký.

**Hành vi**

- **Nhiều triển khai cùng tồn tại**: mỗi `id` chỉ có một mục, không ghi đè lẫn nhau; thao tác hủy chỉ xóa đúng mục của mình, lệnh hủy đến muộn không ghi đè mục đăng ký sau.
- Cấu hình lưu ID đầy đủ `providerId/音色`; nếu không phân giải được thì từ chối bằng `bad-request`, không đổi sang giọng khác.
- Khóa bộ nhớ đệm gồm “giọng đầy đủ + tốc độ + văn bản”; đổi triển khai hoặc giọng sẽ không dùng lại âm thanh cũ.
- Khi lỗi phải `throw`: host chuẩn hóa thành `generate-error` và ghi log; byte rỗng cũng được xem là lỗi.
- Vượt `timeoutMs` được xem là lỗi, đồng thời abort `signal`.

```js
export const inject = ['petApi7340'];

export function apply(ctx) {
  ctx.effect(() =>
    ctx.get('petApi7340').voice.register({
      id: 'my-tts',
      name: '我的语音',
      voices: [
        { id: 'female', name: '女声', tag: '柔和' },
        { id: 'male', name: '男声' },
      ],
      timeoutMs: 20_000,
      async synthesize({ text, voice, rate, signal }) {
        const res = await fetch('http://127.0.0.1:9000/speak', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text, voice, rate }),
          signal,
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return new Uint8Array(await res.arrayBuffer());
      },
    }),
  );
}
```

### voice.list

**Tham số**: không có.

**Giá trị trả về**: `{ providers: [{ id, name, voices }] }`, cùng dữ liệu với `GET /voice/voices`; `voices[].id` có dạng đầy đủ (`providerId/音色`).

```js
ctx.get('petApi7340').voice.list();
// { providers: [{ id: 'edge', name: 'Edge', voices: [{ id: 'edge/zh-CN-XiaoyiNeural', name: '晓伊', tag: '女 · 活泼' }] }] }
```

### speech.register

Cho phép plugin bên thứ ba đăng ký triển khai nhận dạng giọng nói của riêng mình. Có thể đăng ký nhiều triển khai; mỗi triển khai xuất hiện trong `GET /voice/hear-providers`, và hệ thống dùng triển khai người dùng đã chọn. `dsh` tích hợp cũng chỉ là triển khai thông thường, không có đặc quyền.

**Tham số**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `id` | string | Định danh duy nhất, dùng kebab-case; đăng ký trùng sẽ báo lỗi, không ghi đè |
| `name` | string | Tên hiển thị trong danh sách thả xuống của trang cài đặt |
| `timeoutMs` | number? | Thời gian tối đa cho một lần nhận dạng (ms), mặc định 30000 |
| `transcribe` | function | Nhận `{ audio, signal }`, trả văn bản được nhận dạng |

**Giá trị trả về**: `() => void`, hàm hủy đăng ký. Dùng cùng `ctx.effect` để plugin tự hủy đăng ký khi gỡ.

**Ném lỗi khi**: định nghĩa không phải đối tượng, `id` không ở dạng kebab-case, `name` rỗng, `transcribe` không phải hàm, `timeoutMs` không phải số dương hoặc `id` đã được đăng ký.

**Hành vi**

- **Nhiều triển khai cùng tồn tại**: mỗi `id` chỉ có một mục, không ghi đè lẫn nhau; thao tác hủy chỉ xóa đúng mục của mình, lệnh hủy đến muộn không ghi đè mục đăng ký sau.
- Cấu hình lưu ID provider (ví dụ `dsh`); nếu không phân giải được thì từ chối bằng `bad-request`, không quay về triển khai khác.
- `audio` là **byte WAV thô** (16kHz / đơn âm / PCM16); host chỉ chặn đầu vào rõ ràng không hợp lệ và giới hạn 7 MiB, còn định dạng do từng triển khai tự kiểm tra.
- Trả về **chuỗi rỗng nghĩa là không có ai nói trong đoạn âm thanh**, đây là thành công chứ không phải lỗi — ngược với quy tắc “byte rỗng là lỗi” của tổng hợp giọng nói.
- Khi lỗi phải `throw`: host chuẩn hóa thành `generate-error` và trả `message` gốc cho bên gọi. `unsupported` chỉ phát sinh khi host thiếu khả năng (ví dụ chưa cài plugin nhận dạng cho `dsh` tích hợp); triển khai bên thứ ba không thể chủ động trả mã này.
- Vượt `timeoutMs` được xem là lỗi, đồng thời abort `signal`.
- Việc phát hiện ngôn ngữ do triển khai tự xử lý; yêu cầu không có tham số ngôn ngữ.
- **Host không xếp hàng và không lưu đệm**: triển khai tự quyết định cách xử lý đồng thời; cùng một đoạn âm thanh sẽ được gửi đến triển khai lại mỗi lần.

```js
export const inject = ['petApi7340'];

export function apply(ctx) {
  ctx.effect(() =>
    ctx.get('petApi7340').speech.register({
      id: 'my-asr',
      name: '我的识别',
      async transcribe({ audio, signal }) {
        const res = await fetch('http://127.0.0.1:9001/asr', {
          method: 'POST',
          headers: { 'content-type': 'application/octet-stream' },
          body: audio,
          signal,
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return (await res.json()).text;
      },
    }),
  );
}
```

### speech.list

**Tham số**: không có.

**Giá trị trả về**: `{ providers: [{ id, name }] }`, cùng dữ liệu với `GET /voice/hear-providers`.

```js
ctx.get('petApi7340').speech.list();
// { providers: [{ id: 'dsh', name: 'DSH 语音插件' }] }
```

### memory.register

Cho phép plugin bên thứ ba đăng ký triển khai bộ nhớ dài hạn của riêng mình. Có thể đăng ký nhiều triển khai; cấu hình ghi `id` nào thì dùng triển khai đó. `native` tích hợp cũng chỉ là triển khai thông thường, không có đặc quyền.

**Tham số**

| Tên | Kiểu | Mô tả |
| --- | --- | --- |
| `id` | string | Định danh duy nhất, dùng kebab-case; đăng ký trùng sẽ báo lỗi, không ghi đè; không được dùng `native` |
| `name` | string | Tên hiển thị trong danh sách thả xuống của trang cài đặt |
| `timeoutMs` | number? | Thời gian tối đa cho một lần truy hồi (ms), mặc định 15000 |
| `recall` | function? | Nhận `{ petId, userText, prepared, raw }` và `signal`; trả toàn bộ nội dung yêu cầu, hoặc `undefined` để không can thiệp |
| `capture` | function? | Nhận `{ petId, userText, replyText, action?, image?, ts }`; giá trị trả về bị bỏ qua |

Phải có ít nhất một trong hai hàm `recall` và `capture`.

**Giá trị trả về**: `() => void`, hàm hủy đăng ký. Dùng cùng `ctx.effect` để plugin tự hủy đăng ký khi gỡ.

**Ném lỗi khi**: định nghĩa không phải đối tượng, `id` không ở dạng kebab-case, `id` dùng tên dành riêng `native`, `name` rỗng, thiếu cả hai phương thức, `timeoutMs` không phải số dương hoặc `id` đã được đăng ký.

**Hành vi**

- **Nhiều triển khai cùng tồn tại**: mỗi `id` chỉ có một mục, không ghi đè lẫn nhau; thao tác hủy chỉ xóa đúng mục của mình, lệnh hủy đến muộn không ghi đè mục đăng ký sau.
- Tùy chọn cấu hình là `memoryProvider`, lưu ID provider; nếu không phân giải được thì quay về `native` và ghi log — hội thoại không bị gián đoạn chỉ vì cấu hình sai.
- `recall` trả về **toàn bộ nội dung yêu cầu** `{ system, history, userText }`; lõi dùng trực tiếp để tạo phản hồi, không ghép lại. Trả `undefined` nghĩa là lượt này không can thiệp và dùng nội dung lõi đã ghép.
- Giá trị trả về phải qua kiểm tra cấu trúc: thiếu một trong ba trường thì bỏ toàn bộ, ghi log và xử lý như không can thiệp.
- `prepared` là nội dung lõi đã ghép (tính cách + thời gian/môi trường + N lượt gần nhất); `raw` là dữ kiện gốc (nội dung tính cách, thời điểm hiện tại, thời tiết/thành phố, ngày lễ, pool ảnh, tên hành động, danh tính thú cưng); muốn tự ghép thì dùng dữ liệu sau.
- Vượt `timeoutMs` thì xem như không can thiệp và abort `signal`; kể cả khi triển khai bỏ qua `signal` thì cũng không làm chậm câu trả lời.
- `capture` được gọi sau khi bộ nhớ cục bộ ghi xuống đĩa; lõi không chờ, lỗi chỉ được ghi log.
- **Lõi luôn đảm nhiệm việc ghi dữ liệu**: chọn triển khai nào cũng không ảnh hưởng đến việc đọc/ghi `memory.json`, lịch sử hội thoại không mất khi chuyển sang bên thứ ba.

```js
export const inject = ['petApi7340'];

export function apply(ctx) {
  ctx.effect(() =>
    ctx.get('petApi7340').memory.register({
      id: 'my-memory',
      name: '我的记忆',
      timeoutMs: 8000,
      async recall({ userText, prepared }, signal) {
        const res = await fetch('http://127.0.0.1:9002/search?q=' + encodeURIComponent(userText), { signal });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const hits = await res.json();
        if (hits.length === 0) return undefined;
        return { ...prepared, userText: '【记忆】' + hits.join('；') + '\n\n' + prepared.userText };
      },
      async capture({ userText, replyText }) {
        await fetch('http://127.0.0.1:9002/remember', {
          method: 'POST',
          body: JSON.stringify({ userText, replyText }),
        });
      },
    }),
  );
}
```

### memory.list

**Tham số**: không có.

**Giá trị trả về**: `{ providers: [{ id, name }] }`; `native` tích hợp luôn đứng đầu, các bên thứ ba được thêm theo thứ tự đăng ký.

```js
ctx.get('petApi7340').memory.list();
// { providers: [{ id: 'native', name: '内置记忆' }, { id: 'my-memory', name: '我的记忆' }] }
```
