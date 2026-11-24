# dsh-pet 🐾

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-pet"><img alt="phiên bản npm" src="https://img.shields.io/npm/v/dsh-pet?label=npm&color=blue"></a>
  <a href="https://www.npmjs.com/package/dsh-pet"><img alt="lượt tải hàng tháng trên npm" src="https://img.shields.io/npm/dm/dsh-pet?label=%E6%9C%88%E4%B8%8B%E8%BD%BD&color=brightgreen"></a>
  <a href="https://www.npmjs.com/package/dsh-pet"><img alt="tổng lượt tải" src="https://img.shields.io/npm/dt/dsh-pet?label=%E6%80%BB%E4%B8%8B%E8%BD%BD&color=success"></a>
  <a href="https://github.com/PC2005-cloud/dsh-pet/releases"><img alt="lượt tải bản phát hành" src="https://img.shields.io/github/downloads/PC2005-cloud/dsh-pet/total?label=Release%20%E4%B8%8B%E8%BD%BD&color=5C6BC0"></a>
  <a href="https://github.com/PC2005-cloud/dsh-pet"><img alt="số sao" src="https://img.shields.io/github/stars/PC2005-cloud/dsh-pet?style=social"></a>
  <a href="https://github.com/PC2005-cloud/dsh-pet/blob/main/LICENSE"><img alt="giấy phép" src="https://img.shields.io/github/license/PC2005-cloud/dsh-pet?color=orange"></a>
  <a href="https://awesome-dsh-plugin.com"><img alt="plugin DSH nổi bật" src="https://awesome-dsh-plugin.com/badge.svg"></a>
  <a href="https://github.com/PC2005-cloud/dsh-pet"><img alt="dung lượng kho mã" src="https://img.shields.io/github/repo-size/PC2005-cloud/dsh-pet"></a>
  <a href="https://github.com/PC2005-cloud/dsh-pet/issues"><img alt="số issue" src="https://img.shields.io/github/issues/PC2005-cloud/dsh-pet"></a>
  <img alt="nền tảng" src="https://img.shields.io/badge/platform-DeepSeek%20Harness%20Web-8A2BE2">
  <img alt="tài nguyên" src="https://img.shields.io/badge/assets-dynamic%20animations-ff69b4">
  <a href="https://atomgit.com/PC2005-cloud/dsh-pet"><img alt="AtomGit" src="https://img.shields.io/badge/AtomGit-%E9%95%9C%E5%83%8F%E5%90%8C%E6%AD%A5-4B8BBE"></a>
  <a href="https://pet.lxpavilion.top"><img alt="bảng điều khiển dữ liệu" src="https://img.shields.io/badge/%E6%95%B0%E6%8D%AE%E7%9C%8B%E6%9D%BF-pet.lxpavilion.top-4C8DF6"></a>
</p>

Thú cưng desktop sống trong [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): thở khi chờ, thực hiện ngẫu nhiên các động tác (ngủ gật, chơi rubik, ăn lẩu…), quay trái/phải, đi dạo khắp màn hình, nảy lên khi nhấp, bị kéo và ném rồi bật lại, phát hoạt ảnh theo yêu cầu từ menu chuột phải — hơn một trăm hoạt ảnh trong suốt chuyển tiếp liền mạch bất cứ lúc nào; còn có thể đổi hoạt ảnh trạng thái làm việc theo sự kiện phiên DSH, phát hoạt ảnh số dư theo từng mức kèm bong bóng phía trên đầu, lẩm bẩm và trò chuyện, cũng như hiện thông báo hệ thống khi cửa sổ mất tiêu điểm. Có thể mở nhiều thú cưng cùng lúc, đưa chúng ra khỏi trình duyệt lên **desktop** (cửa sổ nhỏ trong suốt luôn ở trên cùng), hoặc tự thêm **loại thú cưng hoàn toàn mới** (pet pack).

Đây không phải plugin thông thường mà là **dự án hoàn chỉnh gồm ba phần**:

```
① Prompt (công thức)     →  ② Chuỗi tạo tài nguyên (công cụ) → ③ Plugin (thành phẩm)
Công thức AI tạo hoạt ảnh  Video nguồn → hoạt ảnh trong suốt      Thú cưng chạy trong DSH
```

Bất kỳ ai clone kho mã này đều có thể **tạo thú cưng desktop của riêng mình từ đầu** — đổi nhân vật, động tác, phong cách; toàn bộ quy trình đều có thể tái tạo.

---

## Bắt đầu nhanh (cài plugin)

Chọn một trong hai cách cài đặt:

- **Giao diện đồ họa (trong ứng dụng desktop)**: mở trang “Quản lý plugin”, nhập `dsh-pet` vào ô cài đặt; không cần mở terminal.
- **Dòng lệnh**: `dsh plugin --profile <profile> add dsh-pet`; điền `<profile>` theo giao diện bạn dùng — với `dsh web`, điền `web`; với ứng dụng desktop (bản Electron), điền `desktop`.

**Không muốn cài DSH?** Release cung cấp gói portable Windows x64 `dsh-pet-win-x64.zip`; giải nén rồi nhấp đúp `dsh-pet.exe` để chạy — đây là chế độ độc lập, không phụ thuộc môi trường DSH.

Sau khi cài, cần **khởi động lại DSH** (người dùng `dsh web` thì khởi động lại `dsh web`) để thay đổi có hiệu lực — tiến trình đang chạy giữ plugin cũ trong bộ nhớ. Thú cưng mặc định xuất hiện ở góc trên bên phải giao diện.

Yêu cầu tiên quyết, cài từ mã nguồn, cách dùng và đóng gói chế độ độc lập, lần tải đầu tiên của Electron, cũng như những gì sẽ xuất hiện sau khi cài, xem **[INSTALL.vi.md](INSTALL.vi.md)**.

## Tính năng plugin

Chỉ làm chức năng thú cưng desktop, không can thiệp lõi DSH; các khả năng gồm:

