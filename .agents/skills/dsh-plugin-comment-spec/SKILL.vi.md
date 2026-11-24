---
name: dsh-plugin-comment-spec
description: "Dùng khi viết, đánh giá hoặc di chuyển chú thích mã trong plugin DSH: lấy phần đầu mô-đun, hợp đồng TSDoc ở cấp khai báo và một số ít chú thích why làm trọng tâm; thống nhất thẻ, ngôn ngữ và cách kiểm tra."
whenToUse: "Dùng khi viết hoặc sửa mã plugin DSH (phía host / phía client trên trình duyệt / chế độ độc lập / desktop helper), bổ sung TSDoc và tài liệu API, đánh giá chất lượng chú thích, dọn chú thích dạng biểu ngữ hoặc lời kể, hoặc thêm lint hay kiểm tra tài liệu cho chú thích."
metadata:
  language: "vi"
  category: "development"
disable-model-invocation: false
user-invocable: true
---

# Quy chuẩn chú thích plugin DSH

## Mục tiêu

Giúp bên gọi sử dụng API plugin chính xác mà không cần đọc phần triển khai, giúp người bảo trì sửa mã an toàn chỉ bằng cách đọc thông tin cần thiết, đồng thời cho phép công cụ kiểm tra chú thích để chúng không lệch khỏi phần triển khai.

Ba nguyên tắc nền tảng:

1. **Chú thích là hợp đồng, không phải văn xuôi.** Mỗi chú thích chỉ trả lời điều mà kiểu và tên không thể trả lời: ranh giới, bất biến, tác dụng phụ, lý do thực hiện theo cách này.
2. **Mỗi sự thật chỉ ghi một lần.** Thông tin có thể sinh từ mã, kiểu, OpenAPI hoặc schema thì không viết lại thủ công.
3. **Mặc định viết một dòng; chỉ mở rộng khi phức tạp.** Sửa cấu trúc trước rồi mới viết chú thích; chú thích không thể bù cho tệp quá lớn hay hàm quá sâu.

## Tra cứu nhanh (10 dòng)

| Tình huống | Viết gì | Viết ở đâu |
| --- | --- | --- |
| Tệp mới (entry/driver/hook có trạng thái) | Trách nhiệm, mục tiêu không đảm nhiệm, dependency, bất biến | Đầu tệp, 4–8 dòng |
| Tệp mới (mô-đun thông thường) | Trách nhiệm trong một câu | Đầu tệp, 1 dòng |
| Tệp mới (lá hàm thuần) | Có thể bỏ: bỏ nếu export đã được tài liệu đầy đủ | — |
| Ký hiệu export | Tóm tắt một dòng, thêm thẻ nếu cần | Ngay trên khai báo |
| Trường interface | Chỉ viết khi ngữ nghĩa không hiển nhiên (mục cấu hình, đơn vị, loại trừ lẫn nhau, giá trị mặc định) | Trên trường, 1 dòng |
| Hàm phức tạp | Tóm tắt + `@param` / `@returns` / `@throws` | Trên khai báo, ≤ 12 dòng |
| Thành viên private / lớp nội bộ | Tóm tắt một dòng, không cam kết tương thích | Trên khai báo |
| Phần triển khai không hiển nhiên | Lý do, đánh đổi, thứ tự bắt buộc | Trong dòng, 1–4 dòng |
| Tệp được sinh | `@generated`, lệnh sinh, cấm sửa thủ công | Đầu tệp |
| Thông tin xác thực | Nguồn, vòng đời, có được ghi log không | Một dòng tại nơi sử dụng |
| Việc cần làm | `TODO(#123, @owner): 动作` | Trong dòng |
| Bối cảnh và quyết định | Liên kết `docs/` hoặc ADR | Một dòng ở đầu mô-đun |

## Phạm vi áp dụng

Áp dụng cho mã nguồn viết thủ công trong kho plugin DSH:

- Phía host: entry plugin Cordis, đăng ký service, route, hợp nhất cấu hình, duy trì trạng thái.
- Phía client trên trình duyệt: entry `./client`, thành phần React, trang cài đặt, render và polling.
- Chế độ độc lập (standalone / CLI): phân tích tham số, ctx giả, server cục bộ, shim.
- Desktop helper (Electron / runtime): main process, preload, renderer, điều phối cửa sổ và tài nguyên.

