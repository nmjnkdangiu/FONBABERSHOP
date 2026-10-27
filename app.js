/**
 * THE CLASSIC BARBER - CLIENT SCRIPT (app.js)
 * Manages booking flow, dynamic time slot conflict detection,
 * and localStorage-backed appointment storage.
 */

// 1. DATA DEFINITIONS - FON BARBERSHOP
const SERVICES = [
  // --- NHÓM 1: DỊCH VỤ ---
  { 
    id: 1, 
    category: "DỊCH VỤ",
    name: "Cắt + tạo kiểu", 
    duration: 35, 
    price: 100000, 
    priceDisplay: "100K",
    desc: "Cắt + sấy + tạo kiểu hoàn chỉnh" 
  },
  { 
    id: 2, 
    category: "DỊCH VỤ",
    name: "Xả tóc", 
    duration: 15, 
    price: 20000, 
    priceDisplay: "20K",
    desc: "Xả sạch bằng dầu gội" 
  },
  { 
    id: 3, 
    category: "DỊCH VỤ",
    name: "Tạo kiểu", 
    duration: 20, 
    price: 50000, 
    priceDisplay: "50K",
    desc: "Xả + sấy vuốt sáp tạo kiểu" 
  },
  { 
    id: 4, 
    category: "DỊCH VỤ",
    name: "Làm râu", 
    duration: 20, 
    price: 70000, 
    priceDisplay: "70K",
    desc: "Tỉa + tạo hình form râu gọn gàng" 
  },
  { 
    id: 5, 
    category: "DỊCH VỤ",
    name: "Gội đầu + massage mặt", 
    duration: 30, 
    price: 60000, 
    priceDisplay: "60K",
    desc: "Làm sạch, thư giãn đầu và mặt" 
  },
  { 
    id: 6, 
    category: "DỊCH VỤ",
    name: "Ráy tai", 
    duration: 20, 
    price: 60000, 
    priceDisplay: "60K",
    desc: "Làm sạch tai êm ái" 
  },
  { 
    id: 7, 
    category: "DỊCH VỤ",
    name: "Cạo mặt", 
    duration: 15, 
    price: 30000, 
    priceDisplay: "30K",
    desc: "Cạo hoàn thiện gọn gàng" 
  },
  { 
    id: 8, 
    category: "DỊCH VỤ",
    name: "Hot shave", 
    duration: 30, 
    price: 70000, 
    priceDisplay: "70K",
    desc: "Cạo mặt bằng khăn nóng và thư giãn" 
  },

  // --- NHÓM 2: DỊCH VỤ HÓA CHẤT ---
  { 
    id: 9, 
    category: "DỊCH VỤ HÓA CHẤT",
    name: "Uốn xoăn thường", 
    duration: 60, 
    price: 350000, 
    priceDisplay: "350K - 700K",
    desc: "Uốn xoăn form tiêu chuẩn bồng bềnh tự nhiên" 
  },
  { 
    id: 10, 
    category: "DỊCH VỤ HÓA CHẤT",
    name: "Uốn con sâu + Ruffled", 
    duration: 75, 
    price: 500000, 
    priceDisplay: "500K - 1TR",
    desc: "Uốn con sâu hoặc Ruffled phong cách bụi bặm cá tính" 
  },
  { 
    id: 11, 
    category: "DỊCH VỤ HÓA CHẤT",
    name: "Uốn Premclock", 
    duration: 90, 
    price: 900000, 
    priceDisplay: "900K - 1800K",
    desc: "Uốn Premclock đẳng cấp, kỹ thuật chuẩn salon" 
  },
  { 
    id: 12, 
    category: "DỊCH VỤ HÓA CHẤT",
    name: "Nhuộm", 
    duration: 60, 
    price: 300000, 
    priceDisplay: "300K - 600K",
    desc: "Tư vấn theo nền tóc và tình trạng tóc" 
  },
  { 
    id: 13, 
    category: "DỊCH VỤ HÓA CHẤT",
    name: "Ép side", 
    duration: 30, 
    price: 200000, 
    priceDisplay: "200K",
    desc: "Ép side 2 bên ôm sát form đầu gọn gàng" 
  },
  { 
    id: 14, 
    category: "DỊCH VỤ HÓA CHẤT",
    name: "Tẩy", 
    duration: 50, 
    price: 250000, 
    priceDisplay: "250K - 500K",
    desc: "Tẩy tóc chuẩn kỹ thuật, hạn chế xơ rát da đầu" 
  }
];

const BARBERS = [
  { id: 0, name: "Thợ Bất Kỳ", title: "Hệ thống tự xếp thợ trống", tag: "ALL" },
  { id: 1, name: "Phong", title: "Thợ chính", tag: "P" },
  { id: 2, name: "Duy", title: "Thợ chính", tag: "D" },
  { id: 3, name: "Khoa", title: "Thợ chính", tag: "K" },
  { id: 4, name: "Phúc", title: "Thợ chính", tag: "P" }
];

// Storage keys
const STORAGE_KEY = 'fon_barbershop_bookings_v3';
const SLOTS_STORAGE_KEY = 'fon_shop_slots_v1';

