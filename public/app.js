const els = {
  authView: document.querySelector('#authView'),
  authTitle: document.querySelector('#authTitle'),
  authError: document.querySelector('#authError'),
  authForm: document.querySelector('#authForm'),
  authClose: document.querySelector('#authClose'),
  authName: document.querySelector('#authName'),
  authEmail: document.querySelector('#authEmail'),
  authPassword: document.querySelector('#authPassword'),
  authSubmit: document.querySelector('#authSubmit'),
  googleAuth: document.querySelector('#googleAuth'),
  googleAuthText: document.querySelector('#googleAuthText'),
  googleButtonWrap: document.querySelector('#googleButtonWrap'),
  authSwitchText: document.querySelector('#authSwitchText'),
  toggleAuthMode: document.querySelector('#toggleAuthMode'),
  verifyView: document.querySelector('#verifyView'),
  verifyEmail: document.querySelector('#verifyEmail'),
  verifyCode: document.querySelector('#verifyCode'),
  verifyNow: document.querySelector('#verifyNow'),
  resendVerify: document.querySelector('#resendVerify'),
  adminLoginView: document.querySelector('#adminLoginView'),
  adminDashboardView: document.querySelector('#adminDashboardView'),
  adminLoginForm: document.querySelector('#adminLoginForm'),
  adminEmail: document.querySelector('#adminEmail'),
  adminPassword: document.querySelector('#adminPassword'),
  adminError: document.querySelector('#adminError'),
  adminMetrics: document.querySelector('#adminMetrics'),
  adminUsers: document.querySelector('#adminUsers'),
  adminUserRows: document.querySelector('#adminUserRows'),
  adminOverviewPanel: document.querySelector('#adminOverviewPanel'),
  adminUsersPanel: document.querySelector('#adminUsersPanel'),
  adminPaymentsPanel: document.querySelector('#adminPaymentsPanel'),
  adminAnalyticsPanel: document.querySelector('#adminAnalyticsPanel'),
  adminAnalyticsSummary: document.querySelector('#adminAnalyticsSummary'),
  adminModelChart: document.querySelector('#adminModelChart'),
  adminModelsPanel: document.querySelector('#adminModelsPanel'),
  adminBroadcastPanel: document.querySelector('#adminBroadcastPanel'),
  adminBroadcastForm: document.querySelector('#adminBroadcastForm'),
  adminBroadcastSubject: document.querySelector('#adminBroadcastSubject'),
  adminBroadcastMessage: document.querySelector('#adminBroadcastMessage'),
  adminBroadcastStatus: document.querySelector('#adminBroadcastStatus'),
  adminBroadcastRecipientCount: document.querySelector('#adminBroadcastRecipientCount'),
  adminBroadcastPreviewSubject: document.querySelector('#adminBroadcastPreviewSubject'),
  adminBroadcastPreviewMessage: document.querySelector('#adminBroadcastPreviewMessage'),
  adminBroadcastHistory: document.querySelector('#adminBroadcastHistory'),
  adminModelSettings: document.querySelector('#adminModelSettings'),
  adminPaymentRequests: document.querySelector('#adminPaymentRequests'),
  adminNavButtons: document.querySelectorAll('[data-admin-view]'),
  adminSidebarToggle: document.querySelector('#adminSidebarToggle'),
  adminMobileNavToggle: document.querySelector('#adminMobileNavToggle'),
  adminSidebarBackdrop: document.querySelector('#adminSidebarBackdrop'),
  viewAllUsers: document.querySelector('#viewAllUsers'),
  adminUserModal: document.querySelector('#adminUserModal'),
  adminUserForm: document.querySelector('#adminUserForm'),
  adminUserError: document.querySelector('#adminUserError'),
  adminEditName: document.querySelector('#adminEditName'),
  adminEditEmail: document.querySelector('#adminEditEmail'),
  adminEditPlan: document.querySelector('#adminEditPlan'),
  adminEditPassword: document.querySelector('#adminEditPassword'),
  adminEditVerified: document.querySelector('#adminEditVerified'),
  adminEditFrozen: document.querySelector('#adminEditFrozen'),
  adminCancelEdit: document.querySelector('#adminCancelEdit'),
  adminLogout: document.querySelector('#adminLogout'),
  appShell: document.querySelector('.app-shell'),
  topbarAuthActions: document.querySelector('#topbarAuthActions'),
  topbarLogin: document.querySelector('#topbarLogin'),
  topbarRegister: document.querySelector('#topbarRegister'),
  guestCard: document.querySelector('#guestCard'),
  sidebarLogin: document.querySelector('#sidebarLogin'),
  sidebar: document.querySelector('#sidebar'),
  toggleSidebar: document.querySelector('#toggleSidebar'),
  collapseSidebar: document.querySelector('#collapseSidebar'),
  mobileSidebar: document.querySelector('#mobileSidebar'),
  searchButton: document.querySelector('#searchButton'),
  searchNav: document.querySelector('#searchNav'),
  searchPanel: document.querySelector('#searchPanel'),
  searchInput: document.querySelector('#searchInput'),
  searchResults: document.querySelector('#searchResults'),
  newChat: document.querySelector('#newChat'),
  newChatRail: document.querySelector('#newChatRail'),
  projectRail: document.querySelector('#projectRail'),
  projectSection: document.querySelector('#projectSection'),
  toggleProjects: document.querySelector('#toggleProjects'),
  historyRail: document.querySelector('#historyRail'),
  clearHistory: document.querySelector('#clearHistory'),
  historyList: document.querySelector('#historyList'),
  welcomeView: document.querySelector('#welcomeView'),
  chatView: document.querySelector('#chatView'),
  messageList: document.querySelector('#messageList'),
  composerForm: document.querySelector('#composerForm'),
  messageInput: document.querySelector('#messageInput'),
  attachButton: document.querySelector('#attachButton'),
  attachMenu: document.querySelector('#attachMenu'),
  sendButton: document.querySelector('.send-button'),
  modeButton: document.querySelector('#modeButton'),
  activeMode: document.querySelector('#activeMode'),
  modeMenu: document.querySelector('#modeMenu'),
  uploadFile: document.querySelector('#uploadFile'),
  fileInput: document.querySelector('#fileInput'),
  attachmentRow: document.querySelector('#attachmentRow'),
  replyBanner: document.querySelector('#replyBanner'),
  replyText: document.querySelector('#replyText'),
  cancelReply: document.querySelector('#cancelReply'),
  profileButton: document.querySelector('#profileButton'),
  profileLogout: document.querySelector('#profileLogout'),
  profileRail: document.querySelector('#profileRail'),
  accountMenu: document.querySelector('#accountMenu'),
  accountProfile: document.querySelector('#accountProfile'),
  accountSubscription: document.querySelector('#accountSubscription'),
  accountPersonalization: document.querySelector('#accountPersonalization'),
  profileModal: document.querySelector('#profileModal'),
  profileForm: document.querySelector('#profileForm'),
  closeProfile: document.querySelector('#closeProfile'),
  closeProfileTop: document.querySelector('#closeProfileTop'),
  profileName: document.querySelector('#profileName'),
  profilePlanBadge: document.querySelector('#profilePlanBadge'),
  profileEmail: document.querySelector('#profileEmail'),
  profileInitials: document.querySelector('#profileInitials'),
  profileAvatarPreview: document.querySelector('#profileAvatarPreview'),
  profileAvatarPick: document.querySelector('#profileAvatarPick'),
  profileAvatarPickText: document.querySelector('#profileAvatarPickText'),
  profileAvatarReset: document.querySelector('#profileAvatarReset'),
  profileAvatarInput: document.querySelector('#profileAvatarInput'),
  profileNameInput: document.querySelector('#profileNameInput'),
  profileEmailInput: document.querySelector('#profileEmailInput'),
  profileInitialsInput: document.querySelector('#profileInitialsInput'),
  creditList: document.querySelector('#creditList'),
  subscriptionModal: document.querySelector('#subscriptionModal'),
  closeSubscription: document.querySelector('#closeSubscription'),
  paymentModal: document.querySelector('#paymentModal'),
  paymentForm: document.querySelector('#paymentForm'),
  closePayment: document.querySelector('#closePayment'),
  cancelPayment: document.querySelector('#cancelPayment'),
  paymentTitle: document.querySelector('#paymentTitle'),
  paymentSubtitle: document.querySelector('#paymentSubtitle'),
  paymentQrImage: document.querySelector('#paymentQrImage'),
  paymentAmount: document.querySelector('#paymentAmount'),
  paymentPlan: document.querySelector('#paymentPlan'),
  paymentProofInput: document.querySelector('#paymentProofInput'),
  paymentProofPicker: document.querySelector('#paymentProofPicker'),
  paymentProofName: document.querySelector('#paymentProofName'),
  paymentProofPreview: document.querySelector('#paymentProofPreview'),
  paymentError: document.querySelector('#paymentError'),
  personalizationModal: document.querySelector('#personalizationModal'),
  closePersonalization: document.querySelector('#closePersonalization'),
  themeToggle: document.querySelector('#themeToggle'),
  renameChat: document.querySelector('#renameChat'),
  toggleHistory: document.querySelector('#toggleHistory'),
  actionModal: document.querySelector('#actionModal'),
  actionTitle: document.querySelector('#actionTitle'),
  actionMessage: document.querySelector('#actionMessage'),
  actionInput: document.querySelector('#actionInput'),
  actionButtons: document.querySelector('#actionButtons'),
  imagePreviewModal: document.querySelector('#imagePreviewModal'),
  imagePreviewClose: document.querySelector('#imagePreviewClose'),
  imagePreviewFull: document.querySelector('#imagePreviewFull')
};

let state = {
  profile: {},
  conversations: [],
  activeConversationId: null
};
let authMode = 'login';
let isAuthenticated = false;
let googleConfig = { configured: false, clientId: '' };
let googleReady = false;
let adminDashboardData = null;
let adminUsersCache = [];
let editingAdminUserId = null;
let activeChatMode = {
  plan: 'Free',
  model: 'gpt-5.5'
};
let pendingVerification = {
  email: '',
  token: ''
};
let pendingAttachments = [];
let replyTo = null;
let sending = false;
let pendingPayment = null;
let paymentProofDraft = '';
let statePollTimer = null;
let chatPinnedToBottom = true;
let userScrolledAwayFromBottom = false;
let editingMessageId = null;
const animatedMessageIds = new Set();
const runningAnimations = new Set();
let profileAvatarDraft = '';

const USER_TOKEN_KEY = 'depoizon_user_token';
const ADMIN_TOKEN_KEY = 'depoizon_admin_token';
const THEME_KEY = 'depoizon_theme';

function snapshotChatMode(mode = activeChatMode) {
  return {
    plan: ['Free', 'Pro', 'Ultra'].includes(mode?.plan) ? mode.plan : 'Free',
    model: typeof mode?.model === 'string' ? mode.model : 'gpt-5.5'
  };
}

function applyTheme(theme) {
  const useDark = theme === 'dark';
  document.body.classList.toggle('theme-dark', useDark);
  els.themeToggle?.setAttribute('aria-checked', String(useDark));
}

function currentTheme() {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

applyTheme(currentTheme());

function userToken() {
  return localStorage.getItem(USER_TOKEN_KEY) || '';
}

function adminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

function showOnly(view) {
  [els.authView, els.verifyView, els.adminLoginView, els.adminDashboardView, els.appShell].forEach((element) => {
    if (element) element.classList.toggle('hidden', element !== view);
  });
}

function showAppShell() {
  document.body.classList.remove('auth-boot');
  showOnly(els.appShell);
  els.authView.classList.add('hidden');
}

function updateAuthChrome() {
  els.topbarAuthActions.classList.toggle('hidden', isAuthenticated);
  els.profileButton.classList.toggle('hidden', !isAuthenticated);
  els.profileRail.classList.toggle('hidden', !isAuthenticated);
  els.guestCard.classList.toggle('hidden', isAuthenticated);
  els.renameChat.classList.toggle('hidden', !isAuthenticated);
}

function showGuestShell() {
  isAuthenticated = false;
  state = { profile: {}, conversations: [], activeConversationId: null };
  document.body.classList.remove('auth-boot');
  showOnly(els.appShell);
  els.authView.classList.add('hidden');
  setSidebarCollapsed(true);
  render();
  updateAuthChrome();
}

function openAuthModal(mode = 'login') {
  setAuthMode(mode);
  document.body.classList.remove('keyboard-open');
  els.authView.classList.remove('hidden');
  window.setTimeout(() => els.authEmail.focus(), 50);
}

function closeAuthModal() {
  els.authView.classList.add('hidden');
  document.body.classList.remove('keyboard-open');
}

function showAuthError(message) {
  els.authError.textContent = message;
  els.authError.classList.toggle('hidden', !message);
}

function showAdminError(message) {
  els.adminError.textContent = message;
  els.adminError.classList.toggle('hidden', !message);
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === 'register';
  els.authTitle.textContent = isRegister ? 'Create your account' : 'Welcome back';
  els.authSubmit.textContent = isRegister ? 'Create account' : 'Continue';
  els.googleAuthText.textContent = isRegister ? 'Register with Google' : 'Continue with Google';
  els.authSwitchText.textContent = isRegister ? 'Already have an account?' : "Don't have an account?";
  els.toggleAuthMode.textContent = isRegister ? 'Log in' : 'Sign up';
  els.authName.closest('.auth-name-field').classList.toggle('hidden', !isRegister);
  els.authPassword.autocomplete = isRegister ? 'new-password' : 'current-password';
  showAuthError('');
  renderGoogleButton();
}

async function authApi(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `Request gagal (${response.status})`);
    Object.assign(error, data);
    throw error;
  }
  return data;
}

function waitForGoogleIdentity() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google.accounts.id);
      return;
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(timer);
        resolve(window.google.accounts.id);
        return;
      }
      if (Date.now() - startedAt > 8000) {
        window.clearInterval(timer);
        reject(new Error('Google Sign-In belum siap. Cek koneksi internet lalu coba lagi.'));
      }
    }, 120);
  });
}

async function setupGoogleSignIn() {
  googleConfig = await authApi('/api/auth/google/config').catch(() => ({ configured: false, clientId: '' }));
  renderGoogleButton();
}

async function renderGoogleButton() {
  if (!els.googleButtonWrap) return;

  if (!googleConfig.configured) {
    els.googleAuth.classList.remove('hidden');
    els.googleAuth.disabled = false;
    els.googleAuthText.textContent = 'Setup Google Client ID';
    return;
  }

  try {
    const googleId = await waitForGoogleIdentity();
    if (!googleReady) {
      googleId.initialize({
        client_id: googleConfig.clientId,
        callback: handleGoogleCredential,
        ux_mode: 'popup',
        auto_select: false,
        cancel_on_tap_outside: true
      });
      googleReady = true;
    }

    els.googleButtonWrap.innerHTML = '<div id="googleRenderedButton"></div>';
    googleId.renderButton(document.querySelector('#googleRenderedButton'), {
      theme: 'outline',
      size: 'large',
      shape: 'rectangular',
      width: Math.min(280, Math.max(220, Math.round(els.authForm.getBoundingClientRect().width || 260))),
      text: authMode === 'register' ? 'signup_with' : 'continue_with'
    });
  } catch (err) {
    els.googleAuth.classList.remove('hidden');
    els.googleAuth.disabled = false;
    els.googleAuthText.textContent = 'Continue with Google';
    showAuthError(err.message);
  }
}

function refreshIcons() {
  if (!window.lucide?.createIcons) return;
  window.lucide.createIcons({
    attrs: {
      width: 20,
      height: 20,
      'stroke-width': 2.1
    }
  });
}

window.addEventListener('resize', () => {
  window.requestAnimationFrame(syncMessageActions);
  if (!isAdminMobileLayout()) closeAdminMobileNav();
});

async function api(path, options = {}) {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request gagal (${response.status})`);
  return data;
}

async function initAuth() {
  setAuthMode('login');
  await setupGoogleSignIn();

  if (location.pathname.startsWith('/admin')) {
    document.body.classList.remove('auth-boot');
    const token = adminToken();
    if (token) {
      const session = await authApi('/api/admin/session', {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => ({ admin: null }));
      if (session.admin) {
        await showAdminDashboard();
        return;
      }
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
    showOnly(els.adminLoginView);
    return;
  }

  const verifyToken = new URLSearchParams(location.search).get('token');
  if (location.pathname === '/verify' && verifyToken) {
    document.body.classList.remove('auth-boot');
    pendingVerification.token = verifyToken;
    pendingVerification.email = '';
    els.verifyEmail.textContent = 'Akun siap diverifikasi';
    showOnly(els.verifyView);
    return;
  }

  const token = userToken();
  if (token) {
    const session = await authApi('/api/auth/session', {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => ({ user: null }));
    if (session.user) {
      isAuthenticated = true;
      showAppShell();
      await loadState();
      return;
    }
    localStorage.removeItem(USER_TOKEN_KEY);
  }

  showGuestShell();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  showAuthError('');
  const email = els.authEmail.value.trim();
  const password = els.authPassword.value;
  const name = els.authName.value.trim();

  try {
    if (authMode === 'register') {
      const result = await authApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
      });
      pendingVerification = { email, token: result.verificationToken || '' };
      els.verifyEmail.textContent = email;
      els.verifyCode.value = '';
      showOnly(els.verifyView);
      return;
    }

    const result = await authApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem(USER_TOKEN_KEY, result.token);
    isAuthenticated = true;
    showAppShell();
    await loadState();
  } catch (err) {
    if (err.needsVerification) {
      pendingVerification = { email: err.email || email, token: err.verificationToken || '' };
      els.verifyEmail.textContent = pendingVerification.email;
      els.verifyCode.value = '';
      showOnly(els.verifyView);
      return;
    }
    showAuthError(err.message);
  }
}

async function handleGoogleCredential(response) {
  showAuthError('');

  try {
    const result = await authApi('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential: response?.credential })
    });
    localStorage.setItem(USER_TOKEN_KEY, result.token);
    isAuthenticated = true;
    showAppShell();
    await loadState();
  } catch (err) {
    showAuthError(err.message);
  }
}

function handleGoogleAuth() {
  if (!googleConfig.configured) {
    showAuthError('Google login belum aktif. Isi GOOGLE_CLIENT_ID di file .env lalu restart server.');
    return;
  }

  renderGoogleButton();
}

async function verifyPendingAccount() {
  try {
    const code = els.verifyCode.value.replace(/\D/g, '').slice(0, 6);
    if (!pendingVerification.token && code.length !== 6) {
      els.verifyEmail.textContent = 'Masukkan kode OTP 6 digit dari email.';
      return;
    }
    const result = await authApi('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        token: pendingVerification.token,
        email: pendingVerification.email,
        code
      })
    });
    localStorage.setItem(USER_TOKEN_KEY, result.token);
    isAuthenticated = true;
    history.replaceState(null, '', '/');
    showAppShell();
    await loadState();
  } catch (err) {
    els.verifyEmail.textContent = err.message;
  }
}

async function resendVerification() {
  if (!pendingVerification.email) return;
  const result = await authApi('/api/auth/resend', {
    method: 'POST',
    body: JSON.stringify({ email: pendingVerification.email })
  });
  pendingVerification.token = result.verificationToken || pendingVerification.token;
  els.verifyCode.value = '';
  els.verifyEmail.textContent = pendingVerification.email;
}

async function logoutUser() {
  const token = userToken();
  if (token) {
    await authApi('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  }
  localStorage.removeItem(USER_TOKEN_KEY);
  showGuestShell();
}

async function handleAdminLogin(event) {
  event.preventDefault();
  showAdminError('');

  try {
    const result = await authApi('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: els.adminEmail.value.trim(),
        password: els.adminPassword.value
      })
    });
    localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
    history.replaceState(null, '', '/admin/dashboard');
    await showAdminDashboard();
  } catch (err) {
    showAdminError(err.message);
  }
}

async function showAdminDashboard() {
  document.body.classList.remove('auth-boot');
  showOnly(els.adminDashboardView);
  closeAdminMobileNav();
  setAdminView('overview');
  const data = await authApi('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminToken()}` }
  });
  adminDashboardData = data;
  renderAdminDashboard(data);
  await loadAdminUsers();
}

