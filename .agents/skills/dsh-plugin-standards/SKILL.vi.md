---
name: dsh-plugin-standards
description: "Quy chuẩn mã khi viết, sửa hoặc review plugin DSH: thống nhất loại plugin, package manifest, thư mục và tệp, đặt tên, kiểu và interface, cấu hình và trạng thái, cách kiểm thử và phát hành."
whenToUse: "Dùng khi tạo package plugin DSH, viết hoặc sửa mã plugin host/client, tách tệp hoặc thêm interface, bổ sung kiểm thử hay tự kiểm tra trước khi phát hành."
metadata:
  language: "vi"
  category: "development"
disable-model-invocation: false
user-invocable: true
---

# Quy chuẩn mã plugin DSH

## Mục tiêu

Giúp plugin DSH có cấu trúc nhất quán, interface dễ dự đoán và có thể chia nhỏ khi bảo trì. Quy chuẩn chỉ trả lời một câu hỏi: **nên viết đoạn mã này thế nào để người khác tiếp quản không phải bực mình**.

Đối tượng áp dụng: phía host, phía client trên trình duyệt, tool, projection, bundle, chế độ chạy độc lập và desktop carrier. Không áp dụng cho phần triển khai nội bộ của thư viện bên thứ ba.

## 1. Xác định loại plugin trước

Trước khi viết dòng mã đầu tiên, xác nhận plugin thuộc loại nào; loại quyết định entry, trường manifest và vòng đời.

| Loại | Đặc điểm | Entry |
|---|---|---|
| A. Host dạng hàm | Chỉ đăng ký service/listener/route | Named export `name`/`inject`/`Config`/`apply` |
| B. Host dạng service | Cung cấp một Cordis service ra bên ngoài | `class X extends Service` + `static Config` + `super(ctx, 'name')` |
| C. Tool | Đăng ký tool cho model | `ctx.tools.register(defineTool({...}))` |
| D. Projection | Fold trạng thái từ sự kiện phiên | `ctx.sessionProjections.register({...})` |
| E. UI client | Có render trên trình duyệt | Host có `apply()` rỗng + `lib/client.js` + `dsh.client` |
| F. Bundle | Chỉ kết hợp plugin khác | `lib/index.js` + `cordis.patch.yml` + `dsh.bundle.patch` |
| G. Chỉ re-export | Chỉ export kiểu hoặc chuyển tiếp lời gọi | Chỉ re-export, không viết logic |
| H. Metadata | Chỉ có locale/icon | `locale/*.json` + `icon` |

Thứ tự phân loại: có UI → E; chỉ kết hợp → F; dành cho model → C; duy trì trạng thái suy diễn → D; cung cấp service ra ngoài → B; các trường hợp còn lại → A.

## 2. Package manifest

Các trường cố định trong `package.json`:

```jsonc
{
  "name": "@scope/dsh-<domain>-<role>",
  "description": "一句话，市场展示用",
  "version": "0.2.1-rc.2",              // 与同 release 的 DSH 精确对齐，不用 ^
  "publishConfig": { "access": "public" },
  "repository": { "type": "git", "url": "…", "directory": "packages/<组>/<包>" },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": { … },
  "files": [ … ],
  "license": "MIT"
}
```

Năm mục `exports` cố định:

```jsonc
".":               { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
"./client":        { "types": "./lib/types/client/index.d.ts", "default": "./lib/client.js" },
"./src/*":         "./src/*",
"./package.json":  "./package.json",
"./locale/*.json": "./locale/*.json"
```

- `./client` chỉ dành cho loại E và bắt buộc phải có cả `lib/client.js` lẫn `lib/types/client/index.d.ts`.
- `./cordis.patch.yml` chỉ dành cho loại F.
- `files` chỉ phát hành sản phẩm runtime và metadata: `lib/index.js`, `lib/types/**/*.d.ts`, `locale/*.json`; loại E thêm `lib/client.js`; loại F thêm `cordis.patch.yml`, `icon.svg`.

Chia dependency thành ba nhóm:

| Vị trí | Nội dung | Phiên bản |
|---|---|---|
| `dependencies` | Package thực sự được import lúc chạy mà host không cung cấp | Chính xác |
| `peerDependencies` | Package do host cung cấp, không được bundle; thường chỉ có `@deepseek-ai/cordis` | Chính xác hoặc `~` |
| `devDependencies` | Tất cả phần còn lại: package peer, package kiểu, thư viện kiểm thử, react | Khớp chính xác với release |

Mọi package ghi trong `dsh.client.inject` cũng phải được liệt kê trong `devDependencies`, nếu không sẽ không lấy được kiểu.

Trường `dsh`:

```jsonc
// E 类
"dsh": { "client": { "inject": ["@deepseek-ai/dsh-client-locale"], "platform": "web" } }
// F 类
"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
// 需要兼容性声明时
"dsh": { "compatibility": { "dshReleases": { "0.2.1-rc.2": "compatible" } } }
```

`dsh.client.inject` liệt kê tên package; `inject` của plugin liệt kê tên service. Hai mục này không giống nhau.

## 3. Thư mục và tệp

Mẫu `src`:

```text
src/
├── index.ts          # 插件入口：name/inject/Config/apply
├── types.ts          # 本包类型唯一归属地
├── client.ts         # 可选：客户端类型再导出
├── client/           # E 类浏览器半边
│   ├── index.ts      # inject + apply(ClientContext)
│   ├── <Component>.tsx
│   ├── slots.ts      # inject face / props
│   └── locales.ts    # zh/en 字典 + key 类型
└── <topic>.ts        # host 侧按主题拆：storage / request / format
```

Quy mô tệp (dòng có nội dung, không tính dòng trống và chú thích):

| Loại | Giới hạn mềm | Giới hạn cứng |
|---|---:|---:|
| Mô-đun thông thường | 200 | 300 |
| Có IO/tổng hợp route | 300 | 400 |
| Tệp React component | 200 | 250 |
| Entry/lắp ráp | 120 | 150 |
| Tệp kiểu | 150 | 200 |
| Tệp kiểm thử | 400 | 600 |