// Supabase Cloud Configuration
const SUPABASE_URL = 'https://cuwjhhrjflehfbsbglgw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1d2poaHJqZmxlaGZic2JnbGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwODk3MTMsImV4cCI6MjEwODY2NTcxM30.gYgWlYL62TrqnOWjqT8LToNWK2JKj7jDKboYqGCaOQE';

let supabaseClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase init error:", err);
}

// Sync from Supabase Cloud to local cache
async function syncFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && Array.isArray(data)) {
      const mappedBookings = data.map(row => ({
        id: row.id,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        customerNote: row.customer_note,
        serviceIds: row.service_ids || [],
        barberId: row.barber_id,
        barberName: row.barber_name,
        date: row.booking_date,
        time: row.booking_time,
        duration: row.duration || 35,
        totalPrice: Number(row.total_price),
        status: row.status,
        isManualBlock: row.is_manual_block || false,
        createdAt: row.created_at
      }));

      saveBookings(mappedBookings);
      renderTimeSlots();
      renderBarberPortal();
    }
  } catch (err) {
    console.warn("Error fetching from Supabase:", err);
  }
}

// Push booking to Supabase Cloud
async function pushBookingToSupabase(booking) {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('appointments').upsert([{
      id: booking.id,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      customer_note: booking.customerNote || '',
      service_ids: booking.serviceIds || [],
      barber_id: booking.barberId,
      barber_name: booking.barberName || '',
      booking_date: booking.date,
      booking_time: booking.time,
      duration: booking.duration || 35,
      total_price: booking.totalPrice,
      status: booking.status,
      is_manual_block: booking.isManualBlock || false,
      created_at: booking.createdAt
    }]);
  } catch (err) {
    console.warn("Error pushing to Supabase:", err);
  }
}

async function updateBookingOnSupabase(id, updates) {
  if (!supabaseClient) return;
  try {
    const mapped = {};
    if (updates.status) mapped.status = updates.status;
    if (updates.duration) mapped.duration = updates.duration;
    if (updates.isManualBlock !== undefined) mapped.is_manual_block = updates.isManualBlock;

    await supabaseClient.from('appointments').update(mapped).eq('id', id);
  } catch (err) {
    console.warn("Error updating Supabase:", err);
  }
}

async function deleteBookingOnSupabase(id) {
  if (!supabaseClient) return;
  try {
    await supabaseClient.from('appointments').delete().eq('id', id);
  } catch (err) {
    console.warn("Error deleting on Supabase:", err);
  }
}

const DEFAULT_TIME_SLOTS = [
  "08:30", "09:15", "10:00", "10:45", "11:30",
  "13:30", "14:15", "15:00", "15:45", "16:30", "17:15", "18:00", "18:45", "19:30"
];

function getTimeSlots() {
  try {
    const saved = localStorage.getItem(SLOTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_TIME_SLOTS;
  } catch (e) {
    return DEFAULT_TIME_SLOTS;
  }
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Current State
let currentStep = 1;
let selectedServices = [1]; // default service 1
let selectedBarberId = 0;   // default any
let selectedDate = getTodayDateString();
let selectedTime = null;
let viewMode = 'customer'; // 'customer' or 'admin'

// Seed sample bookings if not present
function initSampleBookings() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const today = getTodayDateString();
    const samples = [
      {
        id: "BK-8021",
        customerName: "Trần Minh Đức",
        customerPhone: "0987654321",
        customerNote: "Cắt gọn gàng + gội massage",
        serviceIds: [1, 5],
        barberId: 1, // Phong
        date: today,
        time: "09:15",
        totalPrice: 160000,
        status: "confirmed",
        createdAt: new Date().toISOString()
      },
      {
        id: "BK-8022",
        customerName: "Lê Quốc Bảo",
        customerPhone: "0912345678",
        customerNote: "Uốn xoăn tự nhiên",
        serviceIds: [9],
        barberId: 2, // Duy
        date: today,
        time: "14:15",
        totalPrice: 350000,
        status: "confirmed",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  }
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// 2. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initSampleBookings();
  initDateInput();
  renderServices();
  renderBarbers();
  renderBarberPills();
  renderTimeSlots();
  updateSummary();
  renderPortalBarberTabs();
  renderBarberPortal();

  // Load latest data from Supabase Cloud
  syncFromSupabase();

  // Listen for realtime booking events across all devices (Khách đặt là thợ thấy ngay lập tức)
  if (supabaseClient) {
    try {
      supabaseClient
        .channel('appointments-realtime-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
          syncFromSupabase();
        })
        .subscribe();
    } catch (err) {
      console.warn("Realtime sub error:", err);
    }
  }
});

function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function initDateInput() {
  const dateInput = document.getElementById('booking-date');
  const portalDateInput = document.getElementById('portal-date');
  const todayStr = getTodayDateString();
  
  if (dateInput) {
    dateInput.value = todayStr;
    dateInput.min = todayStr;
  }
  if (portalDateInput) {
    portalDateInput.value = todayStr;
  }
  selectedDate = todayStr;
}

