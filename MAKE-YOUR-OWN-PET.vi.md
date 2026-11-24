# Tự tạo thú cưng từ đầu (quy trình đầy đủ)

> Quay lại [README](README.vi.md) ｜ Quy trình đầy đủ: prompt AI → video phông xanh → hoạt ảnh trong suốt → plugin → phát hành. Có thể tái tạo toàn bộ quy trình khi thay nhân vật, hành động hoặc phong cách.

## ① Prompt → video nguồn

Dùng công cụ tạo video AI (như Kling, Runway, Doubao, v.v.; tài nguyên của dự án này được tạo bằng Doubao), theo công thức trong `prompts/桌面宠物 10 秒动作提示词.vi.md`, tạo một video phông xanh dài 10 giây cho mỗi hành động:

- Tỷ lệ video 16:9, nền phông xanh thuần (#00FF00)
- Vị trí/kích thước nhân vật cố định (đỉnh đầu ở khoảng 20% chiều cao, chân ở khoảng 85% chiều cao)
- Hành động luôn nằm trong khung hình; khung hình đầu và cuối là tư thế đứng chính diện chuẩn
- Phân chia từng hoạt ảnh theo giây (các giai đoạn hành động từ 0-10s)

Lưu mỗi tệp mp4 theo một hành động, rồi đặt vào `video/`.

> **Lấy video nguồn**: Để kiểm soát dung lượng kho mã, video nguồn trong `video/` không được đưa vào git. Releases cung cấp **gói nén** để tải trực tiếp bằng trình duyệt:
>
> - `assets-videos.zip` —— gói nén chứa toàn bộ video nguồn (mp4 tên tiếng Trung; giải nén vào `video/`)
>
> Giải nén bằng `Expand-Archive assets-videos.zip` (Windows) hoặc `unzip assets-videos.zip`, rồi đưa các tệp mp4 trở lại `video/` để chạy chuỗi xử lý tài nguyên.

## ①.5 🌙 Hành động nối tiếp nhiều đoạn (ngủ)

Ngủ không phải một hành động đơn lẻ mà gồm **ba đoạn nối tiếp**: bắt đầu ngủ → lặp (vô hạn) → thức dậy; được điều khiển bằng mục “Ngủ” khi nhấp chuột phải và thao tác nhấp để đánh thức. Prompt được lưu riêng tại [`prompts/睡觉动作提示词.vi.md`](prompts/睡觉动作提示词.vi.md); phải tuân thủ các điểm khác với prompt hành động 10 giây:

- Đoạn bắt đầu ngủ và đoạn lặp **không được kết thúc ở tư thế đứng**; chỉ đoạn thức dậy mới quay về tư thế đứng. Hai khung hình đầu và cuối của đoạn lặp phải giống hệt nhau, nếu không vòng lặp sẽ bị giật.
- Cả ba đoạn dùng chung một đường mặt đất và cùng kích thước nhân vật; sau khi tạo, hãy so sánh “khung hình cuối đoạn bắt đầu ngủ = khung hình đầu đoạn lặp = khung hình đầu đoạn thức dậy” và “khung hình cuối đoạn thức dậy = khung hình đầu đoạn bắt đầu ngủ” trước khi đưa vào chuỗi xử lý tài nguyên.
- Các bước còn lại của chuỗi xử lý tài nguyên không đổi (đầu ra vẫn vào `dsh-pet/assets/webm/`). Cuối cùng, ghi ba tên vào cấu hình `animations.sleep`: một bộ gồm các mảng ứng viên `start` / `loop` / `end`, mỗi mảng một ứng viên; có thể cấu hình nhiều bộ (ngủ ngồi, ngủ nằm sấp, v.v.). Cấu trúc được mô tả trong chú thích `sleep` của `dsh-pet/assets/config.jsonc`.

## ② Video nguồn → hoạt ảnh trong suốt (chuỗi xử lý tài nguyên)

step02 (video trong suốt) có **hai quy trình, chọn một tùy nhu cầu** (mặc định tự động, ai cũng có thể tái tạo; nếu kết quả chưa tốt thì dùng PR để ghi đè bằng thao tác tách nền thủ công):

```sh
cd scripts
# Quy trình A (mặc định): tự động tách nền xanh (sắc độ HSV, không cần thao tác thủ công)
python watermark_step01.py   # Tô vùng mặt nạ watermark → step01/
python chroma_step02.py      # Tách phông xanh thành nền trong suốt → step02/

# Quy trình B (tùy chọn): dùng kết quả tách nền thủ công trong PR để ghi đè (cho hành động có vật thể bên thứ ba hoặc kết quả tự động chưa tốt)
#   1. Tách nền thủ công trong PR, xuất .mov trong suốt có alpha (ví dụ ProRes 4444 with Alpha)
#   2. Đặt vào pr/, tên tệp trùng với tên hành động (ví dụ 吃白饭.mov)
python pr_import_step02.py   # pr/*.mov → step02/ (webm trong suốt, ghi đè kết quả tách nền tự động của hành động đó)

# Các bước tiếp theo dùng chung cho cả hai quy trình:
python normalize_step03.py   # Chuẩn hóa về 2160×1215, căn giữa tư thế đứng → step03/
python encode_thumbs.py      # Chuyển mã biến thể phát 640×360 → step04/
```

**Phụ thuộc**: Python 3 + ffmpeg + numpy + scipy (các script của chuỗi xử lý tài nguyên tự dùng ffmpeg trong `.tools/` của workspace).

> **Dự án này sử dụng hoàn toàn quy trình B** (mọi hành động đều được tách nền thủ công bằng PR): với hành động “có vật thể bên thứ ba/viền trong suốt phức tạp”, tách nền HSV tự động dễ để sót viền hoặc xóa nhầm; mặt nạ thủ công trong PR cho kết quả chính xác hơn. Cả hai quy trình đều tạo ra `step02/` ở cùng cấp và các bước sau hoàn toàn giống nhau; `chroma_step02.py` được giữ lại làm phương án tự động dự phòng để mọi hành động vẫn có thể được tạo tự động chỉ với một lệnh.

## ②.5 🍎 Tài nguyên tương thích Safari/HEVC (mov dành riêng cho macOS)

Plugin mặc định chỉ phát hành `.webm` (VP9-alpha). Safari/WKWebView không nhận alpha trong webm (hiển thị nền đen); trên macOS, cần tải tài nguyên **HEVC-with-Alpha `.mov`** đã được chuyển mã chính thức từ GitHub Release để sử dụng. Thực hiện hai bước:

1. **Tải xuống**: <https://github.com/PC2005-cloud/dsh-pet/releases/tag/assets-mov> (tag cố định và luôn được cập nhật; tên tệp sau khi giải nén khớp từng tệp webm)
2. **Đặt vào**: đặt các tệp `.mov` trong `$DSH_HOME/dsh-pet/main-animation/mov/` (với thú cưng trong pet pack, dùng `pet/<tên-loại>-animation/mov/`)

## ③ Hoạt ảnh → plugin

```sh
# Đồng bộ biến thể phát trong step04 vào gói plugin (webm có thể cp trực tiếp)
cp step04/*.webm dsh-pet/assets/webm/   # Định dạng phát (VP9-alpha)

# Cài plugin cục bộ (--profile điền profile đang dùng: dsh web → web, ứng dụng desktop → desktop;
# xem mục “Cài từ mã nguồn” trong INSTALL.vi.md;
# file: trỏ tới thư mục plugin dsh-pet/dsh-pet)
dsh plugin --profile web add file:D:/path/to/dsh-pet/dsh-pet
```

> Sản phẩm trung gian (step01-04) do script tạo và không đưa vào kho mã; video nguồn trong `video/` và script là thành quả được lưu trữ và duy trì trong kho mã.

## 🎯 Phát hành (chỉ định dạng webm)

Plugin chỉ phát hành một gói npm và một định dạng tài nguyên (webm); `files` được thu gọn thành danh sách cố định (lib / src / assets/webm / runtime/electron-helper / assets/fonts / assets/pic / assets/config.jsonc / scripts/ensure-electron.mjs / cordis.patch.yml, xem `prepare.js`; dùng chung cho trình duyệt và desktop, giảm dung lượng gói):

```sh
cd dsh-pet
npm publish --tag latest   # prepack tự build (đầy đủ sản phẩm + thu gọn files), không cần build thủ công
```

- Phía client xác định phần mở rộng phát theo môi trường chạy: macOS WebKit (Safari/WKWebView) tự động dùng `.mov`, các môi trường khác dùng `.webm`
- Cần bản Safari/HEVC (macOS): tài nguyên mov được phát hành chính thức trong GitHub Release `assets-mov`; tải xuống và giải nén vào `main-animation/mov/`
