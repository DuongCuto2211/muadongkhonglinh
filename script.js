(() => {
  "use strict";

  const config = window.INVITE_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const byId = (id) => document.getElementById(id);

  const intro = byId("intro");
  const openButton = byId("openLetter");
  const pageContent = byId("top");
  const topbar = byId("topbar");
  const audio = byId("backgroundMusic");
  const musicToggle = byId("musicToggle");
  const musicLabel = byId("musicLabel");
  let supabaseClient = null;
  let isOpening = false;

  function applyConfig() {
    document.title = config.pageTitle || "Một cuộc hẹn nhỏ";
    const textMap = {
      heroLead: config.heroLead,
      heroTitle: config.heroTitle,
      heroTail: config.heroTail,
      heroCopy: config.heroCopy,
      letterCopy: config.letterCopy,
      eventTime: config.eventTime,
      eventVenue: config.eventVenue,
      eventAddress: config.eventAddress
    };
    Object.entries(textMap).forEach(([id, value]) => {
      if (value && byId(id)) byId(id).textContent = value;
    });

    const date = config.eventDate ? new Date(config.eventDate) : null;
    if (date && !Number.isNaN(date.getTime())) {
      byId("dateDay").textContent = new Intl.DateTimeFormat("vi-VN", { day: "2-digit" }).format(date);
      byId("dateMonth").textContent = new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(date).toLocaleUpperCase("vi-VN");
      byId("dateWeekday").textContent = new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(date);
    }
    const mapLink = byId("mapLink");
    if (config.mapUrl) mapLink.href = config.mapUrl;

    const photos = document.querySelectorAll(".photo-note img");
    (config.gallery || []).slice(0, photos.length).forEach((photo, index) => {
      if (photo.src) photos[index].src = photo.src;
      if (photo.alt) photos[index].alt = photo.alt;
    });

    if (config.MUSIC_FILE) {
      audio.src = config.MUSIC_FILE;
      musicToggle.disabled = false;
      musicLabel.textContent = "bật nhạc";
    } else {
      musicToggle.disabled = true;
      musicLabel.textContent = "thêm MP3 trong config.js";
      musicToggle.title = "Upload MP3 vào thư mục music và điền MUSIC_FILE trong config.js";
    }
  }

  async function toggleMusic() {
    if (!audio.src) return;
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-pressed", "true");
        musicLabel.textContent = "đang phát nhạc";
      } catch (error) {
        musicLabel.textContent = "không phát được nhạc";
        console.warn("Không thể phát file nhạc:", error);
      }
    } else {
      audio.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "bật nhạc";
    }
  }

  function openLetter() {
    if (isOpening) return;
    isOpening = true;
    intro.classList.add("is-opening");
    // Phát nhạc ngay từ tương tác mở thư để phù hợp quy tắc autoplay của trình duyệt.
    if (audio.src) {
      audio.play().then(() => {
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-pressed", "true");
        musicLabel.textContent = "đang phát nhạc";
      }).catch((error) => console.info("Trình duyệt chưa cho phát nhạc:", error));
    }
    window.setTimeout(() => {
      intro.classList.add("is-hidden");
      pageContent.hidden = false;
      topbar.classList.add("is-visible");
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, behavior: "instant" });
      startReveal();
    }, 850);
  }

  function startReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
    items.forEach((item) => observer.observe(item));
  }

  function startCountdown() {
    const target = new Date(config.eventDate || "");
    if (Number.isNaN(target.getTime())) return;
    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        ["days", "hours", "minutes", "seconds"].forEach((id) => byId(id).textContent = "00");
        byId("days").textContent = "00";
        return;
      }
      const values = {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      };
      Object.entries(values).forEach(([id, value]) => byId(id).textContent = String(value).padStart(2, "0"));
    };
    update();
    window.setInterval(update, 1000);
  }

  function setStatus(message, type = "") {
    const status = byId("formStatus");
    status.textContent = message;
    status.className = `form-status${type ? ` is-${type}` : ""}`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "vừa xong";
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  }

  function renderEntries(entries) {
    const list = byId("entriesList");
    const count = byId("entryCount");
    count.textContent = `${entries.length} lời nhắn`;
    if (!entries.length) {
      list.innerHTML = '<div class="empty-note">Chưa có lời nhắn nào.<br>Viết dòng đầu tiên đi bạn! ✎</div>';
      return;
    }
    list.replaceChildren();
    entries.forEach((entry) => {
      const article = document.createElement("article");
      article.className = "guest-entry";
      const name = document.createElement("div");
      name.className = "guest-entry-name";
      name.textContent = entry.name;
      const date = document.createElement("span");
      date.className = "guest-entry-date";
      date.textContent = formatDate(entry.created_at);
      const message = document.createElement("p");
      message.className = "guest-entry-message";
      message.textContent = entry.message;
      name.append(date);
      article.append(name, message);
      list.append(article);
    });
  }

  function connectGuestbook() {
    const url = (config.SUPABASE_URL || "").trim();
    const key = (config.SUPABASE_PUBLISHABLE_KEY || "").trim();
    if (!url || !key || !window.supabase?.createClient) {
      setStatus("Sổ lưu bút đang ở chế độ xem thử. Hãy cấu hình Supabase trong config.js để nhận lời nhắn công khai.");
      return;
    }
    try {
      supabaseClient = window.supabase.createClient(url, key);
      loadEntries();
    } catch (error) {
      console.error(error);
      setStatus("Chưa kết nối được sổ lưu bút. Kiểm tra lại cấu hình Supabase nhé.", "error");
    }
  }

  async function loadEntries() {
    if (!supabaseClient) return;
    const { data, error } = await supabaseClient
      .from(config.GUESTBOOK_TABLE || "guestbook_entries")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      console.error(error);
      setStatus("Không tải được lời nhắn. Bạn kiểm tra SQL và quyền truy cập Supabase nhé.", "error");
      return;
    }
    renderEntries(data || []);
    setStatus("Đã kết nối sổ lưu bút. Viết vài dòng cho cả hội nhé!", "success");
  }

  async function submitEntry(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = byId("guestName").value.trim();
    const message = byId("guestMessage").value.trim();
    const honeypot = byId("website").value;
    const button = form.querySelector("button[type='submit']");
    if (honeypot) return;
    if (!name || !message) {
      setStatus("Bạn nhập tên và lời nhắn trước nhé.", "error");
      return;
    }
    if (!supabaseClient) {
      setStatus("Chưa kết nối Supabase nên chưa thể lưu lời nhắn. Xem hướng dẫn trong README.md nhé.", "error");
      return;
    }
    const previousSubmit = Number(sessionStorage.getItem("guestbookLastSubmit") || 0);
    if (Date.now() - previousSubmit < 15000) {
      setStatus("Bạn chờ một chút rồi gửi tiếp nhé!", "error");
      return;
    }
    button.disabled = true;
    setStatus("Đang gửi lời nhắn…");
    const { error } = await supabaseClient.from(config.GUESTBOOK_TABLE || "guestbook_entries").insert({ name, message });
    button.disabled = false;
    if (error) {
      console.error(error);
      setStatus("Gửi chưa thành công. Kiểm tra kết nối rồi thử lại nhé.", "error");
      return;
    }
    sessionStorage.setItem("guestbookLastSubmit", String(Date.now()));
    form.reset();
    byId("charCount").textContent = "0/280";
    setStatus("Đã gửi rồi! Cảm ơn bạn để lại lời nhắn nha ♡", "success");
    await loadEntries();
  }

  applyConfig();
  startCountdown();
  connectGuestbook();
  openButton.addEventListener("click", openLetter);
  musicToggle.addEventListener("click", toggleMusic);
  byId("guestbookForm").addEventListener("submit", submitEntry);
  byId("guestMessage").addEventListener("input", (event) => {
    byId("charCount").textContent = `${event.target.value.length}/280`;
  });
  byId("backTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