// 3. RENDER FUNCTIONS
function renderServices() {
  const container = document.getElementById('services-container');
  
  const categories = ["DỊCH VỤ", "DỊCH VỤ HÓA CHẤT"];
  let html = '';

  categories.forEach(cat => {
    const list = SERVICES.filter(s => s.category === cat);
    if (list.length > 0) {
      html += `<div class="service-category-title">${cat}</div>`;
      
      html += list.map(s => {
        const isSelected = selectedServices.includes(s.id);
        const displayPrice = s.priceDisplay || formatCurrency(s.price);
        return `
          <div class="service-card ${isSelected ? 'selected' : ''}" onclick="toggleService(${s.id})">
            <span class="check-badge"></span>
            <div class="service-header">
              <div class="service-name">${s.name}</div>
            </div>
            <div class="service-desc">${s.desc}</div>
            <div class="service-price">
              ${displayPrice}
            </div>
          </div>
        `;
      }).join('');
    }
  });

  container.innerHTML = html;
}

function renderBarbers() {
  const container = document.getElementById('barbers-container');
  container.innerHTML = BARBERS.map(b => {
    const isSelected = selectedBarberId === b.id;
    return `
      <div class="barber-card ${isSelected ? 'selected' : ''}" onclick="selectBarber(${b.id})">
        <div class="barber-avatar">${b.tag}</div>
        <div class="barber-name">${b.name}</div>
        <div class="barber-title">${b.title}</div>
      </div>
    `;
  }).join('');
}

function renderBarberPills() {
  const container = document.getElementById('barber-pills-container');
  if (!container) return;
  container.innerHTML = BARBERS.map(b => {
    const isSelected = selectedBarberId === b.id;
    return `
      <button type="button" class="barber-pill ${isSelected ? 'active' : ''}" onclick="selectBarberFromPill(${b.id})">
        ${b.name}
      </button>
    `;
  }).join('');
}

function selectBarberFromPill(id) {
  selectBarber(id);
  renderBarberPills();
}

/**
 * Conflict detection logic:
 * Checks if a time range [time, time + duration) on a given date is occupied.
 */
function isTimeRangeBooked(date, timeStr, durationMinutes, barberId) {
  const bookings = getBookings();
  const reqStart = timeToMinutes(timeStr);
  const reqEnd = reqStart + (durationMinutes || 40);

  const activeBookings = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed' && b.date === date);

  // If a specific barber is chosen (Phong = 1, Duy = 2, Khoa = 3, Phúc = 4)
  if (barberId !== 0) {
    return activeBookings.some(b => {
      if (b.barberId === barberId || b.barberId === 0) {
        const bStart = timeToMinutes(b.time);
        const bEnd = bStart + (b.duration || 40);
        return (reqStart < bEnd && reqEnd > bStart);
      }
      return false;
    });
  } else {
    // "Thợ Bất Kỳ": Checks if all 4 barbers are occupied at this exact time
    const individualBarbers = [1, 2, 3, 4];
    let busyCount = 0;
    for (const bId of individualBarbers) {
      const isBusy = activeBookings.some(b => {
        if (b.barberId === bId || b.barberId === 0) {
          const bStart = timeToMinutes(b.time);
          const bEnd = bStart + (b.duration || 40);
          return (reqStart < bEnd && reqEnd > bStart);
        }
        return false;
      });
      if (isBusy) busyCount++;
    }
    return busyCount >= 4;
  }
}

function renderTimeSlots() {
  const container = document.getElementById('slots-container');
  const slots = getTimeSlots();

  const chosenServices = SERVICES.filter(s => selectedServices.includes(s.id));
  const reqDuration = chosenServices.reduce((sum, s) => sum + s.duration, 0) || 40;

  container.innerHTML = slots.map(time => {
    const booked = isTimeRangeBooked(selectedDate, time, reqDuration, selectedBarberId);
    const isSelected = selectedTime === time && !booked;
    
    let classes = "time-slot";
    if (booked) classes += " booked";
    if (isSelected) classes += " selected";

    const label = booked ? `${time}<br><small style="font-size:0.7rem; font-weight:normal;">Đã bận</small>` : time;

    return `
      <div class="${classes}" onclick="${booked ? '' : `selectTimeSlot('${time}')`}">
        ${label}
      </div>
    `;
  }).join('');
}

function handleCustomTimeChange(customTime) {
  const feedback = document.getElementById('custom-time-feedback');
  if (!customTime) {
    if (feedback) feedback.textContent = '';
    return;
  }

  const chosenServices = SERVICES.filter(s => selectedServices.includes(s.id));
  const reqDuration = chosenServices.reduce((sum, s) => sum + s.duration, 0) || 40;
  
  const barber = BARBERS.find(b => b.id === selectedBarberId);
  const barberName = barber ? barber.name : "Thợ bất kỳ";

  const booked = isTimeRangeBooked(selectedDate, customTime, reqDuration, selectedBarberId);
  if (booked) {
    feedback.className = "time-feedback busy";
    feedback.textContent = `Giờ ${customTime} thợ ${barberName} đã có khách, vui lòng chọn giờ khác.`;
    selectedTime = null;
  } else {
    feedback.className = "time-feedback free";
    feedback.textContent = `Giờ ${customTime} thợ ${barberName} còn trống! Đã chọn giờ này.`;
    selectedTime = customTime;
    renderTimeSlots(); // unselect pre-defined slot chips
  }
  updateSummary();
}

