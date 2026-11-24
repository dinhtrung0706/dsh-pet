# Tổng quan HTTP API công khai của dsh-pet

Nửa phía host của dsh-pet đăng ký **một tuyến tiền tố** `/dsh-pet-7340` với dịch vụ Web của chính DSH. Trình duyệt, ứng dụng desktop, trang cài đặt và plugin bên thứ ba đều truy cập cùng một triển khai. Tài liệu này chỉ **xem trước chức năng** (tên API + một câu); hợp đồng đầy đủ — tham số, nội dung phản hồi, ý nghĩa trường, mã lỗi và ví dụ — xem [`openapi.vi.yaml`](openapi.vi.yaml) trong thư mục gốc.

- **Địa chỉ cơ sở**: `http://127.0.0.1:<port>/dsh-pet-7340`, trong đó `<port>` là cổng mà dịch vụ DSH Web thực tế đang lắng nghe
- **Chỉ lắng nghe trên 127.0.0.1 và không có xác thực**: mọi tiến trình truy cập được cổng này trên máy cục bộ đều có thể gọi API; không chuyển tiếp ra Internet

---

## I. Đọc trạng thái

| API | Chức năng |
| --- | --- |
| `GET /dsh-pet-7340/state` | **Nguồn dữ liệu duy nhất để thăm dò**: mọi bit trạng thái đều nằm ở đây; thêm `?since=&timeout=` để long-poll |
| `GET /dsh-pet-7340/config` | Đọc cấu hình đã hợp nhất (mặc định tích hợp + lớp người dùng, mọi trường đều có giá trị) |
| `GET /dsh-pet-7340/config/meta` | Đường dẫn tệp cấu hình, tệp log, vị trí lưu từng loại dữ liệu và profile cần dùng khi gỡ cài đặt |
| `GET /dsh-pet-7340/models` | Danh sách nhà cung cấp dịch vụ và mô hình khả dụng (cùng nguồn với bộ chọn mô hình của DSH) |
| `GET /dsh-pet-7340/chat?pet=` | Đọc cửa sổ ghi nhớ hội thoại gần đây của một thú cưng; thêm `?rounds=` để chỉ định số lượt cần đọc lần này (0–200; nếu bỏ qua thì dùng `chatMemoryRounds` trong cấu hình) |
| `GET /dsh-pet-7340/pose?pet=` | Đọc vị trí trực tiếp của thú cưng trên **desktop** (vị trí + hướng); phía web dùng dịch vụ client `petApi7340`, không gọi API này |

## II. Khóa chiếm quyền

| API | Chức năng |
| --- | --- |
| `POST /dsh-pet-7340/lock?pet=` | **Khóa chiếm quyền**: độc quyền điều khiển thú cưng này trong lúc trình diễn liên kết (mọi bên khác, trừ bên giữ khóa, đều im lặng); lấy khóa sẽ đánh thức thú cưng, trong thời gian khóa không thể cho ngủ lại; có `lockId` = gia hạn, không có = tạo mới; trả `lockId` + `expiresAt` |
| `POST /dsh-pet-7340/lock/release?pet=` | **Nhả quyền chiếm dụng**: `lockId` = bên giữ khóa hoàn tất / `force` = người dùng giành quyền (được đầu kết xuất báo lên, bên thứ ba không cần gọi) |

**Trong khi khóa được giữ, thú cưng hoàn toàn đứng yên**: không tự di chuyển hay hiện bong bóng — mọi hoạt động như số dư, lẩm bẩm và trạng thái công việc đều nhường quyền.

Các API ghi chú “(cần khóa)” **phải có `?lock=<lockId>`** khi bên thứ ba gọi. Khóa dành cho bên thứ ba sử dụng: kèm khóa để bảo đảm quyền điều khiển thuộc về bạn trong khoảng thời gian đó, không bị plugin khác hay sự kiện của thú cưng ngắt quãng. Thiếu khóa → `lock-required`; ID không đúng → `lock-lost` (kèm `cause`: hết hạn / đã nhả / bị người dùng giành quyền).

Hai trường hợp biên:

- **Không có khóa**: nếu không truyền `?lock=` thì mọi thứ hoạt động như cũ; nếu truyền `?lock=` tức là bạn cho rằng mình vẫn đang giữ khóa → trả `lock-lost`, `cause` cho biết vì sao khóa mất (hết hạn / đã nhả / bị người dùng giành quyền).
- **Ưu tiên người dùng**: khi người dùng kéo thú cưng hoặc ẩn / đóng nó, khóa bị thu hồi ngay. `/whisper`, `/balance`, `/chat` là các thao tác do người dùng chủ động gọi (từ menu chuột phải / lệnh gạch chéo), nên vẫn dùng được trong lúc bị chiếm quyền.

## III. Cho thú cưng nói (bong bóng)

| API | Chức năng |
| --- | --- |
| `POST /dsh-pet-7340/whisper?pet=` | Yêu cầu thú cưng **tạo** một câu lẩm bẩm (dùng mô hình hiện tại); phản hồi có `text` (nếu kèm ảnh thì có thêm `image`), đồng thời vẫn ghi vào bong bóng như cũ |
| `POST /dsh-pet-7340/broadcast?pet=` | **Bên thứ ba gửi nội dung** (cần khóa): ghi văn bản bên ngoài cung cấp vào bong bóng (không tạo nội dung, chỉ chuyển tiếp); có thể tùy chọn ảnh (tên trong pool `image` / địa chỉ có sẵn trong `url`), thời lượng, liên kết hoạt ảnh và có đọc thành tiếng hay không (`speak`, mặc định không đọc) |
| `POST /dsh-pet-7340/bubble/clear?pet=` | **Xóa bong bóng** (cần khóa): thu bong bóng lời nói sớm; chỉ tác động bong bóng, không tác động hoạt ảnh |
| `POST /dsh-pet-7340/chat?pet=` | Gửi một câu cho thú cưng và tạo câu trả lời, đồng thời ghi vào bộ nhớ hội thoại; phản hồi có `text` (nếu kèm ảnh thì có thêm `image`), đồng thời vẫn ghi vào bong bóng như cũ. Có thể gửi kèm một ảnh trong lượt này bằng `attachment` (`mediaType` + base64): ảnh **được ghi vào bộ nhớ** (lưu tham chiếu tệp đính kèm, không lưu bản thân ảnh), nhưng chỉ ảnh hưởng lượt này và không vào bong bóng; nếu không truyền thì hành vi giống hệt phiên bản cũ. Khi bật `chatAnimationEnabled`, câu trả lời có thể chứa `[动作:名称]`; nếu được chấp nhận, hoạt ảnh được phát theo cùng luồng với `/anim` |
| `DELETE /dsh-pet-7340/chat?pet=` | **Xóa bộ nhớ hội thoại**: truyền `?ts=` (có thể lặp lại, lấy từ `messages[].ts` của `GET /chat`) để chỉ xóa các lượt đó — hai tin nhắn trong một lượt dùng chung `ts` và bị xóa theo cặp; không truyền `ts` thì xóa toàn bộ của thú cưng đó. Phản hồi `{ ok: true, removed }`; khi xóa hết sẽ không giữ đối tượng rỗng |
| `GET /dsh-pet-7340/chat/memory` | Liệt kê lịch sử hội thoại còn sót của **thú cưng đã bị xóa** (thú cưng bị xóa nhưng lịch sử vẫn còn, `GET /chat` không đọc được); chỉ trả số lượng và thời điểm gần nhất |
| `DELETE /dsh-pet-7340/chat/memory` | Xóa toàn bộ lịch sử còn sót này |
| `GET /dsh-pet-7340/memory/providers` | Danh mục triển khai bộ nhớ: `{ providers: [{ id, name }] }`, là nguồn giá trị của cấu hình `main.memoryProvider`; `native` tích hợp luôn đứng đầu, các mục khác được thêm theo thứ tự đăng ký |
| `POST /dsh-pet-7340/balance` | Làm mới số dư ngay một lần (hiệu ứng nhìn thấy vẫn là bong bóng + hoạt ảnh theo bậc); khi có `?pet=` (cần `surface=`) thì chỉ thú cưng đó hiện bong bóng, nếu không thì mọi thú cưng bật tính năng số dư đều hiện |
| `POST /dsh-pet-7340/environment` | **Tra cứu môi trường**: thành phố + thời tiết; khi có `?pet=` (cần `surface=`) thì ghi vào `sections.env`; `?fresh=1` bỏ qua bộ nhớ đệm |

## IV. Yêu cầu thực hiện hành động