- **Hơn 100 hoạt ảnh**: mọi biểu hiện như chờ, đi dạo, chơi, làm việc và trò chuyện đều do hoạt ảnh video điều khiển; các hoạt ảnh nối tiếp nhau theo trọng số và có thể thay bằng tài nguyên riêng.
- **Chạy nhiều thú cưng và nhiều loại**: nuôi nhiều thú cưng cùng lúc, mỗi con có kích thước và vị trí riêng; cũng có thể tạo loại thú cưng tùy chỉnh (pet pack), mỗi loại có bộ hoạt ảnh và tài nguyên riêng.
- **Ba chế độ chạy**: lớp phủ trình duyệt của DSH web, cửa sổ trong suốt luôn ở trên cùng của ứng dụng desktop DSH, và chế độ độc lập hoàn toàn không phụ thuộc DSH.
- **Tương tác và vật lý**: phản hồi khi nhấp, kéo rồi ném, bắn như ná cao su khi nhấp đúp, thú cưng va vào nhau; dùng chung vật lý và cảm giác co giãn nảy, có thể điều chỉnh tham số.
- **Điện thoại và màn hình cảm ứng**: kéo và ném trực tiếp bằng cảm ứng, dùng chung vật lý và cảm giác co giãn với chuột; trên trình duyệt điện thoại có thể nghiêng điện thoại để đổi hướng trọng lực, lắc để hất thú cưng đi, và rung khi va chạm — có thể tắt riêng từng mục trong “Hiệu ứng trên thiết bị di động” ở trang cài đặt. Cảm biến chỉ dùng được trên HTTPS hoặc localhost (iOS còn cần cấp quyền một lần); iOS và desktop không có API rung nên chức năng này tự động được bỏ qua.
- **Lẩm bẩm và trò chuyện**: tự động nói một câu theo chu kỳ hoặc trò chuyện bất cứ lúc nào; có lưu bộ nhớ, hỗ trợ hình ảnh và đọc thành tiếng.
- **Giọng nói (nói và nghe)**: đọc thành tiếng câu trả lời và lời lẩm bẩm thủ công; có thể cấu hình giọng, âm lượng và công tắc tổng. Nhấn giữ micro trong cửa sổ trò chuyện để nói; bản ghi âm sẽ được chuyển thành văn bản và điền thẳng vào ô nhập.
- **Hiển thị số dư**: tích hợp truy vấn số dư / hạn mức của các nhà cung cấp phổ biến; phát hoạt ảnh theo mức số dư còn lại và hiện bong bóng; cũng có thể đăng ký nhà cung cấp riêng.
- **Thời tiết và vị trí**: nhấp chuột phải vào “Tra cứu thời tiết” để xem thành phố hiện tại và thời tiết (định vị gần đúng theo IP đầu ra + Open-Meteo, không cần key hay cấu hình); bong bóng hiển thị nhiệt độ, nhiệt độ cảm nhận, độ ẩm, tốc độ gió và biểu tượng thời tiết tương ứng. Thông tin môi trường này cũng được gửi làm ngữ cảnh cho cuộc trò chuyện.
- **Liên kết trạng thái làm việc**: đổi hoạt ảnh theo trạng thái phiên DSH và luôn hiển thị một câu phía trên đầu.
- **Việc cần làm**: thêm việc bằng một câu, có thể kèm thời hạn; danh sách hiển thị phía trên đầu thú cưng. Càng gần hạn thì lời nhắc càng dày, do thú cưng nói ra.
- **Ngủ**: nhấp chuột phải vào “Ngủ” để cho thú cưng nằm ngủ; nhấp một lần hoặc chọn “Thức dậy” bằng chuột phải để đánh thức. Khi ngủ, thú cưng hoàn toàn yên lặng — hoạt ảnh ngẫu nhiên, lời lẩm bẩm, số dư, việc cần làm và trạng thái làm việc đều không làm phiền; thú cưng còn nói mơ theo chu kỳ. Có thể cấu hình nhiều tư thế ngủ (ngủ ngồi, nằm sấp…) bằng `animations.sleep`.
- **Thông báo hệ thống**: hiện thông báo hệ thống khi tác vụ hoàn tất hoặc cần xác nhận; nhấp vào thông báo để quay lại phiên tương ứng.
- **Menu chuột phải**: đổi hoạt ảnh, bắt đầu trò chuyện, quay về vị trí ban đầu, mở DSH / trang web, tải lại cấu hình.
- **Khác**: hiệu ứng âm thanh khi nhấp, khay hệ thống và vị trí hiển thị của từng thú cưng.

Mô tả chi tiết từng khả năng xem **[FEATURES.vi.md](FEATURES.vi.md)**; cấu hình (kích thước / vị trí / chạy nhiều thú cưng / vật lý / mô hình / tính cách / loại thú cưng) xem **[CONFIG.vi.md](CONFIG.vi.md)**.

## 🔌 Giao diện bên ngoài (dành cho plugin khác gọi)

Thú cưng desktop không chỉ để tự chơi mà còn **mở hai kênh gọi từ bên ngoài**, cho plugin hoặc script khác điều khiển và đọc trạng thái.

- **Có thể làm gì**: yêu cầu thú cưng nói một câu chỉ định, phát hoạt ảnh chỉ định, trò chuyện với thú cưng; đọc câu đang nói, trạng thái làm việc, thông báo hệ thống, số dư, thành phố và thời tiết hiện tại.
- **Vì sao mở giao diện**: thú cưng desktop không nên chỉ là vật trang trí — chẳng hạn plugin “quản gia” sau khi kiểm tra có thể nhờ thú cưng nói thay như một “hiện thân”; đồng thời giúp mọi người phát triển dựa trên nó.
- **Kênh một · HTTP**: gắn vào dịch vụ Web của chính DSH (tiền tố `/dsh-pet-7340`, chỉ lắng nghe trên máy cục bộ, không xác thực), gọi được xuyên tiến trình và trực tiếp từ script. Giao diện thao tác chỉ trả `{ok}`; dữ liệu được đọc thống nhất từ `GET /state`.
- **Kênh hai · Dịch vụ Cordis**: phía client đăng ký bên trong trang DSH web; plugin client cùng trang có thể lấy trực tiếp bằng `ctx.get('petApi7340')`, không mạng, không cổng. Chỉ có hiệu lực trong phiên bản trang đó; xem phương thức và giá trị trả về trong [`CORDIS.vi.md`](CORDIS.vi.md).