- Khi vượt giới hạn, tách theo **lý do thay đổi**, không chia theo số dòng: tài nguyên, chủ sở hữu trạng thái và vòng đời giống nhau thì để cùng nhau.
- Nếu số dòng xung đột với lý do thay đổi, **ưu tiên lý do thay đổi**: nếu thực sự không có lý do thay đổi độc lập thì không tách; ghi rõ trong thông điệp commit “vượt giới hạn nhưng không có lý do thay đổi độc lập nên tạm thời không tách”. Tiêu chí là “sau này sửa một yêu cầu thì hai chỗ này có cùng phải đổi không”, không phải “số dòng đã về ngưỡng chưa”.
- Mỗi tệp có một trách nhiệm chính; dòng đầu phần đầu mô-đun phải nêu rõ trách nhiệm.
- Độ sâu thư mục ≤4; tối đa 30 tệp/thư mục; không để thư mục rỗng.
- Tên tệp kebab-case; tệp component PascalCase; kiểu đặt trong `types.ts`; slot trong `slots.ts`; từ điển trong `locales.ts`.
- Cấm `utils.ts`, `helpers.ts`, `common.ts`, `misc.ts`; đặt tên theo lĩnh vực (`jsonc.ts`, `http.ts`, `dom.ts`).
- Import tương đối phải có phần mở rộng: `from './slots.ts'`, `from './GoalBar.tsx'`.
- `src/index.ts` là entry duy nhất; các tệp khác là dependency private của nó. Entry plugin client không được import `src/client/**`.

README phải có bản đồ mã nguồn:

```md
| 文件 | 职责 |
|---|---|
| `src/index.ts` | 插件入口：Config schema、工具注册 |
| `src/types.ts` | 投影键与载荷类型的唯一归属地 |
```

### Chi tiết về thư mục

Chia thư mục theo lĩnh vực, không theo loại kỹ thuật. Chỉ tạo thư mục con khi thỏa cả năm điều kiện:

1. Nhóm tệp có chung lý do thay đổi (sửa A thường phải sửa B);
2. Chỉ cần 1–2 entry ở bề mặt công khai;
3. Có thể đặt tên theo lĩnh vực (không phải `utils`/`common`/`components`);
4. Nhóm có ≤30 tệp (cùng cách tính với giới hạn thư mục đơn) và sẽ không tiếp tục phình to;
5. Tham chiếu giữa các nhóm chủ yếu đi qua entry.

| Số tệp trong một thư mục (kể cả kiểm thử) | Khuyến nghị |
|---|---|
| ≤20 | Giữ dạng phẳng |
| 20–30 | Gộp các tệp cùng loại, xóa tệp không dùng rồi mới cân nhắc chia |
| >30 | Bắt buộc chia theo lĩnh vực |

- Chỉ tạo thư mục con khi có ≥3 tệp.
- Tạo entry `index.ts` khi cần: chỉ tạo khi có ≥2 tham chiếu liên nhóm hoặc có bề mặt công khai ổn định; nếu chỉ có 1–2 chỗ tham chiếu thì import tương đối trực tiếp. Entry giải quyết vấn đề “đường dẫn sâu rải rác”, không phải để “mọi thư mục trông giống nhau” — không có bên tiêu thụ thứ hai thì thêm một tầng chỉ làm tăng một bước.
- Cấm chia theo loại kỹ thuật (`components/`, `hooks/`, `services/`) và cấm thư mục chứa đồ linh tinh (`misc/`, `helpers/`, `common/`).
- Tệp kiểm thử đi theo tệp nguồn vào thư mục con, không gom vào `tests/`.

### Vòng đời tệp

Khi tách hoặc thay tệp cũ, tệp cũ chỉ có thể đi theo một trong ba hướng:

| Vai trò tệp cũ | Hướng xử lý | Thời gian giữ lại |
|---|---|---|
| Entry package | Vỏ mỏng: chỉ re-export và lắp ráp, ≤50 dòng | Vĩnh viễn |
| Được package khác import | Lớp tương thích: chỉ re-export, đánh dấu `@deprecated 替代路径与删除版本` | Một minor |
| Chỉ dùng nội bộ trong package | Xóa | Ngay lập tức |

- Cấm thư mục `legacy/`, `old/`, `archive/`, `backup/`; cấm triển khai song song `_v2`/`_new`; cấm mã cũ bị chú thích vô hiệu hóa.
- Trước khi xóa, xác nhận: không còn tham chiếu, kiểm tra kiểu thành công, kiểm thử xanh, bản đồ mã nguồn README đã cập nhật.
- Giao lịch sử cho git (`git log --follow`, `git blame -C -C`), không giữ lại tệp để lưu lịch sử.

## 4. Khung plugin

Host dạng hàm:

```ts
/**
 * <一句话职责>。
 *
 * <为什么需要这个插件 / 它约束了什么，2–4 句>。
 * @module @scope/dsh-<name>
 */
import z from '@deepseek-ai/schemastery';

/** Cordis plugin name. */
export const name = '<name>';
/** 需要的宿主服务。 */
export const inject = ['<service>'];
/** 运行时配置 schema；默认值写在这里。 */
export const Config = z.object({
  enabled: z.boolean().default(true),
});

/**
 * <注册了什么、依赖什么、清理什么>。
 * @param ctx - 挂载上下文。
 * @param config - <配置语义>。
 */
export function apply(ctx: Context, config: z.infer<typeof Config>) {
  ctx.effect(() => ctx.<service>.<register>({ /* ... */ }), '<name>.<resource>()');
}
```

Host dạng service:

```ts
export class WebServer extends Service {
  static readonly Config = z.object({ host: z.string().required(), port: z.number().required() });
  constructor(ctx: Context, config: z.infer<typeof Config>) {
    super(ctx, 'webServer');
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context { webServer: WebServer; }
}
```

UI client: giữ `apply()` rỗng ở phía host để Loader nhận diện plugin; phía trình duyệt:

```ts
import type { Context as ClientContext } from '@deepseek-ai/cordis';

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap { <ns>: <Key>; }
}

/** Required services. */
export const inject: string[] = ['slots', 'locale'];

/**
 * Client plugin body.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void { /* ctx.slots.register(...) */ }
```

Quy tắc:

- Mọi đăng ký phải đi qua `ctx.effect(register, '<模块>.<资源>()')`; đối số thứ hai là nhãn ổn định, không được bỏ.
- Chỉ ghi giá trị mặc định cấu hình trong schema `Config`, không dự phòng lần nữa trong `apply`.
- Dùng spread merge cho trường tùy chọn: `...config.x ? { x: true } : {}`.
- Patch của bundle dùng `- insert:` cùng `id`/`name`/`config`; `group: true` kết hợp `isolate` để cô lập phạm vi service.

## 5. Hợp đồng export và Loader

`unwrapExports` của Loader sẽ lấy `default` ngay khi phát hiện có `default`; named export bị bỏ qua âm thầm:

| Hình thức | Cách viết | Hậu quả |
|---|---|---|
| Dạng hàm | Chỉ dùng named export, **không dùng default** | Có default thì `inject` bị mất |
| Dạng lớp | `export { Klass, Klass as default }`; viết `inject`/`name` thành **static member** | Named `inject` không có hiệu lực |

- Thứ tự export theo alphabet: `export { Config, apply, inject, name }`.
- Mỗi tệp có một export chính; kiểu nằm sát phần triển khai; export chỉ dùng cho kiểm thử phải đánh dấu `@internal` và đặt cuối tệp.
- Mỗi tệp tối đa 15 export; `index.ts` chỉ làm entry công khai, cấm `export *`.
- Bề mặt export package chỉ gồm bộ bốn plugin và kiểu công khai; mô-đun nội bộ không được cam kết tương thích.

## 6. Đặt tên

| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| Tệp/thư mục | kebab-case | `request-zone.ts` |
| Tệp component | PascalCase | `GoalBar.tsx` |
| Biến/hàm | camelCase, động từ đứng đầu | `deriveTimeZoneContext` |
| Hằng số | UPPER_SNAKE | `MAX_WAIT_MS` |
| Kiểu/interface | PascalCase, không có tiền tố `I` | `WebRoute` |
| Boolean | `is/has/can/should/was` | `isLoopbackHost` |
| Tên service | camelCase, khóa trên Context | `webServer` |
| `name` plugin | kebab-case | `tool-todo` |
| Tên event | `<域>/<动作>` | `turn/start`, `llm/stream` |
| Tên slot | Phân cấp bằng dấu chấm | `conversation.input.dock` |
| Trường cấu hình | camelCase, đơn vị nằm trong tên | `compressionThresholdBytes` |

- Bắt buộc có hậu tố đơn vị: `_MS`, `_PX`, `_BYTES`, `_PERCENT`.
- Cấm định danh dài 1–2 ký tự (ngoại lệ: `i/j` trong vòng lặp, `e` trong catch, `t` là hàm dịch).
- Cấm dùng `data/info/temp/obj/val/manager/helper/flag` làm tên biến cục bộ.
- Danh sách viết tắt cho phép: `id`, `url`, `api`, `http`, `json`, `css`, `ms`.
- Mỗi khái niệm chỉ dùng một từ; không luân phiên `pet`/`instance`/`item`.

## 7. Biến

Phân loại theo vai trò, mỗi loại có quy tắc riêng:

| Loại | Hình thức | Quy tắc |
|---|---|---|
| Hằng số mô-đun | UPPER_SNAKE | Chỉ gán tại nơi định nghĩa; đơn vị nằm trong tên |
| Hằng số dùng chung | Tập trung trong `constants.ts` | Một khái niệm định nghĩa một nơi; liên package dùng tham chiếu chỉ kiểu |
| Giá trị cấu hình | `config.xxx` | Chỉ xuất phát từ schema; chỉ đọc; không dự phòng lại |
| Biến môi trường | `DSH_<PKG>_<NAME>` | Chỉ đọc và phân tích một lần trong `env.ts`; không hợp lệ thì dừng lỗi |
| Trạng thái có thể thay đổi | camelCase | Chỉ tồn tại trong store/closure; không export object có thể thay đổi |
| Singleton mô-đun | `xxxStore`/`xxxRegistry` | Phải dispose được; kiểm thử có thể reset; thứ tự khởi tạo ghi ở đầu mô-đun |
| Cache | Hậu tố `cache`/`byId` | Phải có chiến lược vô hiệu hóa và giới hạn dung lượng |
| Bộ đếm | `seq`/`count`/`epoch` | Nêu rõ tính đơn điệu; không dựa vào tự tăng để đảm bảo duy nhất khi có concurrency |
| Timer | `*Timer`/`*Handle` | Phải dọn được; thống nhất chiến lược `unref` |
| Disposer | `dispose*`/`*Off` | Phải được `ctx.effect` thu thập; cấm bỏ giá trị trả về |
| Handle tài nguyên | `child`/`stream`/`fd`/`server` | Một chủ sở hữu; thứ tự đóng ghi ở đầu mô-đun |
| Sentinel | Cấm chuỗi ma thuật | Dùng `undefined` cho thiếu, `null` cho không có giá trị; không dùng một giá trị để biểu thị hai nghĩa |
| Thông tin xác thực | `*Key`/`*Token`/`*Secret` | Chỉ ở trong bộ nhớ; cấm ghi log; lỗi chỉ trả thông báo phân loại |
| Đường dẫn | `*Path`/`*Dir` | Dùng đường dẫn tuyệt đối nội bộ; sau khi nối phải kiểm tra tiền tố |
| Chuỗi định danh | Export hằng số | Tên route/service/slot/event cấm rải literal |
| Thời gian/ngẫu nhiên | Tham số `now`/`rng` | Hàm thuần không đọc đồng hồ; có thể inject bộ tạo ngẫu nhiên |

Quy tắc vị trí: hằng số mô-đun nằm sau import, trước kiểu; biến cục bộ cách lần sử dụng đầu tiên ≤10 dòng; chuyển bất biến vòng lặp ra ngoài vòng lặp; mỗi ngữ nghĩa chỉ khai báo một lần.

## 8. Kiểu và interface

Phân công rõ cho hai loại schema:

- **`Config` của plugin dùng schemastery**: cần dump JSON Schema cho Loader và patch.
- **Record lưu bền / wire payload dùng zod**: suy ra kiểu bằng `z.infer`; cùng schema có thể tiếp tục chiếu thành RPC schema.