| API | Chức năng |
| --- | --- |
| `POST /dsh-pet-7340/anim?pet=` | **Phát hoạt ảnh theo yêu cầu** (cần khóa): phát tên trong pool (giống menu chuột phải “Hành động”) hoặc `url` do bên thứ ba cung cấp; có thể chỉ định hướng bằng `facing` (`left`/`right`), nếu không truyền thì giữ nguyên hướng; trả `playbackId` |
| `GET /dsh-pet-7340/playback/{id}` | **Biên nhận phát**: tra trạng thái thực tế lần phát đó; thêm `?wait=&timeout=` để chờ |
| `POST /dsh-pet-7340/playback/{id}/report` | Đầu kết xuất báo trạng thái phát (**kênh nội bộ**, bên thứ ba không cần gọi) |
| `POST /dsh-pet-7340/pose/report?pet=` | Đầu kết xuất desktop báo vị trí trực tiếp (**kênh nội bộ**, bên thứ ba không cần gọi) |
| `POST /dsh-pet-7340/position?pet=` | **Điều khiển vị trí** (cần khóa): di chuyển đến tọa độ chuẩn hóa, `mode` = trực tiếp / lò xo / đường thẳng; không đụng đến hoạt ảnh. Trả thêm `x`/`y` **sau khi giới hạn tọa độ** |
| `POST /dsh-pet-7340/throw?pet=` | **Ném theo cơ chế gốc** (cần khóa): cấp vận tốc ban đầu để thú cưng bay đi (`angle` tính bằng độ, `power` là hệ số) |
| `POST /dsh-pet-7340/sleep?pet=` | **Cho thú cưng ngủ**: chọn một bộ hoàn chỉnh từ `animations.sleep` (bắt đầu / lặp / thức dậy) và ghi vào `pets.<id>.sleep`; trong lúc ngủ, mọi nguồn tự động và kích hoạt thủ công đều bị từ chối (trừ khi đang giữ khóa); nếu chưa cấu hình hoạt ảnh ngủ thì trả `no-sleep-animations` |
| `POST /dsh-pet-7340/wake?pet=` | **Đánh thức**: phát hoạt ảnh “thức dậy” rồi trả về chuỗi ngẫu nhiên; nếu vốn không ngủ thì vẫn trả ok (idempotent) |
| `POST /dsh-pet-7340/focus-session` | **Chuyển hội thoại**: yêu cầu trang chuyển đến hội thoại được chỉ định; bong bóng hội thoại trên desktop gọi API này |

## V. Sửa cấu hình và tải lại

| API | Chức năng |
| --- | --- |
| `PUT /dsh-pet-7340/config` | Lưu cấu hình lớp người dùng (tạo lại theo danh sách cho phép, vẫn giữ các trường tinh chỉnh người dùng tự viết) |
| `POST /dsh-pet-7340/config` | Ghi đè toàn bộ cấu hình người dùng bằng mặc định tích hợp, tức “Khôi phục mặc định” |
| `POST /dsh-pet-7340/pet-display` | **Đổi vị trí hiển thị của một thú cưng** (`web` / `desktop` / `both` / `none`), chỉ truyền `{ id, display }` |
| `POST /dsh-pet-7340/pet-config` | **Ghi lại tất cả instance theo loại** (`{ entry, pets }`, `entry` là tiền tố của `pet/<tên>-config.json`); tạo lại theo danh sách cho phép, giữ nguyên pool hoạt ảnh và tính cách ở cấp cao nhất |
| `POST /dsh-pet-7340/reload` | Tải lại desktop (khởi động lại tiến trình thú cưng desktop, tạo lại cửa sổ theo cấu hình mới nhất) |

## VI. Mục menu bên thứ ba

| API | Chức năng |
| --- | --- |
| `POST /dsh-pet-7340/menu/item` | **Đăng ký mục menu** (thay thế toàn bộ mục menu của `owner` đó): `{ owner, labels: ["弹弓","钓鱼"], target?: "web"\|"desktop"\|"both" }`; nếu bỏ `target` thì hiển thị ở cả hai nơi |
| `DELETE /dsh-pet-7340/menu/item?owner=` | **Xóa mục menu** (mọi mục của `owner` đó, idempotent): trả `{ ok: true, removed: 2 }` |
| `GET /dsh-pet-7340/menu/events?owner=&wait=` | **Truy vấn sự kiện kích hoạt** (đọc xong là xóa, `wait` = số mili giây long-poll): trả `{ 弹弓: "main", 钓鱼: null }` |
| `POST /dsh-pet-7340/menu/click` | Đầu kết xuất báo thao tác nhấp (**kênh nội bộ**, bên thứ ba không cần gọi) |