function renderAdminDashboard(data) {
  const metrics = [
    ['users', 'Total Users', data.metrics.totalUsers, '+2.5% this month'],
    ['receipt-text', 'Pending Payments', data.metrics.pendingPayments || 0, 'Butuh review admin'],
    ['message-square', 'Active Sessions', data.metrics.activeSessions, '+5.1% today'],
    ['bot', 'Conversations', data.metrics.conversations, '+1.8% this week'],
    ['database', 'Messages', data.metrics.messages, '+10% total']
  ];

  els.adminMetrics.innerHTML = metrics.map(([icon, label, value, trend]) => `
    <article class="metric-card">
      <span class="metric-icon"><i data-lucide="${icon}"></i></span>
      <div><span>${label}</span><strong>${escapeHtml(value)}</strong><small>${trend}</small></div>
    </article>
  `).join('');

  els.adminUsers.innerHTML = (data.users || []).map((user) => `
    <tr>
      <td data-label="User">${escapeHtml(user.name || user.email)}</td>
      <td data-label="Email">${escapeHtml(user.email)}</td>
      <td data-label="Date">${new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
      <td data-label="Status">${statusPill(user)}</td>
      <td data-label="Provider">${escapeHtml(user.provider || 'email')}</td>
    </tr>
  `).join('') || '<tr><td colspan="5">Belum ada user.</td></tr>';
  renderAdminPayments(data.paymentRequests || []);
  renderAdminModelSettings(data.modelSettings || {});
  renderAdminAnalytics(data.modelAnalytics || {});
  renderAdminBroadcasts(data.broadcasts || [], data.broadcastMeta || {});
  renderAdminDigitalOcean(data.digitalOcean || {});
  refreshIcons();
}

function ensureAdminDigitalOceanPanel() {
  let panel = document.querySelector('#adminDigitalOceanPanel');
  if (panel || !els.adminOverviewPanel) return panel;
  panel = document.createElement('section');
  panel.className = 'admin-table-card admin-do-card';
  panel.id = 'adminDigitalOceanPanel';
  const signupCard = els.adminOverviewPanel.querySelector('.admin-table-card');
  els.adminOverviewPanel.insertBefore(panel, signupCard || null);
  return panel;
}

function formatMemoryMb(value = 0) {
  const mb = Number(value || 0);
  if (mb >= 1024) return `${Number((mb / 1024).toFixed(1))} GB`;
  return `${mb} MB`;
}

function formatUsd(value = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function formatMetricPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '-';
  return `${number.toFixed(number % 1 ? 1 : 0)}%`;
}

function renderDropletMetricPills(metrics = {}) {
  if (metrics.error) {
    return `<span class="admin-do-metric-error">${escapeHtml(metrics.error)}</span>`;
  }
  return [
    ['CPU', formatMetricPercent(metrics.cpuPercent)],
    ['RAM', formatMetricPercent(metrics.memoryPercent)],
    ['Disk', formatMetricPercent(metrics.diskPercent)],
    ['Load', Number.isFinite(Number(metrics.load1)) ? Number(metrics.load1).toFixed(2) : '-']
  ].map(([label, value]) => `<span>${label}: <strong>${escapeHtml(value)}</strong></span>`).join('');
}

function renderDigitalOceanBilling(billing = {}) {
  if (!billing || !Object.keys(billing).length) return '';
  if (!billing.ok) {
    return `
      <div class="admin-do-billing warning">
        <div class="admin-do-billing-title">
          <i data-lucide="credit-card"></i>
          <div>
            <strong>Billing belum terbaca</strong>
            <span>${escapeHtml(billing.error || 'Token perlu scope billing:read.')}</span>
          </div>
        </div>
        <small>Pastikan token DigitalOcean punya scope <code>billing:read</code>.</small>
      </div>
    `;
  }

  const creditHint = billing.creditSource === 'manual'
    ? 'Sisa credit dari data Credits control panel'
    : 'Sisa credit yang terbaca dari balance API';
  const cards = [
    ['badge-dollar-sign', 'Available Credits', formatUsd(billing.availableCredits), creditHint],
    ['receipt', 'Usage Bulan Ini', formatUsd(billing.monthToDateUsage), 'Pemakaian berjalan bulan ini'],
    ['wallet-cards', billing.amountDue > 0 ? 'Amount Due' : 'Account Balance', formatUsd(billing.amountDue || billing.accountBalance), 'Saldo/tagihan akun saat ini'],
    ['clock-3', 'Update Terakhir', billing.generatedAt ? formatDateTime(billing.generatedAt) : '-', 'Dari DigitalOcean balance API']
  ].map(([icon, label, value, hint]) => `
    <article class="admin-do-billing-card">
      <i data-lucide="${icon}"></i>
      <span>${label}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(hint)}</small>
    </article>
  `).join('');

  const history = (billing.history || []).map((item) => `
    <div class="admin-do-billing-row">
      <span>${escapeHtml(item.description)}</span>
      <strong>${escapeHtml(formatUsd(item.amount))}</strong>
      <small>${escapeHtml(item.date ? formatDateTime(item.date) : '-')}</small>
    </div>
  `).join('');
  const credit = billing.credit ? `
    <div class="admin-do-credit-row">
      <div>
        <strong>${escapeHtml(billing.credit.description || 'DigitalOcean credit')}</strong>
        <span>Expires: ${escapeHtml(billing.credit.expiration || '-')}</span>
      </div>
      <div>
        <small>Initial</small>
        <strong>${escapeHtml(formatUsd(billing.credit.initial || 0))}</strong>
      </div>
      <div>
        <small>Remaining</small>
        <strong>${escapeHtml(formatUsd(billing.credit.amountRemaining || billing.availableCredits || 0))}</strong>
      </div>
    </div>
  ` : '';

  return `
    <div class="admin-do-billing">
      <div class="admin-do-billing-title">
        <i data-lucide="wallet"></i>
        <div>
          <strong>Billing & Credits</strong>
          <span>Balance, credit, dan pemakaian DigitalOcean.</span>
        </div>
      </div>
      <div class="admin-do-billing-grid">${cards}</div>
      ${credit}
      ${history ? `<div class="admin-do-billing-history">${history}</div>` : ''}
      ${billing.historyError ? `<small class="admin-do-billing-note">${escapeHtml(billing.historyError)}</small>` : ''}
    </div>
  `;
}

function renderAdminDigitalOcean(data = {}) {
  const panel = ensureAdminDigitalOceanPanel();
  if (!panel) return;

  const head = `
    <div class="admin-card-head">
      <div>
        <h2>DigitalOcean VPS</h2>
        <span class="admin-hint">Ringkasan droplet dari DigitalOcean API read-only.</span>
      </div>
      <span class="admin-range-pill">${data.configured ? 'Terhubung' : 'Belum aktif'}</span>
    </div>
  `;

  if (!data.configured) {
    panel.innerHTML = `${head}
      <div class="admin-do-empty">
        <i data-lucide="key-round"></i>
        <div>
          <strong>Token belum dipasang</strong>
          <span>Isi <code>DIGITALOCEAN_API_TOKEN</code> di file <code>.env</code>, lalu restart server.</span>
        </div>
      </div>
    `;
    return;
  }

  if (data.error) {
    panel.innerHTML = `${head}
      <div class="admin-do-empty danger">
        <i data-lucide="triangle-alert"></i>
        <div>
          <strong>Gagal membaca DigitalOcean</strong>
          <span>${escapeHtml(data.error)}</span>
        </div>
      </div>
    `;
    return;
  }

  const totals = data.totals || {};
  const droplets = data.droplets || [];
  const statCards = [
    ['server', 'Droplets', totals.droplets || 0],
    ['activity', 'Active', totals.active || 0],
    ['cpu', 'vCPU', totals.vcpus || 0],
    ['memory-stick', 'RAM', formatMemoryMb(totals.memoryMb || 0)],
    ['hard-drive', 'Disk', `${Number(totals.diskGb || 0)} GB`]
  ].map(([icon, label, value]) => `
    <div class="admin-do-stat">
      <i data-lucide="${icon}"></i>
      <span>${label}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join('');

  const rows = droplets.map((droplet) => `
    <article class="admin-do-row">
      <div class="admin-do-main">
        <span class="do-status ${droplet.status === 'active' ? 'active' : ''}"></span>
        <div>
          <strong>${escapeHtml(droplet.name)}</strong>
          <small>${escapeHtml(droplet.sizeSlug)} - ${escapeHtml(droplet.region.slug)} - ${escapeHtml(droplet.image)}</small>
        </div>
      </div>
      <div class="admin-do-specs">
        <span>${escapeHtml(droplet.vcpus)} vCPU</span>
        <span>${escapeHtml(formatMemoryMb(droplet.memoryMb))}</span>
        <span>${escapeHtml(droplet.diskGb)} GB SSD</span>
      </div>
      <div class="admin-do-live">${renderDropletMetricPills(droplet.metrics || {})}</div>
      <div class="admin-do-ip">
        <span>${escapeHtml(droplet.publicIpv4 || 'No public IP')}</span>
        <small>${escapeHtml(droplet.createdAt ? formatDateTime(droplet.createdAt) : '-')}</small>
      </div>
    </article>
  `).join('');

  panel.innerHTML = `${head}
    <div class="admin-do-body">
      <div class="admin-do-account">
        <span>${escapeHtml(data.email || 'DigitalOcean account')}</span>
        <small>Status: ${escapeHtml(data.status || '-')} · Limit droplet: ${escapeHtml(data.dropletLimit || 0)}</small>
      </div>
      ${renderDigitalOceanBilling(data.billing || {})}
      <div class="admin-do-stats">${statCards}</div>
      <div class="admin-do-list">${rows || '<div class="admin-do-empty"><i data-lucide="server-off"></i><div><strong>Belum ada droplet</strong><span>Akun ini belum punya VPS yang terbaca.</span></div></div>'}</div>
    </div>
  `;
}

function setAdminView(view) {
  els.adminOverviewPanel.classList.toggle('hidden', view !== 'overview');
  els.adminUsersPanel.classList.toggle('hidden', view !== 'users');
  els.adminPaymentsPanel.classList.toggle('hidden', view !== 'payments');
  els.adminAnalyticsPanel?.classList.toggle('hidden', view !== 'analytics');
  els.adminModelsPanel?.classList.toggle('hidden', view !== 'models');
  els.adminBroadcastPanel?.classList.toggle('hidden', view !== 'broadcast');
  document.querySelector('.admin-topbar h1').textContent = view === 'payments'
    ? 'Payment Requests'
    : view === 'users'
      ? 'User Management'
      : view === 'analytics'
        ? 'Analytics'
      : view === 'models'
        ? 'Model Settings'
      : view === 'broadcast'
        ? 'Broadcast Board'
        : 'Overview';
  els.adminNavButtons.forEach((button) => button.classList.toggle('active', button.dataset.adminView === view));
  if (isAdminMobileLayout()) closeAdminMobileNav();
}

function toggleAdminSidebar() {
  if (isAdminMobileLayout()) {
    closeAdminMobileNav();
    return;
  }
  const collapsed = els.adminDashboardView.classList.toggle('admin-nav-collapsed');
  els.adminSidebarToggle?.setAttribute('aria-label', collapsed ? 'Buka navbar admin' : 'Tutup navbar admin');
  els.adminSidebarToggle?.setAttribute('title', collapsed ? 'Buka navbar' : 'Tutup navbar');
  const icon = els.adminSidebarToggle?.querySelector('i');
  icon?.setAttribute('data-lucide', collapsed ? 'panel-left-open' : 'panel-left-close');
  refreshIcons();
}

function isAdminMobileLayout() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function openAdminMobileNav() {
  if (!els.adminDashboardView) return;
  els.adminDashboardView.classList.add('admin-mobile-nav-open');
  els.adminMobileNavToggle?.setAttribute('aria-expanded', 'true');
}

function closeAdminMobileNav() {
  if (!els.adminDashboardView) return;
  els.adminDashboardView.classList.remove('admin-mobile-nav-open');
  els.adminMobileNavToggle?.setAttribute('aria-expanded', 'false');
}

function toggleAdminMobileNav() {
  if (els.adminDashboardView?.classList.contains('admin-mobile-nav-open')) {
    closeAdminMobileNav();
  } else {
    openAdminMobileNav();
  }
}

function statusPill(user) {
  if (user.frozen) return '<span class="status-pill frozen">Frozen</span>';
  if (!user.verified) return '<span class="status-pill pending">Pending</span>';
  return '<span class="status-pill">Active</span>';
}

function normalizePlan(plan = 'Free') {
  return ['Free', 'Pro', 'Ultra'].includes(plan) ? plan : 'Free';
}

function subscriptionExpiryText(user = {}) {
  const plan = normalizePlan(user.subscriptionPlan);
  if (plan === 'Free') return 'Paket gratis';
  const days = Number(user.subscriptionDaysLeft || 0);
  if (days > 0) return `Sisa ${days} hari`;
  return user.subscriptionExpiresAt ? `Aktif sampai ${formatDateTime(user.subscriptionExpiresAt)}` : 'Aktif 30 hari';
}

function adminPlanSelect(user) {
  const plan = normalizePlan(user.subscriptionPlan);
  const options = ['Free', 'Pro', 'Ultra'].map((item) =>
    `<option value="${item}" ${item === plan ? 'selected' : ''}>${item}</option>`
  ).join('');
  return `
    <div class="admin-plan-cell">
      <select class="admin-plan-select plan-${plan.toLowerCase()}" data-action="plan" aria-label="Titel user ${escapeHtml(user.name || user.email || '')}">${options}</select>
      <small>${escapeHtml(subscriptionExpiryText(user))}</small>
    </div>
  `;
}

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function paymentStatusBadge(status) {
  if (status === 'approved') return '<span class="status-pill">Approved</span>';
  if (status === 'rejected') return '<span class="status-pill frozen">Rejected</span>';
  return '<span class="status-pill pending">Pending</span>';
}

function chartPath(values = [], max = 1, width = 900, height = 260, padding = 28) {
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  if (!values.length) return '';
  return values.map((value, index) => {
    const x = padding + (values.length === 1 ? usableWidth / 2 : (index / (values.length - 1)) * usableWidth);
    const y = padding + usableHeight - ((Number(value || 0) / max) * usableHeight);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function chartPoints(values = [], max = 1, width = 900, height = 260, padding = 28) {
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  if (!values.length) return [];
  return values.map((value, index) => ({
    value: Number(value || 0),
    x: padding + (values.length === 1 ? usableWidth / 2 : (index / (values.length - 1)) * usableWidth),
    y: padding + usableHeight - ((Number(value || 0) / max) * usableHeight)
  }));
}

function renderAdminAnalytics(analytics = {}) {
  if (!els.adminAnalyticsSummary || !els.adminModelChart) return;
  const plans = [
    ['Free', '#19a974'],
    ['Pro', '#5b6cff'],
    ['Ultra', '#ffb020']
  ];
  const labels = analytics.labels || [];
  const series = analytics.series || {};
  const totals = analytics.totals || {};
  const percentages = analytics.percentages || {};
  const modelNames = analytics.modelNames || {};
  const totalRequests = Number(analytics.totalRequests || 0);
  const allValues = plans.flatMap(([plan]) => series[plan] || []);
  const max = Math.max(1, ...allValues);
  const yTicks = [max, Math.round(max * .66), Math.round(max * .33), 0];
  const topPlan = analytics.topPlan || {};
  const topPlanLabel = topPlan.total
    ? `${topPlan.plan} - ${topPlan.modelName || modelNames[topPlan.plan] || topPlan.plan}`
    : 'Belum ada data';
  const peakLabel = analytics.peakDay?.total
    ? `${analytics.peakDay.label} (${formatTokenNumber(analytics.peakDay.total)})`
    : '-';

  els.adminAnalyticsSummary.innerHTML = `
    <article class="analytics-insight">
      <span class="analytics-insight-icon"><i data-lucide="activity"></i></span>
      <div><small>Total aktivitas</small><strong>${formatTokenNumber(totalRequests)}</strong></div>
    </article>
    <article class="analytics-insight">
      <span class="analytics-insight-icon"><i data-lucide="trending-up"></i></span>
      <div><small>Model paling dipakai</small><strong>${escapeHtml(topPlanLabel)}</strong></div>
    </article>
    <article class="analytics-insight">
      <span class="analytics-insight-icon"><i data-lucide="calendar-days"></i></span>
      <div><small>Hari tersibuk</small><strong>${escapeHtml(peakLabel)}</strong></div>
    </article>
    <article class="analytics-insight">
      <span class="analytics-insight-icon"><i data-lucide="bar-chart-3"></i></span>
      <div><small>Rata-rata per hari</small><strong>${escapeHtml(analytics.averageDaily ?? 0)}</strong></div>
    </article>
  `;

  const planStats = plans.map(([plan, color]) => {
    const total = Number(totals[plan] || 0);
    const percent = Number(percentages[plan] ?? (totalRequests ? Math.round((total / totalRequests) * 100) : 0));
    return `
      <article class="analytics-stat">
        <span style="--stat-color:${color}"></span>
        <div><strong>${escapeHtml(plan)}</strong><small>${escapeHtml(modelNames[plan] || plan)} - ${percent}% dari pemakaian</small></div>
        <b>${formatTokenNumber(total)}</b>
      </article>
    `;
  }).join('');

  const paths = plans.map(([plan, color]) => {
    const values = series[plan] || [];
    const points = chartPoints(values, max)
      .filter((point) => point.value > 0)
      .map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4.2" fill="${color}"></circle>`)
      .join('');
    return `<path d="${chartPath(values, max)}" stroke="${color}" />${points}`;
  }).join('');
  const tickLabels = yTicks.map((value, index) =>
    `<span style="top:${index === 0 ? 24 : index === 3 ? 228 : 24 + index * 68}px">${formatTokenNumber(value)}</span>`
  ).join('');
  const axisLabels = labels.map((label, index) => {
    const left = labels.length === 1 ? 50 : (index / (labels.length - 1)) * 100;
    const transform = index === 0 ? 'translateX(0)' : index === labels.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)';
    return `<span style="left:${left}%;transform:${transform}">${escapeHtml(label)}</span>`;
  }).join('');

  els.adminModelChart.innerHTML = `
    <div class="analytics-plan-grid">${planStats}</div>
    <div class="model-chart-canvas">
      <div class="chart-y-labels" aria-hidden="true">${tickLabels}</div>
      <svg viewBox="0 0 900 260" preserveAspectRatio="none" aria-label="Kurva aktivitas model AI">
        <g class="chart-grid">
          <line x1="28" y1="28" x2="872" y2="28"></line>
          <line x1="28" y1="96" x2="872" y2="96"></line>
          <line x1="28" y1="164" x2="872" y2="164"></line>
          <line x1="28" y1="232" x2="872" y2="232"></line>
        </g>
        ${paths}
      </svg>
      <div class="chart-axis-labels">${axisLabels}</div>
    </div>
    <div class="analytics-legend">
      ${plans.map(([plan, color]) => `<span><i style="background:${color}"></i>${escapeHtml(plan)}</span>`).join('')}
    </div>
  `;
  refreshIcons();
}