function saveCustomShopSchedule() {
  const openTime = document.getElementById('cfg-open-time').value;
  const closeTime = document.getElementById('cfg-close-time').value;
  const interval = parseInt(document.getElementById('cfg-interval').value, 10) || 45;

  const startMins = timeToMinutes(openTime);
  const endMins = timeToMinutes(closeTime);

  if (startMins >= endMins) {
    alert("Giờ mở cửa phải trước giờ đóng cửa!");
    return;
  }

  const newSlots = [];
  for (let m = startMins; m + 30 <= endMins; m += interval) {
    newSlots.push(minutesToTime(m));
  }

  localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(newSlots));
  renderTimeSlots();
  alert(`Đã cập nhật khung giờ tiệm thành công (${newSlots.length} ca làm việc từ ${openTime} đến ${closeTime})!`);
}

// 4. SELECTION HANDLERS
function toggleService(id) {
  const idx = selectedServices.indexOf(id);
  if (idx > -1) {
    if (selectedServices.length > 1) {
      selectedServices.splice(idx, 1);
    } else {
      alert("Bạn cần chọn ít nhất 1 dịch vụ!");
      return;
    }
  } else {
    selectedServices.push(id);
  }
  renderServices();
  updateSummary();
}

function selectBarber(id) {
  selectedBarberId = id;
  renderBarbers();
  renderBarberPills();
  
  const chosenServices = SERVICES.filter(s => selectedServices.includes(s.id));
  const reqDuration = chosenServices.reduce((sum, s) => sum + s.duration, 0) || 40;

  // Clear selected time if it conflicts with newly selected barber
  if (selectedTime && isTimeRangeBooked(selectedDate, selectedTime, reqDuration, selectedBarberId)) {
    selectedTime = null;
    const feedback = document.getElementById('custom-time-feedback');
    if (feedback) {
      feedback.className = "time-feedback busy";
      feedback.textContent = "Giờ đã chọn bị trùng với lịch của thợ này, vui lòng chọn lại.";
    }
  }
  renderTimeSlots();
  updateSummary();
}

function onDateChanged() {
  const dateInput = document.getElementById('booking-date');
  selectedDate = dateInput.value;
  selectedTime = null; // reset slot selection
  const customInput = document.getElementById('custom-time-input');
  if (customInput) customInput.value = '';
  const feedback = document.getElementById('custom-time-feedback');
  if (feedback) feedback.textContent = '';
  renderTimeSlots();
  updateSummary();
}

function selectTimeSlot(time) {
  selectedTime = time;
  const customInput = document.getElementById('custom-time-input');
  if (customInput) customInput.value = '';
  const feedback = document.getElementById('custom-time-feedback');
  if (feedback) feedback.textContent = '';
  renderTimeSlots();
  updateSummary();
}

function updateSummary() {
  const chosenServices = SERVICES.filter(s => selectedServices.includes(s.id));
  const totalDuration = chosenServices.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = chosenServices.reduce((sum, s) => sum + s.price, 0);
  const barber = BARBERS.find(b => b.id === selectedBarberId);

  document.getElementById('summary-services').textContent = chosenServices.map(s => s.name).join(' + ');
  document.getElementById('summary-barber').textContent = barber ? barber.name : 'Bất kỳ';
  document.getElementById('summary-price').textContent = formatCurrency(totalPrice);

  if (selectedDate && selectedTime) {
    document.getElementById('summary-datetime').textContent = `${selectedTime} - Ngày ${formatDate(selectedDate)}`;
  } else if (selectedDate) {
    document.getElementById('summary-datetime').textContent = `Ngày ${formatDate(selectedDate)} (Chưa chọn giờ)`;
  } else {
    document.getElementById('summary-datetime').textContent = "Chưa chọn";
  }
}