Các mục menu bên thứ ba được gom dưới **“Thêm”** trong menu chuột phải. Khi `label` là duy nhất trong tất cả mục bên thứ ba, mục được hiển thị trực tiếp (`Thêm / 弹弓`); khi `label` trùng nhau, mỗi `owner` có một menu con riêng bên dưới “Thêm” (`Thêm / owner / label`) để phân biệt. Mục menu của host được cố định và không tham gia kiểm tra trùng tên.

## VII. Tài nguyên

| API | Chức năng |
| --- | --- |
| `GET /dsh-pet-7340/thumb/{petId}/{file}` | Tài nguyên hoạt ảnh (`.webm` / `.mov`, theo thú cưng sở hữu) |
| `GET /dsh-pet-7340/font/{file}` | Tệp phông chữ |
| `GET /dsh-pet-7340/pic/{file}` | Biểu tượng thông báo (`pic/`) và ảnh meme (`pic/memes/{素材根}/`, theo thú cưng sở hữu) |
| `GET /dsh-pet-7340/attachment?id=` | **Lấy ảnh**: đổi `image.attachmentId` (`sha256:…`) trong bộ nhớ hội thoại thành ảnh |
| `GET /dsh-pet-7340/logo?root=` | Ảnh đại diện thú cưng: mặc định trả logo plugin (`assets/logo.png`); khi có `root=<素材根>` thì trả ảnh đại diện được tải lên cho pet pack đó, nếu không có thì trả mặc định |
| `GET /dsh-pet-7340/character?root=` | **Ảnh tham chiếu nhân vật**: dựa trên thư mục tài nguyên để trả ảnh thiết lập chính thức (png / jpg / webp / gif), dùng để bên thứ ba giữ đúng nhân vật khi tạo ảnh; **không gọi thay mô hình tạo ảnh**, việc tạo ảnh và tính phí do bên gọi đảm nhiệm |
| `POST /dsh-pet-7340/pet-avatar?root=` | **Tải ảnh đại diện lên**: `{ base64 }`, ghi đè `pet/<素材根>-avatar.<ext>`; từ chối `root=main` (tích hợp sẵn) |

## VIII. Trạng thái công việc (ghi từ bên ngoài)

| API | Chức năng |
| --- | --- |
| `POST /dsh-pet-7340/work-status` | **Ghi trạng thái công việc từ bên ngoài**: `{ state, task? }`, dùng một slot bên ngoài cố định; bên ghi sau cùng có hiệu lực |
| `DELETE /dsh-pet-7340/work-status` | **Xóa slot bên ngoài** và đưa về rảnh (idempotent, 204) |

## IX. Giọng nói

| API | Chức năng |
| --- | --- |
| `POST /dsh-pet-7340/voice/speak` | Tổng hợp và trả âm thanh: `{ text, voice?, rate? }`; `voice` là ID đầy đủ dạng `provider/音色`, nếu bỏ qua thì dùng cấu hình; nếu trúng bộ nhớ đệm thì không tổng hợp lại, hàng đợi tối đa 3 tác vụ |
| `POST /dsh-pet-7340/voice/hear` | Nhận dạng âm thanh thành văn bản: `{ audio, provider? }`, base64 của WAV PCM16, 16kHz / đơn âm; giới hạn sau giải mã là 7 MiB; nếu bỏ `provider` thì dùng cấu hình `speechProvider` |
| `GET /dsh-pet-7340/voice/voices` | Danh mục giọng đọc: nhóm theo provider, `id` giọng có dạng đầy đủ `provider/音色`; phía trước dùng danh mục này để hiển thị bộ chọn, không mã hóa cứng ID |
| `GET /dsh-pet-7340/voice/hear-providers` | Danh mục triển khai nhận dạng: `{ providers: [{ id, name }] }`, là nguồn giá trị `provider` của `/voice/hear` |

## X. Việc cần làm