function broadcastStatusBadge(status) {
  if (status === 'sent') return '<span class="status-pill">Terkirim</span>';
  if (status === 'partial') return '<span class="status-pill pending">Sebagian</span>';
  return '<span class="status-pill frozen">Gagal</span>';
}

function renderAdminBroadcasts(broadcasts = [], meta = {}) {
  if (!els.adminBroadcastHistory) return;
  const count = Number(meta.recipientCount || 0);
  if (els.adminBroadcastRecipientCount) {
    els.adminBroadcastRecipientCount.textContent = `${formatTokenNumber(count)} penerima`;
    els.adminBroadcastRecipientCount.title = meta.smtpConfigured
      ? 'SMTP aktif, notifikasi siap dikirim.'
      : 'SMTP belum dikonfigurasi di .env.';
  }
  if (els.adminBroadcastStatus && !meta.smtpConfigured) {
    els.adminBroadcastStatus.textContent = 'SMTP belum dikonfigurasi. Notifikasi akan gagal sampai SMTP_HOST, SMTP_USER, dan SMTP_PASS diisi.';
    els.adminBroadcastStatus.classList.add('warning');
  } else if (els.adminBroadcastStatus && !els.adminBroadcastStatus.dataset.keep) {
    els.adminBroadcastStatus.textContent = '';
    els.adminBroadcastStatus.classList.remove('warning', 'success', 'error');
  }

  els.adminBroadcastHistory.innerHTML = broadcasts.map((broadcast) => {
    const failedText = broadcast.failedCount
      ? `<small>${escapeHtml((broadcast.failedRecipients || []).map((item) => item.email).join(', ') || 'Ada email yang gagal dikirim.')}</small>`
      : '<small>Semua email berhasil diproses.</small>';
    return `
      <article class="broadcast-history-item">
        <div class="broadcast-history-main">
          <div class="broadcast-history-title">
            ${broadcastStatusBadge(broadcast.status)}
            <strong>${escapeHtml(broadcast.subject || 'Notifikasi')}</strong>
          </div>
          <p>${escapeHtml(broadcast.message || '').replace(/\r?\n/g, '<br>')}</p>
          ${failedText}
        </div>
        <div class="broadcast-history-meta">
          <b>${formatTokenNumber(broadcast.sentCount || 0)}/${formatTokenNumber(broadcast.recipientCount || 0)}</b>
          <span>${formatDateTime(broadcast.createdAt)}</span>
        </div>
      </article>
    `;
  }).join('') || '<p class="muted-action">Belum ada broadcast yang dikirim.</p>';
  refreshIcons();
}

function updateBroadcastPreview() {
  if (!els.adminBroadcastPreviewSubject || !els.adminBroadcastPreviewMessage) return;
  const subject = els.adminBroadcastSubject?.value.trim() || 'Judul email akan tampil di sini';
  const message = els.adminBroadcastMessage?.value.trim() || 'Isi pesan admin akan tampil sebagai preview email yang rapi dan profesional.';
  els.adminBroadcastPreviewSubject.textContent = subject;
  els.adminBroadcastPreviewMessage.textContent = message;
}

async function sendAdminBroadcast(event) {
  event.preventDefault();
  if (!els.adminBroadcastForm) return;
  const subject = els.adminBroadcastSubject.value.trim();
  const message = els.adminBroadcastMessage.value.trim();
  const recipientText = els.adminBroadcastRecipientCount?.textContent || 'semua user';
  const confirmed = await showConfirm(
    'Kirim notifikasi email?',
    `Pesan ini akan dikirim ke ${recipientText}.`,
    'Kirim'
  );
  if (!confirmed) return;

  els.adminBroadcastStatus.dataset.keep = '1';
  els.adminBroadcastStatus.className = 'broadcast-status';
  els.adminBroadcastStatus.textContent = 'Mengirim notifikasi...';
  els.adminBroadcastForm.querySelector('button[type="submit"]').disabled = true;

  try {
    const result = await authApi('/api/admin/broadcasts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken()}` },
      body: JSON.stringify({ subject, message })
    });
    adminDashboardData = {
      ...(adminDashboardData || {}),
      broadcasts: result.broadcasts || [],
      broadcastMeta: result.broadcastMeta || adminDashboardData?.broadcastMeta || {}
    };
    renderAdminBroadcasts(adminDashboardData.broadcasts || [], adminDashboardData.broadcastMeta || {});
    const sent = Number(result.broadcast?.sentCount || 0);
    const total = Number(result.broadcast?.recipientCount || 0);
    const failed = Number(result.broadcast?.failedCount || 0);
    els.adminBroadcastStatus.className = `broadcast-status ${failed ? 'warning' : 'success'}`;
    els.adminBroadcastStatus.textContent = failed
      ? `Terkirim ke ${sent}/${total} user. ${failed} email gagal diproses.`
      : `Notifikasi berhasil dikirim ke ${sent} user.`;
    els.adminBroadcastSubject.value = '';
    els.adminBroadcastMessage.value = '';
    updateBroadcastPreview();
  } catch (err) {
    els.adminBroadcastStatus.className = 'broadcast-status error';
    els.adminBroadcastStatus.textContent = err.message;
  } finally {
    delete els.adminBroadcastStatus.dataset.keep;
    els.adminBroadcastForm.querySelector('button[type="submit"]').disabled = false;
  }
}

function renderAdminPayments(requests = []) {
  if (!els.adminPaymentRequests) return;
  els.adminPaymentRequests.innerHTML = requests.map((request) => `
    <article class="payment-request-card" data-payment-id="${escapeHtml(request.id)}">
      <img src="${escapeHtml(request.proofImage)}" alt="Bukti pembayaran ${escapeHtml(request.plan)}">
      <div class="payment-request-copy">
        <div class="payment-request-head">
          <span class="plan-badge ${request.plan === 'Ultra' ? 'ultra-badge' : ''}"><i data-lucide="${request.plan === 'Ultra' ? 'crown' : 'badge-check'}"></i>${escapeHtml(request.plan)}</span>
          ${paymentStatusBadge(request.status)}
        </div>
        <strong>${escapeHtml(request.user?.name || request.userName || '-')}</strong>
        <small>${escapeHtml(request.user?.email || request.userEmail || '-')}</small>
        <span>${formatRupiah(request.amount)} • ${formatDateTime(request.createdAt)}</span>
      </div>
      <div class="payment-request-actions">
        <button type="button" data-payment-action="approve" ${request.status !== 'pending' ? 'disabled' : ''}>Terima</button>
        <button type="button" data-payment-action="reject" class="danger" ${request.status !== 'pending' ? 'disabled' : ''}>Tolak</button>
      </div>
    </article>
  `).join('') || '<p class="muted-action">Belum ada request pembayaran.</p>';

  els.adminPaymentRequests.querySelectorAll('[data-payment-action]').forEach((button) => {
    button.addEventListener('click', () => handleAdminPaymentAction(button.closest('.payment-request-card').dataset.paymentId, button.dataset.paymentAction));
  });
  refreshIcons();
}

function renderAdminModelSettings(settings = {}) {
  if (!els.adminModelSettings) return;
  const plans = ['Free', 'Pro', 'Ultra'];
  els.adminModelSettings.innerHTML = plans.map((plan) => {
    const model = settings[plan] || {};
    const credit = model.creditLimits || {};
    const primary = credit.primary || {};
    const weekly = credit.weekly || {};
    const icon = plan === 'Ultra' ? 'crown' : plan === 'Pro' ? 'badge-check' : 'sparkles';
    return `
      <article class="admin-model-item" data-model-plan="${plan}">
        <div class="admin-model-title">
          <span class="credit-icon credit-${plan.toLowerCase()}"><i data-lucide="${icon}"></i></span>
          <div>
            <strong>${escapeHtml(plan)}</strong>
            <small>${escapeHtml(model.modelName || plan)}</small>
          </div>
          <label class="admin-switch">
            <input type="checkbox" data-model-field="enabled" ${model.enabled !== false ? 'checked' : ''}>
            <span></span>
          </label>
        </div>
        <label>Nama tampilan <input data-model-field="modelName" value="${escapeHtml(model.modelName || '')}"></label>
        <label>Keterangan <textarea data-model-field="description" rows="3">${escapeHtml(model.description || '')}</textarea></label>
        <section class="admin-credit-policy" aria-label="Limit token ${plan}">
          <div class="admin-credit-policy-head">
            <strong>Limit token</strong>
            <small>${plan === 'Free' ? 'Default 50.000 per hari' : plan === 'Pro' ? 'Default 50.000/5 jam + 300.000/minggu' : 'Default 80.000/5 jam + 400.000/minggu'}</small>
          </div>
          <div class="admin-credit-grid">
            <label>Waktu reset
              <select data-credit-field="primaryPeriod">
                <option value="daily" ${credit.primaryPeriod === 'daily' ? 'selected' : ''}>Harian</option>
                <option value="hourly" ${credit.primaryPeriod === 'hourly' ? 'selected' : ''}>Per jam</option>
                <option value="weekly" ${credit.primaryPeriod === 'weekly' ? 'selected' : ''}>Mingguan</option>
              </select>
            </label>
            <label class="credit-hours-field">Interval jam
              <input data-credit-field="primaryWindowHours" type="number" min="1" max="168" step="1" value="${escapeHtml(credit.primaryWindowHours || 5)}">
            </label>
            <label>Input token
              <input data-credit-field="primaryInput" type="number" min="0" step="1000" value="${escapeHtml(primary.input ?? 0)}">
            </label>
            <label>Output token
              <input data-credit-field="primaryOutput" type="number" min="0" step="1000" value="${escapeHtml(primary.output ?? 0)}">
            </label>
            ${weekly.input !== undefined ? `
              <label>Mingguan input
                <input data-credit-field="weeklyInput" type="number" min="0" step="1000" value="${escapeHtml(weekly.input ?? 0)}">
              </label>
              <label>Mingguan output
                <input data-credit-field="weeklyOutput" type="number" min="0" step="1000" value="${escapeHtml(weekly.output ?? 0)}">
              </label>
            ` : ''}
          </div>
        </section>
        <button class="secondary-button" type="button" data-save-model="${plan}">Simpan ${escapeHtml(plan)}</button>
      </article>
    `;
  }).join('');

  els.adminModelSettings.querySelectorAll('[data-save-model]').forEach((button) => {
    button.addEventListener('click', () => saveAdminModelSetting(button.dataset.saveModel));
  });
  els.adminModelSettings.querySelectorAll('[data-credit-field="primaryPeriod"]').forEach((select) => {
    const sync = () => {
      const card = select.closest('.admin-model-item');
      const hoursInput = card?.querySelector('[data-credit-field="primaryWindowHours"]');
      if (hoursInput) hoursInput.disabled = select.value !== 'hourly';
    };
    select.addEventListener('change', sync);
    sync();
  });
  refreshIcons();
}

async function saveAdminModelSetting(plan) {
  const card = els.adminModelSettings?.querySelector(`[data-model-plan="${plan}"]`);
  if (!card) return;
  const payload = {
    settings: {
      [plan]: {
        enabled: card.querySelector('[data-model-field="enabled"]')?.checked || false,
        modelName: card.querySelector('[data-model-field="modelName"]')?.value || '',
        description: card.querySelector('[data-model-field="description"]')?.value || '',
        creditLimits: {
          primaryPeriod: card.querySelector('[data-credit-field="primaryPeriod"]')?.value || 'daily',
          primaryWindowHours: Number(card.querySelector('[data-credit-field="primaryWindowHours"]')?.value || 5),
          primary: {
            input: Number(card.querySelector('[data-credit-field="primaryInput"]')?.value || 0),
            output: Number(card.querySelector('[data-credit-field="primaryOutput"]')?.value || 0)
          },
          weekly: card.querySelector('[data-credit-field="weeklyInput"]') ? {
            input: Number(card.querySelector('[data-credit-field="weeklyInput"]')?.value || 0),
            output: Number(card.querySelector('[data-credit-field="weeklyOutput"]')?.value || 0)
          } : undefined
        }
      }
    }
  };
  const result = await authApi('/api/admin/model-settings', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken()}` },
    body: JSON.stringify(payload)
  });
  adminDashboardData = { ...(adminDashboardData || {}), modelSettings: result.modelSettings };
  renderAdminModelSettings(result.modelSettings || {});
  await refreshAdminData();
}

async function handleAdminPaymentAction(id, action) {
  const confirmed = await showConfirm(
    action === 'approve' ? 'Terima pembayaran?' : 'Tolak pembayaran?',
    action === 'approve' ? 'Paket user akan aktif 30 hari setelah diterima.' : 'User tidak akan mendapatkan akses paket ini.',
    action === 'approve' ? 'Terima' : 'Tolak'
  );
  if (!confirmed) return;
  await authApi(`/api/admin/payments/${id}/${action === 'approve' ? 'approve' : 'reject'}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken()}` },
    body: JSON.stringify({})
  });
  await refreshAdminData();
}

async function loadAdminUsers(query = '') {
  const suffix = query ? `?q=${encodeURIComponent(query)}` : '';
  const data = await authApi(`/api/admin/users${suffix}`, {
    headers: { Authorization: `Bearer ${adminToken()}` }
  });
  adminUsersCache = data.users || [];
  renderAdminUsers(data.users || []);
}

function renderAdminUsers(users) {
  els.adminUserRows.innerHTML = users.map((user) => `
    <tr data-user-id="${escapeHtml(user.id)}">
      <td data-label="Username"><strong>${escapeHtml(user.name || '-')}</strong></td>
      <td data-label="Email">${escapeHtml(user.email || '-')}</td>
      <td data-label="Titel">${adminPlanSelect(user)}</td>
      <td data-label="Provider">${escapeHtml(user.provider || 'email')}</td>
      <td data-label="Status">${statusPill(user)}</td>
      <td data-label="Last login">${formatDateTime(user.lastLoginAt)}</td>
      <td data-label="Action">
        <div class="admin-row-actions">
          <button type="button" data-action="edit">Edit</button>
          <button type="button" data-action="freeze">${user.frozen ? 'Unfreeze' : 'Freeze'}</button>
          <button type="button" data-action="delete" class="danger">Hapus</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7">Belum ada user.</td></tr>';

  els.adminUserRows.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', () => handleAdminUserAction(button.closest('tr').dataset.userId, button.dataset.action));
  });
  els.adminUserRows.querySelectorAll('select[data-action="plan"]').forEach((select) => {
    select.addEventListener('change', () => handleAdminPlanChange(select.closest('tr').dataset.userId, select.value, select));
  });
}

