/*
  CHỈNH THÔNG TIN THIỆP Ở FILE NÀY.
  - Bạn có thể thay tên sự kiện, ngày giờ, địa điểm và lời mời.
  - Muốn dùng nhạc MP3: upload file vào thư mục music rồi điền đúng đường dẫn MUSIC_FILE.
  - Supabase: điền Project URL và Publishable key sau khi tạo project.
*/
window.INVITE_CONFIG = {
  // Nội dung thiệp
  pageTitle: "Một cuộc hẹn nhỏ",
  heroLead: "Mình có",
  heroTitle: "một cuộc hẹn",
  heroTail: "muốn rủ bạn",
  heroCopy: "Không cần dịp gì to tát, chỉ là muốn gặp nhau một hôm, kể vài chuyện linh tinh và cười thật nhiều.",
  letterCopy: "Dạo này mỗi đứa một lịch trình, chắc cũng lâu rồi tụi mình chưa có một buổi gặp mặt cho ra trò. Mình muốn rủ bạn dành chút thời gian để gặp nhau, ăn uống, tám chuyện trên trời dưới đất và chụp thêm vài tấm hình làm kỷ niệm.",

  // Thông tin sự kiện — chỉnh theo sự kiện thực tế
  eventDate: "2026-11-29T09:30:00+07:00",
  eventTime: "09:30 – 10:30",
  eventVenue: "THPT Cẩm Lý",
  eventAddress: "mình gặp nhau tại đây nhé",
  mapUrl: "https://maps.google.com/?q=THPT+Cẩm+Lý",

  // Album ảnh: upload ảnh vào thư mục images, sau đó sửa đường dẫn tại đây.
  gallery: [
    { src: "images/memory-01.svg", alt: "Khung ảnh kỷ niệm số 1" },
    { src: "images/memory-02.svg", alt: "Khung ảnh kỷ niệm số 2" },
    { src: "images/memory-03.svg", alt: "Khung ảnh kỷ niệm số 3" }
  ],

  // Nhạc MP3: ví dụ "music/nhac-lofi.mp3". Để trống nếu chưa upload.
  MUSIC_FILE: "",

  // Supabase: chỉ dùng Publishable key (hoặc anon key cũ), KHÔNG dùng Secret/Service Role key.
  SUPABASE_URL: "",
  SUPABASE_PUBLISHABLE_KEY: "",
  GUESTBOOK_TABLE: "guestbook_entries"
};
