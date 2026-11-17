(() => {
  "use strict";

  const config = window.INVITATION_CONFIG || {};
  const byId = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setText(id, value) {
    const element = byId(id);
    if (element && value !== undefined && value !== null) element.textContent = String(value);
  }

  function formatPhoneForDisplay(phone) {
    const digits = String(phone || "").replace(/\D/g, "");
    if (digits.length === 10) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return String(phone || "");
  }

  function applyInvitationConfig() {
    const invitation = config.invitation || {};
    const event = config.event || {};
    setText("invitation-title", invitation.title || "Ê, có hẹn nhé!");
    setText("invitation-body", invitation.body || "Mình muốn rủ mọi người gặp nhau một hôm để cùng trò chuyện, vui chơi và lưu lại thêm vài kỷ niệm.\n\nSắp xếp thời gian đến nhé! Có mặt đông đủ thì mới vui.");
    setText("sender-name", invitation.senderName || "Người gửi lời mời");
    setText("sender-signature", invitation.signature || invitation.senderName || "Thân mến");
    setText("thanks-signature", `Thương mến, ${invitation.senderName || "bạn"}`);

    const contact = String(event.contact || "");
    const contactElement = byId("event-contact");
    if (contactElement) {
      contactElement.textContent = formatPhoneForDisplay(contact);
      const phoneDigits = contact.replace(/[^\d+]/g, "");
      contactElement.href = phoneDigits ? `tel:${phoneDigits}` : "#";
      if (!phoneDigits) contactElement.removeAttribute("href");
    }
    setText("event-time", event.time || "09:30 – 10:30");
    setText("event-location", event.location || "THPT Cẩm Lý");

    const mapsLink = byId("maps-link");
    if (mapsLink) {
      const query = event.mapsQuery || event.location || "THPT Cẩm Lý";
      mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }

    const music = config.music || {};
    const source = byId("music-source");
    if (source && music.src) source.src = music.src;
    const audio = byId("background-music");
    if (audio && source) audio.load();

    updateEventDate(event);
    buildGallery(Array.isArray(config.gallery) ? config.gallery : []);
  }

  function updateEventDate(event) {
    const target = new Date(event.dateTime || "2026-11-29T09:30:00+07:00");
    if (Number.isNaN(target.getTime())) {
      setText("event-day", "29");
      setText("event-month", "THÁNG 11");
      setText("event-year", "2026");
      setText("countdown-note", "Hẹn gặp bạn vào ngày đặc biệt nhé!");
      return;
    }

    const dateParts = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh"
    }).formatToParts(target);
    const part = (type) => dateParts.find((item) => item.type === type)?.value || "";
    setText("event-day", part("day"));
    setText("event-month", `THÁNG ${part("month")}`);
    setText("event-year", part("year"));

    const countdown = byId("countdown");
    const note = byId("countdown-note");
    const ids = ["count-days", "count-hours", "count-minutes", "count-seconds"];
    const pad = (value) => String(value).padStart(2, "0");

    const tick = () => {
      const remaining = target.getTime() - Date.now();
      if (remaining <= 0) {
        if (countdown) countdown.dataset.state = "finished";
        ids.forEach((id) => setText(id, "00"));
        if (note) note.textContent = "Đến giờ gặp nhau rồi! Chúc mọi người có một ngày thật vui ♡";
        return false;
      }
      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setText("count-days", pad(days));
      setText("count-hours", pad(hours));
      setText("count-minutes", pad(minutes));
      setText("count-seconds", pad(seconds));
      return true;
    };

    if (tick()) {
      const timer = window.setInterval(() => {
        if (!tick()) window.clearInterval(timer);
      }, 1000);
    }
  }

  function buildGallery(photos) {
    const grid = byId("photo-grid");
    if (!grid) return;
    grid.replaceChildren();

    if (photos.length === 0) {
      const empty = document.createElement("p");
      empty.className = "entries-empty";
      empty.textContent = "Chưa có ảnh trong album. Thêm ảnh trong mảng gallery ở config.js nhé.";
      grid.append(empty);
      return;
    }

    const tiltClasses = ["polaroid-one", "polaroid-two", "polaroid-three"];
    const tapeClasses = ["washi-blue", "washi-gold", "washi-teal"];

    photos.forEach((photo, index) => {
      const imageConfig = typeof photo === "string" ? { src: photo } : photo;
      const src = String(imageConfig.src || "");
      const alt = String(imageConfig.alt || `Ảnh kỷ niệm ${index + 1}`);
      const caption = String(imageConfig.caption || "Một kỷ niệm đẹp ♡");

      const button = document.createElement("button");
      button.type = "button";
      button.className = `polaroid ${tiltClasses[index % tiltClasses.length]} reveal is-pending`;
      button.dataset.photoIndex = String(index);
      button.disabled = true;
      button.setAttribute("aria-label", `${alt} (chưa tải được ảnh)`);

      const tape = document.createElement("span");
      tape.className = `washi ${tapeClasses[index % tapeClasses.length]}`;
      tape.setAttribute("aria-hidden", "true");

      const frame = document.createElement("span");
      frame.className = "photo-frame";
      const image = document.createElement("img");
      image.src = src;
      image.alt = alt;
      image.loading = "lazy";

      const placeholder = document.createElement("span");
      placeholder.className = "photo-placeholder";
      const symbol = document.createElement("span");
      symbol.textContent = ["✦", "✧", "❧"][index % 3];
      const placeholderTitle = document.createElement("b");
      placeholderTitle.textContent = "YOUR MEMORY";
      const placeholderName = document.createElement("small");
      placeholderName.textContent = src ? src.split("/").pop() : "Thêm ảnh trong config.js";
      placeholder.append(symbol, placeholderTitle, placeholderName);
      frame.append(image, placeholder);

      const captionElement = document.createElement("span");
      captionElement.className = "photo-caption handwritten";
      captionElement.textContent = caption;
      button.append(tape, frame, captionElement);
      grid.append(button);

      image.addEventListener("load", () => {
        image.classList.add("is-loaded");
        placeholder.hidden = true;
        button.disabled = false;
        button.setAttribute("aria-label", `Mở ${alt}`);
      }, { once: true });
      image.addEventListener("error", () => {
        image.classList.remove("is-loaded");
        placeholder.hidden = false;
        button.disabled = true;
      }, { once: true });

      button.addEventListener("click", () => openPhoto(image, caption, alt));
    });
  }

  function openPhoto(image, caption, alt) {
    if (!image || !image.classList.contains("is-loaded")) return;
    const dialog = byId("photo-dialog");
    const dialogImage = byId("dialog-image");
    const dialogCaption = byId("dialog-caption");
    if (!dialog || !dialogImage || !dialogCaption) return;
    dialogImage.src = image.currentSrc || image.src;
    dialogImage.alt = alt;
    dialogCaption.textContent = caption;
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function setupEnvelope() {
    const openButton = byId("open-invitation");
    const envelope = byId("envelope");
    const intro = byId("intro");
    const main = byId("site-content");
    const musicToggle = byId("music-toggle");
    if (!openButton || !envelope || !intro || !main) return;

    openButton.addEventListener("click", () => {
      if (openButton.disabled) return;
      openButton.disabled = true;
      envelope.classList.add("is-open");
      intro.classList.add("is-opening");
      if (musicToggle) musicToggle.hidden = false;
      startMusic();

      const transitionDelay = reduceMotion ? 50 : 1050;
      window.setTimeout(() => {
        main.inert = false;
        main.setAttribute("aria-hidden", "false");
        document.body.classList.remove("is-locked");
        intro.classList.add("is-hidden");
        window.setTimeout(() => {
          intro.hidden = true;
          const letter = byId("letter");
          if (letter) letter.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
          const heading = byId("invitation-title");
          if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
          }
        }, reduceMotion ? 0 : 500);
      }, transitionDelay);
    });
  }

  let musicUnavailable = false;
  function setMusicButtonState(isPlaying, unavailable = false) {
    const button = byId("music-toggle");
    if (!button) return;
    button.classList.toggle("is-playing", Boolean(isPlaying));
    if (unavailable) {
      button.disabled = true;
      button.title = "Chưa phát được nhạc. Kiểm tra file music/nhac-lofi.mp3 nhé.";
      button.setAttribute("aria-label", "Không phát được nhạc nền");
    } else {
      button.disabled = false;
      button.title = isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền";
      button.setAttribute("aria-label", isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền");
    }
  }

  function startMusic() {
    const audio = byId("background-music");
    if (!audio || musicUnavailable) return;
    const attempt = audio.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => setMusicButtonState(true)).catch(() => {
        musicUnavailable = true;
        setMusicButtonState(false, true);
      });
    }
  }

  function setupMusic() {
    const audio = byId("background-music");
    const button = byId("music-toggle");
    if (!audio || !button) return;
    audio.addEventListener("playing", () => setMusicButtonState(true));
    audio.addEventListener("pause", () => setMusicButtonState(false));
    audio.addEventListener("error", () => {
      musicUnavailable = true;
      setMusicButtonState(false, true);
    });
    button.addEventListener("click", () => {
      if (musicUnavailable) return;
      if (audio.paused) startMusic();
      else audio.pause();
    });
  }

  function setupRevealAnimations() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    observeReveals(document);
  }

  function observeReveals(root) {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const items = root.querySelectorAll(".reveal:not(.is-visible)");
    if (!items.length) return;
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-pending");
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    items.forEach((item) => {
      item.classList.add("is-pending");
      observer.observe(item);
    });
  }

  function setGuestbookStatus(message, type = "") {
    const status = byId("guestbook-status");
    if (!status) return;
    status.textContent = message;
    status.classList.remove("is-error", "is-success");
    if (type) status.classList.add(`is-${type}`);
  }

  function setGuestbookUnavailable(message) {
    const form = byId("guestbook-form");
    const list = byId("guestbook-list");
    const submit = byId("guestbook-submit");
    if (form) {
      form.querySelectorAll("input, textarea, button[type='submit']").forEach((element) => { element.disabled = true; });
    }
    if (submit) submit.disabled = true;
    setGuestbookStatus(message, "error");
    if (list) {
      list.replaceChildren();
      const note = document.createElement("div");
      note.className = "entries-error";
      note.textContent = "Sổ lưu bút chưa kết nối. Các lời nhắn sẽ xuất hiện ở đây sau khi cấu hình Supabase.";
      list.append(note);
      list.setAttribute("aria-busy", "false");
    }
  }

  function isSupabaseConfigReady(supabaseConfig) {
    if (!supabaseConfig) return false;
    const url = String(supabaseConfig.url || "");
    const key = String(supabaseConfig.publishableKey || "");
    return /^https:\/\//i.test(url) && !url.includes("YOUR_PROJECT_REF") && key.length > 20 && !key.includes("YOUR_SUPABASE_PUBLISHABLE_KEY") && Boolean(supabaseConfig.tableName);
  }

  function formatEntryDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Vừa gửi";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh"
    }).format(date);
  }

  function createGuestEntry(entry) {
    const article = document.createElement("article");
    article.className = "guest-entry";

    const header = document.createElement("div");
    header.className = "guest-entry-head";
    const name = document.createElement("strong");
    name.className = "guest-entry-name";
    name.textContent = String(entry.name || "Bạn bè");
    const date = document.createElement("time");
    date.className = "guest-entry-date";
    date.dateTime = String(entry.created_at || "");
    date.textContent = formatEntryDate(entry.created_at);
    header.append(name, date);

    const message = document.createElement("p");
    message.className = "guest-entry-message";
    // Không dùng innerHTML: dữ liệu do khách nhập luôn được đưa vào textContent.
    message.textContent = String(entry.message || "");
    article.append(header, message);
    return article;
  }

  function renderGuestEntries(entries) {
    const list = byId("guestbook-list");
    if (!list) return;
    list.replaceChildren();
    const validEntries = Array.isArray(entries) ? entries : [];
    setText("entry-count", String(validEntries.length));

    if (validEntries.length === 0) {
      const empty = document.createElement("div");
      empty.className = "entries-empty";
      empty.textContent = "Chưa có lời nhắn nào. Viết lời đầu tiên nhé! ♡";
      list.append(empty);
    } else {
      validEntries.forEach((entry) => list.append(createGuestEntry(entry)));
    }
    list.setAttribute("aria-busy", "false");
  }

  async function setupGuestbook() {
    const supabaseConfig = config.supabase || {};
    if (!isSupabaseConfigReady(supabaseConfig)) {
      setGuestbookUnavailable("Chưa cấu hình Supabase. Mở config.js và điền Project URL cùng Publishable Key để bật sổ lưu bút.");
      return;
    }
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      setGuestbookUnavailable("Không tải được Supabase SDK. Kiểm tra kết nối mạng rồi tải lại trang nhé.");
      return;
    }

    let client;
    try {
      client = window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey);
    } catch (error) {
      setGuestbookUnavailable("Không thể khởi tạo kết nối Supabase. Kiểm tra lại thông tin trong config.js.");
      return;
    }

    const tableName = String(supabaseConfig.tableName || "guestbook_entries");
    const list = byId("guestbook-list");
    const form = byId("guestbook-form");
    const submitButton = byId("guestbook-submit");
    const messageInput = byId("guest-message");
    const nameInput = byId("guest-name");
    const counter = byId("message-count");
    const honeypot = byId("guest-website");
    let lastSubmitAttempt = 0;
    let isSending = false;

    if (messageInput && counter) {
      const updateCount = () => { counter.textContent = `${messageInput.value.length} / 1000`; };
      messageInput.addEventListener("input", updateCount);
      updateCount();
    }

    async function fetchEntries() {
      if (list) list.setAttribute("aria-busy", "true");
      const { data, error } = await client
        .from(tableName)
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        if (list) {
          list.replaceChildren();
          const failure = document.createElement("div");
          failure.className = "entries-error";
          failure.textContent = "Chưa tải được lời nhắn. Kiểm tra bảng và policy trong Supabase rồi thử tải lại trang.";
          list.append(failure);
          list.setAttribute("aria-busy", "false");
        }
        setGuestbookStatus("Không đọc được sổ lưu bút. Bạn kiểm tra file supabase.sql và quyền RLS nhé.", "error");
        return false;
      }
      renderGuestEntries(data || []);
      setGuestbookStatus("Sổ lưu bút đã kết nối. Để lại vài dòng cho mọi người nhé!", "success");
      return true;
    }

    await fetchEntries();

    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isSending) return;

      if (honeypot && honeypot.value.trim()) {
        setGuestbookStatus("Không thể gửi lời nhắn này.", "error");
        return;
      }

      const name = (nameInput?.value || "").trim();
      const message = (messageInput?.value || "").trim();
      if (!name || !message) {
        setGuestbookStatus("Bạn điền tên và lời nhắn trước nhé.", "error");
        (!name ? nameInput : messageInput)?.focus();
        return;
      }
      if (name.length > 60 || message.length > 1000) {
        setGuestbookStatus("Tên tối đa 60 ký tự và lời nhắn tối đa 1.000 ký tự nhé.", "error");
        return;
      }
      if (Date.now() - performance.timeOrigin < 2500) {
        setGuestbookStatus("Đọc lại lời nhắn một chút rồi gửi nhé.", "error");
        return;
      }
      const now = Date.now();
      const remaining = 10000 - (now - lastSubmitAttempt);
      if (remaining > 0) {
        setGuestbookStatus(`Bạn chờ thêm ${Math.ceil(remaining / 1000)} giây rồi gửi lời nhắn tiếp nhé.`, "error");
        return;
      }

      lastSubmitAttempt = now;
      isSending = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.querySelector("span:first-child").textContent = "ĐANG GỬI...";
      }
      setGuestbookStatus("Đang gửi lời nhắn của bạn...", "");

      try {
        const { data, error } = await client
          .from(tableName)
          .insert({ name, message })
          .select("id, name, message, created_at")
          .single();

        if (error) throw error;

        if (data) {
          const current = Array.from(list?.querySelectorAll(".guest-entry") || []).length;
          // Lời nhắn vừa được lưu thành công từ Supabase, đưa lên đầu danh sách.
          if (list) {
            const empty = list.querySelector(".entries-empty");
            const failure = list.querySelector(".entries-error");
            if (empty) empty.remove();
            if (failure) failure.remove();
            list.prepend(createGuestEntry(data));
            const entries = list.querySelectorAll(".guest-entry");
            if (entries.length > 100) entries[entries.length - 1].remove();
            setText("entry-count", String(Math.min(current + 1, 100)));
            list.setAttribute("aria-busy", "false");
          }
        } else {
          await fetchEntries();
        }

        form.reset();
        if (counter) counter.textContent = "0 / 1000";
        setGuestbookStatus("Đã gửi lời nhắn rồi! Cảm ơn bạn nhiều nha ♡", "success");
      } catch (error) {
        setGuestbookStatus("Gửi chưa thành công. Bạn kiểm tra kết nối mạng rồi thử lại nhé.", "error");
      } finally {
        isSending = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.querySelector("span:first-child").textContent = "GỬI LỜI NHẮN";
        }
      }
    });
  }

  function setupPhotoDialog() {
    const dialog = byId("photo-dialog");
    const close = dialog?.querySelector(".dialog-close");
    if (!dialog || !close) return;
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  function init() {
    document.documentElement.classList.add("js");
    applyInvitationConfig();
    setupEnvelope();
    setupMusic();
    setupRevealAnimations();
    setupPhotoDialog();
    setupGuestbook();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