Quy tắc kiểu:

- Mọi trường công khai đều `readonly`; mảng dùng `readonly T[]`.
- Biểu diễn lỗi bằng discriminated union: `{ ok: false; error: { code; message } }`, không dùng `boolean + 可选错误`.
- Hợp đồng liên package chỉ hợp nhất qua `declare module` (`Context`/`Events`/`SlotMap`/`LocaleNamespaceMap`/`SessionProjectionMap`), không sao chép bản cục bộ.
- Suy ra kiểu cấu hình từ schema, không viết bản thứ hai.
- Cấm `any`; đầu vào bên ngoài dùng `unknown` + kiểm tra từng trường; assertion phải ngay sát câu lệnh kiểm tra.
- Trường nội bộ dùng `#private`, không dựa vào tiền tố `_`.
- Discriminated union phải exhaustive: `default: assertNever(x)`.

Phân tầng interface và độ ổn định:

| Tầng | Nội dung | Cam kết |
|---|---|---|
| Bề mặt export package | `exports` gồm `.`/`./client` | Ràng buộc semver |
| Interface plugin | `name/inject/Config/apply` | Hợp đồng Loader |
| Interface service | Lớp `Service` + mở rộng `Context` | Hợp đồng runtime liên plugin |
| Kiểu liên package | Hợp nhất `declare module` | Hợp đồng lúc biên dịch |

- Khai báo event phải ghi rõ `@mode emit`/`@mode waterfall`/`@mode serial`; payload phải là discriminated union có thể serialize.
- API kiểu đăng ký luôn có dạng `register(def) => disposer`: id duy nhất, ưu tiên bản built-in, đăng ký trùng thì ném lỗi, unregister chỉ xóa đúng lần đăng ký của nó.
- Lỗi công khai phải có `code` ổn định (kebab-case) + `message` dễ hiểu; đổi `code` tương đương đổi API.
- Đánh dấu nội dung deprecated bằng `@deprecated 替代品与起始版本`, giữ ít nhất một minor.

## 9. Hàm, luồng điều khiển và phân tầng

### 9.1 Quy mô và độ phức tạp

| Đối tượng | Giới hạn |
|---|---:|
| Hàm thông thường | 40 dòng |
| Hàm API export | 60 dòng |
| `apply` | 60 dòng |
| React component (trình bày) | 150 dòng |
| React component (realtime: rAF / pointer / state machine) | Phần panel 150 dòng, driver phải tách ra |
| Custom hook | 80 dòng |
| Lớp | 200 dòng; phương thức 30 dòng; tối đa 10 phương thức công khai |
| Tham số | 4 (nhiều hơn thì đổi thành object) |
| Độ lồng nhau | 3 |
| Độ phức tạp chu trình | 10 |

- Mỗi hàm chỉ thực hiện một tầng trừu tượng: không trộn “quyết định + IO + định dạng”.
- Có ≥2 tham số boolean hoặc >4 tham số thì chuyển sang object tùy chọn hoặc tách hàm.
- Chỉ dùng lớp khi có “vòng đời/trạng thái nhiều instance”; object chỉ dùng một lần phải ghi rõ ở đầu mô-đun “không thể dùng lại sau stop”.
- Với component realtime, xét theo **số driver**, không theo số dòng: `ref ≥ 8`, `rAF 循环 ≥ 2` hoặc có state machine pointer thì trích driver thành factory `createXxx(deps)`; component chỉ giữ “panel + lắp ráp”. Tiêu chí tách là “phần này có kiểu lỗi độc lập không”, không phải “đã vượt số dòng chưa”.
- Nếu chưa chắc có nên trích xuất không, dùng một tiêu chí: **có thể assertion quy tắc của phần này tách khỏi DOM / React không?** Có (chuyển đổi, ưu tiên, chuyển trạng thái, quyết định) thì trích thành hàm thuần và kiểm thử; không (thời điểm frame, bắt pointer, ghi layout) thì gom trạng thái trước, đừng vội đổi tệp.

### 9.2 Luồng điều khiển

- Dùng guard clause + return sớm; giữ đường thành công ở mức thụt lề ngoài cùng; chỉ dùng `else` cho nhánh thực sự đối xứng.
- Độ lồng nhau ≤3; nhiều hơn thì trích hàm hoặc dùng lookup table.
- Có >3 nhánh cho cùng một khái niệm (ví dụ `kind` có hơn bốn dạng) thì đổi sang `Record<Kind, Handler>` và dùng `assertNever` để đảm bảo exhaustive.
- Không làm IO trong vòng lặp; tạo index trước vòng lặp lồng nhau; nếu giải quyết được bằng một lượt thì không duyệt hai lượt.
- Cấm ternary lồng nhau; viết `if (x) return true; return false;` thành `return x`.
- Đặt tên cho điều kiện phức tạp trước: `const isStale = ...`, không nhét cả biểu thức vào `if`.

### 9.3 Ranh giới xác thực

Quy ước của DSH là “phân tích một lần, sau đó tin cậy”:

- Phân tích đầu vào bên ngoài một lần tại entry: `parseX(raw): X` trả về **giá trị đã xác thực**, không trả về boolean.
- Phân công: schema xử lý kiểu/trường bắt buộc/enum; `parseX` chỉ bổ sung ràng buộc schema không biểu đạt được (không rỗng, phạm vi, loại trùng, tổ hợp).
- Sau khi phân tích, truyền kiểu đã xác thực xuống dưới (branded hoặc object sau phân tích); hàm nội bộ không xác thực lại.
- Phân tích cấu hình một lần tại entry `apply`: xác thực + điền mặc định + `deepFreeze`, sau đó chỉ đọc.
- Chỉ cho phép xác thực lần hai trong ba trường hợp: qua ranh giới process, đọc dữ liệu khác phiên bản, đọc lại từ medium.
- Nếu A xác thực rồi gọi B và B lại xác thực, chỉ giữ một chỗ: nếu B là public API thì bỏ xác thực ở A; nếu B là hàm nội bộ thì bỏ xác thực ở B.

### 9.4 Phân tầng và hướng dependency

