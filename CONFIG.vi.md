# Cấu hình (kích thước / vị trí / nhiều thú cưng)

> Quay lại [README](README.vi.md)

Có thể cấu hình kích thước, vị trí và số lượng thú cưng theo hai cách:

> 💡 **Hai cách chỉ khác nhau ở điểm vào chỉnh sửa; cuối cùng đều dùng chung một cấu hình người dùng** — khả năng cấu hình rộng hơn nhiều so với các tùy chọn trên trang cài đặt: trang cài đặt cho phép đổi kích thước / vị trí / lề / nơi hiển thị / bật tắt số dư / số lượng thú cưng, nhưng **chỉnh sửa tệp cấu hình thủ công cho phép cấu hình tự do** (pool hoạt ảnh, trọng số phát, hoạt ảnh sự kiện, chu kỳ làm mới, v.v.). Chỉ cần **định dạng giống cấu hình mặc định `config.jsonc` trong gói**, cấu hình người dùng sẽ **ghi đè toàn bộ** các trường tương ứng.

## Cách 1: Trang cài đặt (khuyến nghị)

DSH Settings → “Cấu hình thú cưng”:

- **Kích thước**: chiều rộng tính bằng px (chiều cao tự động = chiều rộng × 9/16); có thêm **giới hạn theo chiều rộng màn hình** (%) (mặc định 100, không giới hạn): giới hạn theo chiều rộng màn hình của thân nhân vật, còn px là giới hạn cho khung vẽ — 100 ≈ không giới hạn (trông như chỉ đặt px trên desktop), nhập 30–50 sẽ làm nhân vật nhỏ rõ rệt trên màn hình điện thoại dọc, nhập 150 làm nhân vật rộng hơn màn hình (khung vẽ vẫn bị giới hạn bởi px). Chỉ tính một lần khi trang tải; cần làm mới cửa sổ sau khi đổi để có hiệu lực
- **Vị trí**: một trong bốn góc (corner) + lề ngang/dọc (marginX / marginY)
- **Nơi hiển thị** (display): web=chỉ trình duyệt / desktop=chỉ desktop / both=hiển thị ở cả hai / none=không hiển thị ở đâu
- **Tính năng số dư**: chỉ thú cưng được đánh dấu mới kích hoạt hoạt ảnh số dư và hiển thị bong bóng số dư (nếu nhà cung cấp dịch vụ chưa đăng ký API số dư thì sẽ hiện bong bóng giải thích bằng văn bản)
- **Nhiều thú cưng**: thêm/xóa thú cưng; mỗi thú cưng có ID, kích thước và vị trí riêng
- **Loại (pet pack)**: các gói nhân vật trong thư mục `pet/` cũng xuất hiện trong danh sách thú cưng (được nhóm theo loại); có thể đổi tên/kích thước/vị trí/cách hiển thị/bốn công tắc/tính cách của instance; nút “+” trong mỗi nhóm tạo instance thuộc loại đó. Khi lưu, `main` ghi vào `main-config.jsonc`, còn thú cưng dạng tệp được ghi lại vào cấu hình của gói nhân vật tương ứng (giữ nguyên pool hoạt ảnh và tính cách cấp cao nhất); mỗi loại phải giữ lại ít nhất một instance, không cho xóa instance cuối cùng
- **Tham số vật lý**: có thể điều chỉnh trực quan cảm giác ném khi kéo (trọng lực / độ đàn hồi / ma sát mặt đất / lực tổng / nảy ở phía trên / va chạm thú cưng / rung khi va chạm / dùng độ nghiêng để điều khiển trọng lực / lắc để ném) ngay trên trang cài đặt, không cần sửa tệp cấu hình thủ công. Rung khi va chạm (`physics.hapticEnabled`, mặc định bật) rung khi va tường, chạm đất, va trần và thú cưng va vào nhau: dùng được trên trình duyệt như Chrome / Edge, không hoạt động trong WebView như iOS và Via; chế độ Không làm phiền của hệ thống sẽ chặn rung. Va chạm thú cưng (`physics.petCollision`, mặc định bật) làm chúng nảy ra theo bảo toàn động lượng (khối lượng ∝ kích thước²). Điều khiển bằng cảm biến tách thành hai công tắc: dùng độ nghiêng để điều khiển trọng lực (`physics.tiltGravity`, mặc định tắt) dùng hướng nghiêng điện thoại thay cho trọng lực cố định hướng xuống (khi `gravity` bằng 0 thì không có giá trị để lấy, tương đương tắt); lắc để ném (`physics.shakeThrow`, mặc định tắt) ném thú cưng theo hướng vung (lực = mức cơ sở × `throwPower`), không liên quan đến độ lớn trọng lực, nên đặt `gravity` bằng 0 vẫn lắc để ném được. Cả hai chỉ hoạt động qua HTTPS hoặc localhost
- **Mô hình AI**: có thể chỉ định mô hình riêng cho lẩm bẩm và hội thoại — mỗi mục trong “Mô hình AI” trên trang cài đặt có một hộp chọn thả xuống (giống bộ chọn mô hình góc dưới bên phải hộp thoại DSH: ô tìm kiếm + danh sách nhóm theo nhà cung cấp; dùng chung nguồn dữ liệu); chọn “Theo hội thoại hiện tại” để dùng mô hình của hội thoại đang mở; nếu mô hình chỉ định không gọi được thì tự động quay về mô hình của hội thoại hiện tại và thử lại một lần
- Nhấn “Lưu” để **có hiệu lực ngay** (không cần làm mới); “Đồng bộ” ghi toàn bộ **nguyên văn** `config.jsonc` trong gói (bao gồm chú thích và mọi trường nâng cao) vào cấu hình người dùng — vừa khôi phục mặc định, vừa có một tệp cấu hình hoàn chỉnh để chỉnh trực tiếp
- **Giọng nói**: chọn riêng cách triển khai đọc thành tiếng và nhập liệu bằng giọng nói. Host cung cấp danh mục giọng đọc và triển khai nhận dạng (`/voice/voices`, `/voice/hear-providers`); cấu hình lưu ID đầy đủ như `provider/音色` hoặc ID provider; trang không mã hóa cứng tên giọng. Nếu triển khai đã chọn bị gỡ thì yêu cầu báo lỗi rõ ràng, không tự chuyển sang triển khai khác