Các tệp liên quan (mỗi kênh có một bộ):

- [`API.vi.md`](API.vi.md) —— Tổng quan giao diện HTTP (mỗi giao diện một câu, xem nhanh chức năng)
- [`openapi.vi.yaml`](openapi.vi.yaml) —— Đặc tả đầy đủ (OpenAPI 3.1, có thể nhập trực tiếp vào Swagger UI / Postman)
- [`CORDIS-API.vi.md`](CORDIS-API.vi.md) —— Tổng quan dịch vụ Cordis (mỗi thành viên một câu, xem nhanh chức năng)
- [`CORDIS.vi.md`](CORDIS.vi.md) —— Dịch vụ Cordis công khai (phía client, dùng `ctx.get('petApi7340')` trong trang, không qua mạng)
- [`tools/api-tester.html`](tools/api-tester.html) —— Ví dụ phía HTTP: bảng điều khiển thú cưng, đóng vai bên tiêu thụ bên thứ ba để thử trực quan (khởi chạy bằng `node tools/api-tester.cjs`)
- [`tools/cordis-probe`](tools/cordis-probe/README.vi.md) —— Ví dụ phía Cordis: đóng vai plugin client cùng trang, tiêu thụ dịch vụ bằng `ctx.get()`

## Khả năng tương thích

- **Hệ điều hành**: chạy được trên Windows / Linux / macOS — lớp phủ trình duyệt và chế độ desktop (cửa sổ trong suốt luôn ở trên cùng bằng Electron) hoạt động nhất quán; Electron tự dò/tải theo nền tảng (`electron.exe` / `Electron.app` / tệp đơn linux), không cần cài thủ công.
- **Không có màn hình / môi trường không desktop**: hỗ trợ Linux headless và các phiên đồ họa không có — chế độ desktop tự phát hiện môi trường hiển thị (khi Linux không có `DISPLAY` / `WAYLAND_DISPLAY`, xác định là không có màn hình và bỏ qua cửa sổ desktop, chỉ ghi cảnh báo vào log); lớp phủ trình duyệt không bị ảnh hưởng.
- **Trình duyệt**: lớp phủ trình duyệt tương thích với **Chromium (Chrome / Edge, v.v.) và Firefox** — hoạt ảnh trong suốt phụ thuộc VP9-Alpha webm; độ trong suốt đã được kiểm tra xác nhận trên cả ba. **Không hỗ trợ Safari** (macOS không nhận alpha của webm, phần trong suốt hiển thị màu đen) — trên macOS dùng tài nguyên `.mov` (GitHub Release `assets-mov`), tải xuống và đặt vào là được (xem “②.5 Tài nguyên tương thích Safari/HEVC”).
- **Nhiều màn hình**: hỗ trợ môi trường nhiều màn hình — việc đi dạo/ném qua màn hình lấy vùng làm việc của từng màn hình làm giới hạn; xử lý chính xác tỷ lệ thu phóng không đồng nhất (DPI khác nhau giữa các màn hình), dải taskbar và khoảng trống giữa các màn hình (ngang / dọc / xếp trên dưới đều được). Mục “Khóa ở màn hình hiện tại” trong trang cài đặt giới hạn hoạt động của thú cưng (khi bị ném hoặc đi dạo) trong màn hình hiện tại.

## Hình ảnh khi chạy

Hình ảnh thú cưng khi chạy thực tế trong giao diện DSH Web:

<p>
  <img src="assets/screenshots/dsh-pet-running-1.png" width="380" alt="dsh-pet khi chạy 1" title="dsh-pet khi chạy 1">
  <img src="assets/screenshots/dsh-pet-running-2.png" width="380" alt="dsh-pet khi chạy 2" title="dsh-pet khi chạy 2">
  <img src="assets/screenshots/dsh-pet-running-3.png" width="380" alt="dsh-pet khi chạy 3" title="dsh-pet khi chạy 3">
  <img src="assets/screenshots/dsh-pet-running-4.png" width="380" alt="dsh-pet khi chạy 4" title="dsh-pet khi chạy 4">
  <img src="assets/screenshots/dsh-pet-running-5.png" width="380" alt="dsh-pet khi chạy 5" title="dsh-pet khi chạy 5">
  <img src="assets/screenshots/dsh-pet-running-6.png" width="380" alt="dsh-pet khi chạy 6" title="dsh-pet khi chạy 6">
  <img src="assets/screenshots/dsh-pet-running-7.png" width="380" alt="dsh-pet khi chạy 7" title="dsh-pet khi chạy 7">
  <img src="assets/screenshots/dsh-pet-running-8.png" width="380" alt="dsh-pet khi chạy 8" title="dsh-pet khi chạy 8">
</p>

## Xem trước hiệu ứng

Toàn bộ hoạt ảnh (640×360, tài nguyên được plugin dùng để phát thực tế) — bản xem trước GIF nằm trong kho mã tại `dsh-pet/assets/preview/` (hiển thị bằng liên kết trực tiếp raw, tên tệp dùng pinyin để thuận tiện đa nền tảng); video trong suốt đầy đủ nằm trong gói plugin tại `dsh-pet/assets/webm/` (VP9-alpha, định dạng phát hành duy nhất):

**Chờ / quay hướng**

