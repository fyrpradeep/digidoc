// ── DigiDoc API Client ─────────────────────────────────────────────
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Get token from localStorage
const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('digidoc_token') : null;

// Core fetch wrapper
async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as any) || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ── Auth APIs ──────────────────────────────────────────────────────
export const authApi = {
  sendOtp:   (mobile: string)                    => request('/auth/send-otp',   { method: 'POST', body: JSON.stringify({ mobile }) }),
  verifyOtp: (mobile: string, otp: string)       => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ mobile, otp }) }),
  register:  (mobile: string, role: string, name?: string) => request('/auth/complete-registration', { method: 'POST', body: JSON.stringify({ mobile, role, name }) }),
  adminLogin:(username: string, password: string)=> request('/auth/admin-login',{ method: 'POST', body: JSON.stringify({ username, password }) }),
};

// ── Patient APIs ───────────────────────────────────────────────────
export const patientApi = {
  getMe:   ()           => request('/patients/me'),
  updateMe:(data: any)  => request('/patients/me', { method: 'PUT', body: JSON.stringify(data) }),
};

// ── Doctor APIs ────────────────────────────────────────────────────
export const doctorApi = {
  getAll:       ()                    => request('/doctors'),
  getOnline:    ()                    => request('/doctors/online'),
  getOne:       (id: string)          => request(`/doctors/${id}`),
  toggleOnline: (isOnline: boolean)   => request('/doctors/me/online', { method: 'PUT', body: JSON.stringify({ isOnline }) }),
  updateMe:     (data: any)           => request('/doctors/me', { method: 'PUT', body: JSON.stringify(data) }),
};

// ── Appointment APIs ───────────────────────────────────────────────
export const appointmentApi = {
  create:  (data: any)  => request('/appointments',        { method: 'POST', body: JSON.stringify(data) }),
  getMy:   ()           => request('/appointments/my'),
  start:   (id: string) => request(`/appointments/${id}/start`, { method: 'PUT' }),
  end:     (id: string) => request(`/appointments/${id}/end`,   { method: 'PUT' }),
};

// ── Prescription APIs ──────────────────────────────────────────────
export const prescriptionApi = {
  create: (data: any)  => request('/prescriptions',    { method: 'POST', body: JSON.stringify(data) }),
  getMy:  ()           => request('/prescriptions/my'),
  getOne: (id: string) => request(`/prescriptions/${id}`),
};

// ── Order APIs ─────────────────────────────────────────────────────
export const orderApi = {
  create:   (data: any)  => request('/orders',     { method: 'POST', body: JSON.stringify(data) }),
  getMy:    ()           => request('/orders/my'),
  getOne:   (id: string) => request(`/orders/${id}`),
  dispatch: (id: string, trackingNo: string) => request(`/orders/${id}/dispatch`, { method: 'PUT', body: JSON.stringify({ trackingNo }) }),
};

// ── Medicine APIs ──────────────────────────────────────────────────
export const medicineApi = {
  getAll:    (category?: string) => request(`/medicines${category ? `?category=${category}` : ''}`),
  getOne:    (id: string)        => request(`/medicines/${id}`),
};

// ── Admin APIs ─────────────────────────────────────────────────────
export const adminApi = {
  getStats:        ()           => request('/admin/stats'),
  getPending:      ()           => request('/admin/doctors/pending'),
  approveDoctor:   (id: string) => request(`/admin/doctors/${id}/approve`, { method: 'PUT' }),
  rejectDoctor:    (id: string) => request(`/admin/doctors/${id}/reject`,  { method: 'PUT' }),
  getAllPatients:   ()           => request('/admin/patients'),
  getAllOrders:     ()           => request('/admin/orders'),
  dispatchOrder:   (id: string, trackingNo: string) => request(`/admin/orders/${id}/dispatch`, { method: 'PUT', body: JSON.stringify({ trackingNo }) }),
};

// ── Auth helpers ───────────────────────────────────────────────────
export const saveAuth = (token: string, role: string, user: any) => {
  localStorage.setItem('digidoc_token', token);
  localStorage.setItem('digidoc_role',  role);
  localStorage.setItem('digidoc_user',  JSON.stringify(user));
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('digidoc_user');
  return u ? JSON.parse(u) : null;
};

export const getRole = () =>
  typeof window !== 'undefined' ? localStorage.getItem('digidoc_role') : null;

export const logout = () => {
  localStorage.removeItem('digidoc_token');
  localStorage.removeItem('digidoc_role');
  localStorage.removeItem('digidoc_user');
  window.location.href = '/login';
};