## Cách 2: config.jsonc (nguồn duy nhất)

Mảng `pets` trong `dsh-pet/assets/config.jsonc` của gói plugin định nghĩa **thú cưng mặc định**:

```jsonc
"pets": [
  { "id": "main", "size": 462, "balanceEnabled": true, "display": "both", "position": { "corner": "top-right", "marginX": 24, "marginY": 100 } }
]
```

- Mỗi thú cưng: `id` (định danh) / `size` (chiều rộng px) / `sizePercent` (không bắt buộc, tỷ lệ phần trăm chiều rộng màn hình 1–100; nếu có thì giới hạn theo chiều rộng cửa sổ, `size` là mức tối đa) / `balanceEnabled` (có bật tính năng số dư hay không, boolean bắt buộc) / `display` (web/desktop/both/none, bắt buộc, xem phần trên) / `position` (một trong bốn `corner` + lề marginX/marginY)
- Chu kỳ làm mới số dư: `eventsRefreshSec.balance` (giây) — khoảng thời gian giữa các lần làm mới dữ liệu số dư và kích hoạt hoạt ảnh số dư; kích hoạt ngay khi khởi động, sau đó lặp theo chu kỳ này (mặc định 1800)
- Các thay đổi trên trang cài đặt được lưu vào lớp người dùng `$DSH_HOME/dsh-pet/main-config.jsonc` (danh sách thú cưng **đầy đủ**, ghi đè mặc định trong gói); “Đồng bộ” ghi toàn bộ nội dung gốc `config.jsonc` trong gói vào tệp đó (tương đương trở về mặc định, nhưng vẫn giữ lại tệp để chỉnh trực tiếp)

## Cách 3: Chỉnh sửa tệp cấu hình thủ công (nâng cao, hoàn toàn tự do)

Tệp cấu hình lớp người dùng nằm tại `$DSH_HOME/dsh-pet/main-config.jsonc`. **Tệp này dùng cùng định dạng với cấu hình mặc định trong gói** — chỉ cần viết các mục cần đổi theo cấu trúc trong `assets/config.jsonc`; trường sai hoặc thiếu sẽ quay về mặc định, không cần (và không thể) viết cả tệp. Nút “Đồng bộ” trên trang cài đặt có thể tạo tệp đầy đủ này (sao chép nguyên văn `config.jsonc` trong gói, kèm đầy đủ chú thích):

