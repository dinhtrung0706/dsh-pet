# Cài đặt (dsh-pet)

> Quay lại [README](README.vi.md)

Cách cài đặt tùy thuộc vào DSH bạn đang dùng: **ứng dụng desktop** dùng mục “Quản lý plugin” trong ứng dụng; **`dsh web`** dùng dòng lệnh; nếu cài từ mã nguồn thì clone rồi build. Cả ba cách đều cài plugin vào `node_modules` của profile, hiệu quả như nhau; chỉ khác điểm bắt đầu.

Sau khi cài, cần **khởi động lại DSH** (người dùng `dsh web` thì khởi động lại `dsh web`) mới có hiệu lực — tiến trình đang chạy vẫn giữ plugin cũ trong bộ nhớ. Thú cưng sẽ xuất hiện ở góc trên bên phải giao diện (góc mặc định, có thể đổi trong trang cài đặt).

## Yêu cầu trước khi cài

Cài đặt bằng dòng lệnh cần Node.js và trình khởi chạy DSH; ứng dụng desktop đã tích hợp CLI và runtime, có thể bỏ qua mục này.

```sh
# ① Yêu cầu trước khi cài: xác nhận Node.js đã được cài
node -v

# ② Cài trình khởi chạy DSH và pnpm (đã cài thì bỏ qua; sau khi cài hãy mở lại terminal)
npm install -g @deepseek-ai/dsh pnpm
dsh --version   # xác minh lệnh dsh dùng được
```

## Cách 1: “Quản lý plugin” trong ứng dụng (ứng dụng desktop)

Mở trực tiếp trang “Quản lý plugin” trong ứng dụng, nhập `dsh-pet` vào ô cài đặt; không cần mở terminal. Nếu cần thao tác với plugin trong terminal, hãy dùng CLI đi kèm ứng dụng desktop.

## Cách 2: Dòng lệnh (`dsh web` và ứng dụng desktop)

Dùng `--profile <profile>` để chỉ định profile cần cài; nhập giá trị tương ứng với giao diện đang dùng:

| Giao diện đang dùng | Giá trị `--profile` |
| --- | --- |
| `dsh web` (trình duyệt) | `web` |
| Ứng dụng desktop (bản Electron) | `desktop` |

```sh
# dsh web
dsh plugin --profile web add dsh-pet

# Ứng dụng desktop (bản Electron)
dsh plugin --profile desktop add dsh-pet
```

> **Tương thích**: plugin hiện được phát triển và kiểm tra trên dsh **`0.2.2-rc.1`** (dùng `dsh --version` để xem phiên bản của bạn). Khuyến nghị dùng cùng phiên bản; nếu gặp vấn đề ở phiên bản khác, hãy gửi phản hồi.

## Cách 3: Cài từ mã nguồn (sau khi clone repo này)

Sản phẩm build trong `lib/` không được đưa vào repo; sau khi clone cần build trước khi cài:

```sh
# ① Clone repo này và vào thư mục plugin
git clone https://github.com/PC2005-cloud/dsh-pet.git
cd dsh-pet/dsh-pet

# ② Cài dependencies
npm install

# ③ Build (lib đầy đủ: tsdown → lib + lõi dùng chung desktop + khai báo kiểu)
npm run build       # phải chạy thủ công một lần (sau khi clone, npm install không tự build nữa)

# ④ Cài vào DSH (file: trỏ tới **thư mục plugin** — cấp thư mục vừa cd vào, dùng lib đã build)
#    --profile nhập profile đang dùng: dsh web → web; ứng dụng desktop → desktop
dsh plugin --profile web add file:D:/path/to/dsh-pet/dsh-pet
```

> Ghi chú: `npm run build` (tức `scripts/prepare.js`) mới tạo ra `lib` **có thể cài đầy đủ** — ngoài build bằng tsdown, còn build lõi dùng chung cho desktop (`shared-core.js`), tạo khai báo kiểu và thu gọn danh sách `files` để phát hành; chỉ chạy `tsdown` sẽ thiếu runtime desktop và kiểu. Khi phát hành và đóng gói (`npm publish` / `npm pack`), `prepack` tự gọi lệnh này; sau khi clone repo cần chạy thủ công một lần.