Chia thành bốn tầng theo đường nối năng lực, không sao chép mô hình controller / service / mapper:

| Tầng | Hình thức | Chỉ làm | Cấm |
|---|---|---|---|
| Entry carrier | Route handler, slot component, tool `execute`, lệnh CLI | Phân tích input, gọi service, ghi response/render | Quy tắc nghiệp vụ, đọc medium trực tiếp |
| Điều phối service | Lớp con `Service`, registry | Đăng ký, route, vòng đời, ranh giới transaction | Tính toán thuần, ghép văn bản |
| Domain | Fold, parse, format, policy thuần | Quy tắc, chuyển đổi, chuyển trạng thái | IO, đồng hồ, ngẫu nhiên, DOM |
| Adapter medium | Storage backend, LLM adapter, HTTP client, bridge | Serialize, lưu bền, protocol | Phán đoán nghiệp vụ |

- Dependency một chiều: carrier → service → domain; adapter được service gọi; domain không phụ thuộc tầng nào.
- Phân tầng khi cần: không ép plugin nhỏ thành đủ bốn tầng nhưng **domain không được phụ thuộc carrier**.
- Đầu mô-đun nêu mục tiêu không đảm nhiệm; cách viết chính thức là “owns only X, never Y”.
- Khi nhiều bên tiêu thụ cùng kết quả, chỉ tạo dữ liệu có cấu trúc một lần; mỗi nơi render bằng phép ánh xạ mỏng riêng.

### 9.5 Vị trí tác dụng phụ và lỗi

- Gom tác dụng phụ ở entry và adapter; hàm domain không đọc đồng hồ, ghi đĩa hay gửi request.
- Inject thời gian, ngẫu nhiên và IO qua tham số để thuận tiện kiểm thử.
- Domain ném lỗi ngữ nghĩa (có `cause`), entry chuyển thành kết quả có cấu trúc; không bọc lại nhiều lần ở tầng trung gian.

### 9.6 Dependency lời gọi

- Có hai loại dependency: cạnh import và cạnh lời gọi. Dùng công cụ cấm vòng lặp import; làm thẳng vòng lặp lời gọi ở composition root.
- Giao tiếp hai chiều chỉ được thông qua hàm hoặc event do composition root inject; cấm hai mô-đun import lẫn nhau.
- Tầng dưới thông báo tầng trên bằng callback inject hoặc phát event, không import tầng trên.
- Chỉ cho phép `let` + tham chiếu trì hoãn trong composition root; cấm trong mô-đun nghiệp vụ.
- Đặt tên để phân biệt “yêu cầu” và “thực thi”: `requestRestart()` không đồng nghĩa `restart()`.

### 9.7 Driver realtime

Các cơ chế realtime như vòng lặp rAF, state machine pointer và bộ bơm timer dùng chung một khung; tuân theo bảng này, đừng tự phát minh cách riêng trong cùng kho mã:

| Thành phần | Cách làm | Lý do |
|---|---|---|
| Handle frame | Driver giữ `frame: number \| null` bên trong | Phải tồn tại qua nhiều lần render; nếu đặt trong component thì sau rerender sẽ mất khả năng hủy |
| Số thế hệ | Khi bắt đầu/dừng thì `token++`; đầu frame kiểm tra `if (token !== own) return` | Frame đến muộn tự bỏ; vòng lặp cũ không sửa trạng thái mới |
| Instance | Trong component dùng `xxxRef.current ??= createXxx({...})` | Tạo lại mỗi render làm mất handle; nếu chỉ tạo một lần, mọi dependency phải đi qua getter |
| Dependency | Tất cả là getter (`box()`/`physics()`/`viewport()`), không truyền snapshot | Driver sống qua nhiều lần render, snapshot sẽ cũ |
| Dừng | `stop()` hủy frame, xóa handle, xóa trạng thái dẫn xuất; bên gọi quyết định dừng driver nào | Mỗi driver chỉ quản lý chính nó, không import driver ngang hàng |
| Ghi | Ghi đồng bộ DOM và giá trị realtime trong frame, chỉ commit trạng thái framework khi đã ổn định | Trì hoãn ghi sang callback khiến rerender đọc giá trị cũ, chỉ lộ lỗi ở nhịp render nhất định |

Phía component chỉ giữ ba việc: lắp getter, nối phương thức driver với view, gọi stop khi unmount.

Tiêu chí: **phần này có kiểu lỗi độc lập không** (không hủy frame sẽ rò frame, handle không sống qua render sẽ mất vòng lặp, snapshot sẽ cũ) — nếu có thì tách thành driver; “nhiều dòng” tự nó không phải lý do.

### 9.8 React được inject lúc runtime

Khi thư viện component nhận năng lực react từ host (`h`, `useState`, `useEffect`, `useRef`) thay vì import trực tiếp, dùng mẫu sau, không thiết kế lại mỗi lần:

```ts
/** 注入的 react 能力；类型只取用到的子集。 */
export interface XxxRuntime {
  /** 创建元素。 */
  h: typeof jsx;
  /** 状态。 */
  useState: <T>(init: T) => [T, Dispatch<SetStateAction<T>>];
  /** 引用。 */
  useRef: <T>(initial: T) => ReactNS.MutableRefObject<T>;
}

/**
 * 造 hook。
 *
 * @param rt - 注入的 react 能力。
 * @returns 接收视图输入的 hook。
 */
export function createXxx(rt: XxxRuntime) {
  return function useXxx(input: XxxInput): Xxx {
    // …
  };
}
```

- Định nghĩa hook trong closure của factory và gọi đúng một lần vô điều kiện trong component; phương thức trả về không phụ thuộc `this`, có thể truyền trực tiếp vào view như `onClick: xxx.onClick`.
- Trạng thái bắt buộc có `useRef` để sống qua lần render phải được giữ bằng `useRef`; không dùng biến cấp mô-đun (sẽ bị dùng chung giữa các instance).
- Kiểu inject chỉ lấy “tập con thực sự dùng đến”, không dùng toàn bộ `typeof React` — nếu không test double cũng phải triển khai mọi phương thức, làm chi phí tăng gấp đôi.

## 10. Cấu hình và trạng thái

