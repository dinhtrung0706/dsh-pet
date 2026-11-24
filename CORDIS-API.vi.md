# Tổng quan Cordis API công khai của dsh-pet

dsh-pet cung cấp hai dịch vụ Cordis: `petApi7340` trong trang (nửa phía trình duyệt) và dịch vụ cùng tên trong tiến trình host (nửa phía host). Chúng cùng tên nhưng thuộc các container khác nhau, không nhìn thấy lẫn nhau — trong trang, `ctx.get()` chỉ lấy được nhóm phía client; trong plugin host, chỉ lấy được nhóm phía host. Tài liệu này chỉ **xem trước chức năng** (thành viên + một câu); hợp đồng đầy đủ — tham số, trường trả về, trường hợp biên và ví dụ — xem [`CORDIS.vi.md`](CORDIS.vi.md).

- **Cách lấy dịch vụ**: `ctx.get('petApi7340')`; không lấy được nhóm tương ứng nghĩa là bạn đang ở nửa bên kia, hoặc dsh-pet chưa bật / phiên bản quá cũ
- **Chỉ đọc**: cả hai dịch vụ đều không cung cấp kênh điều khiển; để thú cưng nói, hành động hoặc đổi cấu hình vẫn dùng HTTP (xem [`API.vi.md`](API.vi.md))
- **Không qua mạng**: gọi dịch vụ là gọi hàm trong tiến trình, không chiếm kết nối và không đi qua cổng

---

## I. Nửa client (bên trong trang DSH web, chỉ có hiệu lực trong instance trang đó)

| Thành viên | Chức năng |
| --- | --- |
| `pose(petId)` | Đọc vị trí và hướng hiện tại của một thú cưng (viewport chuẩn hóa 0–1); nếu trang này không có nó thì trả `null` |
| `progress(petId)` | Đọc tiến độ phát hiện tại của một thú cưng: tên hoạt ảnh, thời gian hiện tại, tổng thời lượng, trạng thái tạm dừng / đệm |
| `getState()` | Đọc ảnh chụp đầy đủ `/state` gần nhất trên trang này (cùng cấu trúc với `GET /state`); trước nhịp đầu tiên thì trả `null` |
| `menuEvents(owner)` | Lấy kết quả nhấp mục menu bên thứ ba trên trang này (cùng cấu trúc với `GET /menu/events`, **đọc là tiêu thụ**) |

## II. Nửa host (bên trong tiến trình plugin host)

| Thành viên | Chức năng |
| --- | --- |
| `balance.register(def)` | Đăng ký nhà cung cấp số dư tùy chỉnh (`{ id, fetch }`): `shape` hỗ trợ `windows` / `money` / `points` / `custom`; loại cuối tự vẽ cây nút. Host thống nhất lập lịch và kết xuất bong bóng |
| `balance.list()` | Liệt kê ID nhà cung cấp số dư tích hợp và đã đăng ký để xác nhận đăng ký có hiệu lực |
| `voice.register(def)` | Đăng ký triển khai tổng hợp giọng nói (`{ id, name, voices, format?, timeoutMs?, synthesize }`): sau khi đăng ký sẽ xuất hiện trong `GET /voice/voices`; có thể cùng tồn tại nhiều triển khai, `id` phải duy nhất, đăng ký trùng sẽ báo lỗi thay vì ghi đè; `synthesize` nhận `{ text, voice, rate, signal }` và trả byte âm thanh |
| `voice.list()` | Liệt kê mọi triển khai và giọng đọc (`{ providers: [{ id, name, voices }] }`), cùng nguồn dữ liệu với `GET /voice/voices` |
| `speech.register(def)` | Đăng ký triển khai nhận dạng giọng nói (`{ id, name, timeoutMs?, transcribe }`): sau khi đăng ký sẽ xuất hiện trong `GET /voice/hear-providers`; có thể cùng tồn tại nhiều triển khai, `id` phải duy nhất, đăng ký trùng sẽ báo lỗi thay vì ghi đè; `transcribe` nhận `{ audio, signal }` và trả văn bản |
| `speech.list()` | Liệt kê mọi triển khai nhận dạng (`{ providers: [{ id, name }] }`), cùng nguồn dữ liệu với `GET /voice/hear-providers` |
| `memory.register(def)` | Đăng ký triển khai bộ nhớ dài hạn bên thứ ba (`{ id, name, timeoutMs?, recall?, capture? }`): `recall` trả toàn bộ nội dung yêu cầu trước khi tạo phản hồi (`undefined` = không can thiệp lượt này), `capture` nhận lượt này sau khi lưu; nhiều triển khai có thể cùng tồn tại, cấu hình ghi `id` nào thì dùng triển khai đó |
| `memory.list()` | Liệt kê mọi triển khai (`{ providers: [{ id, name }] }`); `native` tích hợp luôn đứng đầu |

---

## Liên quan

- [`CORDIS.vi.md`](CORDIS.vi.md) — hợp đồng đầy đủ: tham số, trường trả về, trường hợp biên và ví dụ
- [`API.vi.md`](API.vi.md) / [`openapi.vi.yaml`](openapi.vi.yaml) — phía HTTP của cùng plugin
- [`tools/cordis-probe`](tools/cordis-probe/README.vi.md) — ví dụ plugin bên thứ ba trong cùng trang: tự liệt kê các dịch vụ và thành viên của dsh-pet, có thể gọi trực tiếp