// 5. STEP NAVIGATION
function goToStep(step) {
  // Validate before advancing
  if (step === 3 && selectedServices.length === 0) {
    alert("Vui lòng chọn ít nhất 1 dịch vụ.");
    return;
  }
  if (step === 4 && (!selectedTime || !selectedDate)) {
    alert("Vui lòng chọn ngày và khung giờ bạn muốn đặt lịch!");
    return;
  }

  currentStep = step;
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById(`step-panel-${i}`);
    const badge = document.getElementById(`step-badge-${i}`);
    
    if (i === step) {
      panel.classList.add('active');
      badge.classList.add('active');
    } else {
      panel.classList.remove('active');
      badge.classList.remove('active');
      if (i < step) badge.classList.add('completed');
      else badge.classList.remove('completed');
    }
  }
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// 6. FORM SUBMISSION
function handleBookingSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  if (!selectedTime || !selectedDate) {
    alert("Vui lòng quay lại Bước 3 để chọn Ngày & Khung giờ!");
    goToStep(3);
    return;
  }

  const nameEl = document.getElementById('cust-name');
  const phoneEl = document.getElementById('cust-phone');
  const noteEl = document.getElementById('cust-note');

  const name = nameEl ? nameEl.value.trim() : '';
  const rawPhone = phoneEl ? phoneEl.value.trim() : '';
  const phone = rawPhone.replace(/[\s.-]/g, '');
  const note = noteEl ? noteEl.value.trim() : '';

  if (!name) {
    alert("Vui lòng điền họ và tên của bạn!");
    if (nameEl) nameEl.focus();
    return;
  }
  if (!phone || phone.length < 9) {
    alert("Vui lòng điền số điện thoại liên hệ hợp lệ (tối thiểu 9-10 số)!");
    if (phoneEl) phoneEl.focus();
    return;
  }

  const chosenServices = SERVICES.filter(s => selectedServices.includes(s.id));
  const totalDuration = chosenServices.reduce((sum, s) => sum + s.duration, 0) || 35;
  const totalPrice = chosenServices.reduce((sum, s) => sum + s.price, 0);

  // Auto assign if customer chose "Thợ bất kỳ"
  let assignedBarberId = selectedBarberId;
  if (assignedBarberId === 0) {
    const candidates = [1, 2, 3, 4];
    for (const bId of candidates) {
      if (!isTimeRangeBooked(selectedDate, selectedTime, totalDuration, bId)) {
        assignedBarberId = bId;
        break;
      }
    }
    if (assignedBarberId === 0) assignedBarberId = 1;
  }

  // Double check slot availability for assigned barber
  if (isTimeRangeBooked(selectedDate, selectedTime, totalDuration, assignedBarberId)) {
    alert("Khung giờ này vừa có khách đặt trước! Vui lòng chọn giờ khác.");
    goToStep(3);
    renderTimeSlots();
    return;
  }

  const bookingId = "BK-" + Math.floor(1000 + Math.random() * 9000);
  const barberObj = BARBERS.find(b => b.id === assignedBarberId) || BARBERS[1];

  const newBooking = {
    id: bookingId,
    customerName: name,
    customerPhone: phone,
    customerNote: note,
    serviceIds: [...selectedServices],
    barberId: assignedBarberId,
    barberName: barberObj.name,
    date: selectedDate,
    time: selectedTime,
    duration: totalDuration,
    totalPrice: totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  const bookings = getBookings();
  bookings.unshift(newBooking);
  saveBookings(bookings);
  pushBookingToSupabase(newBooking);

  // Show ticket modal
  showSuccessTicket(newBooking, chosenServices, barberObj);

  // Reset form inputs for next customer
  if (nameEl) nameEl.value = '';
  if (phoneEl) phoneEl.value = '';
  if (noteEl) noteEl.value = '';
  const customInput = document.getElementById('custom-time-input');
  if (customInput) customInput.value = '';
  const feedback = document.getElementById('custom-time-feedback');
  if (feedback) feedback.textContent = '';

  selectedServices = [1];
  selectedBarberId = 0;
  selectedTime = null;
  goToStep(1);
  renderServices();
  renderBarbers();
  renderBarberPills();
  renderTimeSlots();
  updateSummary();
  renderBarberPortal();
}

function showSuccessTicket(booking, chosenServices, barber) {
  const details = document.getElementById('ticket-details');
  details.innerHTML = `
    <div class="ticket-row"><span>Mã lịch hẹn:</span><strong style="color: #ffffff;">${booking.id}</strong></div>
    <div class="ticket-row"><span>Khách hàng:</span><strong>${booking.customerName}</strong></div>
    <div class="ticket-row"><span>Số điện thoại:</span><strong>${booking.customerPhone}</strong></div>
    <div class="ticket-row"><span>Thời gian:</span><strong>${booking.time} - ${formatDate(booking.date)}</strong></div>
    <div class="ticket-row"><span>Dịch vụ:</span><span>${chosenServices.map(s => s.name).join(', ')}</span></div>
    <div class="ticket-row"><span>Thợ phục vụ:</span><strong>${barber ? barber.name : 'Phong'}</strong></div>
    <div class="ticket-row" style="border-top: 1px dashed rgba(226, 232, 240, 0.2); padding-top: 10px; margin-top: 10px;">
      <span>Tổng thanh toán:</span><strong style="color: #ffffff; font-size: 1.15rem; font-weight: 800;">${formatCurrency(booking.totalPrice)}</strong>
    </div>
  `;
  document.getElementById('success-modal').classList.add('open');
}

function closeSuccessModal() {
  document.getElementById('success-modal').classList.remove('open');
}

// 7. BARBER PORTAL SYSTEM (Tách riêng & Bảo mật cho Thợ)
const BARBER_PIN_KEY = 'fon_barber_pin_v1';
const DEFAULT_BARBER_PIN = '2026'; // Mật khẩu mặc định

let isBarberAuthenticated = false;
let currentPortalMode = 'customer';
let selectedPortalBarberId = 1; // Default: Phong (id = 1)

function getBarberPin() {
  return localStorage.getItem(BARBER_PIN_KEY) || DEFAULT_BARBER_PIN;
}

function setBarberPin(newPin) {
  localStorage.setItem(BARBER_PIN_KEY, newPin);
}

