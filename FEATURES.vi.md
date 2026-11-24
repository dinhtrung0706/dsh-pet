# Chi tiết tính năng (số dư / lẩm bẩm và hội thoại / giọng nói / trạng thái công việc / việc cần làm / ngủ)

> Quay lại [README](README.vi.md)

Mục “Tính năng plugin” trong README chỉ liệt kê các khả năng; tài liệu này giải thích chi tiết sáu mục đó.

## ⚙️ Hiển thị số dư (Balance)

1. **Nhà cung cấp tích hợp**: tích hợp sẵn OpenCode Zen Go, Command Code và hai cách đăng nhập DeepSeek (API key chính thức, tài khoản DSH); chỉ cần thiết lập thông tin xác thực tương ứng. Nhà cung cấp không có API sẽ hiện một câu giải thích bằng văn bản thay vì hiển thị số 0.
2. **Hoạt ảnh theo bậc**: chia thành sáu mức dựa trên “đã dùng bao nhiêu”; số dư càng thấp thì biểu cảm càng hoảng — túi tiền đầy tràn → túi vàng leng keng → túi tiền bình thường → đếm tiền cau mày → túi cạn → không còn đồng nào. Mỗi bậc ứng với 20%; chỉ khi dùng hết đúng 100% mới vào bậc cuối.
3. **Nhà cung cấp và bong bóng tùy chỉnh**: có thể kết nối nhà cung cấp riêng — cách lấy dữ liệu và hình thức bong bóng hoàn toàn do bạn quyết định, không cần sửa plugin.
4. **Ba cách kích hoạt**: tự động tra cứu theo chu kỳ đã cấu hình; hoặc dùng menu chuột phải “Xem số dư” hay lệnh `/balance` để tra cứu bất cứ lúc nào.
5. **Cấu hình riêng cho từng thú cưng**: bật/tắt tính năng số dư cho từng thú cưng; khi tắt, không tự tra cứu và không phát hoạt ảnh số dư, nhưng thao tác tra cứu thủ công vẫn có phản hồi.

## ⚙️ Lẩm bẩm và hội thoại

1. **Mô hình**: có thể cấu hình riêng một mô hình cho lẩm bẩm và một mô hình cho hội thoại; nếu không cấu hình thì dùng mô hình của hội thoại hiện tại; nếu mô hình đã chỉ định không gọi được thì tự quay về mô hình của hội thoại hiện tại và thử lại một lần.
2. **Tính cách**: mỗi thú cưng có thể có phần mô tả tính cách riêng để xác định nó là ai và nói chuyện theo giọng điệu nào; cả lẩm bẩm lẫn hội thoại đều dựa theo đó. Để trống thì dùng nội dung mặc định của mục chứa nó.
3. **Kích hoạt**: chọn “Lẩm bẩm” hoặc “Hội thoại” trong menu chuột phải để nói bất cứ lúc nào; rê chuột lên thú cưng rồi nhấn `T` để bắt đầu trò chuyện; dùng `/chat` để trò chuyện và `/pet` để đổi thú cưng hội thoại; có thể bật lẩm bẩm tự động theo chu kỳ.
4. **Hình ảnh**: chọn tệp, chụp màn hình hiện tại, kéo ảnh vào thú cưng hoặc dán bằng `Ctrl+V` — đều được; ảnh được đưa vào kho tệp đính kèm của DSH, mỗi ảnh chỉ lưu một bản.
5. **Ảnh kèm câu trả lời**: có thể để thú cưng gửi kèm ảnh khi trả lời; bật trong phần cài đặt. Ảnh lấy từ thư mục meme — chỉ cần thêm ảnh vào thư mục để tự bổ sung; cũng có thể đặt số ảnh tối đa trong mỗi lần trả lời.
6. **Bộ nhớ**: cấu hình “số lượt lịch sử gửi cho mô hình” (đặt thành 0 để không gửi); bản ghi hội thoại vẫn được lưu đầy đủ. Cửa sổ trò chuyện đánh dấu lượt nào sẽ được đưa vào ngữ cảnh.
7. **Giọng nói**: câu trả lời hội thoại và lần lẩm bẩm được kích hoạt thủ công sẽ được đọc thành tiếng; lẩm bẩm tự động theo chu kỳ mặc định không đọc — xem phần “Giọng nói” bên dưới để biết về giọng, âm lượng, nhận dạng và kết nối triển khai.
8. **Cửa sổ trò chuyện**: cửa sổ hội thoại đầy đủ trong thanh bên DSH, chứa toàn bộ lịch sử; có thể chọn lượt để xóa hoặc xóa toàn bộ (kể cả lịch sử cũ còn lại của thú cưng đã bị xóa); có thể nhấp ảnh bạn gửi và ảnh thú cưng gửi kèm để xem kích thước lớn.
9. **Bối cảnh môi trường**: prompt hệ thống của hội thoại và lẩm bẩm có thêm dòng “hiện tại” — thành phố ước lượng từ IP thoát mạng cùng thời tiết hiện tại tra được (nhiệt độ, nhiệt độ cảm nhận, độ ẩm, tốc độ gió). Thành phố chỉ là ước lượng; prompt sẽ ghi rõ “có thể không chính xác”. Nếu không lấy được thời tiết, sẽ ghi “lần này không tra được” để thú cưng thành thật nói không biết thay vì bịa. Vì vậy, khi hỏi “hôm nay có cần mang ô không”, câu trả lời dựa trên dữ liệu thực. Để lấy dữ liệu mới ngay, chọn “Tra cứu thời tiết” trong menu chuột phải để buộc làm mới và hiện bong bóng môi trường.