Cấu hình:

- Một schema là nguồn sự thật duy nhất: kiểu, giá trị mặc định, xác thực và tài liệu đều được suy ra từ nó.
- Mặc định từ chối trường không biết (`strict`); muốn cho phép phải ghi rõ và nêu lý do.
- Cố định thứ tự ưu tiên và ghi ở đầu mô-đun: mặc định tích hợp → bundle patch → profile patch → ghi đè của người dùng → CLI.
- Đổi tên/ý nghĩa trường phải cung cấp migration và số phiên bản; migration idempotent; nếu thất bại không ghi dữ liệu dở dang.
- Đánh dấu mục nhạy cảm là `secret`: không echo lại, không ghi log, không đưa vào dump.
- Thay đổi cấu hình phải đi qua cùng một đường reload; nếu reload thất bại thì giữ giá trị cũ và báo lỗi.

Trạng thái:

- Trạng thái lưu bền phải có `stateVersion`; khi nâng phiên bản cung cấp migration liền kề, dữ liệu cũ có thể replay.
- `apply` của projection phải là hàm đồng bộ thuần: `(state, event) => state`; cấm IO/đồng hồ/ngẫu nhiên.
- Event không quan tâm phải trả về **cùng reference**, để framework short-circuit bằng `Object.is`.
- Trạng thái lưu bền phải là plain JSON.
- Event log mang trạng thái phải cung cấp toàn bộ trạng thái sau thay đổi; cấm chỉ ghi delta trần.
- Ngữ nghĩa chuỗi ghi: chờ lưu bền thành công → sửa bộ nhớ → phát event thay đổi; nếu lỗi thì không sửa bộ nhớ.
- Dòng lưu bền chỉ là “đường tắt fold”; nếu sai phiên bản hoặc seq vượt giới hạn thì bỏ, không xem là thẩm quyền.

## 11. Concurrency và tài nguyên

- Mọi thao tác chờ đều có timeout; đặt tên hằng số timeout và ghi cơ sở lựa chọn.
- Entry bất đồng bộ nhận `AbortSignal` và truyền đến tầng sâu nhất; sau khi hủy thì không ghi response/trạng thái nữa.
- Cấm floating promise: phải `await`, hoặc `void` kèm chú thích giải thích, hoặc đưa vào queue.
- Ghi đồng thời vào cùng tài nguyên phải tuần tự hóa (queue/lock/single-flight); đọc có thể đồng thời.
- Stream output phải có giới hạn; queue phải có giới hạn và chiến lược loại bỏ.
- Cố định thứ tự cleanup và ghi ở đầu mô-đun: gỡ listener → dừng timer → đóng stream/child process → ghi xuống đĩa.
- Child process dùng ngữ nghĩa `stopAndWait`; restart có backoff + circuit breaker; cấm hai process cũ/mới chạy chồng nhau.
- Thống nhất chiến lược `unref` của timer; phân biệt timer theo request và timer thường trú.
- Disposer trả về từ đăng ký phải được giao cho `ctx.effect`; cấm “đã đăng ký nhưng không ai dọn dẹp”.

## 12. Lỗi và log

Chia lỗi thành ba loại:

| Loại | Ví dụ | Xử lý |
|---|---|---|
| Lỗi người dùng | Tham số không hợp lệ, cấu hình không hợp lệ | 4xx / thông báo rõ; không ghi error |
| Lỗi hệ thống | IO, mạng, timeout | 5xx / code chuẩn hóa; ghi warn/error; có thể retry |
| Lỗi dependency | Thiếu service, thiếu thông tin xác thực | Hạ cấp hoặc nêu rõ không khả dụng; nghiêm cấm giả vờ thành công |

- Lỗi ném ra phải có `cause`: `throw new TypeError(msg, { cause })`.
- Thông báo lỗi nêu “mong đợi gì, nhận được gì”, không ghi “đã xảy ra lỗi”.
- Lỗi bảo mật chỉ trả thông báo phân loại, tuyệt đối không echo thông tin xác thực, URL đầy đủ hoặc request body.
- Ghi log bằng `ctx.logger`, cấm dùng trần `console.*` (client có thể dùng nhưng phải thống nhất prefix).
- Log có cấu trúc: cấp độ + `event` + trường quan trọng + `durationMs`; không in nội dung người dùng.
- Mỗi plugin có một prefix log; log theo request kèm session/trace id.

## 13. Bảo mật

- Input: giới hạn độ dài, whitelist kiểu và enum; sau khi nối đường dẫn phải kiểm tra tiền tố; URL chỉ cho phép http/https.
- Thông tin xác thực: chỉ giữ trong bộ nhớ; khử nhạy cảm trong lỗi; không ghi log, không ghi xuống đĩa; khi đọc phải kiểm tra quyền tệp.
- Lệnh: cấm ghép chuỗi shell; truyền mảng tham số; ngay cả lệnh cố định cũng phải chống đường dẫn chứa dấu nháy.
- HTML: escape toàn bộ văn bản bên ngoài; rich text dùng cây node whitelist + giới hạn dung lượng; mặc định CSP từ chối.
- Mạng: mặc định chỉ lắng nghe loopback; mặc định từ chối cross-origin; so sánh token dùng timing-safe.
- Chuỗi cung ứng: đưa lockfile vào kho mã; mặc định tắt script build của dependency; tách quyền của job phát hành với job build.

## 14. UI client