## Chế độ độc lập (không cần DSH)

Có thể dùng mà không cài DSH: nửa host chạy trên `ctx` giả, một dịch vụ cục bộ tiếp nhận các tuyến (**bảng tuyến vẫn là bảng của plugin**) và thú cưng hiển thị trong cửa sổ độc lập. Có hai cách sử dụng — tải gói portable từ Release hoặc tự build từ mã nguồn.

### Chạy trực tiếp (bản portable trong Release)

1. Mở trang [Releases](https://github.com/PC2005-cloud/dsh-pet/releases), chọn phiên bản và tải `dsh-pet-win-x64.zip` (tên cố định);
2. Giải nén vào thư mục tùy ý, ví dụ `D:\dsh-pet`;
3. Nhấp đúp `dsh-pet.exe` trong thư mục đó.

Không cần Node.js hoặc DSH; runtime Electron đã được đóng gói sẵn. Đóng cửa sổ là thoát.

> Release chỉ cung cấp **Windows x64**; dùng dạng npm bên dưới trên macOS / Linux.

### Cài đặt toàn cục bằng npm (dạng Node)

Cần Node.js; dùng được trên nhiều nền tảng:

```sh
npm install -g dsh-pet        # bắt buộc cài bằng npm; dsh plugin add cài vào profile nên bin không nằm trên PATH
dsh-pet-standalone            # http://127.0.0.1:3080/dsh-pet-7340/ (nếu cổng bận thì chuyển sang cổng tiếp theo)
dsh-pet-standalone --check    # chỉ kiểm tra, không khởi động
dsh-pet-standalone --port 3100
```

Nhấn `Ctrl+C` hoặc gọi `POST /shutdown` để thoát.

### Build và khởi chạy từ mã nguồn

```sh
npm install
npm run build          # lib đầy đủ: tsdown + lõi dùng chung desktop + khai báo kiểu
npm run standalone     # khởi chạy dạng Node, tương đương dsh-pet-standalone
```

### Đóng gói thành exe

```sh
npm run ensure:electron   # lần đầu: tìm thư mục Electron đã giải nén trên máy (nếu không có thì tải vào ~/.dsh/electron)
npm run dist              # đóng gói bằng electron-builder
```

Sản phẩm nằm trong `dist-app/win-unpacked/`; nhấp đúp `dsh-pet.exe` trong đó để chạy. **Chỉ tạo dạng thư mục đã giải nén** (bản portable), không tạo bộ cài nsis — để phân phối, nén toàn bộ thư mục thành zip.

- Nếu máy không tìm thấy thư mục Electron đã giải nén, `dist` sẽ thất bại ngay và yêu cầu chạy `ensure:electron` trước (có thể đặt `DSH_PET_ELECTRON_DIST` trỏ tới thư mục có sẵn); trong CI, đặt `DSH_PET_ALLOW_ELECTRON_DOWNLOAD=1` để tự tải xuống.
- Phát hành được kích hoạt bởi tag `v*` qua `.github/workflows/release-app.yml`: sau khi build, gắn tệp tên cố định `dsh-pet-win-x64.zip` vào Release của tag đó (không tạo Release và không sửa nhật ký thay đổi).

### Giới hạn tính năng

- **Dùng được**: chuỗi hoạt ảnh, nhấp/kéo/ném, menu chuột phải, nhiều instance, hoạt ảnh và meme tùy chỉnh, pet pack.
- **Không dùng được**: số dư, lẩm bẩm, hội thoại, thông báo hệ thống — không có thông tin xác thực và kết nối mô hình của DSH; API trả lỗi có cấu trúc kèm `reason` (xem [API.vi.md](API.vi.md)).
- **Cấu hình**: dùng cùng cấu hình với DSH (`$DSH_HOME/dsh-pet/main-config.jsonc` → mặc định trong gói).
- Chỉ hiển thị instance có `display` gồm `desktop` / `both`; cổng mặc định là 3080 (nếu bận thì chuyển sang cổng tiếp theo).
- **Có thể chạy đồng thời với DSH**, nhưng dùng chung `%APPDATA%\dsh-pet-electron-helper`, nên có thể ghi đè bộ nhớ đệm của nhau (chỉ cảnh báo).

## Sau khi cài đặt, bạn sẽ thấy gì

Cấu hình mặc định là `display: "both"` (hiển thị trên trình duyệt và desktop), nên sau khi khởi động lại DSH, thú cưng lần lượt xuất hiện ở cả hai nơi; không cần bật thủ công:

1. **Thú cưng xuất hiện trên trình duyệt trước.** Nó nằm ở góc trên bên phải giao diện (góc mặc định, có thể đổi trên trang cài đặt); lúc này desktop vẫn chưa có gì.
2. **Host tự bổ sung runtime desktop.** Nếu máy chưa có Electron, plugin tự tải xuống một bản (lưu tại `~/.dsh/electron`, mỗi phiên bản chỉ tải một lần; mặc định dùng mirror npmmirror). Tiến độ được ghi trực tiếp trên console DSH, ví dụ:

   ```
   [dsh-pet] Electron not found, downloading to <用户目录>/.dsh/electron/electron.exe ...
   [dsh-pet] Electron not found, downloading v43.3.0 (win32-x64) ...
   [dsh-pet] downloading 42.3MB / 104.1MB
   [dsh-pet] download complete (37.5s), extracting to <用户目录>/.dsh/electron ...
   ```

   Bước này chạy **ở nền**, thú cưng trên trình duyệt vẫn dùng bình thường. Thời gian phụ thuộc tốc độ mạng (vài chục giây đến vài phút); trong lúc đó không cần thao tác.

3. **Sau đó thú cưng xuất hiện trên desktop.** Khi giải nén xong, hệ thống tự khởi chạy desktop Helper; cùng một thú cưng xuất hiện trong cửa sổ trong suốt trên desktop — **lúc này có tổng cộng hai thú cưng trên màn hình**: một trên trình duyệt và một trên desktop; chúng dùng chung cấu hình và bộ hoạt ảnh.
4. **Nếu chỉ muốn giữ lại một thú cưng**, có thể dùng một trong hai cách; thay đổi có hiệu lực ngay:
   - **Trang cài đặt**: chọn thú cưng → hộp chọn “Nơi hiển thị” → chỉ trình duyệt / chỉ desktop / cả hai / không hiển thị;
   - **Menu chuột phải của thú cưng**: mục con “Nơi hiển thị” → chỉ trang web / chỉ desktop / cả hai / không nơi nào (không cần quay lại trang cài đặt).

> Nếu máy đã có `~/.dsh/electron` (đã tải trước đây hoặc từng chạy `npm run ensure:electron`) hoặc `DSH_PET_ELECTRON_PATH` trỏ tới tệp thực thi có sẵn, bước 2 được bỏ qua và desktop gần như xuất hiện ngay. Tải xuống thất bại **chỉ ảnh hưởng chế độ desktop**: console sẽ hiển thị thông báo, thú cưng trên trình duyệt không bị ảnh hưởng; nếu mạng bị hạn chế, có thể đặt `DSH_PET_ELECTRON_MIRROR` để đổi mirror hoặc `DSH_PET_ELECTRON_VERSION` để chọn phiên bản, rồi khởi động lại để thử.

## Tiếp theo

- Cấu hình kích thước, vị trí, nhiều instance, tham số vật lý, v.v.: xem [CONFIG.vi.md](CONFIG.vi.md)
- Muốn tự tạo một thú cưng: xem [MAKE-YOUR-OWN-PET.vi.md](MAKE-YOUR-OWN-PET.vi.md)