function switchPortal(mode) {
  if (mode === 'barber' && !isBarberAuthenticated) {
    openBarberLogin();
    return;
  }

  currentPortalMode = mode;
  const bookingSec = document.getElementById('booking-section');
  const portalSec = document.getElementById('barber-portal-section');
  const navCustBtn = document.getElementById('nav-customer-btn');
  const navBarberBtn = document.getElementById('nav-barber-btn');

  if (mode === 'customer') {
    if (bookingSec) bookingSec.style.display = 'block';
    if (portalSec) portalSec.style.display = 'none';
    if (navCustBtn) navCustBtn.className = 'btn btn-primary';
    if (navBarberBtn) navBarberBtn.className = 'btn btn-outline';
    renderTimeSlots();
  } else {
    if (bookingSec) bookingSec.style.display = 'none';
    if (portalSec) portalSec.style.display = 'block';
    if (navCustBtn) navCustBtn.className = 'btn btn-outline';
    if (navBarberBtn) navBarberBtn.className = 'btn btn-primary';
    renderPortalBarberTabs();
    renderBarberPortal();
  }
}

function openBarberLogin() {
  const modal = document.getElementById('barber-login-modal');
  const input = document.getElementById('barber-pin-input');
  const err = document.getElementById('login-error-msg');
  if (input) input.value = '';
  if (err) err.textContent = '';
  if (modal) modal.classList.add('open');
  setTimeout(() => { if (input) input.focus(); }, 150);
}

function closeBarberLogin() {
  const modal = document.getElementById('barber-login-modal');
  if (modal) modal.classList.remove('open');
}