| API | Chức năng |
| --- | --- |
| `GET /dsh-pet-7340/todos` | Đọc danh sách việc cần làm (chưa hoàn thành ở trước, hạn càng gần càng lên trước, không có hạn ở cuối) |
| `POST /dsh-pet-7340/todos` | Tạo một mục: `{ text, dueAt? }`, `dueAt` là mili giây epoch hoặc `null` |
| `PATCH /dsh-pet-7340/todos/{id}` | Sửa một mục: `{ text?, dueAt?, done? }`, phải cung cấp ít nhất một trường |
| `DELETE /dsh-pet-7340/todos/{id}` | Xóa một mục (idempotent, trả số lượng `removed`) |

---

## Chi tiết state

`GET /state` là đầu ra duy nhất của mọi bit trạng thái, cấu trúc cố định:

```jsonc
{
  "counter": 1755000000007,   // Phiên bản của toàn bộ S = số thứ tự lần ghi cuối (cấp cao nhất, không phải lá)
  "sections": {               // Phần toàn cục: mọi phía dùng chung một bản
    "balance": {…}, "workStatus": {…}, "notify": {…}, "config": {…}, "menu": {…}, "focusSession": {…}, "env": {…}
  },
  "pets": {                   // Mỗi thú cưng có một bản riêng; khóa là ID thú cưng (có thể chứa dấu chấm, không tách khóa)
    "main": { "say": {…}, "anim": {…}, "position": {…}, "throw": {…}, "lock": {…}, "sleep": {…} }
  }
}
```

Mỗi `{…}` là một lá `{ counter, data }`: **`counter` thay đổi nghĩa là mục đó đã được cập nhật** (tiêu chí duy nhất).

**Long-poll**: `?since=<counter cấp cao nhất của lần trước>&timeout=<ms>` (bắt buộc đi thành cặp, tối đa 10 giây). Nếu có trường thay đổi thì **trả về ngay**, nếu không thì chờ đến khi `timeout` hết hạn; nội dung phản hồi giống như khi không truyền tham số.

**Phía trước lưu riêng một `counter` cho từng nơi cần dùng**: ở lần lấy đầu tiên chỉ ghi lại mốc, không kết xuất; các lần sau nếu bằng nhau thì không kết xuất, nếu khác thì kết xuất và cập nhật — dùng cách này để xác định có thay đổi và có cần kích hoạt hay không.

## Chế độ độc lập (không mở DSH)

Khi DSH không chạy, cùng hợp đồng `/dsh-pet-7340` được cung cấp bởi dịch vụ cục bộ; đồng thời có thêm ba endpoint **gắn ở gốc dịch vụ** (**không nằm dưới tiền tố** `/dsh-pet-7340`):

| API | Chức năng |
| --- | --- |
| `GET /`, `GET /health` | Thông tin dịch vụ và plugin: tên, thư mục gốc và phiên bản plugin, cổng lắng nghe, số giây đã chạy |
| `POST /shutdown` | Tắt máy an toàn: giải phóng effect plugin đã đăng ký (dừng desktop Helper, xóa bộ hẹn giờ định kỳ), sau đó đóng dịch vụ và thoát tiến trình với mã 0 |

Hình dạng endpoint dưới `/dsh-pet-7340` không đổi, nhưng ba API phụ thuộc DSH **được hạ cấp rõ ràng** (thất bại có cấu trúc, không giả vờ thành công): `POST /whisper`, `POST /chat` trả `reason: 'provider-missing'`; `POST /balance` trả `reason: 'unsupported'`.

## Liên quan

- [`CORDIS.vi.md`](CORDIS.vi.md) — dịch vụ Cordis công khai (nửa phía client, trong trang dùng `ctx.get()`, không qua mạng)
- [`openapi.vi.yaml`](openapi.vi.yaml) — hợp đồng đầy đủ (OpenAPI 3.1, có thể nhập trực tiếp vào Swagger UI / Postman)
- [`tools/api-tester.html`](tools/api-tester.html) — bảng điều khiển thú cưng: trang ví dụ đóng vai bên tiêu thụ API bên thứ ba, cho phép dùng thử trực quan các API trên (chạy `node tools/api-tester.cjs`, công cụ sẽ thêm proxy cục bộ để xử lý CORS)

> Lưu ý: các khối mã được giữ nguyên theo nguồn để bảo toàn chính xác ví dụ JSON và chú thích kỹ thuật.