<p>
  <img src="dsh-pet/assets/preview/daiji-huxi-xiuxian.gif" width="160" alt="Thở nhẹ khi chờ" title="Thở nhẹ khi chờ">
  <img src="dsh-pet/assets/preview/dongzhangxiwang.gif" width="160" alt="Ngó nghiêng xung quanh" title="Ngó nghiêng xung quanh">
</p>

**Di chuyển**

<p>
  <img src="dsh-pet/assets/preview/pangxie-zoulu.gif" width="160" alt="Đi kiểu cua" title="Đi kiểu cua">
  <img src="dsh-pet/assets/preview/yuandi-piaofu-tabu.gif" width="160" alt="Bước chân lơ lửng tại chỗ" title="Bước chân lơ lửng tại chỗ">
  <img src="dsh-pet/assets/preview/yuandi-zuozhuan-benpao.gif" width="160" alt="Quay trái và chạy tại chỗ" title="Quay trái và chạy tại chỗ">
</p>

**Động tác nhỏ**

<p>
  <img src="dsh-pet/assets/preview/youxian-hengga.gif" width="160" alt="Thảnh thơi ngân nga" title="Thảnh thơi ngân nga">
  <img src="dsh-pet/assets/preview/chaoda-shenlanyao.gif" width="160" alt="Vươn vai thật dài" title="Vươn vai thật dài">
  <img src="dsh-pet/assets/preview/yuandi-qiaoji-zhuomian-hudong.gif" width="160" alt="Gõ mặt bàn tương tác tại chỗ" title="Gõ mặt bàn tương tác tại chỗ">
  <img src="dsh-pet/assets/preview/yuandi-zhongli-xiadun-yasuo.gif" width="160" alt="Ngồi xổm co lại dưới trọng lực tại chỗ" title="Ngồi xổm co lại dưới trọng lực tại chỗ">
  <img src="dsh-pet/assets/preview/haqian-liantian.gif" width="160" alt="Ngáp liên tục" title="Ngáp liên tục">
  <img src="dsh-pet/assets/preview/yuandi-xiaoqi-chenmian.gif" width="160" alt="Chợp mắt rồi chìm vào giấc ngủ tại chỗ" title="Chợp mắt rồi chìm vào giấc ngủ tại chỗ">
  <img src="dsh-pet/assets/preview/nvpu-quxi-liyi.gif" width="160" alt="Nữ hầu cúi chào" title="Nữ hầu cúi chào">
  <img src="dsh-pet/assets/preview/beixiayitiao-zhamao.gif" width="160" alt="Giật mình hoảng hốt" title="Giật mình hoảng hốt">
  <img src="dsh-pet/assets/preview/xiaofudu-yuandi-360du-xuanzhuan-zhanshi.gif" width="160" alt="Xoay tròn 360 độ với biên độ nhỏ tại chỗ để giới thiệu" title="Xoay tròn 360 độ với biên độ nhỏ tại chỗ để giới thiệu">
  <img src="dsh-pet/assets/preview/touchi-lingshi-bei-zhuazhu.gif" width="160" alt="Ăn vụng đồ ăn vặt rồi bị bắt gặp" title="Ăn vụng đồ ăn vặt rồi bị bắt gặp">
  <img src="dsh-pet/assets/preview/yong-jingyu-weiba-paidadi.gif" width="160" alt="Dùng đuôi cá voi đập xuống đất" title="Dùng đuôi cá voi đập xuống đất">
  <img src="dsh-pet/assets/preview/da-keshui-bei-jingxing.gif" width="160" alt="Đang ngủ gật thì bị đánh thức" title="Đang ngủ gật thì bị đánh thức">
  <img src="dsh-pet/assets/preview/zhao-jingzi.gif" width="160" alt="Soi gương" title="Soi gương">
  <img src="dsh-pet/assets/preview/zhengti-huanzhuang-shise.gif" width="160" alt="Thử màu trang phục toàn thân" title="Thử màu trang phục toàn thân">
  <img src="dsh-pet/assets/preview/qingkuai-jilu.gif" width="160" alt="Ghi chép nhanh nhẹn" title="Ghi chép nhanh nhẹn">
  <img src="dsh-pet/assets/preview/xie-daima.gif" width="160" alt="Viết mã" title="Viết mã">
  <img src="dsh-pet/assets/preview/yaoshan-naliang.gif" width="160" alt="Quạt mát" title="Quạt mát">
  <img src="dsh-pet/assets/preview/chenjian-shuaya.gif" width="160" alt="Đánh răng buổi sáng" title="Đánh răng buổi sáng">
</p>

**Vui chơi**