Không áp dụng cho: sản phẩm build trong `lib/`, khai báo sinh `*.d.ts`, `node_modules`, và tệp kê khai không thể chứa chú thích như `package.json` (đặt giải thích cho các tệp này trong README).

Dự án dùng ngôn ngữ khác có thể tái sử dụng cách phân tầng, mục cấm và quy trình; chỉ thay thẻ theo hệ sinh thái tương ứng (ví dụ Java dùng Javadoc).

## Nguyên tắc đầu tiên: xét “có nên viết không”

Trước khi viết, hãy xét từng câu qua ba câu hỏi:

1. **Có thể suy ra trực tiếp từ chữ ký hoặc tên không?** Có — xóa. `/** 用户名 */ name: string` là nhiễu.
2. **Đang mô tả sự thật hiện tại hay lịch sử và kế hoạch?** Lịch sử — xóa hoặc chuyển vào CHANGELOG; kế hoạch — đưa vào issue; chỉ giữ ràng buộc “hiện tại phải luôn đúng”.
3. **Khi sửa mã lần tới, nội dung có thể mất hiệu lực không?** Có — chuyển thành ràng buộc, đổi thành liên kết hoặc không viết. Giá trị của chú thích không nằm ở “đã viết”, mà ở “vẫn còn đúng”.

Phép thử một câu: **người đọc trong tương lai có thể xác minh câu này bằng mã hoặc kiểm thử không?** Lời kể không thể xác minh thường không nên để lại trong chú thích.

### Chú thích phủ định

Cho phép và khuyến khích ghi một mục tiêu không đảm nhiệm ở đầu mô-đun; mặc định không ghi ở cấp hàm và trường.

Trước khi viết, trả lời ba câu hỏi; nếu cả ba đều là “không” thì đừng viết:

1. **Có dễ vô tình vượt ranh giới không?** Có thể tiện tay làm mà không thêm import hay vượt ranh giới kiểu.
2. **Người đọc có thể hiểu nhầm không?** Tên và ngữ cảnh không gợi ra ranh giới này.
3. **Đã từng xảy ra sự cố chưa?** Đã từng đặt nhầm hoặc phải làm lại trong thực tế.

Phản ví dụ (viết ra chỉ tạo nhiễu):

- `// 本文件不是工具函数集合。` — người đọc không nghĩ như vậy.
- `/** 不负责持久化。*/` gắn vào `parseX()` — thân hàm đã thể hiện điều đó.
- `const ts = Date.now(); // 这里是毫秒而不是秒` — nên đổi tên thành `tsMs`.

Ví dụ tốt (viết có giá trị):

- Entry ghi cấu hình: không khởi động lại Desktop Helper — tầng trên từng gọi khởi động lại trực tiếp, đây là lỗi tiện tay vượt tầng.
- Mô-đun theo dõi event: không subscribe event (việc subscribe nằm ở tầng lắp ráp) — tên gọi là watch nhưng lại không subscribe, trái trực giác.

Ở cấp biến, chỉ ghi “là A chứ không phải B” khi hai khái niệm tương tự cùng tồn tại; ưu tiên phân biệt bằng tên. Nếu tên đã nói rõ thì không ghi.

## Phân tầng chú thích

| Cấp | Vị trí | Nội dung bắt buộc | Giới hạn độ dài | Cách kiểm tra |
| --- | --- | --- | --- | --- |
| Đầu mô-đun (entry/driver/có trạng thái) | Đầu tệp | Vai trò plugin, trách nhiệm, mục tiêu không đảm nhiệm, quan hệ dependency, bất biến then chốt | 4–8 dòng | review |
| Đầu mô-đun (mô-đun thông thường) | Đầu tệp | Trách nhiệm trong một câu | 1 dòng | review |
| Đầu mô-đun (lá hàm thuần) | Đầu tệp | Có thể bỏ | 0 dòng | review |
| Khai báo export | Hàm, lớp, hằng số, kiểu có `export` | Tóm tắt một dòng, thêm thẻ khi cần | 1–7 dòng | tsdoc / api-extractor |
| Trường interface | Trường có ngữ nghĩa không hiển nhiên | Ngữ nghĩa trong một dòng | 1 dòng | review |
| Thành viên private | Trường lớp nội bộ, phương thức private, hằng số trong mô-đun | Tóm tắt một dòng, không cam kết tương thích | 1 dòng | review |
| Hàm phức tạp | Khi tham số, giá trị trả về hoặc ngoại lệ không hiển nhiên | Tóm tắt + `@param` / `@returns` / `@throws` | ≤ 12 dòng | eslint |
| Vòng đời | `apply` / `inject` / `dispose` / `ctx.on` | Đã đăng ký gì, phụ thuộc gì, khi nào dọn dẹp | 1–4 dòng | review |
| Bên trong phần triển khai | Nhánh không hiển nhiên, số ma thuật, đặc tính lạ bên ngoài | Vì sao làm thế này, vì sao không thể làm cách kia | 1–4 dòng | review |
| Tệp được sinh | Đầu tệp | `@generated`, lệnh sinh, cấm sửa thủ công | 3 dòng | review |
| Chỉ thị công cụ | `eslint-disable` / `v8 ignore` | Chỉ thị + lý do | 1 dòng | lint |