function checkBarberPin() {
  const input = document.getElementById('barber-pin-input');
  const err = document.getElementById('login-error-msg');
  const enteredPin = input ? input.value.trim() : '';

  if (enteredPin === getBarberPin()) {
    isBarberAuthenticated = true;
    closeBarberLogin();
    switchPortal('barber');
  } else {
    if (err) {
      err.textContent = "Mật khẩu không chính xác! Vui lòng thử lại.";
    }
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function logoutBarber() {
  isBarberAuthenticated = false;
  switchPortal('customer');
  alert("Đã khóa cổng thợ. Quay lại trang khách đặt lịch.");
}

function promptChangePassword() {
  const currentPin = prompt("Nhập mật khẩu hiện tại của thợ:");
  if (currentPin === null) return;

  if (currentPin !== getBarberPin()) {
    alert("Mật khẩu hiện tại không đúng!");
    return;
  }

  const newPin = prompt("Nhập mật khẩu mới muốn đặt (ít nhất 4 ký tự):");
  if (!newPin || newPin.trim().length < 4) {
    alert("Mật khẩu mới không hợp lệ hoặc quá ngắn (tối thiểu 4 ký tự)!");
    return;
  }

  setBarberPin(newPin.trim());
  alert(`Đổi mật khẩu thành công! Mật khẩu mới của cổng thợ là: ${newPin.trim()}`);
}

function selectPortalBarber(bId) {
  selectedPortalBarberId = bId;
  renderPortalBarberTabs();
  renderBarberPortal();
}

function renderPortalBarberTabs() {
  const container = document.getElementById('portal-barber-tabs');
  if (!container) return;

  const individualBarbers = BARBERS.filter(b => b.id > 0);
  container.innerHTML = individualBarbers.map(b => {
    const isActive = selectedPortalBarberId === b.id;
    return `
      <button type="button" class="portal-tab-btn ${isActive ? 'active' : ''}" onclick="selectPortalBarber(${b.id})">
        Thợ ${b.name}
      </button>
    `;
  }).join('');
}

function renderBarberPortal() {
  const portalDateEl = document.getElementById('portal-date');
  const queryDate = portalDateEl ? portalDateEl.value : getTodayDateString();
  const barber = BARBERS.find(b => b.id === selectedPortalBarberId) || BARBERS[1];

  const allBookings = getBookings();
  const dayBookings = allBookings.filter(b => b.date === queryDate && b.barberId === selectedPortalBarberId && b.status !== 'cancelled');

  // Sort by time
  dayBookings.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  // 1. Calculate Stats
  const statNextTime = document.getElementById('stat-next-time');
  const statNextDetail = document.getElementById('stat-next-detail');
  const statTotalClients = document.getElementById('stat-total-clients');
  const statFreeSlots = document.getElementById('stat-free-slots');

  if (statTotalClients) {
    statTotalClients.textContent = `${dayBookings.length} khách`;
  }

  // Next Client logic
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = queryDate === getTodayDateString();

  let nextBooking = null;
  if (isToday) {
    nextBooking = dayBookings.find(b => timeToMinutes(b.time) >= currentMinutes);
  } else {
    nextBooking = dayBookings[0] || null;
  }

  if (nextBooking) {
    if (statNextTime) statNextTime.textContent = nextBooking.time;
    if (statNextDetail) {
      const sNames = nextBooking.serviceIds.map(id => {
        const s = SERVICES.find(srv => srv.id === id);
        return s ? s.name : '';
      }).filter(Boolean).join(', ');
      statNextDetail.textContent = `Khách: ${nextBooking.customerName} (${sNames})`;
    }
  } else {
    if (statNextTime) statNextTime.textContent = dayBookings.length > 0 ? "Đã xong ca" : "Chưa có";
    if (statNextDetail) statNextDetail.textContent = dayBookings.length > 0 ? "Tất cả khách trong ngày đã phục vụ xong" : "Chưa có lịch hẹn nào cho ngày này";
  }

  // 2. Timeline Slots Grid (Free vs Busy)
  const timelineContainer = document.getElementById('barber-timeline-slots');
  const slots = getTimeSlots();
  let freeCount = 0;

  if (timelineContainer) {
    timelineContainer.innerHTML = slots.map(time => {
      // Find if this barber has booking at this slot
      const booking = dayBookings.find(b => {
        const bStart = timeToMinutes(b.time);
        const bEnd = bStart + (b.duration || 35);
        const slotM = timeToMinutes(time);
        return (slotM >= bStart && slotM < bEnd);
      });

      if (booking) {
        if (booking.isManualBlock) {
          return `
            <div class="timeline-slot-card busy" onclick="toggleManualBlockSlot('${time}')" style="cursor: pointer;" title="Bấm để mở lại ca này">
              <div class="slot-time-badge">${time}</div>
              <div class="slot-status-text">Thợ tạm khóa (Nghỉ ca)</div>
              <div class="slot-client-info">Bấm để mở lại ca</div>
            </div>
          `;
        }

        const sNames = booking.serviceIds.map(id => {
          const s = SERVICES.find(srv => srv.id === id);
          return s ? s.name : '';
        }).filter(Boolean).join(', ');

        return `
          <div class="timeline-slot-card busy">
            <div class="slot-time-badge">${time}</div>
            <div class="slot-status-text">Có khách: ${booking.customerName}</div>
            <div class="slot-client-info">${sNames} &bull; ${booking.duration || 35} phút</div>
          </div>
        `;
      } else {
        freeCount++;
        return `
          <div class="timeline-slot-card free" onclick="toggleManualBlockSlot('${time}')" title="Ca này đang rảnh. Bấm để tạm khóa nếu bận/nghỉ ăn trưa">
            <div class="slot-time-badge">${time}</div>
            <div class="slot-status-text">Còn trống (Rảnh)</div>
            <div class="slot-client-info">Bấm để tạm khóa/nghỉ</div>
          </div>
        `;
      }
    }).join('');
  }

  if (statFreeSlots) {
    statFreeSlots.textContent = `${freeCount} ca`;
  }

  // 3. Client List Table
  const tbody = document.getElementById('portal-bookings-list');
  if (tbody) {
    if (dayBookings.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px;">
            Thợ ${barber.name} chưa có lịch hẹn nào trong ngày ${formatDate(queryDate)}.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = dayBookings.map(b => {
        const serviceNames = b.serviceIds.map(id => {
          const s = SERVICES.find(srv => srv.id === id);
          return s ? s.name : '';
        }).filter(Boolean).join(', ');

        const statusMap = {
          confirmed: '<span class="status-badge status-confirmed">Đang phục vụ</span>',
          completed: '<span class="status-badge status-confirmed" style="background: rgba(16,185,129,0.25); color: #10b981;">Đã xong</span>',
          cancelled: '<span class="status-badge status-cancelled">Đã hủy</span>'
        };

        const durationText = `<span class="duration-badge">⏱️ ${b.duration || 35} phút</span>`;

        return `
          <tr>
            <td><strong>${b.id}</strong></td>
            <td><strong style="color: #ffffff; font-size: 1.05rem;">${b.time}</strong></td>
            <td><strong>${b.customerName}</strong></td>
            <td><a href="tel:${b.customerPhone}" style="color: #cbd5e1; text-decoration: underline;">${b.customerPhone}</a></td>
            <td>${serviceNames || 'Khóa nội bộ'}<br>${durationText}</td>
            <td><small style="color: var(--text-muted);">${b.customerNote || 'Không có'}</small></td>
            <td><strong>${formatCurrency(b.totalPrice)}</strong></td>
            <td>${statusMap[b.status] || b.status}</td>
            <td>
              ${b.status !== 'completed' && b.status !== 'cancelled' ? `
                <div class="action-buttons-wrap">
                  <button class="btn-action-done" title="Cắt xong sớm, giải phóng giờ này ngay lập tức" onclick="completeBookingEarly('${b.id}')">Xong Sớm</button>
                  <button class="btn-action-reduce" title="Lùi lại / Giảm bớt 15 phút nếu bấm nhầm" onclick="adjustBookingDuration('${b.id}', -15)">-15p</button>
                  <button class="btn-action-extend" title="Làm trễ, nới thêm 15 phút" onclick="adjustBookingDuration('${b.id}', 15)">+15p</button>
                  <button class="btn-action-cancel" title="Hủy ca này" onclick="cancelBooking('${b.id}')">Hủy</button>
                </div>
              ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Đã hoàn thành</span>'}
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

// Hoàn thành sớm: giải phóng ca ngay lập tức
function completeBookingEarly(id) {
  const bookings = getBookings();
  const item = bookings.find(b => b.id === id);
  if (!item) return;

  item.status = 'completed';
  item.completedAt = new Date().toISOString();
  saveBookings(bookings);
  updateBookingOnSupabase(id, { status: 'completed' });
  renderBarberPortal();
  renderTimeSlots();
  alert(`Đã hoàn thành ca của ${item.customerName}! Khung giờ ghế cắt đã được giải phóng để đón khách tiếp theo.`);
}

// Tăng / Giảm thời gian ca làm (Hỗ trợ lùi lại khi bấm lộn)
function adjustBookingDuration(id, deltaMinutes) {
  const bookings = getBookings();
  const item = bookings.find(b => b.id === id);
  if (!item) return;

  const currentDuration = item.duration || 35;
  const minDuration = 15; // Giới hạn tối thiểu 15 phút, không thể giảm dưới mức này

  if (deltaMinutes < 0 && currentDuration <= minDuration) {
    alert(`Thời lượng ca đã ở mức tối thiểu (${minDuration} phút), không thể giảm thêm.`);
    return;
  }

  const newDuration = Math.max(minDuration, currentDuration + deltaMinutes);
  item.duration = newDuration;
  saveBookings(bookings);
  updateBookingOnSupabase(id, { duration: newDuration });
  renderBarberPortal();
  renderTimeSlots();

  if (deltaMinutes > 0) {
    alert(`Đã tăng thêm ${deltaMinutes} phút cho ca của khách ${item.customerName}. (Tổng ca: ${newDuration} phút)`);
  } else {
    alert(`Đã lùi lại ${Math.abs(deltaMinutes)} phút cho ca của khách ${item.customerName}. (Tổng ca: ${newDuration} phút)`);
  }
}

function extendBookingDuration(id, minutesToAdd) {
  adjustBookingDuration(id, minutesToAdd);
}

// Tự khóa / mở ca làm việc thủ công (ví dụ bận việc riêng / nghỉ ăn trưa)
function toggleManualBlockSlot(time) {
  const portalDateEl = document.getElementById('portal-date');
  const date = portalDateEl ? portalDateEl.value : getTodayDateString();
  const barberObj = BARBERS.find(b => b.id === selectedPortalBarberId);
  const barberName = barberObj ? barberObj.name : "Thợ";

  const bookings = getBookings();
  const existingIdx = bookings.findIndex(b => b.isManualBlock && b.date === date && b.time === time && b.barberId === selectedPortalBarberId);

  if (existingIdx > -1) {
    const blockId = bookings[existingIdx].id;
    bookings.splice(existingIdx, 1);
    saveBookings(bookings);
    deleteBookingOnSupabase(blockId);
    renderBarberPortal();
    renderTimeSlots();
    alert(`Đã mở lại ca ${time} cho ${barberName}.`);
  } else {
    // Check if slot already has real client
    const hasClient = bookings.some(b => b.status === 'confirmed' && b.date === date && b.time === time && b.barberId === selectedPortalBarberId);
    if (hasClient) {
      alert(`Ca ${time} đã có khách đặt lịch, không thể khóa!`);
      return;
    }

    const blockBooking = {
      id: "BLOCK-" + Math.floor(1000 + Math.random() * 9000),
      customerName: `Tự khóa (Nghỉ ca)`,
      customerPhone: "Nội bộ",
      customerNote: `Thợ ${barberName} bận/nghỉ ca`,
      serviceIds: [],
      barberId: selectedPortalBarberId,
      barberName: barberName,
      date: date,
      time: time,
      duration: 45,
      totalPrice: 0,
      status: 'confirmed',
      isManualBlock: true,
      createdAt: new Date().toISOString()
    };

    bookings.unshift(blockBooking);
    saveBookings(bookings);
    pushBookingToSupabase(blockBooking);
    renderBarberPortal();
    renderTimeSlots();
    alert(`Đã tạm khóa ca ${time} của thợ ${barberName}. Khách trên web sẽ thấy giờ này đã bận.`);
  }
}

function completeBooking(id) {
  completeBookingEarly(id);
}

function cancelBooking(id) {
  if (confirm(`Bạn có chắc muốn hủy lịch hẹn ${id}?`)) {
    const bookings = getBookings();
    const item = bookings.find(b => b.id === id);
    if (item) {
      item.status = 'cancelled';
      saveBookings(bookings);
      updateBookingOnSupabase(id, { status: 'cancelled' });
      renderBarberPortal();
      renderTimeSlots();
    }
  }
}

function resetToDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  initSampleBookings();
  renderBarberPortal();
  renderTimeSlots();
  alert("Đã khôi phục dữ liệu lịch mẫu!");
}

function clearAllBookings() {
  if (confirm("Bạn có chắc chắn muốn XÓA TOÀN BỘ lịch hẹn? (Tất cả khung giờ sẽ trở thành giờ trống)")) {
    saveBookings([]);
    renderBarberPortal();
    renderTimeSlots();
    alert("Đã xóa toàn bộ lịch hẹn thành công!");
  }
}

function resetBookingForm() {
  document.getElementById('booking-form').reset();
  const customInput = document.getElementById('custom-time-input');
  if (customInput) customInput.value = '';
  const feedback = document.getElementById('custom-time-feedback');
  if (feedback) feedback.textContent = '';
  initDateInput();
  selectedServices = [1];
  selectedBarberId = 0;
  selectedTime = null;
  goToStep(1);
  renderServices();
  renderBarbers();
  renderBarberPills();
  renderTimeSlots();
  updateSummary();
}

// UTILITY HELPERS
function formatCurrency(num) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
