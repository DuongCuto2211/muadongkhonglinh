(() => {
'use strict';
const C = window.APP_CONFIG || {};
const $ = s => document.querySelector(s);
const mk = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

let tt;
function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => e.classList.remove('show'), 3200); }

/* ---------- Nội dung từ config.js ---------- */
const inv = C.invitation || {}, ev = C.event || {}, th = C.thanks || {};
document.title = C.pageTitle || document.title;
$('#introHint').textContent = C.introHint || '';
$('#invTitle').textContent = inv.title || '';
(inv.body || '').split(/\n\s*\n/).forEach(p => $('#invBody').append(mk('p', '', p.trim())));
$('#invSign').textContent = inv.sender || '';

const [y, m, d] = (ev.dateISO || '2026-11-29').split('-').map(Number);
$('#evDay').textContent = String(d).padStart(2, '0');
$('#evMonth').textContent = 'Tháng ' + m + ', ' + y;
$('#evWeek').textContent = new Date(y, m - 1, d).toLocaleDateString('vi-VN', { weekday: 'long' });
$('#evTime').textContent = (ev.start || '') + (ev.end ? ' – ' + ev.end : '');
$('#evPlace').textContent = ev.place || '';
const tel = $('#evPhone'); tel.textContent = ev.phone || ''; tel.href = 'tel:' + String(ev.phone || '').replace(/[^\d+]/g, '');
$('#evNote').textContent = ev.note || '';
$('#mapBtn').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.mapQuery || ev.place || '');
$('#thTitle').textContent = th.title || '';
(th.lines || []).forEach(l => $('#thLines').append(mk('p', '', l)));
$('#thHand').textContent = th.handwriting || '';

/* ---------- Đồng hồ đếm ngược ---------- */
const target = new Date((ev.dateISO || '2026-11-29') + 'T' + (ev.start || '00:00') + ':00+07:00').getTime();
const pad = n => String(n).padStart(2, '0');
function tick() {
  const t = target - Date.now();
  if (isNaN(t)) return;
  if (t <= 0) { $('#countdown').textContent = 'Sự kiện đã diễn ra — cảm ơn mọi người nhé!'; clearInterval(timer); return; }
  const s = Math.floor(t / 1000);
  $('#cdD').textContent = Math.floor(s / 86400);
  $('#cdH').textContent = pad(Math.floor(s % 86400 / 3600));
  $('#cdM').textContent = pad(Math.floor(s % 3600 / 60));
  $('#cdS').textContent = pad(s % 60);
}
const timer = setInterval(tick, 1000); tick();

/* ---------- Nhạc nền ---------- */
const mBtn = $('#musicBtn'), audio = new Audio();
audio.loop = true; audio.preload = 'none'; audio.volume = (C.music && C.music.volume) ?? 0.5; audio.src = (C.music && C.music.src) || '';
const setPlaying = p => { mBtn.classList.toggle('playing', p); mBtn.setAttribute('aria-pressed', String(p)); };
async function playMusic() {
  try { await audio.play(); setPlaying(true); }
  catch (e) { setPlaying(false); if (audio.error) toast('Chưa có file nhạc trong thư mục music/'); }
}
audio.addEventListener('error', () => { setPlaying(false); mBtn.title = 'Chưa có file nhạc'; });
mBtn.addEventListener('click', () => { if (!audio.paused) { audio.pause(); setPlaying(false); } else playMusic(); });

/* ---------- Mở phong bì ---------- */
const env = $('#env'), openBtn = $('#openBtn'), intro = $('#intro'), main = $('#main');
let opened = false;
function openLetter() {
  if (opened) return; opened = true;
  env.classList.add('open'); openBtn.disabled = true;
  playMusic();
  setTimeout(() => {
    main.hidden = false; document.body.classList.remove('locked');
    intro.classList.add('leave');
    $('#letter').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => { intro.hidden = true; }, 1000);
  }, reduce ? 200 : 1600);
}
openBtn.addEventListener('click', openLetter);
env.addEventListener('click', openLetter);

/* ---------- Hiện dần khi cuộn ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 }) : null;
document.querySelectorAll('.reveal').forEach(e => io ? io.observe(e) : e.classList.add('in'));

/* ---------- Album + phóng to ảnh ---------- */
const lb = $('#lightbox'); let lastTrigger = null;
function openLb(p, trigger) {
  lastTrigger = trigger; $('#lbImg').src = p.src; $('#lbImg').alt = p.caption || '';
  $('#lbCap').textContent = p.caption || ''; lb.hidden = false; document.body.classList.add('noscroll'); $('#lbClose').focus();
}
function closeLb() { lb.hidden = true; document.body.classList.remove('noscroll'); if (lastTrigger) lastTrigger.focus(); }
lb.addEventListener('click', closeLb);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });
const rots = [-4, 3, -2, 5, -5, 2];
(C.photos || []).forEach((p, i) => {
  const b = mk('button', 'polaroid'); b.type = 'button'; b.style.setProperty('--r', rots[i % rots.length] + 'deg');
  b.setAttribute('aria-label', 'Phóng to ảnh ' + (i + 1));
  const img = new Image(); img.loading = 'lazy'; img.alt = p.caption || ''; img.onerror = () => b.remove(); img.src = p.src;
  b.append(mk('i', 'tape'), img, mk('span', '', p.caption || ''));
  b.addEventListener('click', e => { e.stopPropagation(); openLb(p, b); });
  $('#gallery').append(b);
});

