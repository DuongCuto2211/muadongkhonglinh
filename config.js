/* ===== CẤU HÌNH — chỉnh mọi thông tin tại đây ===== */
window.APP_CONFIG = {
  // Supabase: Project Settings → API. Chỉ dùng Project URL + Publishable (anon) key. KHÔNG dùng Secret / Service Role key.
  SUPABASE_URL: "",              // ví dụ: "https://abcdxyz.supabase.co"
  SUPABASE_PUBLISHABLE_KEY: "",  // ví dụ: "sb_publishable_..."
  GUESTBOOK_TABLE: "guestbook_entries",

  pageTitle: "Thư mời — Ê, có hẹn nhé!",
  introHint: "Có một lời mời dành cho bạn...",

  invitation: {
    title: "Ê, có hẹn nhé!",
    body: "Không biết dạo này mọi người thế nào rồi nhỉ? Mình muốn rủ cả nhóm gặp nhau một hôm để cùng trò chuyện, vui chơi và lưu lại thêm vài kỷ niệm.\n\nSắp xếp thời gian đến nhé! Có mặt đông đủ thì mới vui.",
    sender: "Tên người gửi"       // hiển thị như chữ ký viết tay
  },

  event: {
    dateISO: "2026-11-29",         // định dạng YYYY-MM-DD
    start: "09:30",
    end: "10:30",
    place: "THPT Cẩm Lý",
    mapQuery: "THPT Cẩm Lý",       // từ khóa tìm trên Google Maps
    phone: "0971460102",
    note: "Nhớ đến đúng giờ nhé!"
  },

  music: { src: "music/nhac-lofi.mp3", volume: 0.5 },

  // Thêm/bớt ảnh: upload JPG vào thư mục images rồi khai báo ở đây
  photos: [
    { src: "images/memory-01.jpg", caption: "Ngày xưa ấy" },
    { src: "images/memory-02.jpg", caption: "Cả nhóm" },
    { src: "images/memory-03.jpg", caption: "Nhớ lắm" }
  ],

  guestbook: { maxName: 40, maxMessage: 300, cooldownSeconds: 30, limit: 100 },

  thanks: {
    title: "Cảm ơn vì đã ghé qua!",
    lines: ["Mong rằng chúng ta sẽ có thêm thật nhiều kỷ niệm đẹp cùng nhau.", "Hẹn gặp mọi người nhé!"],
    handwriting: "Hẹn gặp lại!"
  }
};