### Đầu mô-đun

Chia thành ba cấp theo vai trò tệp, không viết mọi tệp theo khuôn bốn đoạn:

| Vai trò | Viết gì | Độ dài |
| --- | --- | --- |
| Entry, lắp ráp, service, driver, hook có trạng thái | Đảm nhiệm gì, không đảm nhiệm gì (tối đa một điều), phụ thuộc vào ai, điều gì phải luôn đúng | 4–8 dòng |
| Mô-đun thông thường (nhóm hàm liên quan hoặc một component) | Trách nhiệm trong một câu, thêm một mục tiêu không đảm nhiệm nếu cần | 1 dòng |
| Lá hàm thuần (chuyển đổi, định dạng, quyết định thuần) | Bỏ; cũng nên bỏ nếu tệp chỉ có một export và export đó đã có tài liệu đầy đủ | 0 dòng |

Nếu có `@module`, đặt ở dòng đầu hoặc cuối; chỉ tệp entry và driver đáng có thẻ này. Phần đầu không phải bảng: nếu diễn đạt rõ trong một câu thì không viết thành bốn dòng.

Không viết: danh sách route, danh sách trường, danh sách cấu hình, lịch sử thay đổi, sơ đồ ASCII, cấu trúc thư mục. Những nội dung này hoặc có thể sinh tự động, hoặc thuộc trang tài liệu; ghi vào chú thích sẽ tạo ra sự thật thứ hai.

```ts
/**
 * 宿主半侧：把 <能力> 注册为 DSH 服务与路由，并维护其内存状态。
 * 不负责渲染与素材；浏览器半侧经 /<prefix>/state 轮询读取。
 * 契约见 openapi.yaml；配置只经 readAllConfig 读取，本模块不碰文件。
 * @module dsh-plugin-<name>
 */
```

Nếu vượt quá 8 dòng, thường không phải vì “cần giải thích thêm”, mà vì “nên tách tệp này”.

### Khai báo export

Export của entry được `exports` trong `package.json` (`.`、`./client`) trỏ tới tạo thành bề mặt công khai của plugin: mỗi ký hiệu phải có phần tóm tắt; viết tài liệu cho trường theo tiêu chí ở mục tiếp theo.

Phần tóm tắt dùng câu mệnh lệnh hoặc cụm danh từ, thì hiện tại và kết thúc bằng dấu chấm; viết bằng tiếng Trung, giữ nguyên định danh. Không lặp lại tên và kiểu.

```ts
/** 解析不带前导斜杠的命令名；不合法时返回 undefined。 */
export function parseCommandName(line: string): string | undefined;

/** 轮询状态的唯一数据源；counter 变化才触发渲染。 */
readonly state: PollState;
```

### Trường interface

Chỉ viết khi ngữ nghĩa không hiển nhiên. Bắt buộc ghi chú cho bốn loại sau:

- **Mục cấu hình và công tắc**: thay đổi hành vi nào và giá trị mặc định.
- **Giá trị số**: đơn vị và thứ nguyên (`_MS` / `_PX` / `_BYTES`), cùng phạm vi giá trị hoặc quy tắc kẹp giá trị.
- **Loại trừ lẫn nhau hoặc chọn một trong hai**: lựa chọn còn lại là gì, ai đảm bảo chỉ có một lựa chọn.
- **Hợp đồng liên mô-đun**: ai ghi, ai đọc, hạ cấp thế nào khi thất bại hoặc thiếu dữ liệu.