<p>
  <img src="dsh-pet/assets/preview/yuandi-zhuanxin-wan-mofang.gif" width="160" alt="Chăm chú chơi rubik tại chỗ" title="Chăm chú chơi rubik tại chỗ">
  <img src="dsh-pet/assets/preview/yuandi-dunxia-wan-wanju-qiche.gif" width="160" alt="Ngồi xổm chơi ô tô đồ chơi tại chỗ" title="Ngồi xổm chơi ô tô đồ chơi tại chỗ">
  <img src="dsh-pet/assets/preview/jingyu-tu-paopao-texiao.gif" width="160" alt="Cá voi phun bong bóng" title="Cá voi phun bong bóng">
  <img src="dsh-pet/assets/preview/yuandi-tiaoyue-zhuasui-touding-wupin.gif" width="160" alt="Nhảy lên chụp vỡ đồ vật trên đầu tại chỗ" title="Nhảy lên chụp vỡ đồ vật trên đầu tại chỗ">
  <img src="dsh-pet/assets/preview/wan-youxi-qijibaituai.gif" width="160" alt="Chơi game đến phát cáu" title="Chơi game đến phát cáu">
  <img src="dsh-pet/assets/preview/wan-shuiqiang.gif" width="160" alt="Chơi súng nước" title="Chơi súng nước">
  <img src="dsh-pet/assets/preview/xiaotiqin-yanzou.gif" width="160" alt="Chơi violin" title="Chơi violin">
  <img src="dsh-pet/assets/preview/lanjing-xianshi.gif" width="160" alt="Cá voi xanh xuất hiện" title="Cá voi xanh xuất hiện">
  <img src="dsh-pet/assets/preview/youya-nvpuwu.gif" width="160" alt="Vũ điệu nữ hầu thanh lịch" title="Vũ điệu nữ hầu thanh lịch">
  <img src="dsh-pet/assets/preview/qingkuai-yaobaiwu.gif" width="160" alt="Điệu nhảy lắc lư nhẹ nhàng" title="Điệu nhảy lắc lư nhẹ nhàng">
  <img src="dsh-pet/assets/preview/keai-zhaiwu.gif" width="160" alt="Vũ đạo dễ thương" title="Vũ đạo dễ thương">
  <img src="dsh-pet/assets/preview/chui-qiqiu.gif" width="160" alt="Thổi bóng bay" title="Thổi bóng bay">
  <img src="dsh-pet/assets/preview/dongwu-huanrao.gif" width="160" alt="Động vật vây quanh" title="Động vật vây quanh">
  <img src="dsh-pet/assets/preview/fang-fengzheng.gif" width="160" alt="Thả diều" title="Thả diều">
  <img src="dsh-pet/assets/preview/chai-liwu.gif" width="160" alt="Mở quà" title="Mở quà">
  <img src="dsh-pet/assets/preview/bian-gezi.gif" width="160" alt="Biến thành chim bồ câu" title="Biến thành chim bồ câu">
  <img src="dsh-pet/assets/preview/puke-moshu.gif" width="160" alt="Ảo thuật bài tây" title="Ảo thuật bài tây">
  <img src="dsh-pet/assets/preview/chou-tuoluo.gif" width="160" alt="Quay con quay" title="Quay con quay">
  <img src="dsh-pet/assets/preview/chui-dizi.gif" width="160" alt="Thổi sáo" title="Thổi sáo">
  <img src="dsh-pet/assets/preview/hudie-mifeng-huanrao-touding-kaihua.gif" width="160" alt="Bướm và ong bay quanh đầu, hoa nở" title="Bướm và ong bay quanh đầu, hoa nở">
  <img src="dsh-pet/assets/preview/lu-mao.gif" width="160" alt="Vuốt ve mèo" title="Vuốt ve mèo">
  <img src="dsh-pet/assets/preview/pingkong-shenghua.gif" width="160" alt="Làm hoa xuất hiện từ hư không" title="Làm hoa xuất hiện từ hư không">
  <img src="dsh-pet/assets/preview/qi-muma.gif" width="160" alt="Cưỡi ngựa gỗ" title="Cưỡi ngựa gỗ">
  <img src="dsh-pet/assets/preview/sanqiu-paojie.gif" width="160" alt="Tung hứng ba quả bóng" title="Tung hứng ba quả bóng">
  <img src="dsh-pet/assets/preview/ti-jianzi.gif" width="160" alt="Đá cầu" title="Đá cầu">
  <img src="dsh-pet/assets/preview/xiawuziqi.gif" width="160" alt="Chơi cờ Caro" title="Chơi cờ Caro">
  <img src="dsh-pet/assets/preview/dangqiuqian.gif" width="160" alt="Đu xích đu" title="Đu xích đu">
</p>

**Ăn uống**

<p>
  <img src="dsh-pet/assets/preview/chi-baifan.gif" width="160" alt="Ăn cơm trắng" title="Ăn cơm trắng">
  <img src="dsh-pet/assets/preview/dakou-chi-lingshi.gif" width="160" alt="Ăn đồ ăn vặt ngon lành" title="Ăn đồ ăn vặt ngon lành">
  <img src="dsh-pet/assets/preview/chi-token.gif" width="160" alt="Ăn token" title="Ăn token">
  <img src="dsh-pet/assets/preview/chi-zaocan.gif" width="160" alt="Ăn sáng" title="Ăn sáng">
  <img src="dsh-pet/assets/preview/chi-wucan.gif" width="160" alt="Ăn trưa" title="Ăn trưa">
  <img src="dsh-pet/assets/preview/chi-wancan.gif" width="160" alt="Ăn tối" title="Ăn tối">
  <img src="dsh-pet/assets/preview/chi-bingqilin-ronghua.gif" width="160" alt="Ăn kem tan chảy" title="Ăn kem tan chảy">
  <img src="dsh-pet/assets/preview/chi-dazhaxie.gif" width="160" alt="Ăn cua lông" title="Ăn cua lông">
  <img src="dsh-pet/assets/preview/chi-tanghulu.gif" width="160" alt="Ăn kẹo hồ lô" title="Ăn kẹo hồ lô">
  <img src="dsh-pet/assets/preview/chi-changshoumian.gif" width="160" alt="Ăn mì trường thọ" title="Ăn mì trường thọ">
  <img src="dsh-pet/assets/preview/chi-xigua.gif" width="160" alt="Ăn dưa hấu" title="Ăn dưa hấu">
  <img src="dsh-pet/assets/preview/shuan-huoguo.gif" width="160" alt="Ăn lẩu" title="Ăn lẩu">
</p>

**Mùa lễ hội**