## 🔊 Giọng nói (Voice)

1. **Hai chiều**: thú cưng có thể đọc lời thoại (tổng hợp) và nghe bạn nói (nhận dạng). Cả hai đều chạy qua host; trình duyệt và desktop dùng chung một hệ thống.
2. **Nội dung được đọc**: câu trả lời hội thoại và lẩm bẩm được kích hoạt thủ công sẽ được đọc; lẩm bẩm tự động theo chu kỳ mặc định không đọc nhưng có thể bật riêng trong cài đặt; nhắc việc cần làm cũng có công tắc riêng. Nút loa cạnh mỗi câu trả lời trong cửa sổ trò chuyện phát riêng câu đó.
3. **Giọng, âm lượng và công tắc tổng**: mặc định dùng giọng trực tuyến edge; chọn giọng trong danh sách thiết lập sẵn. Âm lượng là hệ số 0–1, trong đó 1 là tối đa. Khi tắt công tắc tổng, mọi phát âm thanh tự động đều im lặng; nhấn loa thủ công vẫn phát.
4. **Bong bóng chờ giọng nói**: khi tổng hợp chậm, bong bóng tiếp tục hiển thị để chờ; chỉ thu lại sau khi phát xong để tránh chữ biến mất trước khi âm thanh bắt đầu. Nếu tổng hợp lỗi hoặc timeout, bong bóng giữ biểu tượng loa bị tắt tiếng và hội thoại vẫn tiếp tục.
5. **Phát ở phía nào**: mỗi lần chỉ phát âm thanh ở một phía — xác định theo nơi hiển thị của thú cưng đó; nếu bật cả hai thì ưu tiên desktop. Trang web chuyển ra nền thì không phát tiếng.
6. **Nghe bạn nói**: giữ nút micro trong cửa sổ trò chuyện để nói, hoặc bật/tắt ghi âm bằng phím tắt; sau khi kết thúc, bản ghi được nhận dạng thành văn bản và điền thẳng vào ô nhập. Bản ghi quá ngắn bị bỏ vì xem là chạm nhầm; nếu không nghe thấy tiếng thì hiện thông báo tại chỗ. Micro chỉ dùng được qua HTTPS / localhost.
7. **Kết nối dịch vụ riêng**: có một vị trí đăng ký riêng cho tổng hợp và nhận dạng; sau khi đăng ký triển khai riêng, hệ thống không dùng triển khai tích hợp nữa (xem tài liệu Cordis).

## ⚙️ Liên kết trạng thái công việc (Work Status)

1. **Theo hội thoại**: khi bật, thú cưng theo trạng thái hội thoại DSH và chuyển hoạt ảnh giữa sáu mức “đang suy nghĩ / đang làm / đang sắp xếp / đang chờ / thành công / lỗi”; đồng thời hiện bong bóng trạng thái phía trên đầu.
2. **Nhịp hoạt ảnh**: các mức đang diễn ra phát lặp và bong bóng luôn hiện; thành công và lỗi chỉ phát một lần, bong bóng tự thu sau 10 giây.
3. **Văn bản bong bóng**: tùy công cụ và lệnh hiện tại mà thông báo việc cụ thể — đọc tệp sẽ nói “để xem qua index.ts nào”, sửa tệp sẽ nói “cần sửa index.ts rồi”, tìm nội dung sẽ nói “TODO trốn ở đâu nhỉ”; khi chạy lệnh thì dựa theo tên lệnh (`git push` → “đến lúc đẩy lên rồi nhỉ, để mình”, `npm test` → “chạy npm test nhé”). Đường dẫn quá dài thì chỉ giữ tên tệp; tên lệnh quá dài thì dùng câu chung. Nếu có danh sách công việc, ưu tiên hiện mục đang thực hiện trong danh sách. Khi không khớp công cụ cụ thể, chọn ngẫu nhiên một câu dự phòng tương ứng với một trong sáu mức.