Không ghi cho trường mà tên đã nói rõ, như tọa độ, kích thước, số đếm, tên. Bổ sung từng dòng cho hàng chục trường khiến tài liệu giống bảng hơn là hợp đồng; các trường thực sự cần giải thích sẽ chìm trong những câu cùng khuôn.

### Thành viên private và lớp nội bộ

Dùng cùng tiêu chuẩn như ký hiệu export cho lớp nội bộ, trường private, hằng số trong mô-đun và ký hiệu export; nhưng chỉ viết tóm tắt một dòng, không viết thẻ đầy đủ và không cam kết tương thích:

```ts
/** 当前实例的注册层级；层级高的定义遮蔽全局定义。 */
private readonly layers: ScopedLayers;

/** 单进程内生成 commandId 的序号，重启后从 0 开始。 */
private commandSeq = 0;
```

Khi cần xác định rõ “không công khai”, thêm `@internal`; mọi ký hiệu có thể được bên ngoài `import` trực tiếp đều phải tuân theo tiêu chuẩn export.

### Hàm phức tạp

Chỉ mở rộng khi “đọc xong chữ ký vẫn còn thắc mắc”. Cấu trúc cố định: tóm tắt một dòng → dòng trống → khu vực thẻ.

- `@param name - 语义`: ghi ý nghĩa, tính tùy chọn, giá trị mặc định, ranh giới; không ghi kiểu.
- `@returns`: ghi giá trị biên (rỗng, `undefined`, giá trị mặc định, thành công một phần).
- `@throws`: ghi điều kiện kích hoạt và kiểu lỗi; không ném lỗi thì không ghi.
- `{@link Symbol}`: tham chiếu ký hiệu liên quan, không ghi “xem xxx.ts:123”.
- `@example`: chỉ dùng cho cách dùng bất thường; mỗi hàm tối đa một ví dụ.

```ts
/**
 * 注册一个插件命令。
 *
 * @param definition - 发现元数据与处理器；同名重复注册会被拒绝。
 * @returns 精确注销该定义的 disposer。
 * @throws {TypeError} 名称不符合 `<规则>` 时。
 */
```

#### Generic

Khi tham số kiểu không hiển nhiên, dùng `@typeParam` để ghi ràng buộc và mục đích; không lặp lại nội dung `extends` đã thể hiện:

```ts
/**
 * 按配置键读取值。
 *
 * @typeParam K - 配置键；返回类型由该键推导。
 * @param key - 已声明的键。
 * @returns 对应值；键不存在时返回 `undefined`。
 */
export function readConfigValue<K extends keyof Config>(key: K): Config[K] | undefined;
```

#### Overload

Chỉ viết tóm tắt và thẻ một lần, đặt trên chữ ký triển khai hoặc overload đầu tiên; chỉ bổ sung một dòng `@remarks` cho từng overload khi hành vi khác nhau, không sao chép cùng một phần giải thích ba lần.

### Vòng đời và inject

Đây là các vị trí đặc thù của plugin DSH, dễ bị viết thành “nhắc lại framework” nhất:

- `name` / `inject` / `provide` / `apply` / `dispose`: mỗi mục viết một dòng giải thích **vì sao cần dependency này, đăng ký gì và dọn dẹp gì**; không giải thích cách Cordis hoạt động.
- `ctx.on(...)` / `ctx.effect(...)`: nêu vòng đời của listener và thời điểm gỡ bỏ.
- Hàm xử lý route: liên kết tới hợp đồng OpenAPI, không liệt kê từng trường trong response body.
- Component phía client: mỗi trường props một dòng; chỉ giải thích “vì sao không thể xóa dependency này” trong dependency của `useEffect`.
- Hợp nhất cấu hình: ghi giá trị mặc định và thứ tự ưu tiên ở đầu mô-đun, không viết văn xuôi cho từng trường.

### Bên trong phần triển khai

Chỉ viết về năm loại nội dung: nguồn của hằng số không hiển nhiên, nhánh phản trực giác, đánh đổi hiệu năng hoặc bảo mật, đặc tính lạ của hệ thống bên ngoài, thứ tự gọi bắt buộc phải giữ.

Không viết: diễn giải từng dòng, kiểm tra null hiển nhiên, giải thích getter/setter, lặp lại ý nghĩa biến.

Giới hạn 1–4 dòng. Quá 4 dòng nghĩa là cần tên tốt hơn, hàm nhỏ hơn, hoặc chuyển bối cảnh sang `docs/` và chỉ giữ liên kết.

