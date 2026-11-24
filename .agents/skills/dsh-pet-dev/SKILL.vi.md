---
name: dsh-pet-dev
description: "Quy tắc phát triển tổng quát của kho mã (plugin thú cưng dsh-pet): kết nối ranh giới nhiệm vụ, quy chuẩn mã plugin, quy chuẩn chú thích và quy chuẩn commit thành một chuỗi thực thi, để một lần gọi bao quát toàn bộ quy trình từ sửa mã đến commit."
whenToUse: "Dùng khi thay đổi bất kỳ mã, chú thích, tài liệu nào trong kho mã này hoặc chuẩn bị commit: khi người dùng nói “sửa chỗ này”, “thêm tính năng”, “sửa giúp”, “commit và push”, hoặc gọi thủ công dsh-pet-dev."
metadata:
  language: "vi"
  category: "development"
disable-model-invocation: true
user-invocable: true
---

# Quy tắc phát triển dsh-pet (dsh-pet-dev)

## Mục tiêu

Skill đầu vào duy nhất của kho mã này. Nó không lặp lại nội dung của bốn quy chuẩn; chỉ trả lời một điều: **yêu cầu lần này cần gọi những skill con nào và thực thi theo thứ tự nào**.

Bốn skill con là nội dung chuẩn tắc; tệp này là mục lục và bảng thứ tự. Nếu có mâu thuẫn, ưu tiên skill con.

## Bốn skill con

| Skill con | Khi nào bắt buộc gọi |
| --- | --- |
| `task-guardrails` | Bước đầu tiên của mọi yêu cầu, trước mọi lần gọi công cụ |
| `dsh-plugin-standards` | Khi cần sửa mã nguồn host/client, thêm hoặc xóa tệp, sửa API, bổ sung kiểm thử |
| `dsh-plugin-comment-spec` | Gọi cùng `dsh-plugin-standards`: viết mã thì phải viết chú thích |
| `git-commit` | Khi cần commit, viết hoặc viết lại thông điệp commit |

Cả bốn skill con đã được đăng ký; chuyển thẳng tên cho công cụ `skill`, không cần tìm hay đọc tệp. Chạy lệnh kiểm tra bắt buộc trong thư mục con `dsh-pet/`.

## Chuỗi thực thi

Thực hiện theo thứ tự, không bỏ bước và không gọi tất cả cùng lúc.

1. **Phân loại yêu cầu** (`task-guardrails`): hội thoại thuần túy / điều tra chỉ đọc / cần thay đổi. Nếu chưa rõ, chọn loại thận trọng hơn.
2. **Nói trước khi dùng công cụ**: nêu cách hiểu và dự định xem gì; thao tác chỉ đọc cũng phải nói trước.
3. **Dừng trước thao tác ghi**: nói rõ “sửa gì, đạt hiệu quả gì, xác minh thế nào”, sau đó dùng hộp thoại chờ phản hồi. Báo trước không đồng nghĩa được chấp thuận.
4. **Trước khi sửa mã, gọi đồng thời `dsh-plugin-standards` và `dsh-plugin-comment-spec`**: skill thứ nhất quy định loại plugin, quy mô tệp, vị trí thư mục, bề mặt export và vị trí kiểm thử; skill thứ hai quy định cấp độ phần đầu mô-đun, tóm tắt một dòng cho ký hiệu export và chỉ viết lý do (why). Viết mã luôn kèm chú thích, không tách thành hai bước.
5. **Cuối cùng chạy các kiểm tra bắt buộc** (trong `dsh-pet/`): `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run check:cycles`, `npm run check:runtime`, `npm run check:openapi`, `npm test`, `npm run build`. Không được nói “đã xác minh” nếu chưa chạy.
6. **Khi commit, gọi `git-commit`**: suy ra `type(scope)` từ diff thực tế; phần nội dung nêu cách triển khai, thay đổi hành vi và các tệp liên quan. Chỉ push khi có chỉ thị rõ ràng.

## Cách gọi

- Gọi theo nhu cầu, không gọi tất cả cùng lúc: hỏi đáp thuần túy thì không gọi skill nào; điều tra chỉ đọc chỉ gọi `task-guardrails`; sửa mã thì gọi cả `task-guardrails`, `dsh-plugin-standards`, `dsh-plugin-comment-spec`; commit thì gọi `git-commit`.
- Mỗi skill con chỉ cần gọi một lần trong một nhiệm vụ; không gọi lặp lại và không nhắc lại quy tắc dựa trên trí nhớ.
- Chỉ kích hoạt skill này khi người dùng nêu tên; AI gọi bốn skill con theo nhu cầu, người dùng cũng có thể nêu tên trực tiếp.

## Mâu thuẫn và mức ưu tiên

- **Ưu tiên ranh giới**: `task-guardrails` quyết định “có được phép làm không”, `dsh-plugin-standards` / `dsh-plugin-comment-spec` quyết định “viết thế nào”, `git-commit` quyết định “ghi nhận thế nào”. Khi quy chuẩn mâu thuẫn với ranh giới, trước hết phải tuân thủ ranh giới.
- **Khi quy chuẩn không khớp với mã, hãy báo cáo, không tự ý sửa**: nếu phát hiện nội dung quy chuẩn mâu thuẫn với hiện trạng kho mã, hãy giải thích trước rồi hỏi; không sửa quy chuẩn ngay.

## Nguyên tắc

1. Không tạo tác dụng phụ nếu chưa được cho phép rõ ràng: không ghi tệp, cài dependency hay thay đổi Git.
2. Không xem ví dụ là nhiệm vụ: khi người dùng mô tả vấn đề hoặc phàn nàn, hãy xác nhận cách hiểu trước khi hành động.
3. Xóa hẳn, không để lại: sau khi xác nhận không còn tham chiếu thì xóa; không giữ lớp tương thích, bản triển khai cũ hay mã bị chú thích vô hiệu hóa (trừ khi người dùng yêu cầu).
4. Mỗi sự thật chỉ ghi một lần: không sao chép phép tính định vị, hằng số hay kiểu; không đưa nội dung quy chuẩn vào tệp này.
5. Thông điệp commit phải dựa trên diff lần này, không chép nguyên văn ví dụ trong skill này.