/* ---------- Sổ lưu bút (Supabase) ---------- */
const G = C.guestbook || {}, maxN = G.maxName || 40, maxM = G.maxMessage || 300, cool = (G.cooldownSeconds ?? 30) * 1000;
const TABLE = C.GUESTBOOK_TABLE || 'guestbook_entries';
let sb = null;
try { if (C.SUPABASE_URL && C.SUPABASE_PUBLISHABLE_KEY && window.supabase) sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_PUBLISHABLE_KEY); }
catch (e) { console.error('Supabase init:', e); }
const form = $('#gbForm'), list = $('#gbList'), st = $('#gbStatus'), btn = $('#gbBtn'), nameIn = $('#gbName'), msgIn = $('#gbMsg');
nameIn.maxLength = maxN; msgIn.maxLength = maxM;
const say = (k, t) => { st.className = 'status ' + k; st.textContent = t; };
const count = () => { $('#gbCount').textContent = msgIn.value.length + '/' + maxM; };
msgIn.addEventListener('input', count); count();
const fmt = iso => { const x = new Date(iso); return isNaN(x) ? '' : x.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }); };
function card(r, fresh) {
  const li = mk('li', fresh ? 'new' : ''), t = mk('time', '', fmt(r.created_at)); t.dateTime = r.created_at || '';
  li.append(mk('h4', '', r.name), mk('p', '', r.message), t); return li;
}
async function load() {
  if (!sb) { say('err', 'Sổ lưu bút chưa kết nối Supabase. Hãy điền SUPABASE_URL và SUPABASE_PUBLISHABLE_KEY trong config.js.'); return; }
  say('info', 'Đang tải lời nhắn...');
  try {
    const { data, error } = await sb.from(TABLE).select('id,name,message,created_at').order('created_at', { ascending: false }).limit(G.limit || 100);
    if (error) throw error;
    say('', ''); list.replaceChildren(...data.map(r => card(r)));
    if (!data.length) list.append(mk('li', 'empty', 'Chưa có lời nhắn nào — hãy là người đầu tiên nhé!'));
  } catch (e) { console.error(e); say('err', 'Không tải được lời nhắn. Hãy tải lại trang sau ít phút.'); }
}
const LK = 'gb_last_sent'; let last = 0, sending = false;
try { last = +localStorage.getItem(LK) || 0; } catch (e) { /* bỏ qua */ }
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (sending || $('#gbWebsite').value) return;
  const name = nameIn.value.trim().replace(/\s+/g, ' '), message = msgIn.value.trim();
  if (!name || !message) return say('err', 'Bạn nhớ điền cả tên và lời nhắn nhé!');
  if (name.length > maxN) return say('err', 'Tên tối đa ' + maxN + ' ký tự.');
  if (message.length > maxM) return say('err', 'Lời nhắn tối đa ' + maxM + ' ký tự.');
  const wait = Math.ceil((last + cool - Date.now()) / 1000);
  if (wait > 0) return say('err', 'Chậm lại chút nhé, bạn có thể gửi tiếp sau ' + wait + ' giây.');
  if (!sb) return say('err', 'Chưa kết nối Supabase nên chưa gửi được. Kiểm tra lại config.js.');
  sending = true; btn.disabled = true; btn.textContent = 'Đang gửi...'; say('info', 'Đang gửi lời nhắn...');
  try {
    const { data, error } = await sb.from(TABLE).insert({ name, message }).select('id,name,message,created_at').single();
    if (error) throw error;
    list.querySelector('.empty')?.remove(); list.prepend(card(data, true));
    form.reset(); count(); last = Date.now();
    try { localStorage.setItem(LK, String(last)); } catch (e2) { /* bỏ qua */ }
    say('ok', 'Đã gửi! Cảm ơn lời nhắn của bạn 💛');
  } catch (err) { console.error(err); say('err', 'Gửi thất bại. Bạn thử lại sau một chút nhé.'); }
  finally { sending = false; btn.disabled = false; btn.textContent = 'Gửi lời nhắn'; }
});
load();
})();