## ⚙️ Việc cần làm (Todo)

1. **Mở và thu gọn**: chọn “Việc cần làm” trong menu chuột phải hoặc rê chuột lên thú cưng rồi nhấn `D`; thu gọn bằng cách nhấn ✕ ở góc trên bên phải, nhấp vùng trống ngoài bảng hoặc nhấn `D` lần nữa. Nhấp vào thân thú cưng hay kéo nó đi không làm bảng đóng — thường cần xem danh sách trong lúc di chuyển vị trí.
2. **Bảng**: hiển thị trong bong bóng phía trên đầu như số dư và di chuyển cùng thú cưng; chiều rộng, cỡ chữ và lề trong co giãn theo kích thước thú cưng và cấu hình cỡ chữ; đổi thú cưng hoặc cỡ chữ không cần chỉnh riêng.
3. **Thêm việc**: một dòng nội dung + thời điểm đến hạn tùy chọn. Bộ chọn lịch được vẽ riêng: nhấp ngày, sau đó chọn giờ trong mục “giờ / phút” (phút cách nhau 5 phút), nhấp “Hoàn tất” để đóng; “Xóa” để bỏ hạn. Không cho chọn thời điểm đã qua.
4. **Danh sách**: việc chưa hoàn thành ở trước, việc gần đến hạn xếp cao hơn, việc không có hạn ở cuối; tối đa hiển thị hai dòng, phần còn lại cuộn được. Việc hoàn thành được gạch ngang và chuyển xanh; cần xác nhận hai lần trước khi xóa để tránh thao tác nhầm.
5. **Nhắc nhở**: dùng bộ hẹn giờ của host, không cần trang luôn mở. Bắt đầu nhắc khi còn dưới 7 ngày và tăng tần suất khi gần hạn (24h → 12h → 4h → 1h → 20m → 5m); sau hạn, nhắc mỗi 30 phút trong ngày đầu, mỗi 6 giờ trong tuần đầu, rồi ngừng. Mỗi lần chỉ một thú cưng đang hiển thị được nhắc, bong bóng ở lại 15 giây; nếu hiện không có trình duyệt / desktop nào trực tuyến thì tạm hoãn, khi có đầu kết nối lại sẽ nhắc bù.
6. **Vị trí dữ liệu**: một danh sách dùng chung cấp người dùng (không chia theo thú cưng), nằm trong thư mục dữ liệu plugin ở `todos.json`; có thể xem đường dẫn trong mục “Cấu hình nâng cao” của trang cài đặt. Xóa tệp này tương đương xóa toàn bộ việc cần làm.

## 😴 Ngủ (Sleep)

1. **Cách dùng**: chọn “Ngủ” trong menu chuột phải để thú cưng ngủ; khi đang ngủ, nhấp vào nó hoặc chọn “Thức dậy” trong menu chuột phải để gọi dậy. Rê chuột lên thú cưng rồi nhấn `S` cũng bật/tắt chế độ ngủ (cùng một phím để ngủ và thức); cả ba loại lời thoại dùng chung một luồng.
2. **Trong khi ngủ**: hoàn toàn yên lặng — không tự di chuyển, đổi hướng hay phát hành động ngẫu nhiên; lẩm bẩm, số dư, nhắc việc và trạng thái công việc đều không làm phiền. Menu chuột phải để phát hoạt ảnh, trò chuyện hoặc tra số dư cũng bị chặn; thú cưng chỉ đáp “mình đang ngủ” (có thể cấu hình lời thoại).
3. **Nói mơ**: khi ngủ, thú cưng thỉnh thoảng nói mơ theo chu kỳ; giọng điệu dựa trên tính cách và prompt tình huống ngủ; chỉ hiện bong bóng, không đổi hoạt ảnh và không đọc thành tiếng.
4. **Tư thế và lời thoại**: cấu hình nhiều bộ tư thế ngủ trong `animations.sleep` (ngủ ngồi, ngủ nằm sấp, v.v.); mỗi bộ có ba giai đoạn, mỗi giai đoạn có thể có nhiều mục để chọn ngẫu nhiên. Lời thoại lúc đi ngủ, thức dậy và bị làm phiền được cấu hình riêng theo từng loại.

## Tiếp theo

- Chỉnh cấu hình (kích thước / vị trí / nhiều instance / vật lý / mô hình / tính cách / loại thú cưng): xem [CONFIG.vi.md](CONFIG.vi.md)
- Để plugin khác điều khiển thú cưng: xem [API.vi.md](API.vi.md) và [CORDIS.vi.md](CORDIS.vi.md)