<p>
  <img src="dsh-pet/assets/preview/beiluoye-yanmo.gif" width="160" alt="Bị lá rụng vùi lấp" title="Bị lá rụng vùi lấp">
  <img src="dsh-pet/assets/preview/zhongqiu-shangyue-chi-yuebing.gif" width="160" alt="Ngắm trăng và ăn bánh Trung thu" title="Ngắm trăng và ăn bánh Trung thu">
  <img src="dsh-pet/assets/preview/duixueren.gif" width="160" alt="Nặn người tuyết" title="Nặn người tuyết">
  <img src="dsh-pet/assets/preview/fang-yanhua.gif" width="160" alt="Bắn pháo hoa" title="Bắn pháo hoa">
  <img src="dsh-pet/assets/preview/chi-zongzi.gif" width="160" alt="Ăn bánh ú" title="Ăn bánh ú">
  <img src="dsh-pet/assets/preview/chi-niangao.gif" width="160" alt="Ăn bánh tổ" title="Ăn bánh tổ">
  <img src="dsh-pet/assets/preview/chi-qingtuan.gif" width="160" alt="Ăn bánh thanh đoàn" title="Ăn bánh thanh đoàn">
  <img src="dsh-pet/assets/preview/chi-labazhou.gif" width="160" alt="Ăn cháo Lạp Bát" title="Ăn cháo Lạp Bát">
  <img src="dsh-pet/assets/preview/chi-chongyanggao.gif" width="160" alt="Ăn bánh Trùng Dương" title="Ăn bánh Trùng Dương">
  <img src="dsh-pet/assets/preview/shou-hongbao.gif" width="160" alt="Nhận lì xì" title="Nhận lì xì">
  <img src="dsh-pet/assets/preview/xie-fuzi.gif" width="160" alt="Viết chữ Phúc" title="Viết chữ Phúc">
  <img src="dsh-pet/assets/preview/chuanzhenqiqiao.gif" width="160" alt="Xâu kim cầu duyên" title="Xâu kim cầu duyên">
  <img src="dsh-pet/assets/preview/wu-shitou.gif" width="160" alt="Múa đầu lân" title="Múa đầu lân">
  <img src="dsh-pet/assets/preview/taotang-nanguadeng.gif" width="160" alt="Xin kẹo bên đèn bí ngô" title="Xin kẹo bên đèn bí ngô">
  <img src="dsh-pet/assets/preview/cha-zhuyu-shangju.gif" width="160" alt="Cài thù du và ngắm hoa cúc" title="Cài thù du và ngắm hoa cúc">
  <img src="dsh-pet/assets/preview/fanghedeng.gif" width="160" alt="Thả đèn hoa đăng" title="Thả đèn hoa đăng">
  <img src="dsh-pet/assets/preview/menghua-xiaoyouling.gif" width="160" alt="Hóa thành hồn ma nhỏ đáng yêu" title="Hóa thành hồn ma nhỏ đáng yêu">
  <img src="dsh-pet/assets/preview/zhuangdian-shengdanshu.gif" width="160" alt="Trang trí cây thông Noel" title="Trang trí cây thông Noel">
  <img src="dsh-pet/assets/preview/fang-kongmingdeng.gif" width="160" alt="Thả đèn Khổng Minh" title="Thả đèn Khổng Minh">
  <img src="dsh-pet/assets/preview/chitangyuan.gif" width="160" alt="Ăn bánh trôi" title="Ăn bánh trôi">
  <img src="dsh-pet/assets/preview/chijiaozi.gif" width="160" alt="Ăn sủi cảo" title="Ăn sủi cảo">
</p>

**Lời thoại**

<p>
  <img src="dsh-pet/assets/preview/shia-chishenme.gif" width="160" alt="Ừ nhỉ, ăn gì đây" title="Ừ nhỉ, ăn gì đây">
  <img src="dsh-pet/assets/preview/shendu-sikao-suisuinian.gif" width="160" alt="Vừa suy nghĩ sâu xa vừa lẩm bẩm" title="Vừa suy nghĩ sâu xa vừa lẩm bẩm">
</p>

**Phản hồi khi nhấp**

<p>
  <img src="dsh-pet/assets/preview/dianji-huiying-kaixin-yuedong.gif" width="160" alt="Phản hồi khi nhấp - vui vẻ nhảy lên" title="Phản hồi khi nhấp - vui vẻ nhảy lên">
  <img src="dsh-pet/assets/preview/dianji-huiying-haixiu-jingya.gif" width="160" alt="Phản hồi khi nhấp - ngượng ngùng ngạc nhiên" title="Phản hồi khi nhấp - ngượng ngùng ngạc nhiên">
  <img src="dsh-pet/assets/preview/dianji-huiying-aojiao-shengqi-ceshen-zhanshi.gif" width="160" alt="Phản hồi khi nhấp - hờn dỗi tức giận, nghiêng người tạo dáng" title="Phản hồi khi nhấp - hờn dỗi tức giận, nghiêng người tạo dáng">
  <img src="dsh-pet/assets/preview/dianji-huiying-naoyang-gegexiao.gif" width="160" alt="Phản hồi khi nhấp - bị cù và cười khúc khích" title="Phản hồi khi nhấp - bị cù và cười khúc khích">
  <img src="dsh-pet/assets/preview/dianji-huiying-yuanqi-huishou.gif" width="160" alt="Phản hồi khi nhấp - vẫy tay đầy năng lượng" title="Phản hồi khi nhấp - vẫy tay đầy năng lượng">
</p>

**Kéo thả**

<p>
  <img src="dsh-pet/assets/preview/beishubiao-tuozhuai-xuankong-fankui.gif" width="160" alt="Phản hồi khi bị chuột kéo lên không trung" title="Phản hồi khi bị chuột kéo lên không trung">
</p>

**Sự kiện số dư** (phân mức theo tỷ lệ số dư đã dùng, đầy → sắp hết → cạn)

<p>
  <img src="dsh-pet/assets/preview/qian-dai-man-yi.gif" width="160" alt="Số dư - túi tiền đầy tràn" title="Số dư - túi tiền đầy tràn">
  <img src="dsh-pet/assets/preview/jin-dai-ding-dang.gif" width="160" alt="Số dư - túi vàng leng keng" title="Số dư - túi vàng leng keng">
  <img src="dsh-pet/assets/preview/qian-dai-ru-chang.gif" width="160" alt="Số dư - tiền bạc bình thường" title="Số dư - tiền bạc bình thường">
  <img src="dsh-pet/assets/preview/shu-jin-zhou-mei.gif" width="160" alt="Số dư - đếm tiền rồi cau mày" title="Số dư - đếm tiền rồi cau mày">
  <img src="dsh-pet/assets/preview/dai-kong-ru-xi.gif" width="160" alt="Số dư - túi rỗng không còn gì" title="Số dư - túi rỗng không còn gì">
  <img src="dsh-pet/assets/preview/fen-wen-bu-sheng.gif" width="160" alt="Số dư - không còn một xu" title="Số dư - không còn một xu">