| Trường | Tác dụng | Chỉ cần dùng cùng định dạng với mặc định |
| --- | --- | --- |
| `pets` | Danh sách thú cưng (kích thước/vị trí/nhiều instance/công tắc số dư) | Mảng; mỗi mục cùng cấu trúc `pets[]` |
| `animations` | **Pool hoạt ảnh**: idle / turn / drag / clicks / moves / categories / events (hoạt ảnh sự kiện như số dư) / sleep (bộ hoạt ảnh ngủ, không bắt buộc) | Cùng cấu trúc `animations` |
| `animationWeights` | Trọng số phát chuỗi hoạt ảnh (idle / turn / move) | Cùng cấu trúc `animationWeights` |
| `eventsRefreshSec` | Chu kỳ làm mới sự kiện (giây): `whisper` lẩm bẩm, `sleepTalk` nói mơ, `balance` số dư | Cùng cấu trúc `eventsRefreshSec` |
| `sleepStartTexts` | **Lời thoại lúc đi ngủ** (chọn ngẫu nhiên một mục; hiện bong bóng khi phát hoạt ảnh “bắt đầu”) | Mảng chuỗi không rỗng |
| `sleepEndTexts` | **Lời thoại lúc thức dậy** (chọn ngẫu nhiên một mục; hiện bong bóng khi phát hoạt ảnh “thức dậy”) | Mảng chuỗi không rỗng |
| `sleepRefuseTexts` | **Lời từ chối khi bị làm phiền lúc ngủ** (chọn ngẫu nhiên một mục) | Mảng chuỗi không rỗng |
| `notificationsEnabled` | Công tắc tổng cho thông báo hệ thống (boolean) | Cùng `notificationsEnabled` |
| `notifyWhenFocused` | **Vẫn nhắc khi cửa sổ đang được chú ý**: true = vẫn hiện thông báo và đọc trạng thái công việc thành tiếng khi trang đang hiển thị và có tiêu điểm (boolean, mặc định false) | Boolean, có thể dùng mặc định |
| `chatAnimationEnabled` | **Liên kết hội thoại với hành động**: khi bật, gửi danh sách hành động trong `animations.categories` cho mô hình để mô hình chọn hành động phù hợp ngữ cảnh và biểu diễn ngay (boolean, mặc định true) | Boolean, có thể dùng mặc định |
| `environmentCity` | **Ghi đè thành phố dùng tra thời tiết**: để trống = tự định vị bằng IP thoát mạng; nhập tên thành phố (ví dụ “扬州”) để tra thời tiết ở đó thay vì định vị bằng IP. Chỉ đọc mục `main`; nhập tên thành phố, không nhập tỉnh | Chuỗi, mặc định `""` |

> Ngữ nghĩa ghi đè: lớp người dùng cung cấp trường nào thì **thay thế toàn bộ** trường đó (ví dụ, nếu viết `animations` thì dùng toàn bộ pool hoạt ảnh của bạn để thay mặc định); trường không ghi sẽ dùng mặc định trong gói. Kiểm tra được thực hiện khi plugin tải — lỗi định dạng sẽ được báo rõ trong console DSH, không âm thầm chạy với cấu hình thiếu.

## Cách 4: Thú cưng bổ sung (pet pack) — thêm “loại” mới

Cách 1–3 chỉ điều chỉnh **instance của thú cưng mặc định** (số lượng/kích thước/vị trí); pool hoạt ảnh luôn là một bộ dùng chung toàn cục. Để thêm **một loại thú cưng hoàn toàn mới** (pool hoạt ảnh riêng + tài nguyên riêng), tạo thư mục `pet/` dưới thư mục gốc dữ liệu người dùng:

```
$DSH_HOME/dsh-pet/
├─ main-config.jsonc           ← Cấu hình thú cưng chính (đã có, không thay đổi)
├─ main-animation/webm/*.webm  ← Tài nguyên thú cưng chính (đã có, chỉ thuộc main)
└── pet/
   ├── pig-config.json         ← Cấu hình thú cưng bổ sung pig (phần tên trước hậu tố = tên loại, ID instance tùy ý)
   └── pig-animation/*.webm    ← Tài nguyên hoạt ảnh riêng của pig (xếp trực tiếp như main-animation)
```

Mỗi thú cưng bổ sung gồm một tệp `-config.json` và một thư mục `-animation/` ghép theo cùng tiền tố; hệ thống tự phát hiện khi quét `pet/`, đồng thời áp dụng cho trình duyệt và desktop. Mỗi tệp `-config.json` định nghĩa **một “loại”** (pool hoạt ảnh + thư mục tài nguyên), mảng `pets` có thể chứa **bất kỳ số lượng instance nào** của loại đó (dùng chung pool hoạt ảnh và tài nguyên):