function findAdminUser(id) {
  const cached = adminUsersCache.find((user) => user.id === id);
  if (cached) return {
    ...cached,
    subscriptionPlan: normalizePlan(cached.subscriptionPlan)
  };
  const row = Array.from(els.adminUserRows.querySelectorAll('tr')).find((item) => item.dataset.userId === id);
  if (!row) return null;
  return {
    id,
    name: row.children[0]?.innerText?.trim() || '',
    email: row.children[1]?.innerText?.trim() || '',
    subscriptionPlan: normalizePlan(row.children[2]?.querySelector('select')?.value),
    provider: row.children[3]?.innerText?.trim() || '',
    frozen: row.children[4]?.innerText?.trim() === 'Frozen',
    verified: row.children[4]?.innerText?.trim() !== 'Pending'
  };
}

async function handleAdminPlanChange(id, plan, select) {
  const user = findAdminUser(id);
  if (!user) return;
  const previousPlan = normalizePlan(user.subscriptionPlan);
  const nextPlan = normalizePlan(plan);
  select.disabled = true;
  try {
    await authApi(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken()}` },
      body: JSON.stringify({ subscriptionPlan: nextPlan })
    });
    select.className = `admin-plan-select plan-${nextPlan.toLowerCase()}`;
    await refreshAdminData();
  } catch (err) {
    select.value = previousPlan;
    select.className = `admin-plan-select plan-${previousPlan.toLowerCase()}`;
    await showConfirm('Gagal mengubah titel', err.message, 'OK');
  } finally {
    select.disabled = false;
  }
}

async function handleAdminUserAction(id, action) {
  const user = findAdminUser(id);
  if (!user) return;

  if (action === 'edit') {
    editingAdminUserId = id;
    els.adminUserError.classList.add('hidden');
    els.adminEditName.value = user.name;
    els.adminEditEmail.value = user.email;
    els.adminEditPlan.value = normalizePlan(user.subscriptionPlan);
    els.adminEditPassword.value = '';
    els.adminEditVerified.checked = user.verified;
    els.adminEditFrozen.checked = user.frozen;
    els.adminUserModal.showModal();
    return;
  }

  if (action === 'freeze') {
    await authApi(`/api/admin/users/${id}/freeze`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken()}` },
      body: JSON.stringify({ frozen: !user.frozen })
    });
    await refreshAdminData();
    return;
  }

  if (action === 'delete') {
    const confirmed = await showConfirm('Hapus user?', `User ${user.email} akan dihapus dan session-nya dicabut.`, 'Hapus');
    if (!confirmed) return;
    await authApi(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken()}` }
    });
    await refreshAdminData();
  }
}

async function saveAdminUser(event) {
  event.preventDefault();
  if (!editingAdminUserId) return;
  els.adminUserError.classList.add('hidden');

  try {
    await authApi(`/api/admin/users/${editingAdminUserId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken()}` },
      body: JSON.stringify({
        name: els.adminEditName.value,
        email: els.adminEditEmail.value,
        subscriptionPlan: els.adminEditPlan.value,
        password: els.adminEditPassword.value,
        verified: els.adminEditVerified.checked,
        frozen: els.adminEditFrozen.checked
      })
    });
    els.adminUserModal.close();
    editingAdminUserId = null;
    await refreshAdminData();
  } catch (err) {
    els.adminUserError.textContent = err.message;
    els.adminUserError.classList.remove('hidden');
  }
}

async function refreshAdminData() {
  const data = await authApi('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${adminToken()}` }
  });
  adminDashboardData = data;
  renderAdminDashboard(data);
  await loadAdminUsers();
}

function activeConversation() {
  return state.conversations.find((item) => item.id === state.activeConversationId) || null;
}

function hasPendingMessage(conversationId = null) {
  return state.conversations.some((conversation) =>
    (!conversationId || conversation.id === conversationId) &&
    conversation.messages?.some((message) => message.role === 'assistant' && message.isLoading)
  );
}

function hasActivePendingMessage() {
  return hasPendingMessage(state.activeConversationId);
}

function isChatNearBottom(threshold = 140) {
  if (!els.chatView) return true;
  const distance = els.chatView.scrollHeight - els.chatView.scrollTop - els.chatView.clientHeight;
  return distance <= threshold;
}

function scrollChatToBottom() {
  els.chatView.scrollTop = els.chatView.scrollHeight;
  chatPinnedToBottom = true;
  userScrolledAwayFromBottom = false;
}

function setSendButtonIcon(waiting) {
  const icon = document.createElement(waiting ? 'span' : 'i');
  if (waiting) {
    icon.className = 'stop-icon';
    icon.setAttribute('aria-hidden', 'true');
  } else {
    icon.setAttribute('data-lucide', 'arrow-up');
  }
  els.sendButton.replaceChildren(icon);
  if (!waiting) refreshIcons();
}

function updateProcessingState() {
  const activePending = hasActivePendingMessage();
  const pendingAnywhere = hasPendingMessage();
  sending = activePending;
  els.attachButton.disabled = sending;
  els.sendButton.disabled = false;
  els.newChat.disabled = false;
  els.newChatRail.disabled = false;
  els.messageInput.disabled = false;
  els.messageInput.placeholder = 'Tanyakan Apa Saja';
  els.sendButton.classList.toggle('is-waiting', sending);
  els.sendButton.setAttribute('aria-disabled', String(sending));
  els.sendButton.setAttribute('aria-label', sending ? 'Batalkan jawaban' : 'Kirim');
  els.sendButton.setAttribute('title', sending ? 'Batalkan jawaban' : 'Kirim');
  const hasStopIcon = Boolean(els.sendButton.querySelector('.stop-icon'));
  const hasSendIcon = Boolean(els.sendButton.querySelector('svg, [data-lucide="arrow-up"]'));
  if ((sending && !hasStopIcon) || (!sending && !hasSendIcon)) {
    setSendButtonIcon(sending);
  }

  if (pendingAnywhere && !statePollTimer) {
    statePollTimer = window.setInterval(() => {
      loadState().catch(() => {});
    }, 2500);
  }

  if (!pendingAnywhere && statePollTimer) {
    window.clearInterval(statePollTimer);
    statePollTimer = null;
  }
}