```ts
// 宿主的 dispose 是异步的：先摘监听再关窗，否则回调会打到已销毁的 webContents。
```

### Bảo mật và thông tin xác thực

Với mã liên quan đến khóa bí mật, token hoặc dữ liệu người dùng, chú thích chỉ ghi **nguồn, vòng đời, có được đưa vào log không**; tuyệt đối không ghi giá trị thật. Ví dụ luôn dùng placeholder.

```ts
// key 只驻留内存，禁止写日志或落盘；错误信息里只保留后四位。
```

### Tệp được sinh

Sản phẩm được sinh và đưa vào kho mã (bundle, script runtime đã sao chép) phải khai báo trong ba dòng đầu của tệp: công cụ nào tạo, lệnh sinh và cấm sửa thủ công.

```ts
/**
 * @generated by `pnpm run build:desktop-core`，请勿手改。
 * 源文件：src/shared/index.ts。
 */
```

Nếu bộ sinh không hỗ trợ chèn phần đầu tệp, hãy ghi chú ở entry viết thủ công gần nhất hoặc trong README.

## Mục cấm

| Mẫu phản tác dụng | Vì sao không nên | Cách thay thế |
| --- | --- | --- |
| Biểu ngữ như `// ---- 配置 ----` | Che giấu tệp quá lớn, tạo xung đột merge, thường còn sót lại sau khi chuyển mã đi nơi khác | Tách mô-đun, dùng ranh giới tệp và export thay thế |
| `**加粗**`, `## 标题`, sơ đồ ASCII | Editor không render, grep và diff đầy nhiễu | Văn bản thuần; đưa sơ đồ vào trang tài liệu |
| “trước khi cải tổ / triển khai cũ / trước đây” | Không thể xác minh, chắc chắn lỗi thời | git, CHANGELOG, ADR |
| Mã bị chú thích vô hiệu hóa | Phải bảo trì hai bản, người đọc không biết bản nào hiệu lực | Xóa, khôi phục từ hệ thống quản lý phiên bản khi cần |
| Tham chiếu số dòng hoặc đường dẫn tệp | Mất hiệu lực ngay khi tệp được di chuyển | `{@link}` hoặc liên kết tài liệu ổn định |
| `@param {string} name 名称` | TS đã thể hiện kiểu, hoàn toàn dư thừa | Chỉ ghi ngữ nghĩa |
| Chép bảng route, trường, cấu hình vào chú thích | Lệch khỏi phần triển khai và không ai kiểm tra | Liên kết OpenAPI, schema hoặc sản phẩm được sinh |
| TODO không có người phụ trách | Sẽ không bao giờ được xử lý | `TODO(#123, @owner): 具体动作`, hoặc chỉ giữ issue |
| Trộn tiếng Trung và tiếng Anh trong cùng một chú thích | Người đọc phải đổi ngôn ngữ liên tục, thuật ngữ dễ bị lệch | Dùng thống nhất tiếng Trung; chỉ định danh và trích dẫn nguyên văn dùng tiếng Anh |
| Thêm chú thích để đạt coverage | Tạo nhiễu, che khuất hợp đồng thực sự còn thiếu | Thà thiếu còn hơn viết giả |
| `// 本文件不是…`, “không đảm nhiệm…” ở cấp hàm, biến “là A chứ không phải B” | Người đọc vốn không hiểu nhầm, chỉ tạo nhiễu | Xóa; nếu cần phân biệt thì sửa tên |

## Quy chuẩn thẻ

Dùng ngữ nghĩa TSDoc (tương thích với chuỗi công cụ JSDoc).

| Thẻ | Khi nào dùng | Cách viết |
| --- | --- | --- |
| `@module` | Đầu mô-đun | `@module <包名>` |
| `@param` | Có tham số với ngữ nghĩa không hiển nhiên | `@param name - 语义` |
| `@typeParam` | Tham số generic không hiển nhiên | `@typeParam T - 约束与用途` |
| `@returns` | Có giá trị trả về và ranh giới không hiển nhiên | `@returns 边界与缺省` |
| `@throws` | Có thể ném ngoại lệ | `@throws {Type} 触发条件` |
| `@deprecated` | Dự kiến gỡ bỏ | `@deprecated 替代品与起始版本` |
| `@internal` | Không cam kết với bên ngoài | `@internal` |
| `@remarks` | Cần giải thích thành đoạn | Đoạn riêng sau phần tóm tắt |
| `@example` | Cách dùng bất thường | Khối mã, tối đa một ví dụ |
| `@see` / `{@link}` | Ký hiệu hoặc tài liệu liên quan | `{@link Symbol}` |

