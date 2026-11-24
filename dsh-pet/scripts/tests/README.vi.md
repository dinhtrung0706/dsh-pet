# Kiểm thử hồi quy trên trình duyệt cho trang cài đặt

Chạy trong thư mục gói `dsh-pet/`:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
npm run test:ui
```

Nếu Linux CI thiếu thư viện hệ thống, dùng `pnpm exec playwright install --with-deps chromium`.

Kiểm thử dùng React và Chromium thực để hiển thị trang cài đặt, chặn các API cấu hình và mô hình, rồi xác minh việc tải, thử lại sau khi lỗi, khôi phục mặc định và lưu, cũng như bố cục cửa sổ hẹp bằng tiếng Trung và tiếng Anh. Kiểm thử chỉ truy cập dịch vụ cục bộ tạm thời, không đọc hoặc sửa cấu hình DSH của người dùng. Chạy riêng với kiểm thử đơn vị Node trong `npm test`; việc cài plugin thông thường không tải trình duyệt.

Có thể đặt `DSH_PET_UI_ARTIFACTS` thành thư mục đầu ra để lưu ảnh chụp bố cục. Cửa sổ Electron desktop, khả năng xuyên nhấp của hệ điều hành và tỷ lệ thu phóng màn hình vẫn cần được kiểm thử riêng trong môi trường chạy thực tế.