async function cancelPendingResponse() {
  if (!hasActivePendingMessage()) return;
  try {
    await api('/api/chat/cancel', {
      method: 'POST',
      body: JSON.stringify({ conversationId: state.activeConversationId })
    });
  } catch (err) {
    await showActionModal({
      title: 'Gagal membatalkan',
      message: err.message,
      inputValue: null,
      buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
    });
  } finally {
    sending = false;
    await loadState();
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeLanguageLabel(language = '') {
  const clean = String(language || '').trim().toLowerCase();
  const labels = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    c: 'C',
    cpp: 'C++',
    'c++': 'C++',
    cc: 'C++',
    hpp: 'C++',
    java: 'Java',
    php: 'PHP',
    go: 'Go',
    golang: 'Go',
    rust: 'Rust',
    rs: 'Rust',
    sql: 'SQL',
    csharp: 'C#',
    'c#': 'C#',
    cs: 'C#',
    python: 'Python',
    py: 'Python',
    bash: 'Bash',
    shell: 'Shell',
    prompt: 'Prompt',
    kode: 'Kode',
    code: 'Kode'
  };
  return labels[clean] || (clean ? clean.toUpperCase() : 'Kode');
}

function inferCodeLanguage(code = '', fallback = '') {
  if (fallback) return normalizeLanguageLabel(fallback);
  const sample = String(code || '').trim();
  if (/<!doctype html|<html|<head|<body|<\/[a-z][\s\S]*>/i.test(sample)) return 'HTML';
  if (/#include\s*<|using\s+namespace\s+std|std::|cout\s*<<|cin\s*>>|int\s+main\s*\(/i.test(sample)) return 'C++';
  if (/\b(public\s+class|System\.out\.println|public\s+static\s+void\s+main)\b/i.test(sample)) return 'Java';
  if (/<\?php|\becho\s+['"]|\$\w+\s*=/i.test(sample)) return 'PHP';
  if (/\bpackage\s+main\b|fmt\.Println|func\s+main\s*\(/i.test(sample)) return 'Go';
  if (/\bfn\s+main\s*\(|println!\s*\(/i.test(sample)) return 'Rust';
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE)\b[\s\S]*\bFROM\b/i.test(sample)) return 'SQL';
  if (/(^|\n)\s*(function|const|let|var|import|export)\s|=>|console\.log/i.test(sample)) return 'JavaScript';
  if (/(^|\n)\s*(body|\.|#|:root|@media)[^{]*\{[\s\S]*\}/i.test(sample)) return 'CSS';
  if (/^\s*[{[][\s\S]*[}\]]\s*$/.test(sample)) return 'JSON';
  if (/(^|\n)\s*(def|import|from|print)\s/i.test(sample)) return 'Python';
  return normalizeLanguageLabel(fallback);
}

function formatHtmlCode(code = '') {
  const compact = String(code || '').replace(/>\s+</g, '><').trim();
  if (!compact.includes('<')) return String(code || '').trim();

  const tokens = compact
    .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  let indent = 0;
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

  return tokens.map((token) => {
    const closing = /^<\//.test(token);
    const tagName = token.match(/^<\/?\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase() || '';
    const selfClosing = /\/>$/.test(token) || voidTags.has(tagName) || /^<!/.test(token);
    if (closing) indent = Math.max(indent - 1, 0);
    const line = `${'  '.repeat(indent)}${token}`;
    if (!closing && !selfClosing && /^<[a-z]/i.test(token) && !token.includes(`</${tagName}>`)) {
      indent += 1;
    }
    return line;
  }).join('\n');
}

function formatJsonCode(code = '') {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch (err) {
    return String(code || '').trim();
  }
}

function splitStatements(line = '') {
  const parts = [];
  let current = '';
  let quote = '';
  let escaped = false;
  let parenDepth = 0;
  let initializerDepth = 0;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    current += char;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }

    if (char === '(') parenDepth += 1;
    if (char === ')') parenDepth = Math.max(parenDepth - 1, 0);

    if (char === '{' && /=\s*$/.test(current.slice(0, -1))) {
      initializerDepth += 1;
      continue;
    }
    if (char === '}' && initializerDepth > 0) {
      initializerDepth -= 1;
      continue;
    }

    if ((char === ';' && parenDepth === 0) || (char === '{' && initializerDepth === 0) || (char === '}' && initializerDepth === 0)) {
      parts.push(current.trim());
      current = '';
    }
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function formatBraceCode(code = '') {
  const prepared = String(code || '')
    .replace(/\r/g, '')
    .replace(/\s*(#include\s*<)/g, '\n$1')
    .replace(/\s*(using\s+namespace\s+)/g, '\n$1')
    .replace(/\s*(int\s+main\s*\()/g, '\n$1')
    .replace(/\s*(\/\/\s*[A-Z]\.)/g, '\n$1')
    .replace(/\s+(for\s*\()/g, '\n$1')
    .replace(/\s+(while\s*\()/g, '\n$1')
    .replace(/\s+(if\s*\()/g, '\n$1')
    .replace(/\s+(else\b)/g, '\n$1')
    .replace(/(\/\/[^\n]*?)(?=\s+(?:stack|queue|vector|map|set|int|float|double|char|bool|string|auto|cout|cin|while|for|return)\b)/g, '$1\n');

  const statements = prepared
    .split('\n')
    .flatMap(splitStatements)
    .map((line) => line.trim())
    .filter(Boolean);

  let indent = 0;
  return statements.map((line) => {
    if (/^}/.test(line)) indent = Math.max(indent - 1, 0);
    const formatted = `${'  '.repeat(indent)}${line}`;
    if (/[{]$/.test(line) && !/^}/.test(line)) indent += 1;
    return formatted;
  }).join('\n');
}

function formatCodeForDisplay(code = '', label = '') {
  const clean = String(code || '').trim();
  const normalized = normalizeLanguageLabel(label);
  if (normalized === 'HTML') return formatHtmlCode(clean);
  if (normalized === 'JSON') return formatJsonCode(clean);
  if (['C', 'C++', 'C#', 'JavaScript', 'TypeScript', 'Java', 'PHP', 'Go', 'Rust'].includes(normalized)) return formatBraceCode(clean);
  return clean;
}

function highlightGenericCode(code = '') {
  const keywordPattern = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|import|export|from|class|new|async|await|def|true|false|null|using|namespace|public|private|protected|static|void|int|float|double|char|bool|string|auto|struct|template|typename)\b/g;
  const functionPattern = /\b(cout|cin|endl|stack|queue|vector|map|set|std|main|push|pop|top|front|empty|size)\b/g;

  const highlightBody = (body) => {
    const strings = [];
    let escaped = escapeHtml(body).replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, (value) => {
      const key = `@@STR${strings.length}@@`;
      strings.push(`<span class="tok-string">${value}</span>`);
      return key;
    });

    escaped = escaped
      .replace(keywordPattern, '<span class="tok-keyword">$1</span>')
      .replace(functionPattern, '<span class="tok-function">$1</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-number">$1</span>');

    strings.forEach((value, index) => {
      escaped = escaped.replace(`@@STR${index}@@`, value);
    });
    return escaped;
  };

  return String(code || '').split('\n').map((line) => {
    if (/^\s*#\s*(include|define|ifdef|ifndef|endif)/.test(line)) {
      return `<span class="tok-preprocessor">${escapeHtml(line)}</span>`;
    }

    const commentIndex = line.indexOf('//');
    if (commentIndex >= 0) {
      return `${highlightBody(line.slice(0, commentIndex))}<span class="tok-comment">${escapeHtml(line.slice(commentIndex))}</span>`;
    }

    return highlightBody(line);
  }).join('\n');
}

function highlightHtmlCode(code = '') {
  return escapeHtml(code).replace(/(&lt;\/?)([a-zA-Z0-9-]+)(.*?)(\/?&gt;)/g, (match, open, tag, attrs, close) => {
    const highlightedAttrs = attrs
      .replace(/\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)(=)(&quot;.*?&quot;|'.*?')/g, ' <span class="tok-attr">$1</span>$2<span class="tok-string">$3</span>');
    return `<span class="tok-tag">${open}${tag}</span>${highlightedAttrs}<span class="tok-tag">${close}</span>`;
  });
}

function highlightCodeForDisplay(code = '', label = '') {
  const normalized = normalizeLanguageLabel(label);
  if (normalized === 'HTML') return highlightHtmlCode(code);
  return highlightGenericCode(code);
}

function codeFileExtension(label = '', code = '') {
  let normalized = normalizeLanguageLabel(label);
  if (!normalized || normalized === 'Kode') {
    normalized = inferCodeLanguage(code);
  }
  const extensions = {
    HTML: 'html',
    CSS: 'css',
    JavaScript: 'js',
    TypeScript: 'ts',
    JSON: 'json',
    Python: 'py',
    'C++': 'cpp',
    C: 'c',
    'C#': 'cs',
    Java: 'java',
    PHP: 'php',
    Go: 'go',
    Rust: 'rs',
    SQL: 'sql',
    Bash: 'sh',
    Shell: 'sh',
    Prompt: 'txt',
    Kode: 'txt'
  };
  return extensions[normalized] || 'txt';
}

function fileNameExtension(name = '') {
  const clean = String(name || '');
  if (!clean.includes('.')) return '';
  if (/^\.[a-z0-9_-]+(?:\.[a-z0-9_-]+)?$/i.test(clean) && !clean.slice(1).includes('/')) {
    return clean.split('.').slice(1).join('.');
  }
  return clean.split('.').pop()?.toLowerCase() || '';
}

function safeDownloadName(value = 'program') {
  const clean = String(value || 'program')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/\.{2,}/g, '.')
    .slice(0, 80);
  return clean || 'program';
}

function safeDownloadPath(value = 'program') {
  const segments = String(value || 'program')
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => safeDownloadName(segment))
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..')
    .slice(-6);
  return segments.join('/') || safeDownloadName(value);
}

function topicDownloadName(extension = 'zip') {
  return `${topicDownloadBase()}.${extension}`;
}

function topicDownloadBase() {
  const conversation = activeConversation?.();
  const title = conversation?.title && conversation.title !== 'Percakapan Baru'
    ? conversation.title
    : conversation?.messages?.find((message) => message.role === 'user' && message.content)?.content
      || 'program';
  const stopWords = new Set(['buatkan', 'buat', 'saya', 'tolong', 'program', 'aplikasi', 'website', 'file', 'kode', 'codingan', 'dengan', 'untuk', 'yang', 'dan', 'agar', 'tema', 'pakai', 'menggunakan']);
  const words = String(title || 'program')
    .toLowerCase()
    .replace(/\.[a-z0-9]{1,6}\b/g, ' ')
    .replace(/[^a-z0-9\s-]+/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word))
    .slice(0, 8);
  return safeDownloadName(words.join('-') || title || 'program');
}

function filenameFromContext(text = '', expectedExt = '') {
  const allowed = expectedExt
    ? expectedExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    : 'html|css|js|ts|json|py|php|java|c|cpp|cs|go|rs|sql|sh|txt|md';
  const patterns = [
    new RegExp(`(?:nama\\s*file|file|filename|path)\\s*[:=\\-]\\s*([\\w ._/-]+?\\.(${allowed}))\\b`, 'i'),
    new RegExp(`(?:^|[\\s"'` + '`' + `([{])([\\w._/-]+\\.(${allowed}))\\b`, 'i')
  ];
  for (const pattern of patterns) {
    const match = String(text || '').match(pattern);
    if (match?.[1]) return safeDownloadPath(match[1]);
  }
  return '';
}

function filenameFromCodeComment(code = '', expectedExt = '') {
  const head = String(code || '').split('\n').slice(0, 6).join('\n');
  return filenameFromContext(head, expectedExt);
}

function descriptiveTextFileName(part, index) {
  const text = `${part.context || ''}\n${part.content || ''}`.toLowerCase();
  const label = normalizeLanguageLabel(part.label);
  if (/\b(readme|panduan penggunaan|dokumentasi)\b/.test(text)) return 'README.md';
  if (/\b(cara\s*(install|instal|penginstalan|pemasangan)|installation|setup|npm install|composer install|pip install)\b/.test(text)) return 'cara-instalasi.txt';
  if (/\b(instruksi|petunjuk|langkah-langkah|cara menjalankan|cara pakai|usage)\b/.test(text)) return 'instruksi.txt';
  if (/\b(catatan|note|penting|perhatian)\b/.test(text)) return 'catatan.txt';
  if (/\b(struktur folder|struktur file|folder structure|tree|direktori)\b/.test(text) || /(^|\n)\s*(src|scripts|assets|public|admin|components)\//.test(text)) return 'struktur-folder.txt';
  if (/\b(env|environment|variabel)\b/.test(text) && /[A-Z0-9_]+\s*=/.test(part.content || '')) return 'env.example';
  if (label === 'Prompt') return 'prompt.txt';
  return `${topicDownloadBase()}-${index + 1}.txt`;
}

function defaultFileNameForCode(part, index, usedNames) {
  const ext = codeFileExtension(part.label, part.content);
  let normalized = normalizeLanguageLabel(part.label);
  if (!normalized || normalized === 'Kode') normalized = inferCodeLanguage(part.content);
  const content = String(part.content || '');
  const contextName = filenameFromContext(part.context || '', ext);
  const commentName = filenameFromCodeComment(content, ext);
  let name = contextName || commentName;

  if (!name) {
    const defaults = {
      HTML: 'index.html',
      CSS: 'style.css',
      JavaScript: 'script.js',
      TypeScript: 'script.ts',
      JSON: 'data.json',
      Python: 'main.py',
      PHP: 'index.php',
      Java: 'Main.java',
      'C++': 'main.cpp',
      C: 'main.c',
      'C#': 'Program.cs',
      Go: 'main.go',
      Rust: 'main.rs',
      SQL: 'schema.sql',
      Bash: 'setup.sh',
      Shell: 'setup.sh',
      Prompt: 'prompt.txt'
    };
    name = defaults[normalized] || descriptiveTextFileName(part, index);
  }

  name = name.includes('/') || name.includes('\\') ? safeDownloadPath(name) : safeDownloadName(name);
  if (fileNameExtension(name) !== ext) name = `${name}.${ext}`;

  const base = name.slice(0, -(ext.length + 1));
  let unique = name;
  let counter = 2;
  while (usedNames.has(unique.toLowerCase())) {
    unique = `${base}-${counter}.${ext}`;
    counter += 1;
  }
  usedNames.add(unique.toLowerCase());
  return unique;
}

function replaceGenericKodeName(file, index, usedNames) {
  const name = String(file.name || '');
  const normalized = name.replace(/\\/g, '/');
  const leaf = normalized.split('/').pop() || normalized;
  if (!/^kode-\d+(?:\.[a-z0-9]{1,6})?$/i.test(leaf)) {
    usedNames.add(normalized.toLowerCase());
    return file;
  }

  const ext = fileNameExtension(leaf) || codeFileExtension('', file.content);
  const descriptive = descriptiveTextFileName({ content: file.content, label: ext === 'txt' ? 'Kode' : '' }, index);
  const baseName = ext === 'txt' ? descriptive : `${topicDownloadBase()}-${index + 1}.${ext}`;
  let nextName = fileNameExtension(baseName) ? baseName : `${baseName}.${ext}`;
  let counter = 2;
  while (usedNames.has(nextName.toLowerCase())) {
    const currentExt = fileNameExtension(nextName) || ext;
    const base = nextName.slice(0, -(currentExt.length + 1));
    nextName = `${base}-${counter}.${currentExt}`;
    counter += 1;
  }
  usedNames.add(nextName.toLowerCase());
  return { ...file, name: nextName };
}

function codeDownloadFiles(parts = []) {
  const usedNames = new Set();
  const files = parts
    .filter((part) => ['code', 'prompt'].includes(part.type) && String(part.content || '').trim())
    .map((part, index) => {
      return {
        name: defaultFileNameForCode(part, index, usedNames),
        content: part.content
      };
    });
  const finalNames = new Set();
  return files.map((file, index) => replaceGenericKodeName(file, index, finalNames));
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

const zipCrcTable = (() => {
  const table = [];
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  bytes.forEach((byte) => {
    crc = zipCrcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function pushUint16(target, value) {
  target.push(value & 0xff, (value >>> 8) & 0xff);
}

function pushUint32(target, value) {
  target.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function createZipBlob(files = []) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const { dosTime, dosDate } = dosDateTime();

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.content);
    const checksum = crc32(dataBytes);
    const local = [];
    pushUint32(local, 0x04034b50);
    pushUint16(local, 20);
    pushUint16(local, 0);
    pushUint16(local, 0);
    pushUint16(local, dosTime);
    pushUint16(local, dosDate);
    pushUint32(local, checksum);
    pushUint32(local, dataBytes.length);
    pushUint32(local, dataBytes.length);
    pushUint16(local, nameBytes.length);
    pushUint16(local, 0);
    chunks.push(new Uint8Array(local), nameBytes, dataBytes);

    const header = [];
    pushUint32(header, 0x02014b50);
    pushUint16(header, 20);
    pushUint16(header, 20);
    pushUint16(header, 0);
    pushUint16(header, 0);
    pushUint16(header, dosTime);
    pushUint16(header, dosDate);
    pushUint32(header, checksum);
    pushUint32(header, dataBytes.length);
    pushUint32(header, dataBytes.length);
    pushUint16(header, nameBytes.length);
    pushUint16(header, 0);
    pushUint16(header, 0);
    pushUint16(header, 0);
    pushUint16(header, 0);
    pushUint32(header, 0);
    pushUint32(header, offset);
    central.push(new Uint8Array(header), nameBytes);

    offset += local.length + nameBytes.length + dataBytes.length;
  });

  const centralSize = central.reduce((sum, chunk) => sum + chunk.length, 0);
  const end = [];
  pushUint32(end, 0x06054b50);
  pushUint16(end, 0);
  pushUint16(end, 0);
  pushUint16(end, files.length);
  pushUint16(end, files.length);
  pushUint32(end, centralSize);
  pushUint32(end, offset);
  pushUint16(end, 0);
  return new Blob([...chunks, ...central, new Uint8Array(end)], { type: 'application/zip' });
}

function downloadProgramFiles(files = []) {
  if (!files.length) return;
  if (files.length === 1) {
    const fileName = files[0].name.includes('/') ? files[0].name.split('/').pop() : files[0].name;
    triggerBlobDownload(new Blob([files[0].content], { type: 'text/plain;charset=utf-8' }), fileName || topicDownloadName(codeFileExtension('', files[0].content)));
    return;
  }
  triggerBlobDownload(createZipBlob(files), topicDownloadName('zip'));
}

function runHtmlProgram(code = '') {
  const overlay = document.createElement('div');
  overlay.className = 'html-runner-overlay';
  overlay.innerHTML = `
    <section class="html-runner-panel" role="dialog" aria-modal="true" aria-label="Preview HTML">
      <header class="html-runner-head">
        <strong>Preview HTML</strong>
        <button type="button" class="html-runner-close" aria-label="Tutup preview"><i data-lucide="x"></i></button>
      </header>
      <iframe class="html-runner-frame" sandbox="allow-scripts allow-forms allow-modals"></iframe>
    </section>
  `;
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.querySelector('.html-runner-close').addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  overlay.querySelector('.html-runner-frame').srcdoc = String(code || '');
  refreshIcons();
}

function looksLikeCodeBlock(text = '') {
  const clean = String(text || '').trim();
  if (clean.length < 24) return false;
  return /<!doctype html|<html|<head|<body|<\/[a-z][\s\S]*>|#include\s*<|using\s+namespace\s+std|cout\s*<<|cin\s*>>|int\s+main\s*\(|(^|\n)\s*(function|const|let|var|import|export|def|class)\s|=>|console\.log|```/i.test(clean);
}

function renderInlineMarkdown(text = '') {
  const placeholders = [];
  const remember = (html) => {
    const key = `@@MD${placeholders.length}@@`;
    placeholders.push({ key, html });
    return key;
  };

  let html = escapeHtml(text)
    .replace(/`([^`]+)`/g, (_, value) => remember(`<code>${value}</code>`))
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

  placeholders.forEach(({ key, html: value }) => {
    html = html.replaceAll(key, value);
  });
  return html;
}

function stripMarkdownDecorations(text = '') {
  return String(text || '')
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/__([^_\n]+)__/g, '$1')
    .replace(/(^|[^\w])\*([^*\n]+)\*/g, '$1$2')
    .replace(/(^|[^\w])_([^_\n]+)_/g, '$1$2')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/^\s*[*+-]\s+/gm, '')
    .replace(/^\s*(?:[-*_]\s*){3,}\s*$/gm, '')
    .replace(/[*_`]{1,3}/g, '');
}

function cleanDisplayText(text = '') {
  return stripMarkdownDecorations(text)
    .replace(/\bjawaban saya akan menggunakan[^.?!]*(?:[.?!]|$)/gi, '')
    .replace(/\btidak ada simbol markdown[^.?!]*(?:[.?!]|$)/gi, '')
    .replace(/\bjangan spam simbol markdown[^.?!]*(?:[.?!]|$)/gi, '')
    .replace(/\bgunakan format sederhana:[^.?!]*(?:[.?!]|$)/gi, '')
    .replace(/\b(?:simbol markdown|markdown dekoratif)\b[^.?!]*(?:[.?!]|$)/gi, '')
    .replace(/\s*(?:\*\*|#{2,}|-{3,}|_{3,})\s*/g, ' ')
    .replace(/[\u2013\u2014]+/g, ',')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/,\s*,+/g, ',')
    .replace(/([^\s]),(?=\S)/g, '$1, ')
    .replace(/[ \t]+\n/g, '\n');
}

function cleanAssistantTextOutsideCode(content = '', cleaner = cleanDisplayText) {
  return String(content || '')
    .split(/(```[\s\S]*?```)/g)
    .map((part) => part.startsWith('```') ? part : cleaner(part))
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function textForClipboard(message) {
  const content = String(message?.content || '');
  if (message?.role !== 'assistant') return content;
  return cleanAssistantTextOutsideCode(content, (text) => cleanDisplayText(text)
    .replace(/[ \t]{2,}/g, ' '));
}

function appendMarkdownParagraph(container, lines) {
  const text = cleanDisplayText(lines.join('\n')).trim();
  if (!text) return;
  const paragraph = document.createElement('p');
  paragraph.innerHTML = renderInlineMarkdown(text);
  container.appendChild(paragraph);
}

function renderMarkdownText(container, content = '') {
  const lines = String(content || '').replace(/\r/g, '').split('\n');
  let paragraphLines = [];
  let list = null;
  let currentNumberedItem = null;

  const closeParagraph = () => {
    appendMarkdownParagraph(container, paragraphLines);
    paragraphLines = [];
  };
  const closeList = () => {
    if (list) {
      container.appendChild(list);
      list = null;
      currentNumberedItem = null;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      closeParagraph();
      if (!list) closeList();
      return;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      closeParagraph();
      closeList();
      container.appendChild(document.createElement('hr'));
      return;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = Math.min(heading[1].length + 2, 5);
      const element = document.createElement(`h${level}`);
      element.innerHTML = renderInlineMarkdown(cleanDisplayText(heading[2]));
      container.appendChild(element);
      return;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      closeParagraph();
      if (list?.tagName === 'OL' && currentNumberedItem) {
        let nested = currentNumberedItem.querySelector(':scope > ul');
        if (!nested) {
          nested = document.createElement('ul');
          currentNumberedItem.appendChild(nested);
        }
        const item = document.createElement('li');
        item.innerHTML = renderInlineMarkdown(cleanDisplayText(bullet[1]));
        nested.appendChild(item);
        return;
      }
      if (!list || list.tagName !== 'UL') {
        closeList();
        list = document.createElement('ul');
      }
      const item = document.createElement('li');
      item.innerHTML = renderInlineMarkdown(cleanDisplayText(bullet[1]));
      list.appendChild(item);
      currentNumberedItem = null;
      return;
    }

    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      closeParagraph();
      if (!list || list.tagName !== 'OL') {
        closeList();
        list = document.createElement('ol');
      }
      const item = document.createElement('li');
      item.innerHTML = renderInlineMarkdown(cleanDisplayText(numbered[1]));
      list.appendChild(item);
      currentNumberedItem = item;
      return;
    }

    if (list?.tagName === 'OL' && currentNumberedItem && /^\s{2,}\S/.test(rawLine)) {
      closeParagraph();
      const continuation = document.createElement('div');
      continuation.className = 'list-continuation';
      continuation.innerHTML = renderInlineMarkdown(cleanDisplayText(line));
      currentNumberedItem.appendChild(continuation);
      return;
    }

    closeList();
    paragraphLines.push(rawLine);
  });

  closeParagraph();
  closeList();
}

function parseRichAssistantContent(content = '') {
  const source = cleanAssistantTextOutsideCode(content).trim();
  if (!source) return [];

  const parts = [];
  const fencedRegex = /```([a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/g;
  let cursor = 0;
  let match;

  while ((match = fencedRegex.exec(source)) !== null) {
    const before = source.slice(cursor, match.index).trim();
    if (before) parts.push({ type: 'text', content: before });
    parts.push({
      type: 'code',
      label: inferCodeLanguage(match[2], match[1]),
      content: formatCodeForDisplay(match[2], inferCodeLanguage(match[2], match[1])),
      context: before || parts.filter((part) => part.type === 'text').slice(-1)[0]?.content || ''
    });
    cursor = fencedRegex.lastIndex;
  }

  const rest = source.slice(cursor).trim();
  if (parts.length) {
    if (rest) parts.push({ type: 'text', content: rest });
    return parts;
  }

  const inlineCodeMatch = source.match(/(^|[\n\r])\s*(HTML|CSS|JavaScript|Javascript|JS|TypeScript|Python|JSON|C\+\+|CPP|C#|CSharp|C|Java|PHP|Go|Golang|Rust|SQL)\s*(:|-)?\s*(?=<!doctype|<html|<head|<body|<style|<script|#include|using\s+namespace|int\s+main|public\s+class|<\?php|package\s+main|fn\s+main|select\s|[.{#][\w-]+\s*\{|function\s|const\s|let\s|var\s|import\s|export\s|def\s|[{[])([\s\S]+)$/i);
  if (inlineCodeMatch && looksLikeCodeBlock(inlineCodeMatch[4])) {
    const intro = source.slice(0, inlineCodeMatch.index).trim();
    if (intro) parts.push({ type: 'text', content: intro });
    const label = inferCodeLanguage(inlineCodeMatch[4], inlineCodeMatch[2]);
    parts.push({
      type: 'code',
      label,
      content: formatCodeForDisplay(inlineCodeMatch[4], label),
      context: intro
    });
    return parts;
  }

  const promptMatch = source.match(/^([\s\S]*?)(Prompt(?:\s+(?:Utama|Final|Gambar|Video))?\s*:?)\s*\n+([\s\S]{80,})$/i);
  if (promptMatch) {
    const intro = `${promptMatch[1].trim()}${promptMatch[1].trim() ? '\n\n' : ''}${promptMatch[2].trim()}`.trim();
    if (intro) parts.push({ type: 'text', content: intro });
    parts.push({
      type: 'prompt',
      label: 'Prompt',
      content: promptMatch[3].trim(),
      context: intro
    });
    return parts;
  }

  const codeStartMatch = source.match(/(?:^|[\n\r])\s*(?=(?:#include\s*<|using\s+namespace\s+std|int\s+main\s*\(|<!doctype|<html|function\s|const\s|let\s|var\s|def\s|import\s|export\s))/i);
  if (codeStartMatch && codeStartMatch.index > 0) {
    const intro = source.slice(0, codeStartMatch.index).trim();
    const code = source.slice(codeStartMatch.index).trim();
    if (intro) parts.push({ type: 'text', content: intro });
    const label = inferCodeLanguage(code);
    parts.push({
      type: 'code',
      label,
      content: formatCodeForDisplay(code, label),
      context: intro
    });
    return parts;
  }

  if (looksLikeCodeBlock(source)) {
    const label = inferCodeLanguage(source);
    parts.push({
      type: 'code',
      label,
      content: formatCodeForDisplay(source, label),
      context: ''
    });
    return parts;
  }

  return [{ type: 'text', content: source }];
}

function renderRichAssistantContent(container, content) {
  const parts = parseRichAssistantContent(content);
  const files = codeDownloadFiles(parts);
  container.innerHTML = '';
  container.classList.toggle('rich-response', parts.some((part) => part.type !== 'text'));

  parts.forEach((part) => {
    if (part.type === 'text') {
      const text = document.createElement('div');
      text.className = 'response-text';
      renderMarkdownText(text, part.content);
      container.appendChild(text);
      return;
    }

    const card = document.createElement('section');
    const normalizedLabel = normalizeLanguageLabel(part.label);
    card.className = `code-card ${part.type === 'prompt' ? 'prompt-card' : ''}`;
    card.innerHTML = `
      <div class="code-card-head">
        <span class="code-card-title"><i data-lucide="${part.type === 'prompt' ? 'file-text' : 'code-2'}"></i>${escapeHtml(part.label)}</span>
        <div class="code-card-actions">
          ${normalizedLabel === 'HTML' ? '<button type="button" class="code-run" title="Run HTML" aria-label="Run HTML"><i data-lucide="play"></i><span>Run</span></button>' : ''}
          <button type="button" class="code-copy" title="Salin kode" aria-label="Salin kode"><i data-lucide="copy"></i></button>
        </div>
      </div>
      <pre><code></code></pre>
    `;
    card.querySelector('code').innerHTML = part.type === 'prompt'
      ? escapeHtml(part.content)
      : highlightCodeForDisplay(part.content, part.label);
    card.querySelector('.code-copy').addEventListener('click', async () => {
      await navigator.clipboard?.writeText(part.content);
      const button = card.querySelector('.code-copy');
      button.classList.add('copied');
      window.setTimeout(() => button.classList.remove('copied'), 900);
    });
    card.querySelector('.code-run')?.addEventListener('click', () => runHtmlProgram(part.content));
    container.appendChild(card);
  });

  if (files.length) {
    const actions = document.createElement('div');
    actions.className = 'program-download-row';
    const button = document.createElement('button');
    button.className = 'program-download-button';
    button.type = 'button';
    button.innerHTML = `<i data-lucide="${files.length > 1 ? 'file-archive' : 'download'}"></i><span>${files.length > 1 ? `Unduh ${files.length} program ZIP` : `Unduh ${files[0].name}`}</span>`;
    button.addEventListener('click', () => downloadProgramFiles(files));
    actions.appendChild(button);
    container.appendChild(actions);
  }
}

function isDigitalOceanMessage(message = {}) {
  return Boolean(message.source?.viaAgent || message.source?.plan === 'Pro' || message.source?.plan === 'Ultra');
}

function formatFileSize(size) {
  if (!size) return '0 B';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function isImageAttachment(file) {
  return file?.kind === 'image' || /^image\//.test(file?.type || '');
}

function attachmentImageSource(file) {
  return file?.url || file?.dataUrl || '';
}

function showActionModal({ title, message, inputValue = '', inputPlaceholder = '', buttons = [] }) {
  return new Promise((resolve) => {
    els.actionTitle.textContent = title;
    els.actionMessage.textContent = message;
    els.actionButtons.innerHTML = '';
    els.actionInput.value = inputValue;
    els.actionInput.placeholder = inputPlaceholder;
    els.actionInput.classList.toggle('hidden', !inputPlaceholder && inputValue === null);

    buttons.forEach((button) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.className = button.variant === 'danger'
        ? 'danger-button'
        : button.variant === 'primary'
          ? 'primary-button'
          : 'secondary-button';
      element.textContent = button.label;
      element.addEventListener('click', () => {
        els.actionModal.close();
        resolve(button.value === 'input' ? els.actionInput.value : button.value);
      });
      els.actionButtons.appendChild(element);
    });

    els.actionModal.addEventListener('cancel', () => resolve(null), { once: true });
    els.actionModal.showModal();
    if (!els.actionInput.classList.contains('hidden')) {
      setTimeout(() => els.actionInput.focus(), 50);
    }
  });
}

function showConfirm(title, message, dangerLabel = 'Hapus') {
  els.actionInput.classList.add('hidden');
  return showActionModal({
    title,
    message,
    inputValue: null,
    buttons: [
      { label: 'Batal', value: false },
      { label: dangerLabel, value: true, variant: 'danger' }
    ]
  });
}

function showTextInput(title, message, value) {
  return showActionModal({
    title,
    message,
    inputValue: value,
    inputPlaceholder: 'Nama percakapan',
    buttons: [
      { label: 'Batal', value: null },
      { label: 'Simpan', value: 'input', variant: 'primary' }
    ]
  });
}

function showConversationMenu() {
  els.actionInput.classList.add('hidden');
  return showActionModal({
    title: 'Kelola percakapan',
    message: 'Pilih tindakan untuk percakapan ini.',
    inputValue: null,
    buttons: [
      { label: 'Batal', value: null },
      { label: 'Ganti nama', value: 'rename', variant: 'primary' },
      { label: 'Hapus', value: 'delete', variant: 'danger' }
    ]
  });
}

function groupLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return sameDay ? 'Hari Ini' : 'Sebelumnya';
}

function renderProfile() {
  const profile = state.profile || {};
  const initials = profile.initials || 'U';
  const plan = ['Pro', 'Ultra'].includes(profile.subscriptionPlan) ? profile.subscriptionPlan : 'Free';
  els.profileName.textContent = profile.name || 'User';
  els.profileEmail.textContent = profile.email || '';
  renderAvatar(els.profileInitials, initials, profile.avatarUrl, plan);
  renderAvatar(els.profileRail, initials, profile.avatarUrl, plan);
  if (els.profileAvatarPreview) renderAvatar(els.profileAvatarPreview, initials, profileAvatarDraft || profile.avatarUrl, plan);
  if (els.profilePlanBadge) {
    els.profilePlanBadge.classList.toggle('hidden', plan === 'Free');
    els.profilePlanBadge.classList.toggle('pro', plan === 'Pro');
    els.profilePlanBadge.classList.toggle('ultra', plan === 'Ultra');
    els.profilePlanBadge.querySelector('span').textContent = plan;
    els.profilePlanBadge.title = plan === 'Free'
      ? 'Paket Free'
      : `${plan} ${Number(profile.subscriptionDaysLeft || 0)} hari - aktif sampai ${formatDateTime(profile.subscriptionExpiresAt)}`;
    const iconName = plan === 'Ultra' ? 'crown' : 'badge-check';
    const badgeIcon = els.profilePlanBadge.querySelector('[data-lucide]');
    if (badgeIcon && badgeIcon.getAttribute('data-lucide') !== iconName) {
      const nextIcon = document.createElement('i');
      nextIcon.setAttribute('data-lucide', iconName);
      badgeIcon.replaceWith(nextIcon);
    }
  }
  renderCreditList(profile.creditSummary || {}, plan);
  updateModeAccess();
}

function allowedPlansForSubscription(plan = 'Free') {
  if (plan === 'Ultra') return ['Free', 'Pro', 'Ultra'];
  if (plan === 'Pro') return ['Free', 'Pro'];
  return ['Free'];
}

function isModeAllowed(mode) {
  const plan = ['Pro', 'Ultra'].includes(state.profile?.subscriptionPlan) ? state.profile.subscriptionPlan : 'Free';
  return allowedPlansForSubscription(plan).includes(mode);
}

function formatTokenNumber(value) {
  const number = Math.max(0, Number(value || 0));
  return new Intl.NumberFormat('id-ID').format(number);
}

function bucketPercentValue(bucket) {
  return Math.max(0, Math.min(100, Number(bucket?.percent ?? 0)));
}

function formatResetClock(value) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatResetDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

function formatResetDateTime(value) {
  if (!value) return 'Belum dipakai';
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', '');
}

function creditUsageRow({ label, bucket, resetText, detail }) {
  const percent = bucketPercentValue(bucket);
  return `
    <div class="credit-usage-row">
      <div class="credit-usage-meta">
        <strong>${escapeHtml(label)}</strong>
        <span>${percent}%</span>
        <time>${escapeHtml(resetText)}</time>
      </div>
      <div class="credit-meter" aria-label="${escapeHtml(label)} tersisa ${percent}%"><span style="width:${percent}%"></span></div>
      <small>${escapeHtml(detail)}</small>
    </div>
  `;
}

function creditWindowHours(credit = {}) {
  const matched = String(credit.resetLabel || '').match(/per\s+(\d+)\s+jam/i);
  return matched ? Math.max(1, Number(matched[1] || 5)) : 5;
}

function renderCreditList(summary, plan) {
  if (!els.creditList) return;
  const visiblePlans = allowedPlansForSubscription(plan);
  els.creditList.innerHTML = '';
  visiblePlans.forEach((itemPlan) => {
    const credit = summary[itemPlan] || {};
    const percent = Math.max(0, Math.min(100, Number(credit.percent || 0)));
    const icon = itemPlan === 'Ultra' ? 'crown' : itemPlan === 'Pro' ? 'badge-check' : 'sparkles';
    const bucket = itemPlan === 'Free' ? credit.daily : credit.window;
    const weekly = credit.weekly;
    const windowHours = creditWindowHours(credit);
    const inputLeft = bucket?.remaining?.input ?? bucket?.inputLimit ?? 0;
    const outputLeft = bucket?.remaining?.output ?? bucket?.outputLimit ?? 0;
    const windowLabel = itemPlan === 'Free' ? 'Harian' : `${windowHours}j`;
    const windowReset = itemPlan === 'Free'
      ? (bucket?.resetAt ? `Reset ${formatResetClock(bucket.resetAt)}` : 'Belum dipakai')
      : (bucket?.resetAt ? formatResetClock(bucket.resetAt) : 'Belum dipakai');
    const windowDetail = itemPlan === 'Free'
      ? `${formatTokenNumber(inputLeft)} input / ${formatTokenNumber(outputLeft)} output tersisa`
      : `${formatTokenNumber(inputLeft)} input / ${formatTokenNumber(outputLeft)} output per ${windowHours} jam`;
    const usageRows = [
      creditUsageRow({
        label: windowLabel,
        bucket,
        resetText: windowReset,
        detail: windowDetail
      }),
      weekly ? creditUsageRow({
        label: '1 Minggu',
        bucket: weekly,
        resetText: formatResetDateTime(weekly.resetAt),
        detail: `${formatTokenNumber(weekly.remaining?.input)} input / ${formatTokenNumber(weekly.remaining?.output)} output mingguan`
      }) : ''
    ].join('');
    const row = document.createElement('article');
    row.className = `credit-card credit-${itemPlan.toLowerCase()} ${percent <= 0 ? 'empty' : ''}`;
    row.innerHTML = `
      <div class="credit-card-top">
        <span class="credit-icon"><i data-lucide="${icon}"></i></span>
        <div>
          <strong>${itemPlan}</strong>
          <small>${escapeHtml(credit.label || itemPlan)}</small>
        </div>
        <b>${percent}%</b>
      </div>
      <div class="credit-usage-list">${usageRows}</div>
    `;
    els.creditList.appendChild(row);
  });
}

function updateModeAccess() {
  if (!els.modeMenu) return;
  const allowed = allowedPlansForSubscription(['Pro', 'Ultra'].includes(state.profile?.subscriptionPlan) ? state.profile.subscriptionPlan : 'Free');
  const modelSettings = state.modelSettings || {};
  els.modeMenu.querySelectorAll('[data-mode]').forEach((button) => {
    const model = modelSettings[button.dataset.mode] || {};
    const disabledByAdmin = model.enabled === false;
    const locked = !allowed.includes(button.dataset.mode) || disabledByAdmin;
    const small = button.querySelector('small');
    if (small && model.modelName) small.textContent = model.modelName;
    button.disabled = locked;
    button.classList.toggle('locked', locked);
    button.title = disabledByAdmin ? `Model ${button.dataset.mode} sedang dinonaktifkan admin` : (locked ? `Berlangganan ${button.dataset.mode} untuk membuka model ini` : (model.description || ''));
  });
  if (!allowed.includes(activeChatMode.plan) || modelSettings[activeChatMode.plan]?.enabled === false) {
    setMode('Free', { silent: true });
  }
}

function renderAvatar(element, initials, avatarUrl, plan = 'Free') {
  if (!element) return;
  const cleanInitials = String(initials || 'U').slice(0, 4).toUpperCase();
  const cleanAvatarUrl = String(avatarUrl || '').trim();
  element.replaceChildren();
  element.classList.toggle('has-photo', Boolean(cleanAvatarUrl));
  element.classList.toggle('default-logo-avatar', !cleanAvatarUrl);
  element.classList.toggle('plan-pro', plan === 'Pro');
  element.classList.toggle('plan-ultra', plan === 'Ultra');
  element.dataset.plan = plan;
  element.style.backgroundImage = '';

  if (cleanAvatarUrl) {
    const frame = document.createElement('span');
    frame.className = 'avatar-photo-frame';
    const image = document.createElement('img');
    image.className = 'avatar-photo';
    image.alt = '';
    image.referrerPolicy = 'no-referrer';
    image.src = cleanAvatarUrl;
    image.addEventListener('error', () => {
      element.classList.remove('has-photo');
      element.classList.add('default-logo-avatar');
      element.replaceChildren(document.createTextNode(cleanInitials));
    }, { once: true });
    frame.appendChild(image);
    element.appendChild(frame);
    if (plan === 'Pro' || plan === 'Ultra') {
      const badge = document.createElement('span');
      badge.className = `avatar-plan-badge ${plan === 'Ultra' ? 'ultra' : 'pro'}`;
      badge.title = plan;
      badge.innerHTML = `<i data-lucide="${plan === 'Ultra' ? 'crown' : 'badge-check'}"></i>`;
      element.appendChild(badge);
    }
    return;
  }

  element.setAttribute('aria-label', cleanInitials);
  if (plan === 'Pro' || plan === 'Ultra') {
    const badge = document.createElement('span');
    badge.className = `avatar-plan-badge ${plan === 'Ultra' ? 'ultra' : 'pro'}`;
    badge.title = plan;
    badge.innerHTML = `<i data-lucide="${plan === 'Ultra' ? 'crown' : 'badge-check'}"></i>`;
    element.appendChild(badge);
  }
}

function renderHistory() {
  const groups = new Map();
  state.conversations.forEach((conversation) => {
    const label = groupLabel(conversation.updatedAt || conversation.createdAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(conversation);
  });

  els.historyList.innerHTML = '';

  if (state.conversations.length === 0) {
    els.historyList.innerHTML = '<p class="muted-action">Belum ada riwayat</p>';
    refreshIcons();
    return;
  }

  groups.forEach((items, label) => {
    const labelEl = document.createElement('div');
    labelEl.className = 'history-label';
    labelEl.textContent = label;
    els.historyList.appendChild(labelEl);

    items.forEach((conversation) => {
      const item = document.createElement('button');
      item.className = `history-item ${conversation.id === state.activeConversationId ? 'active' : ''}`;
      item.innerHTML = `<span>${escapeHtml(conversation.title)}</span><span class="history-menu" aria-label="Menu percakapan">...</span>`;
      item.addEventListener('click', () => selectConversation(conversation.id));
      item.querySelector('.history-menu').addEventListener('click', async (event) => {
        event.stopPropagation();
        const action = await showConversationMenu();
        if (action === 'rename') await renameConversation(conversation.id);
        if (action === 'delete') await deleteConversation(conversation.id);
      });
      els.historyList.appendChild(item);
    });
  });

  refreshIcons();
}

function searchConversations(query) {
  const clean = String(query || '').trim().toLowerCase();
  if (!clean) return [];

  return state.conversations
    .map((conversation) => {
      const messages = conversation.messages || [];
      const titleMatch = conversation.title.toLowerCase().includes(clean);
      const message = messages.find((item) => String(item.content || '').toLowerCase().includes(clean));
      if (!titleMatch && !message) return null;
      return {
        conversation,
        snippet: titleMatch
          ? conversation.title
          : `${message.role === 'assistant' ? 'AI' : 'User'}: ${String(message.content || '').replace(/\s+/g, ' ').slice(0, 96)}`
      };
    })
    .filter(Boolean)
    .slice(0, 12);
}

function renderSearchResults() {
  const query = els.searchInput.value;
  const results = searchConversations(query);
  els.searchResults.innerHTML = '';

  if (!query.trim()) {
    els.searchResults.innerHTML = '<p class="search-empty">Ketik untuk mencari percakapan.</p>';
    return;
  }

  if (results.length === 0) {
    els.searchResults.innerHTML = '<p class="search-empty">Tidak ada hasil.</p>';
    return;
  }

  results.forEach(({ conversation, snippet }) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'search-result';
    item.innerHTML = `
      <span class="search-result-icon" aria-hidden="true"><i data-lucide="message-square-text"></i></span>
      <span class="search-result-copy">
        <strong>${escapeHtml(conversation.title)}</strong>
        <small>${escapeHtml(snippet)}</small>
      </span>
    `;
    item.addEventListener('click', () => selectConversation(conversation.id));
    els.searchResults.appendChild(item);
  });
  refreshIcons();
}

function renderAttachments(files, container, { removable = false, variant = 'composer' } = {}) {
  container.innerHTML = '';
  files.forEach((file) => {
    const imageSource = attachmentImageSource(file);
    if (isImageAttachment(file) && imageSource) {
      const preview = document.createElement('figure');
      preview.className = `attachment-preview ${variant === 'message' ? 'message-image-preview' : ''}`;
      if (variant === 'message') {
        preview.tabIndex = 0;
        preview.setAttribute('role', 'button');
        preview.setAttribute('aria-label', `Preview ${file.name}`);
      }
      preview.innerHTML = `
        <img src="${escapeHtml(imageSource)}" alt="${escapeHtml(file.name)}" loading="lazy">
        ${removable ? `<button type="button" class="attachment-remove" data-remove-attachment="${file.id}" aria-label="Hapus ${escapeHtml(file.name)}"><i data-lucide="x"></i></button>` : ''}
      `;
      container.appendChild(preview);
      preview.querySelector('img')?.addEventListener('load', syncMessageActions, { once: true });
      if (variant === 'message') {
        preview.addEventListener('click', () => openImagePreview(imageSource, file.name));
        preview.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openImagePreview(imageSource, file.name);
          }
        });
      }
      return;
    }

    const chip = document.createElement(removable ? 'div' : 'span');
    chip.className = 'attachment-chip';
    chip.innerHTML = `
      <span>${escapeHtml(file.name)}</span>
      <small>${formatFileSize(file.size)}</small>
      ${removable ? `<button type="button" class="attachment-remove inline" data-remove-attachment="${file.id}" aria-label="Hapus ${escapeHtml(file.name)}"><i data-lucide="x"></i></button>` : ''}
    `;
    container.appendChild(chip);
  });

  if (removable) {
    container.querySelectorAll('[data-remove-attachment]').forEach((button) => {
      button.addEventListener('click', () => removePendingAttachment(button.dataset.removeAttachment));
    });
  }
}

function openImagePreview(src, name = 'Preview gambar') {
  els.imagePreviewFull.src = src;
  els.imagePreviewFull.alt = name;
  els.imagePreviewModal.showModal();
  refreshIcons();
}

function closeImagePreview() {
  els.imagePreviewModal.close();
  els.imagePreviewFull.removeAttribute('src');
}

function autoSizeEditTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  const editor = textarea.closest('.inline-edit');
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const isLongEdit = editor?.classList.contains('long-edit');
  const minHeight = editor?.classList.contains('long-edit')
    ? (isMobile ? 270 : 316)
    : (isMobile ? 94 : 104);
  const maxHeight = isLongEdit ? minHeight : (isMobile ? 180 : 280);
  textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)}px`;
}

function renderMessages({ forceScroll = false } = {}) {
  const conversation = activeConversation();
  const hasMessages = conversation && conversation.messages.length > 0;
  const previousScrollTop = els.chatView.scrollTop;
  const previousScrollHeight = els.chatView.scrollHeight;
  const shouldScrollToBottom = forceScroll || (!userScrolledAwayFromBottom && chatPinnedToBottom && isChatNearBottom());
  els.welcomeView.classList.toggle('hidden', hasMessages);
  els.chatView.classList.toggle('hidden', !hasMessages);
  els.messageList.innerHTML = '';

  if (!hasMessages) return;

  conversation.messages.forEach((message) => {
    const wrapper = document.createElement('article');
    const shouldAnimate = false;
    wrapper.className = `message ${message.role}${message.isError ? ' error' : ''}${message.isLoading ? ' loading' : ''}${shouldAnimate ? ' animating' : ''}`;
    const reply = message.replyTo
      ? conversation.messages.find((item) => item.id === message.replyTo)
      : null;
    const visibleMessageAttachments = message.role === 'assistant'
      ? (message.attachments || []).filter(isImageAttachment).slice(0, 1)
      : (message.attachments || []);
    const isEditing = message.role === 'user' && editingMessageId === message.id;
    const attachments = visibleMessageAttachments.length ? document.createElement('div') : null;
    if (attachments) {
      attachments.className = 'attachment-list';
      renderAttachments(visibleMessageAttachments, attachments, { variant: 'message' });
    }

    const isProviderRaw = message.role === 'assistant' && isDigitalOceanMessage(message);
    const displayContent = message.role === 'assistant'
      ? cleanAssistantTextOutsideCode(shouldAnimate ? '' : message.content)
      : (shouldAnimate ? '' : message.content);
    const richParts = !message.isLoading && message.role === 'assistant'
      ? parseRichAssistantContent(displayContent)
      : [];
    const hasRichContent = richParts.some((part) => part.type !== 'text');
    const hasBubbleText = message.isLoading || Boolean(displayContent?.trim()) || shouldAnimate;
    const editIsLong = isEditing && (String(message.content || '').length > 72 || String(message.content || '').includes('\n'));
    const bubbleContent = isEditing
      ? `<div class="inline-edit${editIsLong ? ' long-edit' : ''}"><textarea class="inline-edit-input" rows="1" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="sentences">${escapeHtml(message.content || '')}</textarea><div class="inline-edit-actions"><button type="button" class="secondary-button inline-edit-cancel">Batal</button><button type="button" class="primary-button inline-edit-save">Kirim</button></div></div>`
      : message.isLoading
      ? '<span class="typing-status" aria-label="AI sedang mengetik"><span>Snake AI sedang menulis</span><span class="typing-indicator"><span></span><span></span><span></span></span></span>'
      : escapeHtml(displayContent);

    wrapper.innerHTML = `
      ${reply ? `<div class="message-meta">Reply: ${escapeHtml(reply.content.slice(0, 120))}</div>` : ''}
      <div class="message-media-slot"></div>
      <div class="bubble${isEditing ? ` editing-bubble${editIsLong ? ' long-edit-bubble' : ''}` : ''}${isProviderRaw ? ' raw-provider-response' : ''}${shouldAnimate ? ' typing-text' : ''}${hasRichContent ? ' rich-response' : ''}${hasBubbleText ? '' : ' hidden'}">${bubbleContent}</div>
      <div class="message-actions">
        <button data-action="copy" title="Salin" aria-label="Salin"><i data-lucide="copy"></i></button>
        <button data-action="reply" title="Balas" aria-label="Balas"><i data-lucide="reply"></i></button>
        ${message.role === 'user' && !isEditing ? '<button data-action="edit" title="Edit" aria-label="Edit"><i data-lucide="pencil"></i></button>' : ''}
        <button data-action="delete" title="Hapus" aria-label="Hapus"><i data-lucide="trash-2"></i></button>
      </div>
    `;

    if (attachments) {
      wrapper.querySelector('.message-media-slot').appendChild(attachments);
    }
    if (!isEditing && !message.isLoading && message.role === 'assistant') {
      renderRichAssistantContent(wrapper.querySelector('.bubble'), displayContent);
    }

    if (isEditing) {
      const input = wrapper.querySelector('.inline-edit-input');
      const saveButton = wrapper.querySelector('.inline-edit-save');
      const cancelButton = wrapper.querySelector('.inline-edit-cancel');
      autoSizeEditTextarea(input);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
      input.addEventListener('input', () => autoSizeEditTextarea(input));
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') cancelInlineEdit();
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          saveInlineEdit(conversation.id, message.id, input.value);
        }
      });
      saveButton.addEventListener('click', () => saveInlineEdit(conversation.id, message.id, input.value));
      cancelButton.addEventListener('click', cancelInlineEdit);
    }

    wrapper.querySelector('[data-action="copy"]').addEventListener('click', () => navigator.clipboard?.writeText(textForClipboard(message)));
    wrapper.querySelector('[data-action="reply"]').addEventListener('click', () => setReply(message));
    wrapper.querySelector('[data-action="edit"]')?.addEventListener('click', () => editMessage(conversation.id, message));
    wrapper.querySelector('[data-action="delete"]').addEventListener('click', () => deleteMessage(conversation.id, message.id));
    els.messageList.appendChild(wrapper);

  });

  if (shouldScrollToBottom) {
    scrollChatToBottom();
  } else {
    const heightDelta = els.chatView.scrollHeight - previousScrollHeight;
    els.chatView.scrollTop = Math.max(0, previousScrollTop + Math.min(heightDelta, 0));
  }
  syncMessageActions();
  refreshIcons();
}

function syncMessageActions() {
  els.messageList.querySelectorAll('.message').forEach((message) => {
    const actions = message.querySelector('.message-actions');
    if (!actions) return;
    actions.style.removeProperty('--action-width');
  });
}

function splitForTypewriter(text) {
  const cleanText = String(text || '').trimStart();
  const lines = cleanText.split(/(\n+)/);
  if (cleanText.length > 900) {
    return lines.flatMap((part) => part.match(/\n+|[^\n]+/g) || []);
  }
  return cleanText.match(/\s+|[^\s]+/g) || [];
}

function startTypewriter({ id, content, bubble }) {
  if (!bubble || runningAnimations.has(id)) return;

  runningAnimations.add(id);
  bubble.innerHTML = '<span class="typing-status"><span>Menyiapkan jawaban</span><span class="typing-indicator"><span></span><span></span><span></span></span></span>';
  bubble.classList.add('typing-text');

  const chunks = splitForTypewriter(content);
  const cleanContent = String(content || '').trim();
  const delay = cleanContent.length > 900 ? 8 : 16;
  let index = 0;

  if (!chunks.length) {
    bubble.textContent = 'Jawaban kosong. Coba kirim ulang pesan.';
    bubble.classList.remove('typing-text');
    bubble.closest('.message')?.classList.remove('animating');
    animatedMessageIds.delete(id);
    runningAnimations.delete(id);
    return;
  }

  const tick = () => {
    if (!document.body.contains(bubble)) {
      runningAnimations.delete(id);
      return;
    }

    if (index === 0) {
      bubble.textContent = '';
    }

    bubble.textContent += chunks[index] || '';
    index += 1;
    if (!userScrolledAwayFromBottom && chatPinnedToBottom && isChatNearBottom()) {
      scrollChatToBottom();
    }

    if (index < chunks.length) {
      window.setTimeout(tick, delay);
      return;
    }

    bubble.classList.remove('typing-text');
    bubble.closest('.message')?.classList.remove('animating');
    animatedMessageIds.delete(id);
    runningAnimations.delete(id);
  };

window.setTimeout(tick, 120);
}

function render({ forceScroll = false } = {}) {
  renderProfile();
  renderHistory();
  renderMessages({ forceScroll });
  updateProcessingState();
  updateAuthChrome();
  refreshIcons();
}

async function loadState() {
  state = await api('/api/state');
  if (!state.activeConversationId && state.conversations[0]) {
    state.activeConversationId = state.conversations[0].id;
  }
  render({ forceScroll: true });
  updateModeAccess();
}

async function createConversation() {
  if (!isAuthenticated) {
    openAuthModal('login');
    return null;
  }
  try {
    const conversation = await api('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ title: 'Percakapan Baru' })
    });
    state.conversations.unshift(conversation);
    state.activeConversationId = conversation.id;
    if (state.conversationLimits) {
      state.conversationLimits.current = state.conversations.length;
    }
    render();
    return conversation;
  } catch (err) {
    await showActionModal({
      title: 'Percakapan tidak bisa dibuat',
      message: err.message,
      inputValue: null,
      buttons: [
        { label: 'OK', value: true, variant: 'primary' }
      ]
    });
    return null;
  }
}

async function selectConversation(id) {
  const previousId = state.activeConversationId;
  if (id === previousId) return;
  state.activeConversationId = id;
  render();
  closeMobileSidebar();

  try {
    const result = await api(`/api/conversations/${id}/select`, {
      method: 'POST',
      body: JSON.stringify({ localOnly: hasPendingMessage() })
    });
    if (result.conversation) {
      const index = state.conversations.findIndex((item) => item.id === result.conversation.id);
      if (index >= 0) state.conversations[index] = result.conversation;
    }
    if (result.warning) {
      await showActionModal({
        title: 'ChatGPT belum sinkron',
        message: result.warning,
        inputValue: null,
        buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
      });
    }
    render();
  } catch (err) {
    state.activeConversationId = previousId;
    render();
    await showActionModal({
      title: 'Gagal memilih percakapan',
      message: err.message,
      inputValue: null,
      buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
    });
  }
}

async function renameConversation(id = state.activeConversationId) {
  const conversation = state.conversations.find((item) => item.id === id);
  if (!conversation) return;
  const title = await showTextInput('Ganti nama percakapan', 'Masukkan nama baru yang lebih mudah dikenali.', conversation.title);
  if (!title?.trim()) return;
  const updated = await api(`/api/conversations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title })
  });
  Object.assign(conversation, updated);
  render();
}

async function deleteConversation(id) {
  const confirmed = await showConfirm('Hapus percakapan?', 'Percakapan ini akan dihapus dari riwayat lokal.', 'Hapus');
  if (!confirmed) return;
  const result = await api(`/api/conversations/${id}`, { method: 'DELETE' });
  state.conversations = state.conversations.filter((item) => item.id !== id);
  state.activeConversationId = result.activeConversationId;
  render();
}

async function clearHistory() {
  const confirmed = await showConfirm('Hapus semua riwayat?', 'Semua percakapan lokal akan dibersihkan dari sidebar.', 'Hapus semua');
  if (!confirmed) return;
  await api('/api/conversations', { method: 'DELETE' });
  state.conversations = [];
  state.activeConversationId = null;
  render();
}

function setReply(message) {
  replyTo = message.id;
  els.replyText.textContent = `Reply: ${message.content.slice(0, 140)}`;
  els.replyBanner.classList.remove('hidden');
  els.messageInput.focus();
}

function clearReply() {
  replyTo = null;
  els.replyBanner.classList.add('hidden');
}

async function editMessage(conversationId, message) {
  if (message.role !== 'user') return;
  editingMessageId = message.id;
  renderMessages();
}

function cancelInlineEdit() {
  editingMessageId = null;
  renderMessages();
}

async function saveInlineEdit(conversationId, messageId, value) {
  const content = String(value || '').trim();
  if (!content || hasPendingMessage(conversationId)) return;
  const conversation = state.conversations.find((item) => item.id === conversationId);
  const message = conversation?.messages.find((item) => item.id === messageId);
  if (!conversation || !message || message.role !== 'user') return;

  const mode = snapshotChatMode(message.mode || activeChatMode);
  if (!isModeAllowed(mode.plan)) {
    openSubscription();
    return;
  }

  const messageIndex = conversation.messages.findIndex((item) => item.id === messageId);
  if (messageIndex < 0) return;

  sending = true;
  Object.assign(message, {
    content,
    mode,
    editedAt: new Date().toISOString()
  });
  conversation.messages = conversation.messages.slice(0, messageIndex + 1);
  conversation.messages.push({
    id: `tmp_ai_edit_${Date.now()}`,
    role: 'assistant',
    content: '',
    isLoading: true,
    createdAt: new Date().toISOString()
  });
  editingMessageId = null;
  render();

  try {
    const result = await api('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        conversationId,
        editMessageId: messageId,
        message: content,
        mode
      })
    });
    if (result.assistantMessage?.id) {
      animatedMessageIds.add(result.assistantMessage.id);
    }
    const activeBeforeRefresh = state.activeConversationId;
    await loadState();
    state.activeConversationId = state.conversations.some((item) => item.id === activeBeforeRefresh)
      ? activeBeforeRefresh
      : result.conversationId;
    render();
  } catch (err) {
    await showActionModal({
      title: 'Pesan gagal terkirim',
      message: err.message,
      inputValue: null,
      buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
    });
    await loadState();
  } finally {
    sending = false;
    updateProcessingState();
  }
}

async function deleteMessage(conversationId, messageId) {
  const confirmed = await showConfirm('Hapus pesan?', 'Pesan ini akan dihapus dari percakapan lokal.', 'Hapus');
  if (!confirmed) return;
  await api(`/api/conversations/${conversationId}/messages/${messageId}`, { method: 'DELETE' });
  const conversation = state.conversations.find((item) => item.id === conversationId);
  conversation.messages = conversation.messages.filter((item) => item.id !== messageId);
  renderMessages();
}

async function readFile(file) {
  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  let preview = '';
  if (/text|json|csv|javascript|typescript|html|css|markdown/.test(file.type) || /\.(txt|md|json|csv|js|ts|html|css)$/i.test(file.name)) {
    preview = await file.text().then((text) => text.slice(0, 12000)).catch(() => '');
  }

  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    kind: file.type.startsWith('image/') ? 'image' : 'document',
    preview,
    dataUrl
  };
}

async function handleFiles(files) {
  const selected = Array.from(files).slice(0, 8);
  const mapped = [];
  for (const file of selected) {
    if (file.size > 12 * 1024 * 1024) {
      await showActionModal({
        title: 'File terlalu besar',
        message: `${file.name} melewati batas 12 MB per file.`,
        inputValue: null,
        buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
      });
      continue;
    }
    mapped.push(await readFile(file));
  }
  pendingAttachments = pendingAttachments.concat(mapped).slice(0, 8);
  renderAttachments(pendingAttachments, els.attachmentRow, { removable: true });
  refreshIcons();
  els.fileInput.value = '';
}

async function sendCurrentMessage() {
  const message = els.messageInput.value.trim();
  if ((!message && pendingAttachments.length === 0) || hasActivePendingMessage()) return;
  const requestMode = snapshotChatMode(activeChatMode);
  const requestAttachments = pendingAttachments.slice();
  const requestReplyTo = replyTo;

  if (!isAuthenticated) {
    openAuthModal('login');
    return;
  }
  if (!isModeAllowed(requestMode.plan)) {
    openSubscription();
    return;
  }
  const currentCredit = state.profile?.creditSummary?.[requestMode.plan];
  if (currentCredit && Number(currentCredit.percent || 0) <= 0) {
    await showActionModal({
      title: `Credit ${requestMode.plan} habis`,
      message: 'Credit model ini sudah 0%. Tunggu reset otomatis atau pilih model lain yang masih tersedia.',
      inputValue: null,
      buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
    });
    return;
  }

  let tempConversation = activeConversation();
  if (!tempConversation) {
    tempConversation = await createConversation();
    if (!tempConversation) return;
  }

  sending = true;
  els.messageInput.value = '';
  autoSizeTextarea();

  const tempUserMessage = {
    id: `tmp_${Date.now()}`,
    role: 'user',
    content: message,
    mode: requestMode,
    attachments: requestAttachments,
    replyTo: requestReplyTo,
    createdAt: new Date().toISOString()
  };

  if (tempConversation) {
    tempConversation.messages.push(tempUserMessage);
    tempConversation.messages.push({
      id: `tmp_ai_${Date.now()}`,
      role: 'assistant',
      content: '',
      isLoading: true,
      createdAt: new Date().toISOString()
    });
  }
  renderMessages();
  updateProcessingState();

  const payload = {
    conversationId: state.activeConversationId,
    message,
    attachments: requestAttachments,
    replyTo: requestReplyTo,
    mode: requestMode
  };

  pendingAttachments = [];
  renderAttachments(pendingAttachments, els.attachmentRow, { removable: true });
  clearReply();

  try {
    const result = await api('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (result.assistantMessage?.id) {
      animatedMessageIds.add(result.assistantMessage.id);
    }
    const activeBeforeRefresh = state.activeConversationId;
    await loadState();
    const canKeepCurrentSelection = state.conversations.some((item) => item.id === activeBeforeRefresh);
    state.activeConversationId = canKeepCurrentSelection && activeBeforeRefresh !== result.conversationId
      ? activeBeforeRefresh
      : result.conversationId;
    render();
  } catch (err) {
    await showActionModal({
      title: 'Pesan gagal terkirim',
      message: err.message,
      inputValue: null,
      buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
    });
    await loadState();
  } finally {
    sending = false;
  }
}

function removePendingAttachment(id) {
  pendingAttachments = pendingAttachments.filter((file) => file.id !== id);
  renderAttachments(pendingAttachments, els.attachmentRow, { removable: true });
  refreshIcons();
}

function autoSizeTextarea() {
  els.messageInput.style.height = 'auto';
  els.messageInput.style.height = `${Math.min(els.messageInput.scrollHeight, 160)}px`;
}

function openProfile() {
  profileAvatarDraft = state.profile.avatarUrl || '';
  els.profileNameInput.value = state.profile.name || '';
  els.profileEmailInput.value = state.profile.email || '';
  els.profileInitialsInput.value = state.profile.initials || '';
  renderAvatar(els.profileAvatarPreview, state.profile.initials || 'U', profileAvatarDraft, state.profile.subscriptionPlan || 'Free');
  els.profileModal.showModal();
}

async function saveProfile(event) {
  event.preventDefault();
  state.profile = await api('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify({
      name: els.profileNameInput.value,
      email: els.profileEmailInput.value,
      initials: els.profileInitialsInput.value,
      avatarUrl: profileAvatarDraft
    })
  });
  els.profileModal.close();
  renderProfile();
}

function readProfileAvatar(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showActionModal({
      title: 'File tidak didukung',
      message: 'Pilih gambar PNG, JPG, WebP, atau GIF untuk foto profil.',
      buttons: [{ label: 'OK', value: 'ok', variant: 'primary' }]
    });
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showActionModal({
      title: 'Gambar terlalu besar',
      message: 'Ukuran foto profil maksimal 2 MB agar aplikasi tetap ringan.',
      buttons: [{ label: 'OK', value: 'ok', variant: 'primary' }]
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    profileAvatarDraft = String(reader.result || '');
    renderAvatar(els.profileAvatarPreview, els.profileInitialsInput.value || state.profile.initials || 'U', profileAvatarDraft, state.profile.subscriptionPlan || 'Free');
  };
  reader.readAsDataURL(file);
}

function resetProfileAvatar() {
  profileAvatarDraft = '';
  els.profileAvatarInput.value = '';
  renderAvatar(els.profileAvatarPreview, els.profileInitialsInput.value || state.profile.initials || 'U', '', state.profile.subscriptionPlan || 'Free');
}

async function chooseSubscriptionPlan(plan) {
  const nextPlan = ['Pro', 'Ultra'].includes(plan) ? plan : 'Free';
  try {
    const payment = await api('/api/subscription/qris', {
      method: 'POST',
      body: JSON.stringify({ plan: nextPlan })
    });
    pendingPayment = payment;
    paymentProofDraft = '';
    els.paymentError.classList.add('hidden');
    els.paymentProofInput.value = '';
    els.paymentProofName.textContent = 'PNG, JPG, atau WebP maksimal 3.5 MB';
    els.paymentProofPicker.classList.remove('has-file');
    els.paymentProofPreview.classList.add('hidden');
    els.paymentProofPreview.removeAttribute('src');
    els.paymentTitle.textContent = `Pembayaran ${nextPlan}`;
    els.paymentSubtitle.textContent = 'Scan QRIS sesuai nominal, lalu upload bukti pembayaran.';
    els.paymentAmount.textContent = formatRupiah(payment.amount);
    els.paymentPlan.textContent = `Paket ${nextPlan}`;
    els.paymentQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(payment.qris)}`;
    els.subscriptionModal.close();
    els.paymentModal.showModal();
    refreshIcons();
  } catch (err) {
    await showActionModal({
      title: 'Gagal membuka pembayaran',
      message: err.message,
      inputValue: null,
      buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
    });
  }
}

function closePaymentModal() {
  pendingPayment = null;
  paymentProofDraft = '';
  els.paymentModal.close();
}

function readPaymentProof(file) {
  if (!file) return;
  if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
    els.paymentError.textContent = 'Bukti harus berupa gambar PNG, JPG, atau WebP.';
    els.paymentError.classList.remove('hidden');
    return;
  }
  if (file.size > 3.5 * 1024 * 1024) {
    els.paymentError.textContent = 'Ukuran bukti pembayaran maksimal 3.5 MB.';
    els.paymentError.classList.remove('hidden');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    paymentProofDraft = String(reader.result || '');
    els.paymentProofName.textContent = file.name;
    els.paymentProofPicker.classList.add('has-file');
    els.paymentProofPreview.src = paymentProofDraft;
    els.paymentProofPreview.classList.remove('hidden');
    els.paymentError.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

async function submitPaymentProof(event) {
  event.preventDefault();
  if (!pendingPayment?.plan) return;
  if (!paymentProofDraft) {
    els.paymentError.textContent = 'Upload bukti pembayaran dulu.';
    els.paymentError.classList.remove('hidden');
    return;
  }
  try {
    await api('/api/subscription/requests', {
      method: 'POST',
      body: JSON.stringify({
        plan: pendingPayment.plan,
        proofImage: paymentProofDraft
      })
    });
    closePaymentModal();
    await showActionModal({
      title: 'Bukti terkirim',
      message: 'Permintaan langganan sudah dikirim ke dashboard admin. Paket akan aktif setelah admin menyetujui pembayaran.',
      inputValue: null,
      buttons: [{ label: 'Mengerti', value: true, variant: 'primary' }]
    });
  } catch (err) {
    els.paymentError.textContent = err.message;
    els.paymentError.classList.remove('hidden');
  }
}

function setAccountMenuOpen(open, source = 'rail') {
  if (!els.accountMenu) return;
  els.accountMenu.classList.toggle('hidden', !open);
  els.accountMenu.classList.toggle('from-sidebar', source === 'sidebar');
  els.profileRail?.setAttribute('aria-expanded', String(open && source === 'rail'));
  els.profileButton?.setAttribute('aria-expanded', String(open && source === 'sidebar'));
  if (open) refreshIcons();
}

function toggleAccountMenu(source = 'rail') {
  const isOpen = !els.accountMenu.classList.contains('hidden');
  const sameSource = els.accountMenu.classList.contains('from-sidebar') === (source === 'sidebar');
  setAccountMenuOpen(!(isOpen && sameSource), source);
}

function closeAccountMenu() {
  setAccountMenuOpen(false);
}

function openProfileFromAccountMenu() {
  closeAccountMenu();
  openProfile();
}

function openSubscription() {
  closeAccountMenu();
  els.subscriptionModal.showModal();
}

function openPersonalization() {
  closeAccountMenu();
  applyTheme(currentTheme());
  els.personalizationModal.showModal();
}

function toggleThemePreference() {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
}

function toggleAttachMenu() {
  els.attachMenu.classList.toggle('hidden');
  els.modeMenu.classList.add('hidden');
  els.modeButton.setAttribute('aria-expanded', 'false');
}

function toggleModeMenu() {
  const isOpen = !els.modeMenu.classList.contains('hidden');
  els.modeMenu.classList.toggle('hidden', isOpen);
  els.attachMenu.classList.add('hidden');
  els.modeButton.setAttribute('aria-expanded', String(!isOpen));
}

function clearTextSelectionWhenOutside(event) {
  const selection = window.getSelection?.();
  if (!selection || selection.isCollapsed) return;
  if (event.target?.closest?.('.bubble, .code-card, .response-text')) return;
  selection.removeAllRanges();
}

function setMode(mode, options = {}) {
  if (!options.silent && !isModeAllowed(mode)) {
    openSubscription();
    els.modeMenu.classList.add('hidden');
    els.modeButton.setAttribute('aria-expanded', 'false');
    return;
  }
  const button = els.modeMenu.querySelector(`[data-mode="${mode}"]`);
  activeChatMode = {
    plan: mode,
    model: button?.dataset.model || 'gpt-5.5'
  };
  els.activeMode.textContent = mode;
  els.modeMenu.querySelectorAll('[data-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
  els.modeMenu.classList.add('hidden');
  els.modeButton.setAttribute('aria-expanded', 'false');
}

function toggleHistory() {
  els.toggleHistory.closest('.history-section').classList.toggle('collapsed');
}

function openSidebarSection(section) {
  setSidebarCollapsed(false);
  if (isMobileLayout()) {
    els.sidebar.classList.add('open');
    els.appShell.classList.add('mobile-sidebar-open');
  }
  els.searchPanel.classList.toggle('hidden', section !== 'search');
  els.projectSection.classList.toggle('section-focus', section === 'project');
  els.toggleHistory.closest('.history-section').classList.remove('collapsed');

  document.querySelectorAll('.rail .icon-button, .nav-item').forEach((button) => {
    button.classList.remove('active');
  });

  if (section === 'search') {
    els.searchButton.classList.add('active');
    els.searchNav.classList.add('active');
    renderSearchResults();
    window.setTimeout(() => els.searchInput.focus(), 80);
    return;
  }

  if (section === 'new') {
    els.newChatRail.classList.add('active');
    els.newChat.classList.add('active');
    return;
  }

  if (section === 'project') {
    els.projectRail.classList.add('active');
    els.projectSection.scrollIntoView({ block: 'nearest' });
    return;
  }

  if (section === 'history') {
    els.historyRail.classList.add('active');
    els.toggleHistory.closest('.history-section').scrollIntoView({ block: 'nearest' });
  }
}

function openRailSidebar() {
  if (els.appShell.classList.contains('sidebar-collapsed')) {
    openSidebarSection('history');
  }
}

async function createConversationFromNav() {
  openSidebarSection('new');
  await createConversation();
}

function isMobileLayout() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function setSidebarCollapsed(collapsed) {
  els.sidebar.classList.toggle('collapsed', collapsed);
  els.appShell.classList.toggle('sidebar-collapsed', collapsed);
  els.toggleSidebar.setAttribute('aria-expanded', String(!collapsed));
  els.collapseSidebar.setAttribute('aria-expanded', String(!collapsed));
  if (collapsed) {
    els.sidebar.classList.remove('open');
    els.appShell.classList.remove('mobile-sidebar-open');
  }
}

function toggleSidebarCollapsed() {
  setSidebarCollapsed(!els.appShell.classList.contains('sidebar-collapsed'));
}

function collapseSidebar() {
  setSidebarCollapsed(true);
}

function openMobileSidebar() {
  setSidebarCollapsed(false);
  els.sidebar.classList.add('open');
  els.appShell.classList.add('mobile-sidebar-open');
}

function closeMobileSidebar() {
  if (isMobileLayout()) {
    els.sidebar.classList.remove('open');
    els.appShell.classList.remove('mobile-sidebar-open');
  }
}

els.composerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (hasActivePendingMessage()) {
    cancelPendingResponse();
    return;
  }
  sendCurrentMessage();
});
els.authForm.addEventListener('submit', handleAuthSubmit);
els.authClose.addEventListener('click', closeAuthModal);
els.authView.addEventListener('click', (event) => {
  if (event.target === els.authView) closeAuthModal();
});
els.authForm.querySelectorAll('input').forEach((input) => {
  input.addEventListener('focus', () => {
    if (isMobileLayout()) document.body.classList.add('keyboard-open');
  });
  input.addEventListener('blur', () => {
    window.setTimeout(() => {
      if (isMobileLayout() && !els.authForm.contains(document.activeElement)) {
        document.body.classList.remove('keyboard-open');
      }
    }, 80);
  });
});
els.toggleAuthMode.addEventListener('click', () => setAuthMode(authMode === 'login' ? 'register' : 'login'));
els.googleAuth.addEventListener('click', handleGoogleAuth);
els.topbarLogin.addEventListener('click', () => openAuthModal('login'));
els.topbarRegister.addEventListener('click', () => openAuthModal('register'));
els.sidebarLogin.addEventListener('click', () => openAuthModal('login'));
els.verifyNow.addEventListener('click', verifyPendingAccount);
els.resendVerify.addEventListener('click', resendVerification);
els.verifyCode.addEventListener('input', () => {
  els.verifyCode.value = els.verifyCode.value.replace(/\D/g, '').slice(0, 6);
});
els.adminLoginForm.addEventListener('submit', handleAdminLogin);
els.adminNavButtons.forEach((button) => {
  button.addEventListener('click', () => setAdminView(button.dataset.adminView));
});
els.adminSidebarToggle?.addEventListener('click', toggleAdminSidebar);
els.adminMobileNavToggle?.addEventListener('click', toggleAdminMobileNav);
els.adminSidebarBackdrop?.addEventListener('click', closeAdminMobileNav);
els.adminBroadcastForm?.addEventListener('submit', sendAdminBroadcast);
els.adminBroadcastSubject?.addEventListener('input', updateBroadcastPreview);
els.adminBroadcastMessage?.addEventListener('input', updateBroadcastPreview);
els.viewAllUsers.addEventListener('click', () => setAdminView('users'));
els.adminUserForm.addEventListener('submit', saveAdminUser);
els.adminCancelEdit.addEventListener('click', () => {
  editingAdminUserId = null;
  els.adminUserModal.close();
});
els.adminLogout.addEventListener('click', async () => {
  await authApi('/api/admin/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken()}` }
  }).catch(() => {});
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  history.replaceState(null, '', '/admin');
  showOnly(els.adminLoginView);
});
els.composerForm.addEventListener('click', (event) => {
  if (event.target.closest('button, input, textarea, .attachment-pill')) return;
  els.messageInput.focus();
});
els.messageInput.addEventListener('input', autoSizeTextarea);
els.messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (!hasActivePendingMessage()) sendCurrentMessage();
  }
});
els.chatView.addEventListener('scroll', () => {
  const nearBottom = isChatNearBottom();
  chatPinnedToBottom = nearBottom;
  userScrolledAwayFromBottom = !nearBottom;
});
els.chatView.addEventListener('wheel', (event) => {
  if (event.deltaY < 0) {
    chatPinnedToBottom = false;
    userScrolledAwayFromBottom = true;
  }
}, { passive: true });
let chatTouchStartY = 0;
els.chatView.addEventListener('touchstart', (event) => {
  chatTouchStartY = event.touches?.[0]?.clientY || 0;
}, { passive: true });
els.chatView.addEventListener('touchmove', (event) => {
  const currentY = event.touches?.[0]?.clientY || 0;
  if (currentY > chatTouchStartY + 6) {
    chatPinnedToBottom = false;
    userScrolledAwayFromBottom = true;
  }
}, { passive: true });
els.searchButton.addEventListener('click', (event) => {
  event.stopPropagation();
  openSidebarSection('search');
});
els.searchNav.addEventListener('click', () => openSidebarSection('search'));
els.searchInput.addEventListener('input', renderSearchResults);
els.newChat.addEventListener('click', createConversationFromNav);
els.newChatRail.addEventListener('click', (event) => {
  event.stopPropagation();
  createConversationFromNav();
});
els.projectRail.addEventListener('click', (event) => {
  event.stopPropagation();
  openSidebarSection('project');
});
els.toggleProjects.addEventListener('click', () => openSidebarSection('project'));
els.historyRail.addEventListener('click', (event) => {
  event.stopPropagation();
  openSidebarSection('history');
});
els.renameChat.addEventListener('click', createConversationFromNav);
els.clearHistory.addEventListener('click', clearHistory);
els.attachButton.addEventListener('click', toggleAttachMenu);
els.modeButton.addEventListener('click', toggleModeMenu);
els.modeMenu.querySelectorAll('[data-mode]').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
});
els.toggleHistory.addEventListener('click', toggleHistory);
els.uploadFile.addEventListener('click', () => els.fileInput.click());
els.fileInput.addEventListener('change', (event) => handleFiles(event.target.files));
els.cancelReply.addEventListener('click', clearReply);
els.profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleAccountMenu('sidebar');
});
els.profileLogout.addEventListener('click', (event) => {
  event.stopPropagation();
  closeAccountMenu();
  logoutUser();
});
els.profileRail.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleAccountMenu('rail');
});
els.accountProfile.addEventListener('click', openProfileFromAccountMenu);
els.accountSubscription.addEventListener('click', openSubscription);
els.accountPersonalization.addEventListener('click', openPersonalization);
els.profileForm.addEventListener('submit', saveProfile);
els.closeProfile.addEventListener('click', () => els.profileModal.close());
els.closeProfileTop?.addEventListener('click', () => els.profileModal.close());
els.closeSubscription.addEventListener('click', () => els.subscriptionModal.close());
els.subscriptionModal.querySelectorAll('[data-subscribe-plan]').forEach((button) => {
  button.addEventListener('click', () => chooseSubscriptionPlan(button.dataset.subscribePlan));
});
els.paymentForm.addEventListener('submit', submitPaymentProof);
els.closePayment.addEventListener('click', closePaymentModal);
els.cancelPayment.addEventListener('click', closePaymentModal);
els.paymentProofInput.addEventListener('change', (event) => readPaymentProof(event.target.files?.[0]));
els.closePersonalization.addEventListener('click', () => els.personalizationModal.close());
els.themeToggle.addEventListener('click', toggleThemePreference);
els.profileAvatarPick.addEventListener('click', () => els.profileAvatarInput.click());
els.profileAvatarPickText.addEventListener('click', () => els.profileAvatarInput.click());
els.profileAvatarReset.addEventListener('click', resetProfileAvatar);
els.profileAvatarInput.addEventListener('change', (event) => readProfileAvatar(event.target.files?.[0]));
els.profileInitialsInput.addEventListener('input', () => {
  if (!profileAvatarDraft) {
    renderAvatar(els.profileAvatarPreview, els.profileInitialsInput.value || 'U', '', state.profile.subscriptionPlan || 'Free');
  }
});
els.imagePreviewClose.addEventListener('click', closeImagePreview);
els.imagePreviewModal.addEventListener('click', (event) => {
  if (event.target === els.imagePreviewModal) {
    closeImagePreview();
  }
});
els.toggleSidebar.addEventListener('click', toggleSidebarCollapsed);
els.collapseSidebar.addEventListener('click', toggleSidebarCollapsed);
els.mobileSidebar.addEventListener('click', (event) => {
  event.stopPropagation();
  openMobileSidebar();
});
document.querySelector('.rail').addEventListener('click', (event) => {
  if (event.target.closest('button')) return;
  openRailSidebar();
});
document.querySelector('.main-panel').addEventListener('click', (event) => {
  if (event.target.closest('.modal, dialog')) return;

  if (isMobileLayout()) {
    closeMobileSidebar();
    return;
  }

  if (els.sidebar.classList.contains('collapsed')) return;
  collapseSidebar();
});
document.addEventListener('click', (event) => {
  clearTextSelectionWhenOutside(event);
  if (!els.accountMenu.contains(event.target) && !event.target.closest('#profileRail, #profileButton')) {
    closeAccountMenu();
  }
  if (!els.attachMenu.contains(event.target) && !els.attachButton.contains(event.target)) {
    els.attachMenu.classList.add('hidden');
  }
  if (!els.modeMenu.contains(event.target) && !els.modeButton.contains(event.target)) {
    els.modeMenu.classList.add('hidden');
    els.modeButton.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('touchstart', clearTextSelectionWhenOutside, { passive: true });

setMode('Free');
refreshIcons();
setSidebarCollapsed(els.appShell.classList.contains('sidebar-collapsed'));
document.addEventListener('selectstart', (event) => {
  if (event.target.closest('button, .nav-item, .history-item, .topbar-item, .attachment-chip, .brand-wordmark')) {
    event.preventDefault();
  }
});
initAuth().catch((err) => {
  document.body.innerHTML = `<main class="welcome-view"><p>Gagal memuat aplikasi: ${escapeHtml(err.message)}</p></main>`;
});