- Owner khai báo `kind` (single/list/keyed/chain) và `scope` (root/session-maybe/session) cho slot; registrant chỉ tiêu thụ.
- Framework kết hợp props theo ba phần: `PropsRuntime<slot>` + `InjectFace<...>` + `PropsLocale<ns>`; component không tự tạo `t`.
- Với mỗi trường props của component export: chỉ ghi một dòng cho ngữ nghĩa không hiển nhiên; không ghi tọa độ/kích thước/tên (chi tiết xem `dsh-plugin-comment-spec`); kiểu trả về phải khai báo rõ `JSX.Element | null`.
- Locale: trong `locales.ts`, `zh` là nguồn chuẩn cho tập key, tập key `en` phải khớp; `type Key = keyof typeof zh`; key theo dạng `<域>.<对象>.<角色>`.
- `locale/zh.json` chỉ chứa metadata thị trường (`meta.title`/`meta.description`), không chứa nội dung UI.
- Tách component: component trình bày tối đa 150 dòng mỗi component; `useState` ≤5; `useEffect` ≤6; trạng thái dẫn xuất trích thành hàm thuần. Component realtime (rAF / pointer / state machine) phải tách driver theo §9.7; panel vẫn chịu giới hạn 150 dòng, hạn mức `useState`/`useEffect` chỉ tính của panel.
- Style chỉ dùng design token `--dsw-*`, cấm giá trị màu literal; ưu tiên primitives, không tự tạo lại button/menu/dialog.
- Kích thước, khoảng cách, bo góc dùng token hoặc hằng số dùng chung; chỉ cho phép một entry inject CSS là `injectStyleOnce(key, css)`.
- Accessibility: phần tử có thể nhấn dùng ngữ nghĩa native hoặc `role="button" tabIndex={0}` + Enter/Space; nút icon có `aria-label`; trạng thái dùng `aria-expanded`/`aria-live`; focus nhìn thấy được; truy cập được bằng bàn phím.

## 15. Chú thích và tài liệu

Chi tiết chú thích xem `dsh-plugin-comment-spec` cùng thư mục; mục này chỉ liệt kê các ràng buộc cứng:

- Phần đầu tệp phân cấp theo vai trò: entry/lắp ráp/driver/hook có trạng thái viết 4–8 dòng (trách nhiệm, mục tiêu không đảm nhiệm, dependency, bất biến); mô-đun thông thường 1 dòng; lá hàm thuần có thể bỏ.
- Mỗi export có tóm tắt một dòng; hàm phức tạp ghi `@param name - 语义`, `@returns 边界`, `@throws 条件`.
- Chỉ ghi “vì sao”, không ghi “đã làm gì”; cấm kể lịch sử, tham chiếu đường dẫn tệp và TODO không có người phụ trách.
- Ngoại lệ coverage phải kèm lý do: `/* v8 ignore next N -- 原因 */`.
- Ngôn ngữ chú thích theo dự án, giữ nguyên tên thẻ và cấu trúc.

Tài liệu:

- `README.md` và `README.zh.md` đi theo cặp, liên kết qua lại ở đầu trang.
- Frontmatter cố định `description` + `kind: "package-reference"`.
- Các chương cố định: Tổng quan → Dùng package này → Hiểu cách triển khai (gồm bản đồ mã nguồn, hình thức export) → Khám phá thêm → Trải nghiệm model (đối với tool) → Giới hạn đã biết → Ghi chú phát triển.
- Anchor chương dùng `<a id="kebab-case"></a>`; phần giải thích triển khai dài đặt trong `<details>`.
- README song ngữ dùng `README.i18n.yaml` ghi hash tiếng Trung/Anh của từng heading; sửa một phía phải đồng bộ phía còn lại và ghi lại hash.
- Quyết định thiết kế ghi vào `notes/<date>-<topic>.md` hoặc ADR; README liên kết tới đó, không nhét vào chú thích mã.

## 16. Kiểm thử

### 16.1 Loại kiểm thử

| Loại | Kiểm thử gì | Đặt ở đâu | Tỷ lệ |
|---|---|---|---|
| Unit | Hàm thuần: parse / format / chuyển đổi / chuyển trạng thái | Cùng thư mục với mã được kiểm thử | ~70% |
| Contract | Plugin đã đăng ký gì, đã dọn dẹp gì | Cùng thư mục với mã được kiểm thử | ~20% |
| Integration | Hành vi kết hợp component + slot + locale | `tests/integration/` | Ít |
| End-to-end | Khởi động, route, ma trận lỗi | `tests/*.expected.e2e.ts` | ~10% |

- Kiểm thử component dùng render thật, không dùng snapshot lớn.
- Kiểm thử cần HTTP dùng test double có kiểm soát: stub cục bộ, `nock`/`msw` hoặc fetch được inject; assertion hình dạng request, timeout, retry và chuẩn hóa lỗi; không phụ thuộc tài khoản thật hay thời gian hiện tại.
- Bộ kiểm thử mặc định không truy cập Internet công cộng hay nhà cung cấp thật; ca cần nhà cung cấp thật để riêng trong `*.live.test.ts` (mặc định skip, cần biến môi trường tường minh, không chạy trong CI).

### 16.2 Tệp và thư mục

- Mỗi tệp nguồn tương ứng một tệp kiểm thử: `foo.ts` ↔ `foo.test.ts`, cùng thư mục.
- Tích hợp xuyên mô-đun đặt trong `tests/integration/`; e2e đặt trong `tests/*.expected.e2e.ts`.
- Fixture đặt trong `tests/fixtures/`, chỉ đọc; nếu cần ghi thì mỗi test tự tạo thư mục tạm.
- Hàm hỗ trợ kiểm thử đặt trong `tests/support/`, không đặt tên `utils.ts`.
- Tệp kiểm thử ≤600 dòng; nếu vượt thì tách theo hành vi, không tách thành “phần 1 / phần 2”.

### 16.3 Cách viết

- `describe('<模块/函数>')`; `test('<行为>：<条件> → <结果>')`, viết tiếng Trung.
- AAA: chuẩn bị, thực thi, assertion; một test chỉ xác minh một hành vi.
- Nội dung assertion viết rõ “đáng lẽ phải là gì” để khi thất bại có thể định vị ngay.
- Mỗi test tự tạo ctx / store / thư mục tạm; các test không chia sẻ trạng thái thay đổi và không phụ thuộc thứ tự chạy.
- Inject thời gian, ngẫu nhiên, mạng và filesystem qua tham số.
- Kiểm thử contract tối thiểu phải assertion hai điều: đăng ký thành công và đã dọn sạch sau dispose.
- Kiểm thử mạng: mỗi test tự tạo server, cổng ngẫu nhiên, đóng khi kết thúc; assertion header/đường dẫn/timeout, không phụ thuộc Internet công cộng.

### 16.4 Điều cấm