</p>

**Hoạt ảnh lẩm bẩm** (được kích hoạt khi lẩm bẩm / trả lời trò chuyện, chọn ngẫu nhiên 1 đoạn)

<p>
  <img src="dsh-pet/assets/preview/suisuinian-cazhuo-suisuinian.gif" width="160" alt="Lẩm bẩm - vừa lau bàn vừa nói" title="Lẩm bẩm - vừa lau bàn vừa nói">
  <img src="dsh-pet/assets/preview/suisuinian-fadai-suisuinian.gif" width="160" alt="Lẩm bẩm - vừa ngẩn ngơ vừa nói" title="Lẩm bẩm - vừa ngẩn ngơ vừa nói">
  <img src="dsh-pet/assets/preview/suisuinian-duiping-suisuinian.gif" width="160" alt="Lẩm bẩm - vừa nhìn màn hình vừa nói" title="Lẩm bẩm - vừa nhìn màn hình vừa nói">
</p>

**Hoạt ảnh trạng thái làm việc** (theo sự kiện phiên DSH, sáu trạng thái: suy nghĩ / làm việc / sắp xếp / chờ / thành công / lỗi)

<p>
  <img src="dsh-pet/assets/preview/gongzuozhuangtai-sikao-maopao.gif" width="160" alt="Trạng thái làm việc - suy nghĩ và nổi bong bóng" title="Trạng thái làm việc - suy nghĩ và nổi bong bóng">
  <img src="dsh-pet/assets/preview/gongzuozhuangtai-manglu-dianan.gif" width="160" alt="Trạng thái làm việc - bận rộn nhấn nút" title="Trạng thái làm việc - bận rộn nhấn nút">
  <img src="dsh-pet/assets/preview/gongzuozhuangtai-qingdian-guidang.gif" width="160" alt="Trạng thái làm việc - kiểm kê và lưu trữ" title="Trạng thái làm việc - kiểm kê và lưu trữ">
  <img src="dsh-pet/assets/preview/gongzuozhuangtai-yuandi-duobu-zhangwang.gif" width="160" alt="Trạng thái làm việc - đi qua đi lại và quan sát tại chỗ" title="Trạng thái làm việc - đi qua đi lại và quan sát tại chỗ">
  <img src="dsh-pet/assets/preview/gongzuozhuangtai-queyue-qingzhu.gif" width="160" alt="Trạng thái làm việc - vui mừng ăn mừng" title="Trạng thái làm việc - vui mừng ăn mừng">
  <img src="dsh-pet/assets/preview/gongzuozhuangtai-chuitou-tanqi-maohan.gif" width="160" alt="Trạng thái làm việc - cúi đầu thở dài, đổ mồ hôi" title="Trạng thái làm việc - cúi đầu thở dài, đổ mồ hôi">
</p>

**Ngủ** (nhấp chuột phải vào “Ngủ” hoặc rê chuột lên thú cưng rồi nhấn `S`; khi đang ngủ, nhấp một lần để đánh thức)

<p>
  <img src="dsh-pet/assets/preview/shuijiao-kaishi.gif" width="160" alt="Ngủ - bắt đầu" title="Ngủ - bắt đầu">
  <img src="dsh-pet/assets/preview/shuijiao-xunhuan.gif" width="160" alt="Ngủ - lặp" title="Ngủ - lặp">
  <img src="dsh-pet/assets/preview/shuijiao-qilai.gif" width="160" alt="Ngủ - thức dậy" title="Ngủ - thức dậy">
</p>

> Lưu ý: hoạt ảnh có nền trong suốt; vùng trong suốt của bản xem trước GIF hiển thị màu nền trang, còn webm thực tế phát với nền trong suốt.

## Tạo thú cưng của riêng bạn từ đầu

Prompt AI → video phông xanh → hoạt ảnh trong suốt → plugin; có thể đổi nhân vật, động tác, phong cách và tái tạo toàn bộ quy trình.

Xem toàn bộ các bước trong **[MAKE-YOUR-OWN-PET.vi.md](MAKE-YOUR-OWN-PET.vi.md)** (công thức prompt, chuỗi tạo tài nguyên, tương thích Safari, phát hành).

## Cấu trúc dự án

Chỉ liệt kê các thư mục liên quan đến mã nguồn và phát hành; video / scripts / step / pr trong chuỗi tạo tài nguyên xem phần ② của [MAKE-YOUR-OWN-PET.vi.md](MAKE-YOUR-OWN-PET.vi.md) (không liệt kê các thư mục cục bộ trong gitignore):

