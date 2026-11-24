# dsh-cordis-probe

Plugin kiểm thử ở cấp kho mã: mô phỏng bên tiêu thụ của bên thứ ba.

| Nửa | Vai trò |
|---|---|
| Client | Bảng ở góc dưới bên phải trang, liệt kê và gọi các service của dsh-pet (`ctx.get`, không gửi request); phần đầu bảng có thêm hai nút bật/tắt **giọng nói / nhận dạng** |
| Host | Đăng ký năm nhà cung cấp dịch vụ mock để chúng xuất hiện trong bộ chọn mô hình, dùng xác minh bong bóng số dư (bao gồm hai kiểu phân trang tùy chỉnh); ngoài ra cung cấp các route bật/tắt giọng nói, nhận dạng và bộ nhớ |

## Cài đặt

Cài đặt DSH → “Thêm plugin” → nhập đường dẫn tuyệt đối của thư mục này, rồi khởi động lại `dsh web`.

## Tệp

| Tệp | Chức năng |
|---|---|
| `lib/client.js` | Bảng danh mục service + các nút bật/tắt giọng nói / nhận dạng |
| `lib/index.js` | Nửa Host: đăng ký route mô hình, nhà cung cấp dịch vụ số dư và hai route bật/tắt |
| `lib/mock-balance.js` | Dữ liệu của năm nhà cung cấp dịch vụ mock: 3 dạng tích hợp sẵn + 2 dạng nhiều trang tùy chỉnh (4 trang / 3 trang) |
| `lib/mock-adapter.js` | Đưa các nhà cung cấp dịch vụ mock vào bộ chọn mô hình |
| `lib/mock-voice.js` | Triển khai giọng nói mock: không phụ thuộc văn bản, luôn trả về một âm báo có sẵn (660Hz trong 0.3 giây) |
| `lib/mock-speech.js` | Triển khai nhận dạng mock: không xem âm thanh, luôn trả về `mock 识别：收到 N 字节` |
| `lib/mock-memory.js` | Triển khai bộ nhớ mock: lưu 5 lượt gần nhất cho mỗi thú cưng; khi được hỏi về “ghi nhớ/trước đây/lần trước”, chèn lượt trước làm bằng chứng |
| `lib/toggle-route.js` | Route dùng chung cho ba nút bật/tắt: `GET` đọc trạng thái, `POST` chuyển trạng thái |

## Nút bật/tắt giọng nói

Nút “Giọng nói: tắt/bật” ở đầu bảng điều khiển một triển khai giọng nói mock, **mặc định tắt**:

- Bật → gọi `petApi7340.voice.register` để đăng ký `mock-tone`; từ đó `POST /voice/speak` chuyển sang dùng nó và trả về một âm báo;
- Tắt → gọi disposer được trả về khi đăng ký để hủy đăng ký; tổng hợp giọng nói quay lại triển khai tích hợp sẵn;
- Khi gỡ plugin, đăng ký sẽ tự động bị hủy; giọng nói mock không bị để lại trong Host.

## Nút bật/tắt nhận dạng

Nút “Nhận dạng: tắt/bật” ở đầu bảng điều khiển một triển khai nhận dạng mock, **mặc định tắt**:

- Bật → gọi `petApi7340.speech.register` để đăng ký `mock-asr`; từ đó `POST /voice/hear` chuyển sang dùng nó và trả về văn bản giả kèm số byte;
- Tắt → gọi disposer được trả về khi đăng ký để hủy đăng ký; nhận dạng quay lại khả năng tích hợp sẵn của Host (`speechToText` của DSH);
- Khi gỡ plugin, đăng ký sẽ tự động bị hủy; nhận dạng mock không bị để lại trong Host.

Văn bản trả về có số byte để xác minh âm thanh thực sự đi qua base64 và HTTP: gửi một tệp WAV 121 KB, nếu nhận lại “收到 121388 字节” thì toàn bộ luồng đã đến Host.

Nút và phần đăng ký nằm ở hai nửa khác nhau (trang / Host), giữa chúng là HTTP, nên Host mở thêm hai route tối giản — chỉ phục vụ ví dụ này, không thuộc bề mặt API của dsh-pet.

## Nút bật/tắt bộ nhớ

`/cordis-probe-memory` điều khiển một triển khai bộ nhớ mock, **mặc định tắt** (có nút ở đầu bảng điều khiển, hoặc có thể gọi trực tiếp route).

**Cách chứng minh phần mở rộng thực sự có hiệu lực** (lịch sử gốc không làm được hai việc này):

1. Bật bộ nhớ → trò chuyện một câu → `captured` trong `GET /cordis-probe-memory` tăng 1: `capture` đã nhận lượt này;
2. Gửi thêm một câu có chứa “记得/上次” → câu trả lời phải bắt đầu bằng `[MOCK-RECALL-OK]`: `recall` đã viết lại nội dung lượt này. Đây là dấu mà mock yêu cầu mô hình lặp lại; lịch sử gốc không tạo ra dấu đó.

Tắt → disposer hủy đăng ký, `recall`/`capture` không còn chạy; nếu hỏi lại cùng câu, dấu sẽ biến mất và `captured` ngừng tăng. Plugin tự hủy đăng ký khi được gỡ.

```bash
curl -X POST http://127.0.0.1:<port>/cordis-probe-memory   # 打开 / 关闭
curl http://127.0.0.1:<port>/cordis-probe-memory           # {"ok":true,"on":…,"captured":N}
```

## Tổng quan mock số dư

| ID nhà cung cấp | Dạng | Nội dung bong bóng |
|---|---|---|
| `mock-windows` | windows | Mức sử dụng của ba cửa sổ (5h / tuần / tháng), cửa sổ cấp bách nhất là tháng |
| `mock-money` | money | Số dư hai loại tiền + trang trí mức cao/thấp |
| `mock-points` | points | 800 / 1000 điểm |
| `mock-custom-kinds` | custom (4 trang) | Dùng cây nút mô phỏng ba trang “cửa sổ / số tiền / điểm” + một trang tổng hợp cả ba |
| `mock-custom-fancy` | custom (3 trang) | Dung lượng còn lại của nhiều mô hình, cơ cấu ví (có nhãn PRO), lưới thống kê mức sử dụng |

Có thể **nhấp bong bóng của nhà cung cấp tùy chỉnh để chuyển vòng giữa các trang** (trang cuối quay lại trang đầu); trường `percent` điều khiển hoạt ảnh theo cấp độ.
