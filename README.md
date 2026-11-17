# Thiệp mời online — phong cách sổ tay doodle

Website thiệp mời một trang, tối ưu cho điện thoại, có phong bì mở thư, nhạc MP3 tự upload, nội dung cuộn dọc, đếm ngược, album ảnh và sổ lưu bút công khai (Supabase).

## 1. Cấu trúc thư mục

```text
thu-moi-sketchbook/
├── index.html
├── styles.css
├── config.js
├── script.js
├── supabase.sql
├── README.md
├── images/
│   ├── memory-01.svg
│   ├── memory-02.svg
│   └── memory-03.svg
└── music/
    └── (đặt file MP3 của bạn ở đây)
```

## 2. Chỉnh thông tin thiệp

Mở `config.js` và sửa các dòng:

- `pageTitle`, `heroLead`, `heroTitle`, `heroTail`: tiêu đề.
- `heroCopy`, `letterCopy`: lời mời.
- `eventDate`: ngày giờ theo định dạng ISO, ví dụ `2026-11-29T09:30:00+07:00`.
- `eventTime`, `eventVenue`, `eventAddress`, `mapUrl`: giờ, địa điểm và bản đồ.

Ngày đang điền trong mẫu là 29/11/2026, 09:30–10:30, THPT Cẩm Lý. Hãy đổi lại nếu sự kiện của bạn khác.

## 3. Thêm nhạc MP3 của bạn

1. Đổi tên file MP3 đơn giản, ví dụ `nhac-lofi.mp3`.
2. Đưa file vào thư mục `music/`.
3. Mở `config.js`, sửa:

```js
MUSIC_FILE: "music/nhac-lofi.mp3",
```

4. Lưu file và upload/commit lại lên GitHub.

Nhạc bắt đầu phát sau khi khách nhấn nút mở phong bì. Nếu chưa upload MP3, nút nhạc sẽ báo cần thêm file.

## 4. Thêm ảnh của bạn

1. Upload ảnh vào thư mục `images/`.
2. Mở `config.js` và sửa đường dẫn trong `gallery`, ví dụ:

```js
gallery: [
  { src: "images/anh-nhom-1.jpg", alt: "Ảnh cả nhóm" },
  { src: "images/anh-nhom-2.jpg", alt: "Buổi đi chơi" },
  { src: "images/anh-nhom-3.jpg", alt: "Kỷ niệm" }
],
```

Có thể giữ ảnh SVG minh họa mặc định hoặc thay bằng JPG/PNG/WebP.

## 5. Bật sổ lưu bút công khai bằng Supabase

GitHub Pages chỉ chạy website tĩnh, không tự lưu dữ liệu form. Sổ lưu bút cần Supabase.

1. Tạo project tại https://supabase.com/.
2. Trong project, mở **SQL Editor**.
3. Mở file `supabase.sql`, copy toàn bộ nội dung, dán vào SQL Editor và nhấn **Run**.
4. Vào phần **Project Settings → API Keys** (giao diện có thể hiển thị mục Connect/API Keys).
5. Copy **Project URL** và **Publishable key**.
6. Mở `config.js`, điền:

```js
SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
SUPABASE_PUBLISHABLE_KEY: "sb_publishable_xxxxxxxxx",
```

Dự án cũ có thể hiển thị `anon` key thay cho Publishable key; có thể dùng key `anon` công khai tương đương cho trường hợp này. Không bao giờ đưa `Secret key` hoặc `service_role` key vào website.

Bảng `guestbook_entries` cho phép khách đọc và thêm lời nhắn; không cấp quyền sửa/xóa. Tên và lời nhắn hiển thị công khai nên nhắc bạn bè không ghi thông tin riêng tư. SQL giới hạn tên tối đa 40 ký tự và lời nhắn tối đa 280 ký tự.

Nếu Supabase báo thiếu quyền Data API cho bảng, kiểm tra phần **API / Data API** để bảo đảm `guestbook_entries` được expose. Giữ RLS bật và chỉ cấp quyền SELECT/INSERT như trong SQL.

## 6. Upload lên GitHub Pages

1. Đăng nhập GitHub và tạo repository mới, ví dụ `loi-moi-ban-be`.
2. Chọn repository **Public** nếu dùng GitHub Free.
3. Giải nén gói ZIP trên máy tính.
4. Mở repository → **Add file → Upload files**.
5. Upload các file `index.html`, `styles.css`, `config.js`, `script.js`, `supabase.sql`, `README.md` vào thư mục gốc.
6. Mở thư mục `images` và upload đủ 3 file SVG. Tạo thư mục `music` rồi upload MP3 của bạn vào đó (có thể upload file nhạc cùng lúc với các file còn lại bằng cách kéo cả thư mục nếu trình duyệt hỗ trợ; nếu không, mở thư mục và upload riêng).
7. Nhấn **Commit changes**.
8. Mở **Settings → Pages**.
9. Ở **Build and deployment**, chọn **Deploy from a branch**.
10. Chọn branch `main`, folder `/(root)`, nhấn **Save**.
11. Đợi GitHub triển khai rồi mở đường link hiện ở trang Pages, thường có dạng `https://USERNAME.github.io/loi-moi-ban-be/`.

`index.html` phải nằm ngay thư mục gốc của nguồn xuất bản, không nằm sâu trong một thư mục con.

## 7. Kiểm tra trước khi gửi

- Mở link bằng cửa sổ ẩn danh và điện thoại.
- Bấm phong bì để mở; kiểm tra nhạc có phát sau thao tác này không.
- Vuốt hết trang, thử nút bản đồ.
- Điền thử lưu bút: sau khi gửi, dòng mới sẽ hiển thị trong danh sách.
- Nếu cập nhật file mà chưa thấy thay đổi, tải lại trang bằng Ctrl + F5 hoặc xóa cache.

## Lưu ý

- Nhạc cần được người dùng bật bằng thao tác mở thư vì trình duyệt thường chặn autoplay trước tương tác.
- Đây là website tĩnh; không có trang quản trị hay đăng nhập cho khách. Dữ liệu lưu bút công khai.
- Cooldown 15 giây ở trình duyệt chỉ hạn chế gửi liên tục thông thường, không phải chống spam tuyệt đối. Nếu trang được chia sẻ rộng, nên thêm CAPTCHA hoặc Edge Function/rate limit.
