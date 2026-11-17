# Thư mời online – Sea Blue & Champagne Gold

Website thiệp mời tĩnh, viết bằng HTML5, CSS3 và JavaScript thuần. Có thể triển khai trực tiếp bằng **GitHub Pages**, không cần Node.js, npm hay backend riêng. Sổ lưu bút dùng Supabase Database thật, không lưu lời nhắn trong `localStorage`.

## 1. Cấu trúc thư mục

```text
thu-moi/
├── index.html
├── styles.css
├── script.js
├── config.js
├── supabase.sql
├── README.md
├── images/
│   └── README.txt
└── music/
    └── README.txt
```

Các file `memory-01.jpg`, `memory-02.jpg`, `memory-03.jpg` và `nhac-lofi.mp3` chưa được tạo vì cần dùng ảnh/nhạc thật của bạn. Website tự hiển thị placeholder ảnh và xử lý lỗi nhạc nếu các file này chưa tồn tại.

## 2. Chỉnh nội dung thiệp

Mở `config.js` và sửa các mục sau:

- `invitation.title`: tiêu đề lời mời.
- `invitation.body`: nội dung thư. Có thể dùng `\n\n` để xuống đoạn.
- `invitation.senderName`, `invitation.signature`: tên người gửi và chữ ký.
- `event.dateTime`: ngày giờ sự kiện theo ISO 8601, nên giữ múi giờ `+07:00` cho Việt Nam. Ví dụ `2026-11-29T09:30:00+07:00`; ngày hiển thị trên thiệp và bộ đếm ngược được lấy từ giá trị này.
- `event.time`, `event.location`, `event.contact`, `event.mapsQuery`: giờ, địa điểm, số liên hệ và từ khóa tìm trên Google Maps.
- `gallery`: mảng ảnh. Mỗi phần tử gồm `src`, `alt`, `caption`. Muốn thêm ảnh, thêm phần tử mới vào mảng này.
- `music.src`: đường dẫn tương đối tới file MP3.

Tất cả đường dẫn tài nguyên nội bộ dùng đường dẫn tương đối, phù hợp với GitHub Pages Project Site.

## 3. Đổi kiểu chữ (font)

Website hiện dùng 3 font: **Be Vietnam Pro** cho nội dung chính, **Playfair Display** cho phần chữ serif và **Caveat** cho các dòng viết tay. Cả bộ font được chọn để hiển thị tiếng Việt tốt. Nếu Google Fonts không truy cập được, trình duyệt tự chuyển sang các font dự phòng trong `styles.css`.

Để thay font, mở `styles.css`, tìm phần `:root` ở đầu file và sửa 3 biến sau:

```css
--serif: "Playfair Display", Georgia, "Times New Roman", serif;
--hand: "Caveat", "Segoe Print", "Comic Sans MS", cursive;
--sans: "Be Vietnam Pro", "Segoe UI", Arial, sans-serif;
```

- `--sans`: chữ nội dung, nút bấm và biểu mẫu.
- `--serif`: tiêu đề trang trọng, nội dung thư và thông tin sự kiện.
- `--hand`: tiêu đề viết tay, chữ ký và ghi chú trang trí.

Nếu dùng font Google khác, hãy thêm font đó vào đường dẫn Google Fonts trong phần `<head>` của `index.html`, rồi ghi đúng tên font vào biến CSS tương ứng. Sau khi thay font trên GitHub Pages, tải lại mạnh bằng `Ctrl + F5` (máy tính) hoặc xóa cache trang trên điện thoại để tránh xem CSS cũ.

## 4. Thêm ảnh và nhạc của bạn

### Album ảnh

Upload ảnh JPG/JPEG thật vào thư mục `images/`. Mặc định website chờ các file:

```text
images/memory-01.jpg
images/memory-02.jpg
images/memory-03.jpg
```

Nếu tên hoặc số lượng ảnh khác, sửa mảng `gallery` trong `config.js`. Không cần đổi đuôi file ảnh; hãy dùng đúng định dạng JPG/JPEG.

### Nhạc nền

Đặt file MP3 của bạn tại:

```text
music/nhac-lofi.mp3
```

Hoặc sửa `music.src` trong `config.js`. Nhạc chỉ được thử phát sau khi người xem nhấn **MỞ THƯ**. Trường hợp file chưa có hoặc trình duyệt từ chối phát, các phần còn lại của website vẫn hoạt động.

## 5. Tạo Supabase Database cho sổ lưu bút