```jsonc
// pet/pig-config.json — cấu hình đầy đủ, cùng cấu trúc với main-config.jsonc
{
  "notificationsEnabled": true,
  "notifyWhenFocused": false,
  "pets": [
    {
      "id": "pig1", // ID instance (có thể có nhiều instance; không cần trùng tiền tố tên tệp)
      "size": 420,
      "balanceEnabled": true,
      "display": "both", // web / desktop / both / none
      "position": { "corner": "top-right", "marginX": 24, "marginY": 100 },
    },
    {
      "id": "pig2",
      "size": 360,
      "balanceEnabled": false,
      "display": "web",
      "position": { "corner": "top-left", "marginX": 24, "marginY": 100 },
    },
  ],
  "animations": {
    "idle": ["待机"],
    "turn": [],
    "drag": [],
    "clicks": ["打滚"],
    "moves": {
      "default": {
        "minDist": 80,
        "maxDist": 360,
        "margin": 20,
        "leadSec": 2,
        "tailSec": 2,
      },
      "actions": [],
    },
    "categories": [],
    "events": {
      "balance": [
        "余额-钱袋满溢",
        "余额-金袋叮当",
        "余额-钱袋如常",
        "余额-数金皱眉",
        "余额-袋空如洗",
        "余额-分文不剩",
      ],
    },
  },
  "animationWeights": { "idle": 80, "turn": 0, "move": 0 },
  "eventsRefreshSec": { "balance": 1800 },
}
```

Quy tắc (tách biệt **nghiêm ngặt** với thú cưng chính, tuyệt đối không dùng chung):

- **Chỉ tìm tài nguyên của chính loại đó**: tên thư mục tài nguyên = tiền tố tên tệp (`pet/pig-config.json` → `pet/pig-animation/`), mọi instance của loại dùng chung thư mục đó; URL hoạt ảnh `/thumb/<前缀>/<名>.webm`, không tìm thấy thì trả 404 — tuyệt đối không rơi về `main-animation` hoặc tài nguyên trong gói
- **Pool hoạt ảnh không dùng mặc định toàn cục**: phải khai báo đầy đủ `animations` / `animationWeights` (thiếu là lỗi cấu hình)
- **`animations.sleep` là mục không bắt buộc** (hành động ngủ): không khai báo = loại đó không có chức năng ngủ, menu chuột phải không hiện “Ngủ”, các hoạt ảnh khác không bị ảnh hưởng. Nếu khai báo thì đây là mảng các “bộ”, mỗi bộ `{ start, loop, end }` có ba mảng ứng viên; lúc đi ngủ chọn ngẫu nhiên một bộ hoàn chỉnh, cả ba giai đoạn lấy từ bộ đó, rồi khi vào từng giai đoạn mới chọn ngẫu nhiên một mục trong giai đoạn (tránh mục vừa phát xong). Xem chú thích `sleep` trong `assets/config.jsonc` của gói để biết cấu trúc
- **Văn bản khi ngủ được khai báo riêng cho từng loại**: `sleepStartTexts` / `sleepEndTexts` / `sleepRefuseTexts`; nếu không khai báo thì dùng bộ tích hợp. `eventsRefreshSec.sleepTalk` là chu kỳ nói mơ (giây, mặc định 60)
- Ràng buộc cấu trúc giống cấu hình chính: mọi trường của từng mục `pets` phải đầy đủ và hợp lệ; ID trong mảng phải duy nhất; `animations` / `animationWeights` được kiểm tra theo cùng quy tắc; `notificationsEnabled` / `eventsRefreshSec` là thuộc tính toàn cục, không thuộc tệp thú cưng (nếu khai báo sẽ bị bỏ qua, không khai báo cũng không báo lỗi)
- Cấu hình không hợp lệ / thiếu thư mục `-animation/` / ID instance trùng thú cưng chính → báo lỗi rõ khi tải và bỏ qua (không ảnh hưởng thú cưng khác)
- Trang cài đặt **liệt kê** thú cưng dạng tệp (nhóm theo loại): sau khi đổi tên/kích thước/vị trí/cách hiển thị/bốn công tắc/tính cách instance và lưu, cấu hình được ghi lại vào tệp riêng của loại đó — không trộn vào `main-config.jsonc`; pool hoạt ảnh và tính cách ở cấp cao nhất của tệp được giữ nguyên. Nút “+” tạo instance thuộc loại đó; mỗi loại phải giữ lại ít nhất một instance
- Hoạt ảnh theo bậc số dư dùng `events.balance` riêng của từng thú cưng