Quy tắc:

- Thứ tự cố định: tóm tắt → `@remarks` → `@typeParam` → `@param` → `@returns` → `@throws` → `@example`.
- Tên trong `@param` phải khớp hoàn toàn với chữ ký; khi đổi tên tham số, cập nhật thẻ tương ứng.
- Không chèn dòng trống giữa các thẻ; không chèn dòng trống giữa nhóm `@param` và `@returns`; chèn dòng trống giữa phần tóm tắt và thẻ.
- Câu tiếng Trung dùng dấu câu toàn giác; giữ nguyên ký hiệu bên trong đoạn mã, lệnh và đường dẫn.
- Không viết `@param {type}`; giao việc kiểu cho TypeScript.

## Ngôn ngữ và thuật ngữ

Chú thích luôn dùng tiếng Trung. Giữ nguyên tiếng Anh cho định danh mã, tên kiểu, tên API và tên lệnh; khi trích dẫn thông báo lỗi, log hoặc nội dung UI, giữ nguyên văn, không viết lại.

- **Ngôn ngữ theo kho mã đích.** Ví dụ trong tài liệu này dùng tiếng Trung; khi chuyển hoặc tham khảo mã khác, không sao chép ngôn ngữ máy móc mà dùng ngôn ngữ thống nhất của kho mã đích; không trộn ngôn ngữ trong cùng tệp.
- **Thuyết minh trong toàn kho mã thống nhất bằng tiếng Trung.** Không viết câu này tiếng Trung, câu kia tiếng Anh; tên riêng giữ nguyên tiếng Anh không được xem là trộn ngôn ngữ.
- **Một khái niệm dùng một thuật ngữ.** Lần đầu xuất hiện có thể thêm thuật ngữ tiếng Anh trong ngoặc, ví dụ “cấu hình đã phân giải (resolved config)”; không luân phiên từ đồng nghĩa.
- **Tránh tiếng lóng nội bộ dự án.** Nếu bắt buộc dùng, định nghĩa một lần ở đầu mô-đun; không bắt người mới tự đoán.
- **Dấu câu theo ngữ nghĩa.** Câu tiếng Trung dùng dấu câu toàn giác; ký hiệu bên trong đoạn mã, lệnh và đường dẫn giữ nguyên.
- **Tên thẻ giữ nguyên tiếng Anh.** `@param`, `@returns`, `{@link}` là cú pháp công cụ, không dịch.

## Cân nhắc giữa chú thích và kiểm thử

Quy tắc có thể được kiểm thử khóa chặt thì không ghi vào chú thích. Bảng ưu tiên, chuyển đổi ranh giới, chuyển trạng thái và nhánh hạ cấp đều nên viết thành assertion; chú thích chỉ giữ lại ba loại mà kiểm thử không thể diễn đạt:

- **Thứ tự**: vì sao phải thực thi theo thứ tự này, đổi thứ tự sẽ hỏng ở đâu.
- **Đánh đổi**: vì sao chọn một trong hai phương án đều khả thi và đã từ bỏ điều gì.
- **Đặc tính lạ bên ngoài**: hành vi phản trực giác ở host hoặc trình duyệt, kiểm thử không thể tái hiện ổn định.

Mỗi sự thật chỉ xuất hiện ở một nơi: nếu kiểm thử đã assertion công thức chuyển đổi, đầu mô-đun không cần chép lại; chỉ ghi quy ước mà kiểm thử không bao phủ (ví dụ kết quả không phụ thuộc thời lượng, không phụ thuộc thứ tự đầu vào). Ghi ở cả hai nơi sẽ dẫn đến lệch; khi lệch sẽ không ai biết nên tin bên nào.

## Độ dài và mật độ

