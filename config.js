/*
 * CẤU HÌNH THIỆP MỜI
 * Chỉ sửa các giá trị trong object bên dưới. Không đặt Secret Key / Service Role Key ở đây.
 */
window.SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";
window.GUESTBOOK_TABLE = "guestbook_entries";

window.INVITATION_CONFIG = Object.freeze({
  invitation: {
    title: "Ê, có hẹn nhé!",
    body: "Không biết dạo này mọi người thế nào rồi nhỉ? Mình muốn rủ cả nhóm gặp nhau một hôm để cùng trò chuyện, vui chơi và lưu lại thêm vài kỷ niệm.\n\nSắp xếp thời gian đến nhé! Có mặt đông đủ thì mới vui.",
    senderName: "Hải Dương",
    signature: "Hải Dương"
  },
  event: {
    // Dùng ISO 8601 có múi giờ Việt Nam (+07:00) để đồng hồ đếm ngược chính xác.
    dateTime: "2026-11-29T09:30:00+07:00",
    time: "09:30 – 10:30",
    location: "THPT Cẩm Lý",
    contact: "0971460102",
    // Có thể đổi thành địa chỉ hoặc tên địa điểm cụ thể để Google Maps tìm chính xác hơn.
    mapsQuery: "THPT Cẩm Lý, Bắc Giang, Việt Nam"
  },
  gallery: [
    { src: "images/memory-01.jpg", alt: "Ảnh kỷ niệm 1", caption: "Một ngày thật xanh ♡" },
    { src: "images/memory-02.jpg", alt: "Ảnh kỷ niệm 2", caption: "Cười một chút nhé!" },
    { src: "images/memory-03.jpg", alt: "Ảnh kỷ niệm 3", caption: "Lưu lại thanh xuân" }
  ],
  music: {
    src: "music/nhac-lofi.mp3"
  },
  supabase: {
    url: window.SUPABASE_URL,
    publishableKey: window.SUPABASE_PUBLISHABLE_KEY,
    tableName: window.GUESTBOOK_TABLE
  }
});