```
├── README.md  INSTALL.md  FEATURES.md  MAKE-YOUR-OWN-PET.md  CONFIG.md  API.md  CORDIS.md  openapi.yaml   # giới thiệu / cài đặt / mô tả tính năng / hướng dẫn tạo pet / cấu hình / giao diện HTTP / dịch vụ Cordis / đặc tả OpenAPI
├── prompts/           # ① Công thức prompt tạo hoạt ảnh (quy chuẩn phông xanh + phân chia theo giây)
├── assets/            # ảnh chụp màn hình dùng để giới thiệu kho mã
├── tools/             # công cụ phát triển: trang gỡ lỗi API, dịch vụ mock cordis-probe, bộ dò DPI
├── .github/workflows/ # CI: quy trình chuyển mã Safari/HEVC (macOS runner, kích hoạt thủ công → phát hành Release assets-mov)
├── dsh-pet/           # ③ Plugin (có thể phát hành npm độc lập)
│   ├── src/
│   │   ├── host/       # Nửa Host: cấu hình / route / số dư / trạng thái làm việc
│   │   ├── client/     # Nửa trình duyệt: hiển thị thú cưng / chuỗi hoạt ảnh / trang cài đặt
│   │   ├── shared/     # Logic thuần dùng chung ở hai phía (vật lý / menu / lấy dữ liệu)
│   │   └── standalone/ # CLI chế độ độc lập (chạy thú cưng trực tiếp, không phụ thuộc DSH)
│   ├── lib/            # Sản phẩm build (được tạo bởi npm run build, không đưa vào kho mã)
│   ├── runtime/        # Vỏ chạy chế độ desktop (cửa sổ Electron trong suốt)
│   ├── assets/         # Hoạt ảnh webm / GIF xem trước / phông chữ / biểu tượng / cấu hình mặc định config.jsonc
│   └── scripts/        # Script build, phát hành và phát triển
└── LICENSE             # MIT
```

## Dự án liên quan

- **[aipets](https://github.com/kallen-noelle/aipets)** —— Thú cưng desktop cho Windows 11, có năm nhân vật có thể mở cùng lúc, luôn ở trên cùng trong suốt, xuyên nhấp và quăng có quán tính. Điểm nổi bật là **hành động do mô hình lớn quyết định**: sau mỗi lượt trò chuyện, mô hình chọn hành động dựa trên thời gian, thời tiết, pin và mức độ thân thiết; khi không ai nói chuyện, mô hình vẫn có thể sắp xếp lịch gần như cả ngày. Nếu mô hình không dùng được, hệ thống quay về quy tắc tích hợp sẵn. Trò chuyện với bất kỳ API tương thích OpenAI nào, có bộ nhớ dài hạn, sticker, vẽ ảnh và gọi công cụ (tìm kiếm web / Home Assistant / MCP), hỗ trợ đọc thành tiếng và nhập bằng giọng nói; cùng một mã nguồn cung cấp cả bản desktop một tệp `aipets.exe` và bản sân khấu toàn trang trong trình duyệt.

## 💬 Phản hồi và nhịp phát hành

Hoan nghênh tạo [issue](https://github.com/PC2005-cloud/dsh-pet/issues) và PR — hãy gửi phản hồi về lỗi hoặc vấn đề trải nghiệm bất cứ lúc nào. **Với tính năng mới, hãy mở issue trước** và mô tả trường hợp sử dụng; sau khi được xác nhận mới bắt đầu triển khai, không gửi PR hiện thực trước khi xác nhận. Plugin này tập trung vào thú cưng desktop và bản thân DSH; các yêu cầu đi quá xa phạm vi đó thường sẽ không được thực hiện. Trước khi bắt đầu, hãy xem [lịch sử commit](https://github.com/PC2005-cloud/dsh-pet/commits/main) để xác nhận vấn đề tương tự chưa được sửa (một số vấn đề có thể đã được sửa trên `main` nhưng chưa phát hành).

- **Không phát hành riêng các sửa đổi nhỏ**: lỗi nhỏ và tối ưu không ảnh hưởng cách sử dụng sẽ được **gộp** vào bản phát hành tiếp theo để tránh phát hành quá thường xuyên. Vì vậy, “đã sửa trên `main`” không có nghĩa là “bản bạn cài đã có sửa đổi” — khi `latest` chưa được cập nhật, hãy căn cứ vào lịch sử commit trên `main`.
- **Muốn dùng ngay bản sửa chưa phát hành**: làm theo mục “Cài đặt từ mã nguồn” trong [INSTALL.vi.md](INSTALL.vi.md) để trỏ plugin vào kho mã cục bộ; lưu ý thay đổi mã ở **nửa Host** cần **khởi động lại DSH** mới có hiệu lực (nửa trình duyệt chỉ cần làm mới trang).
- **Khi báo lỗi, vui lòng cung cấp**: phiên bản plugin, phiên bản `dsh`, hệ điều hành, các bước tái hiện (có log hoặc ảnh chụp màn hình càng tốt).

## Giấy phép

- Mã nguồn: MIT
- Tài nguyên (hoạt ảnh / prompt / video nguồn): được phép sử dụng theo giấy phép nguồn mở; chi tiết tuân theo giấy phép hình tượng của nguyên mẫu nhân vật (xem “Giấy phép hình tượng” bên dưới).
- **Quy ước tác phẩm phái sinh**: các tác phẩm phái sinh / bản chỉnh sửa / thay giao diện dựa trên dự án này phải kèm địa chỉ GitHub của tác giả gốc trên **các kênh công khai** như kho mã GitHub hoặc trang web sản phẩm: <https://github.com/PC2005-cloud/dsh-pet>
- **Nguồn gốc hình tượng**: hình tượng thú cưng là nhân vật DeepSeek “Đại Phì Ngư” (cô gái cá voi) do cộng đồng sáng tạo phái sinh, **không phải hình tượng chính thức của DeepSeek**; nguyên mẫu “Minh Nguyệt” do Bilibili [@上善无形](https://space.bilibili.com/4456176) sáng tạo; thiết kế phiên bản DeepSeek (cô gái cá voi nữ hầu) do Bilibili [@ZipZipPipe](https://space.bilibili.com/4168597) thực hiện.
- **Giấy phép hình tượng**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) (ghi công · phi thương mại · chia sẻ tương tự), [tuyên bố gốc](https://www.bilibili.com/opus/1247156596114456581): “Đại Phì Ngư là hình tượng tuân theo giấy phép CC BY-NC-SA 4.0, không được thương mại hóa dưới bất kỳ hình thức nào. Nếu bạn rất yêu thích hình tượng này và muốn nó có hình dạng vật lý, bạn có thể tự đặt làm.”