- Không thêm regex guard đọc mã nguồn (ví dụ “tệp này phải có ký hiệu nào đó”): nó kiểm tra văn bản chứ không kiểm tra hành vi, đổi cấu trúc là thất bại. Đưa guard hiện có vào baseline, chỉ giảm chứ không tăng; khi sửa tệp liên quan hãy thay guard bằng kiểm thử assertion hành vi.
- Không mock hàm nội bộ của mô-đun đang kiểm thử.
- Không snapshot object lớn.
- Không dùng `sleep` để chờ; dùng polling theo điều kiện hoặc inject đồng hồ.
- Không truyền trạng thái giữa các test (biến toàn cục, cache cấp mô-đun).
- Không assertion chi tiết triển khai (trường private, số lần gọi) thay vì hành vi.

### 16.5 Coverage

- Dòng mới/sửa ≥80%; hàm thuần ≥90%; không chạy theo con số tổng thể.
- Đăng ký baseline cho phần cũ chưa được cover, chỉ giảm chứ không tăng.
- Ngoại lệ coverage phải ghi lý do.
- Số dòng kiểm thử : số dòng mã nguồn ≈ 0.8–1.2.

## 17. Build và phát hành

- Dùng tsdown để build, sản phẩm ở `lib/`; hình thức bundle client là `window.__ModuleLoader__.load({ id, factory })`; externalize `react`/`react-dom`/`@deepseek-ai/*`.
- Trước phát hành bắt buộc chạy: `typecheck → lint → format:check → test → prepack-check`.
- Danh sách allowlist `files` chỉ có một nguồn; generator, bundler và script kiểm tra đều phải suy ra từ hoặc assertion theo nguồn đó.
- Sản phẩm được sinh (`lib/types/**`, bundle, schema dump, catalog, hash i18n) phải đánh dấu `@generated` + lệnh sinh; CI kiểm tra diff.
- Phiên bản đồng bộ với DSH release; trước khi tạo tag, xác minh `package.json.version` khớp tag.
- CI: PR chạy toàn bộ kiểm tra bắt buộc; phát hành là job riêng, chỉ job đó có `contents: write`; job build chỉ có quyền đọc.

## 18. Hiệu năng

- Ngân sách: kích thước bundle, thời gian khởi động, bộ nhớ mỗi request, thời gian hiển thị màn đầu; mỗi mục có ngưỡng và đưa vào CI.
- Cache: chỉ cache kết quả tính toán thuần; phải có key, giới hạn dung lượng và vô hiệu hóa; cache không thay đổi ngữ nghĩa.
- Lazy loading: dependency nặng như SDK, parser dùng dynamic import, không nằm trong đường khởi động.
- Đường nóng (rAF, polling) cấm tạo object/closure lớn mới mỗi frame; cache giá trị dẫn xuất.
- IO: đọc theo lô, tránh stat lặp; debounce theo dõi tệp.

## 19. Danh sách điều cấm

1. Plugin dạng hàm export `default` (sẽ làm Loader mất `inject`).
2. Plugin client thiếu `apply()` ở phía host.
3. Chỉ khai báo `exports["./client"]` mà bỏ `dsh.client`.
4. Package trong `dsh.client.inject` bị thiếu khỏi `devDependencies`.
5. Viết tay bản thứ hai của giá trị mặc định cấu hình.
6. Dùng màu literal/px hard-code, không dùng `--dsw-*`.
7. Túi đồ linh tinh `utils.ts`/`common.ts`.
8. Sao chép kiểu/hằng số/protocol xuyên plugin.
9. Tệp đơn >300 dòng, hàm đơn >60 dòng, component đơn >150 dòng (xem §9.7 về việc tách driver của component realtime; phần panel cũng chịu giới hạn này).
10. Đăng ký tài nguyên nhưng không có disposer sở hữu.
11. Floating promise, chờ không timeout, async không thể hủy.
12. Dùng `console.*` thay cho `ctx.logger`.
13. Dùng chú thích để kể lịch sử, ghi đường dẫn, viết TODO không có người phụ trách.
14. Manifest phát hành và script build được duy trì riêng rẽ.
15. Migration không có số phiên bản hoặc đổi định dạng mà không tăng `stateVersion`.

## 20. Kiểm tra trước commit

- [ ] Đã xác định rõ loại plugin, đủ bộ bốn entry.
- [ ] `exports`/`files`/ba nhóm dependency/các trường `dsh` chính xác.
- [ ] Tệp ≤300 dòng, hàm ≤60 dòng, component ≤150 dòng; phần vượt giới hạn đã hỏi “có lý do thay đổi độc lập không”; nếu không thì ghi rõ không tách, nếu có thì tách.
- [ ] Driver của component realtime (rAF / pointer / state machine) đã được tách; handle frame và số thế hệ nằm bên trong driver (§9.7).
- [ ] Hook inject react dùng mẫu `createXxx(rt)`; trạng thái qua render dùng `useRef` thay cho biến cấp mô-đun (§9.8).
- [ ] Không có bản sao thứ hai của hằng số/kiểu/quy tắc/manifest.
- [ ] Biến đặt đúng vị trí theo loại; handle và timer có chủ sở hữu cleanup.
- [ ] Giá trị mặc định cấu hình chỉ nằm trong schema; trường không biết bị từ chối.
- [ ] Trạng thái lưu bền có `stateVersion` và migration liền kề.
- [ ] Async có timeout/hủy; không có floating promise.
- [ ] Lỗi đã phân loại, có `code`/`cause`, đã khử dữ liệu nhạy cảm.
- [ ] Log có cấu trúc, không in nội dung người dùng hay thông tin xác thực.
- [ ] Đã xác thực độ dài/enum/đường dẫn/URL đầu vào.
- [ ] Client chỉ dùng token `--dsw-*`, ưu tiên primitives.
- [ ] Tập key locale zh/en giống nhau; thao tác được bằng bàn phím.
- [ ] Kiểm thử ở cùng thư mục, kiểm thử hành vi, cover dòng mới.
- [ ] Sản phẩm được sinh đánh dấu `@generated` và được CI kiểm tra.
- [ ] README có bản đồ mã nguồn, có cặp song ngữ, hash i18n đã cập nhật.
- [ ] Nội dung deprecated/tương thích có khai báo và hướng dẫn migration.