1. Tạo project miễn phí tại [Supabase](https://supabase.com/).
2. Mở project, vào **SQL Editor**.
3. Mở file `supabase.sql` trong bộ source, sao chép toàn bộ nội dung và chạy.
4. Trong Supabase Dashboard, mở **Project Settings → API** (hoặc API Keys tùy giao diện).
5. Sao chép **Project URL** và **Publishable key**. Với project cũ, Supabase có thể hiển thị `anon` key legacy; key công khai này cũng được thiết kế để dùng ở frontend khi RLS được cấu hình đúng.
6. Mở `config.js` và điền:

```js
window.SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";
window.GUESTBOOK_TABLE = "guestbook_entries";
```

Ba biến này nằm ngay đầu file `config.js`; hãy thay giá trị mẫu bằng thông tin project của bạn. Phần cấu hình Supabase bên dưới đã tự đọc các biến này. Không dán `Secret key`, `service_role` key hoặc bất kỳ khóa bí mật nào vào website.

### Quyền truy cập và an toàn dữ liệu

- RLS được bật trên bảng `public.guestbook_entries`.
- Khách truy cập có thể `SELECT` lời nhắn và `INSERT` lời nhắn mới.
- Không tạo policy và không cấp quyền công khai `UPDATE` hoặc `DELETE`; quyền INSERT chỉ áp dụng cho hai cột `name`, `message`, không cho khách tự đặt `id` hoặc `created_at`.
- Tên được giới hạn 1–60 ký tự; lời nhắn 1–1.000 ký tự ở cả giao diện và database.
- Nội dung người dùng được hiển thị bằng `textContent`, không chèn HTML tùy ý.
- Frontend có cooldown 10 giây, kiểm tra thời gian điền form và trường honeypot để hạn chế spam cơ bản.

**Lưu ý chống spam:** cooldown và honeypot ở frontend có thể bị người có chủ ý vượt qua bằng cách gọi API trực tiếp. Với website công khai có lượng truy cập lớn, nên bổ sung CAPTCHA/Cloudflare Turnstile và một Edge Function hoặc lớp rate-limit phía server. Không thể thực thi giới hạn theo IP đáng tin cậy chỉ bằng JavaScript chạy trên trình duyệt.

## 6. Chạy thử trên máy

Bạn có thể mở `index.html` trực tiếp để xem giao diện, nhưng một số trình duyệt hạn chế tài nguyên khi dùng `file://`. Cách thử đáng tin cậy hơn là mở thư mục bằng tiện ích Live Server trong VS Code hoặc một máy chủ tĩnh bất kỳ. Không cần chạy lệnh build.

Khi chưa điền Supabase URL và Publishable Key, form lưu bút sẽ hiển thị thông báo chưa cấu hình và bị vô hiệu hóa. Đây là hành vi có chủ ý; website không giả lập việc lưu lời nhắn.

## 7. Triển khai miễn phí bằng GitHub Pages

1. Tạo một repository GitHub, ví dụ `thu-moi`.
2. Upload toàn bộ nội dung bên trong thư mục này lên **root** của repository (đảm bảo `index.html` nằm ngay ở root).
3. Kiểm tra `config.js`, các ảnh và MP3 đã được thêm trước khi public repository.
4. Trong repository, mở **Settings → Pages**.
5. Ở **Build and deployment**, chọn **Deploy from a branch**.
6. Chọn branch `main` và folder `/(root)`, sau đó nhấn **Save**.
7. Sau khi GitHub Pages hoàn tất, website sẽ có địa chỉ dạng:

   `https://TEN-TAI-KHOAN.github.io/thu-moi/`

8. Mở link trên điện thoại và máy tính để kiểm tra. Gửi link này cho bạn bè.

Mỗi lần thay nội dung, ảnh, nhạc hoặc mã nguồn, commit/push các thay đổi lên branch đã chọn. GitHub Pages sẽ tự cập nhật website.

## 7. Kiểm tra sau khi deploy

- Mở trang bằng HTTPS, nhấn **MỞ THƯ** và xác nhận nội dung thư xuất hiện.
- Nếu đã thêm MP3, kiểm tra nút nhạc có bật/tắt được.
- Kiểm tra ngày giờ đếm ngược và Google Maps.
- Upload ảnh JPG, tải lại trang và mở ảnh phóng to.
- Điền Supabase URL/Publishable Key, gửi một lời nhắn thử; mở trang trên thiết bị/trình duyệt khác để xác nhận lời nhắn được đọc từ Database.
- Tải lại trang và kiểm tra lời nhắn vẫn còn, mới nhất nằm trên đầu.
- Không đưa Secret/Service Role Key vào bất cứ file frontend nào.

## 8. Công nghệ

- HTML5, CSS3, JavaScript thuần.
- Supabase JavaScript SDK v2 được nạp từ CDN jsDelivr.
- Supabase Database + Row Level Security.
- GitHub Pages.

Website hỗ trợ responsive mobile-first, `prefers-reduced-motion`, animation nhẹ khi cuộn, album Polaroid có dialog phóng to và trạng thái lỗi rõ ràng cho các thành phần phụ thuộc tài nguyên bên ngoài.