- Đầu mô-đun chia theo vai trò (entry 4–8 dòng / thông thường 1 dòng / lá hàm thuần có thể bỏ); tóm tắt khai báo 1 dòng; tài liệu hàm ≤ 12 dòng; why trong thân hàm 1–4 dòng.
- Trung vị khối tài liệu nên là 1 dòng, p90 ≤ 7 dòng. **Khối ≥ 10 dòng là dấu hiệu “nên chuyển sang tài liệu”**, không phải dấu hiệu “viết chi tiết hơn”.
- Tỷ lệ dòng chú thích 10%–20% là khoảng thường gặp. Nếu trên 25%, trước tiên kiểm tra “có đang viết văn xuôi hay che giấu cấu trúc không”; nếu dưới 5%, trước tiên kiểm tra “có thiếu hợp đồng export không”.
- Mật độ không phải KPI, không đánh giá theo số dòng và không thêm lời vô ích để đạt chỉ tiêu. Đặc biệt với chú thích trường: ghi đầy các trường hiển nhiên sẽ khiến các trường thực sự cần giải thích bị chìm trong những câu cùng khuôn.

## Quy trình viết

**Thêm mã mới**

1. Tệp mới: xác định phần đầu mô-đun theo vai trò trước (entry/driver 4–8 dòng; mô-đun thông thường 1 dòng; lá hàm thuần có thể bỏ), rồi mới viết import.
2. Viết tóm tắt một dòng cho mỗi ký hiệu export; mỗi trường interface một dòng.
3. Thêm thẻ khi tham số, giá trị trả về hoặc ngoại lệ không hiển nhiên; chỉ thêm `@example` khi cách dùng không hiển nhiên.
4. Chỉ viết why ở nơi không hiển nhiên; không viết những gì có thể thể hiện bằng tên và kiểu.
5. Trước khi commit, chạy kiểm tra kiểu và lint (nếu đã cấu hình quy tắc TSDoc).

**Sửa mã**

1. Trước tiên xác định thay đổi lần này làm chú thích nào mất chính xác; chỉ sửa chú thích liên quan, không tiện tay viết lại chú thích không liên quan.
2. Xóa tham chiếu ký hiệu không còn tồn tại và ví dụ hết hiệu lực.
3. Khi hành vi thay đổi, cập nhật `@returns` / `@throws`; trước khi xóa export, đánh dấu `@deprecated` và giữ lại một phiên bản.
4. Nếu nhánh mới tạo ra ràng buộc mới, bổ sung một câu why thay vì một đoạn mô tả quy trình.

**Review mã**

1. Đối chiếu từng mục trong danh sách kiểm tra, phân loại vấn đề thành “sai, lỗi thời, phong cách”.
2. Chỉ bắt buộc sửa mục “sai, lỗi thời”; góp ý vấn đề phong cách nhưng không chặn.
3. Với chú thích dài, chỉ yêu cầu chuyển sang tài liệu, không yêu cầu xóa thông tin.
4. Khi “chú thích mâu thuẫn với phần triển khai”, lấy mã làm chuẩn, sửa chú thích trước rồi đánh giá xem mã có bug không.

**Di chuyển nội dung cũ**

1. Xóa trang trí trước: biểu ngữ, chữ đậm, tiêu đề, sơ đồ ASCII.
2. Chuyển khối ≥ 10 dòng sang `docs/`, giữ lại trong mã phần tóm tắt 2–3 dòng cùng liên kết.
3. Bổ sung thẻ còn thiếu cho ký hiệu export.
4. Cuối cùng bật kiểm tra bắt buộc: bắt đầu bằng `warn`, sau khi ổn định mới chuyển thành `error`. Mỗi lần chỉ thay đổi một khía cạnh để tránh diff quá lớn.

## Danh sách kiểm tra

- [ ] Đầu mô-đun có khớp vai trò tệp (entry/driver viết đầy đủ, lá hàm thuần có thể bỏ) và trả lời “đảm nhiệm gì, phụ thuộc vào ai, điều gì phải luôn đúng” không?
- [ ] Mỗi ký hiệu export có tóm tắt không; các trường interface chỉ ghi những trường có ngữ nghĩa không hiển nhiên (mục cấu hình, đơn vị, loại trừ, mặc định), không thêm chú thích cho đủ số lượng ở trường hiển nhiên chứ?
- [ ] Khi tham số generic không hiển nhiên, đã viết `@typeParam` chưa? Tài liệu overload chỉ xuất hiện một lần chưa?
- [ ] Tệp được sinh đã đánh dấu `@generated` và lệnh sinh chưa?
- [ ] Chú thích liên quan thông tin xác thực chỉ ghi nguồn và yêu cầu che giấu, không có giá trị thật chứ?
- [ ] Tên `@param` khớp chữ ký chưa? Ranh giới của giá trị trả về và ngoại lệ đã rõ chưa?
- [ ] Có kiểu bị lặp, tên bị lặp, chi tiết triển khai bị lặp không?
- [ ] Có biểu ngữ, chữ đậm, hình, lời kể lịch sử hoặc tham chiếu số dòng không?
- [ ] Chú thích ≥ 10 dòng có nên chuyển sang tài liệu không?
- [ ] TODO có issue và owner chưa?
- [ ] Mỗi sự thật chỉ nằm ở một nơi (không sao chép OpenAPI, schema hoặc bảng cấu hình) chưa?
- [ ] Ngôn ngữ thuyết minh có thống nhất là tiếng Trung (trừ định danh và trích dẫn nguyên văn) chưa?

