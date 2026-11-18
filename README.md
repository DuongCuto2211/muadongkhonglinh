# Website thiệp mời online

Website tĩnh (HTML/CSS/JS thuần) — phong bì mở thư, thông tin sự kiện, album Polaroid, sổ lưu bút lưu thật trên Supabase, nhạc nền MP3.

## Cấu trúc
`index.html` · `styles.css` · `script.js` · `config.js` (mọi nội dung chỉnh ở đây) · `supabase.sql` · `images/` · `music/`

## 1. Tạo Supabase cho sổ lưu bút
1. Vào https://supabase.com → **New project**.
2. Mở **SQL Editor** → dán toàn bộ `supabase.sql` → **Run**.
3. Vào **Project Settings → API**, chép **Project URL** và **Publishable key** (`sb_publishable_...` hoặc anon key) dán vào `config.js`:
   ```js
   SUPABASE_URL: "https://xxxx.supabase.co",
   SUPABASE_PUBLISHABLE_KEY: "sb_publishable_...",
   ```
   **Tuyệt đối không** dùng Secret key / service_role key trong website.

## 2. Chỉnh nội dung
Sửa `config.js`: tiêu đề, lời mời, tên người gửi, ngày giờ, địa điểm, số điện thoại, ảnh, lời cảm ơn.

## 3. Thêm ảnh và nhạc
- Ảnh: bỏ file JPG vào `images/` (đang là ảnh mẫu `memory-01..03.jpg`, hãy ghi đè bằng ảnh thật cùng tên hoặc khai báo thêm trong `photos` ở `config.js`). Nên nén ảnh dưới ~500 KB.
- Nhạc: đặt `music/nhac-lofi.mp3`. Không có file thì web vẫn chạy bình thường.
- Tên file phân biệt chữ hoa/chữ thường trên GitHub Pages.

## 4. Đưa lên GitHub Pages
1. Tạo repository mới trên GitHub, upload toàn bộ nội dung thư mục này lên nhánh `main`.
2. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, thư mục `/ (root)` → Save.
3. Sau 1–2 phút, link có dạng `https://<tên-github>.github.io/<tên-repo>/` — gửi cho bạn bè.

## Bảo mật
- Khách chỉ có quyền đọc và thêm lời nhắn (RLS); không sửa/xóa được. Bạn xóa lời nhắn không phù hợp trong **Table Editor** của Supabase.
- Nội dung hiển thị bằng `textContent` (chống XSS). Giới hạn độ dài được kiểm tra cả ở web lẫn CSDL.
- Chống gửi liên tục ở phía trình duyệt (30 giây/lần, chỉnh trong `config.js`); đây chỉ là rào cản nhẹ, không chặn được người cố tình spam.

## Xử lý sự cố
- *"Chưa kết nối Supabase"*: chưa điền `config.js`.
- *"Gửi thất bại"*: chưa chạy `supabase.sql`, sai bảng/khóa — mở Console (F12) xem lỗi chi tiết.
- Nhạc không phát: kiểm tra đúng tên `music/nhac-lofi.mp3`, hoặc bấm nút nhạc ở góc phải.
