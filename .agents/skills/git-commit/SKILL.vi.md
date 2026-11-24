---
name: git-commit
description: "Tạo thông điệp commit Git tiếng Trung theo cấu trúc type(scope): subject dựa trên thay đổi mã lần này, để dễ truy vết và tự động sinh nhật ký thay đổi. Dùng khi người dùng yêu cầu “tạo/tóm tắt/chuẩn hóa thông điệp commit”."
whenToUse: "Khi người dùng yêu cầu tạo thông điệp commit dựa trên thay đổi mã lần này; yêu cầu viết commit tiếng Trung theo cấu trúc đã nêu; hoặc yêu cầu chuẩn hóa/viết lại một thông điệp commit để có thể truy vết."
metadata:
  language: "vi"
  category: "development"
disable-model-invocation: false
user-invocable: true
---

# Quy chuẩn commit Git có cấu trúc (Technical Commit Convention)

## Mục tiêu

Cung cấp cho mọi dự án một quy chuẩn thông điệp commit Git thống nhất, có cấu trúc và có thể truy vết về mặt kỹ thuật; giúp mỗi commit nêu rõ thay đổi ở tầng mã (mô-đun, thuật toán, cấu hình, dependency, v.v.), đồng thời dễ đọc với nhà phát triển và thuận tiện tự động sinh nhật ký thay đổi.

## Quan điểm cốt lõi

- Có thể truy vết kỹ thuật: mỗi commit nêu rõ thay đổi ở tầng mã, gồm mô-đun, thuật toán, cấu hình, dependency, v.v.
- Hướng đến nhà phát triển: thông điệp commit dễ đọc nhưng trọng tâm là mô tả kỹ thuật, tránh diễn đạt mơ hồ.
- Có cấu trúc: dùng các nhãn nhẹ (type, scope, subject, chi tiết kỹ thuật) để thuận tiện tự động phân tích và sinh nhật ký thay đổi.

## Đầu vào và đầu ra

- Đầu vào: danh sách tệp đã thay đổi hoặc mô tả thay đổi lần này (người dùng cung cấp hoặc suy ra từ mã).
- Đầu ra: thông điệp commit dạng văn bản thuần, có thể dùng trực tiếp với `git commit -m`.

## Định nghĩa định dạng

```
<type>(<scope>): <subject>

<technical body>  (必填，至少一条技术描述)

[optional footer]
```

### 1. Type (loại, ngữ nghĩa kỹ thuật, bắt buộc)

| Type    | Ý nghĩa                  | Tình huống ví dụ                         |
|---------|--------------------------|------------------------------------------|
| feat    | Thêm tính năng/trang/component | Thêm chức năng tìm kiếm, thêm quy trình đăng nhập |
| fix     | Sửa lỗi mã hoặc nội dung | Sửa lỗ hổng XSS, sửa lỗi đếm phân trang |
| perf    | Tối ưu hiệu năng         | Tải ảnh lazy, chiến lược cache, tách bundle |
| refactor| Tái cấu trúc mã (không đổi chức năng) | Viết lại cách triển khai mô-đun, thống nhất tầng request |
| style   | Thay đổi UI/phong cách   | Sửa màu chủ đề, điều chỉnh breakpoint responsive |
| docs    | Cập nhật nội dung tài liệu | Thêm/sửa README, chú thích, tài liệu API |
| chore   | Thay đổi build/dependency/cấu hình | Nâng cấp dependency, sửa cấu hình build, điều chỉnh CI |
| revert  | Hoàn tác thay đổi kỹ thuật | Hoàn tác phương án do vấn đề tương thích |

### 2. Scope (phạm vi, bắt buộc)

Dùng một từ để chỉ mô-đun kỹ thuật bị ảnh hưởng, ví dụ: `template`, `router`, `api`, `auth`, `ui`, `style`, `config`, `deploy`, `docs`, `analytics`, `test`, `script`, v.v. Nếu không thể xếp vào một mô-đun duy nhất, có thể bỏ `(<scope>)`.

### 3. Subject (chủ đề, mô tả kỹ thuật ngắn gọn, bắt buộc)

Viết bằng tiếng Trung, dài 10~20 ký tự, mô tả trực tiếp thay đổi kỹ thuật đã thực hiện, ví dụ:

- 重构分页逻辑，改用游标分页
- 升级 marked 库并修复 XSS 隐患
- 添加 webp 支持并实现降级方案

### 4. Technical Body (nội dung kỹ thuật, bắt buộc)

Phải có ít nhất một mô tả kỹ thuật cụ thể; có thể dùng danh sách khi có nhiều mục. Nội dung bao gồm nhưng không giới hạn ở:

- Cách triển khai: đã dùng API, thuật toán, cấu trúc dữ liệu hoặc mẫu thiết kế nào.
- So sánh trước và sau thay đổi: thay đổi trong logic mã quan trọng.
- Chỉ số hiệu năng: thời gian tải, kích thước gói trước và sau tối ưu, v.v.
- Thay đổi dependency: đã thêm/nâng cấp gói dependency nào và phiên bản.
- Điều chỉnh cấu hình: thay đổi cấu hình build, lint, kiểm thử, v.v.
- Nguyên nhân gốc của bug: lý do phát sinh lỗi và nguyên lý sửa chữa.

Định dạng ví dụ:

```
- 技术实现：
  - 将分页参数 from offset 改为 after timestamp，基于 createTime 索引查询，减少大偏移量下的慢查询。
  - 前端修改 API 调用方式：`GET /items?after=xxx&limit=10`。
- 性能影响：接口延迟从 320ms 降至 210ms（压测结果）。
- 涉及文件：`routes/items.js`, `src/api.ts`
```

### 5. Footer (chân thông điệp, tùy chọn)

- `Breaking change:` mô tả thay đổi không tương thích.
- `Closes #issue` liên kết nhiệm vụ hoặc vấn đề.
- `See also` liên kết tài liệu liên quan.

## Quy trình làm việc

1. Khi người dùng yêu cầu “tạo thông điệp commit dựa trên thay đổi mã lần này”, chủ động hỏi danh sách tệp hoặc mô tả thay đổi; nếu người dùng chưa cung cấp, suy luận dựa trên phần mở rộng tệp và mẫu thường gặp (ví dụ thay đổi `.scss` thì viết chi tiết về style, `.js/.ts` thì viết chi tiết về logic), đồng thời nhắc người dùng bổ sung thông tin.
2. Xác định loại thay đổi chính, chọn `type` và `scope`.
3. Viết `subject` tiếng Trung (10~20 ký tự), rồi bổ sung ít nhất một dòng nội dung kỹ thuật.
4. Thêm footer khi cần.
5. Xuất văn bản thuần, có thể dùng trực tiếp cho `git commit -m`.

## Nguyên tắc

- Thông điệp commit được tạo **bắt buộc** phải có ít nhất một mô tả kỹ thuật, không được chỉ ghi nội dung mơ hồ như “đã cập nhật style”.
- Nếu thông tin người dùng cung cấp không đủ để nêu rõ chi tiết kỹ thuật, hãy suy luận theo mẫu thường gặp và nhắc người dùng sau kết quả rằng có thể bổ sung khi cần.
- Giữ đầu ra có cấu trúc, có thể truy vết và dễ đọc với nhà phát triển.