## Kiểm tra bắt buộc và công cụ (khuyến nghị, không bắt buộc)

- `eslint-plugin-tsdoc`: kiểm tra cú pháp TSDoc, đặt trực tiếp ở mức `error`.
- `eslint-plugin-jsdoc`: `require-jsdoc` (chỉ với exported), `require-param`, `require-returns`, `check-param-names`, `check-tag-names`, `tag-lines`; ban đầu đặt `warn`.
- `@microsoft/api-extractor`: sinh `.api.md` và so sánh diff trong CI; thay đổi export phải được chấp thuận rõ ràng.
- TypeDoc: dùng `--validation.notDocumented` để biến “export không có tài liệu” thành lỗi.
- Kiểm tra định dạng TODO trong CI: chỉ chấp nhận `TODO(#\d+, @[\w-]+)`.
- **Baseline phần cũ**: chỉ áp dụng kiểm tra bắt buộc với tệp mới và dòng trong diff; ghi vấn đề hiện hữu vào tệp baseline, chỉ giảm chỉ số chứ không tăng, tránh khiến hàng nghìn khối cũ cùng thất bại.
- Thứ tự di chuyển: kiểm kê chỉ đọc → `warn` → sửa phần cũ → `error`. Không bật tất cả cùng lúc.

## Chỉ số (giá trị đề xuất, không phải tiêu chí cứng)

| Chỉ số | Giá trị đề xuất |
| --- | --- |
| Độ phủ tài liệu ký hiệu export | ≥ 95% |
| Hàm export có `@param` | ≥ 90% |
| Độ phủ trường interface | Không đặt chỉ số: chỉ bao phủ trường không hiển nhiên; ghi kín mọi trường làm giảm chất lượng |
| Khối chú thích ≥ 10 dòng | 0 |
| Biểu ngữ, chữ đậm, sơ đồ ASCII | 0 |
| TODO có issue và owner | 100% |
| Độ dài khối tài liệu p50 / p90 | 1 dòng / ≤ 7 dòng |
| Tỷ lệ dòng chú thích | 10%–20% |

## Ví dụ: viết lại một lần

```ts
// ---- 配置模块 ----
// 改造前配置分散在三个文件，现在统一到这里
// 读取配置
export function readConfig() { /* ... */ }
```

Viết lại thành:

```ts
/**
 * 配置的唯一读取入口：合并内置默认、用户层与环境变量。
 * 不负责写盘；写盘只经 saveUserConfig。
 * @module dsh-plugin-<name>/config
 */

/** 返回字段已填满的成品配置；解析失败时抛出，不返回半成品。 */
export function readConfig(): Config;
```

Chỉ có ba thay đổi: thay biểu ngữ bằng phần đầu mô-đun, xóa lời kể lịch sử, viết hợp đồng vào phần tóm tắt hàm. Không thêm lượng thông tin nhưng mỗi câu đều có thể xác minh.

## Nguyên tắc

1. Không viết chú thích chỉ để đạt chỉ số; thà thiếu còn hơn viết thừa.
2. Không dùng chú thích bù cho cấu trúc: tệp quá lớn thì tách trước, hàm quá dài thì trích xuất trước, không viết biểu ngữ.
3. Không xóa why có giá trị; chuyển sang `docs/` hoặc ADR, giữ liên kết trong mã.
4. Mỗi lần chỉ thay đổi một khía cạnh: trang trí trước, văn bản dài sau, rồi thẻ, cuối cùng là kiểm tra bắt buộc.
5. Thay đổi API công khai phải đồng bộ chú thích và báo cáo API.
6. Khi chưa chắc, dùng câu hỏi “người đọc tương lai có thể xác minh câu này không” để quyết định giữ hay bỏ.

