const puppeteer = require('puppeteer');
const express = require('express');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

function loadEnvFile() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) return;
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const separator = trimmed.indexOf('=');
        if (separator <= 0) return;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = value;
    });
}

loadEnvFile();

process.on('uncaughtException', (err) => {
    console.error('[-] Uncaught exception:', err && err.stack ? err.stack : err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('[-] Unhandled rejection:', err && err.stack ? err.stack : err);
});

let browser, page;
let attachedToExistingChrome = false;
let isRecovering = false;
let chatQueue = Promise.resolve();
let remoteChatQueue = Promise.resolve();
const activeChatRequests = new Map();

const SESSION_FILE = './session.json';
const SESSION_BACKUP_FILE = './session.backup.json';
const PROFILE_DIR = './chatgpt_profile';
const DATA_FILE = './depoizon-data.json';
const PUBLIC_DIR = path.join(__dirname, 'public');
const PUBLIC_UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');
const UPLOAD_TMP_DIR = path.join(__dirname, '.chatgpt_uploads');
const PORT = Number(process.env.PORT || 3000);
const CHATGPT_URL = 'https://chatgpt.com/';
const LOGIN_URL = 'https://chatgpt.com/auth/login';
const LOGIN_ONLY = process.argv.includes('--login');
const USE_CHROME_DEBUG = process.argv.includes('--debug-chrome') || process.env.USE_CHROME_DEBUG === '1';
const RUN_HEADLESS = !LOGIN_ONLY && process.env.HEADLESS !== 'false';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const DIGITALOCEAN_INFERENCE_URL = (process.env.DIGITALOCEAN_INFERENCE_URL || 'https://inference.do-ai.run').replace(/\/+$/, '');
const DIGITALOCEAN_PRO_API_KEY = process.env.DIGITALOCEAN_PRO_API_KEY || '';
const DIGITALOCEAN_PRO_MODEL = process.env.DIGITALOCEAN_PRO_MODEL || 'nvidia-nemotron-3-super-120b';
const DIGITALOCEAN_PRO_AGENT_URL = (process.env.DIGITALOCEAN_PRO_AGENT_URL || '').replace(/\/+$/, '');
const DIGITALOCEAN_ULTRA_API_KEY = process.env.DIGITALOCEAN_ULTRA_API_KEY || '';
const DIGITALOCEAN_ULTRA_MODEL = process.env.DIGITALOCEAN_ULTRA_MODEL || 'deepseek-v4-pro';
const DIGITALOCEAN_ULTRA_AGENT_URL = (process.env.DIGITALOCEAN_ULTRA_AGENT_URL || '').replace(/\/+$/, '');
const DIGITALOCEAN_API_TOKEN = process.env.DIGITALOCEAN_API_TOKEN || process.env.DO_API_TOKEN || '';
const DIGITALOCEAN_CREDIT_BALANCE = process.env.DIGITALOCEAN_CREDIT_BALANCE || '';
const DIGITALOCEAN_CREDIT_DESCRIPTION = process.env.DIGITALOCEAN_CREDIT_DESCRIPTION || '';
const DIGITALOCEAN_CREDIT_EXPIRES_AT = process.env.DIGITALOCEAN_CREDIT_EXPIRES_AT || '';
const DIGITALOCEAN_CREDIT_INITIAL = process.env.DIGITALOCEAN_CREDIT_INITIAL || '';
const DIGITALOCEAN_CREDIT_REMAINING = process.env.DIGITALOCEAN_CREDIT_REMAINING || '';
const REQUIRED_PRO_MODEL = 'nvidia-nemotron-3-super-120b';
const REQUIRED_ULTRA_MODEL = 'deepseek-v4-pro';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || 'Snake AI <no-reply@snake-ai.local>';
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`).replace(/\/+$/, '');
const QRIS_TEMPLATE = '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214231218720193620303UMI51440014ID.CO.QRIS.WWW0215ID20222128710910303UMI5204481453033605802ID5910SHEILASHOP6006KLATEN61055741162070703A0163048812';
const SUBSCRIPTION_PLANS = {
    Pro: { label: 'Pro', amount: 10000 },
    Ultra: { label: 'Ultra', amount: 20000 }
};
const SUBSCRIPTION_DURATION_DAYS = 30;
const CREDIT_LIMITS = {
    Free: {
        daily: { input: 50000, output: 50000 }
    },
    Pro: {
        windowMs: 5 * 60 * 60 * 1000,
        window: { input: 50000, output: 50000 },
        weekly: { input: 300000, output: 300000 }
    },
    Ultra: {
        windowMs: 5 * 60 * 60 * 1000,
        window: { input: 80000, output: 80000 },
        weekly: { input: 400000, output: 400000 }
    }
};
const CONVERSATION_LIMITS = {
    Free: 5,
    Pro: 10,
    Ultra: 20
};
const SYSTEM_CHROME_PATHS = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

const PROMPT_SELECTOR = [
    'div#prompt-textarea[contenteditable="true"]',
    '[data-testid="composer-input"]',
    'div[contenteditable="true"][role="textbox"]',
    'textarea[placeholder*="Message"]:not([style*="display: none"])',
    'textarea[placeholder*="Pesan"]:not([style*="display: none"])',
    'textarea[placeholder*="Tanyakan"]:not([style*="display: none"])'
].join(', ');

const SEND_BUTTON_SELECTOR = [
    'button[data-testid="send-button"]',
    'button[aria-label="Send prompt"]',
    'button[aria-label="Kirim prompt"]',
    'button[aria-label="Kirim perintah"]'
].join(', ');

const STOP_BUTTON_SELECTOR = [
    'button[data-testid="stop-button"]',
    'button[aria-label="Stop streaming"]',
    'button[aria-label="Hentikan streaming"]'
].join(', ');

const BAD_RESPONSE_MARKERS = [
    'Something went wrong while generating the response',
    'There was an error generating a response',
    'Terjadi kesalahan'
];

const TRANSIENT_RESPONSE_MARKERS = [
    'Menganalisis gambar',
    'Analyzing image',
    'Thinking',
    'Sedang berpikir'
];

function nowIso() {
    return new Date().toISOString();
}

function addDaysIso(baseDate = new Date(), days = 0) {
    const date = baseDate instanceof Date ? new Date(baseDate) : new Date(baseDate);
    if (Number.isNaN(date.getTime())) return nowIso();
    date.setDate(date.getDate() + days);
    return date.toISOString();
}

function addMinutesIso(baseDate = new Date(), minutes = 0) {
    const date = baseDate instanceof Date ? new Date(baseDate) : new Date(baseDate);
    if (Number.isNaN(date.getTime())) return nowIso();
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
}

function validSubscriptionPlan(plan = 'Free') {
    return ['Pro', 'Ultra'].includes(plan) ? plan : 'Free';
}

function subscriptionExpired(user = {}, referenceDate = new Date()) {
    const plan = validSubscriptionPlan(user.subscriptionPlan);
    if (plan === 'Free') return false;
    const expiresAt = Date.parse(user.subscriptionExpiresAt || '');
    return !Number.isFinite(expiresAt) || expiresAt <= referenceDate.getTime();
}

function subscriptionPlanForUser(user = {}) {
    return subscriptionExpired(user) ? 'Free' : validSubscriptionPlan(user.subscriptionPlan);
}

function subscriptionDaysLeft(user = {}) {
    const plan = subscriptionPlanForUser(user);
    if (plan === 'Free') return 0;
    const expiresAt = Date.parse(user.subscriptionExpiresAt || '');
    if (!Number.isFinite(expiresAt)) return 0;
    return Math.max(0, Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
}

function setUserSubscription(user, plan = 'Free', options = {}) {
    const nextPlan = validSubscriptionPlan(plan);
    const now = new Date();
    const currentPlan = subscriptionPlanForUser(user);
    if (nextPlan === 'Free') {
        user.subscriptionPlan = 'Free';
        user.subscriptionExpiresAt = null;
        return;
    }
    user.subscriptionPlan = nextPlan;
    if (options.forceDuration || currentPlan !== nextPlan || !user.subscriptionExpiresAt || subscriptionExpired(user, now)) {
        user.subscriptionExpiresAt = addDaysIso(now, SUBSCRIPTION_DURATION_DAYS);
    }
}

function normalizeUserSubscription(user) {
    if (!user) return false;
    let changed = false;
    const plan = validSubscriptionPlan(user.subscriptionPlan);
    if (user.subscriptionPlan !== plan) {
        user.subscriptionPlan = plan;
        changed = true;
    }
    if (plan === 'Free') {
        if (user.subscriptionExpiresAt) {
            user.subscriptionExpiresAt = null;
            changed = true;
        }
        return changed;
    }
    if (!user.subscriptionExpiresAt || Number.isNaN(Date.parse(user.subscriptionExpiresAt))) {
        user.subscriptionExpiresAt = addDaysIso(new Date(), SUBSCRIPTION_DURATION_DAYS);
        changed = true;
    }
    if (subscriptionExpired(user)) {
        user.subscriptionPlan = 'Free';
        user.subscriptionExpiresAt = null;
        user.subscriptionExpiredAt = nowIso();
        changed = true;
    }
    return changed;
}

function escapeHtml(value = '') {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function nlToBr(value = '') {
    return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

function createId(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyStore() {
    return {
        profile: {
            name: 'Sar yadi',
            email: 'boldape156@mail.desapacul.si',
            initials: 'Sy',
            avatarUrl: '',
            subscriptionPlan: 'Free',
            subscriptionExpiresAt: null
        },
        auth: {
            users: [],
            sessions: [],
            adminSessions: [],
            admin: null
        },
        paymentRequests: [],
        broadcasts: [],
        modelSettings: createDefaultModelSettings(),
        activeConversationId: null,
        conversations: []
    };
}

function createDefaultModelSettings() {
    return {
        Free: {
            enabled: true,
            displayName: 'Free',
            modelName: 'GPT 5.5',
            description: 'Model gratis dengan credit harian 50.000 input dan 50.000 output.',
            creditLimits: {
                primaryPeriod: 'daily',
                primaryWindowHours: 24,
                primary: { input: 50000, output: 50000 }
            }
        },
        Pro: {
            enabled: true,
            displayName: 'Pro',
            modelName: 'Snake AI 1.1',
            description: 'Model Pro untuk coding, debugging, dan tugas teknis dengan credit 5 jam serta mingguan.',
            creditLimits: {
                primaryPeriod: 'hourly',
                primaryWindowHours: 5,
                primary: { input: 50000, output: 50000 },
                weekly: { input: 300000, output: 300000 }
            }
        },
        Ultra: {
            enabled: true,
            displayName: 'Ultra',
            modelName: 'Snake AI',
            description: 'Model Ultra untuk pekerjaan kompleks dengan jatah credit lebih besar.',
            creditLimits: {
                primaryPeriod: 'hourly',
                primaryWindowHours: 5,
                primary: { input: 80000, output: 80000 },
                weekly: { input: 400000, output: 400000 }
            }
        }
    };
}

function normalizeTokenLimit(value, fallback) {
    const number = Math.floor(Number(value));
    if (!Number.isFinite(number)) return fallback;
    return Math.max(0, Math.min(10000000, number));
}

function normalizeCreditLimits(incoming = {}, defaults = {}) {
    const period = ['hourly', 'daily', 'weekly'].includes(incoming.primaryPeriod)
        ? incoming.primaryPeriod
        : defaults.primaryPeriod;
    const windowHours = normalizeTokenLimit(incoming.primaryWindowHours, defaults.primaryWindowHours || 5);
    const normalizedWindowHours = Math.max(1, Math.min(168, windowHours || defaults.primaryWindowHours || 5));
    const primary = incoming.primary && typeof incoming.primary === 'object' ? incoming.primary : {};
    const weekly = incoming.weekly && typeof incoming.weekly === 'object' ? incoming.weekly : {};
    return {
        primaryPeriod: period,
        primaryWindowHours: normalizedWindowHours,
        primary: {
            input: normalizeTokenLimit(primary.input, defaults.primary?.input || 0),
            output: normalizeTokenLimit(primary.output, defaults.primary?.output || 0)
        },
        ...(defaults.weekly ? {
            weekly: {
                input: normalizeTokenLimit(weekly.input, defaults.weekly.input),
                output: normalizeTokenLimit(weekly.output, defaults.weekly.output)
            }
        } : {})
    };
}

function normalizeModelSettings(settings = {}) {
    const defaults = createDefaultModelSettings();
    return Object.fromEntries(Object.entries(defaults).map(([plan, value]) => {
        const incoming = settings?.[plan] || {};
        return [plan, {
            ...value,
            enabled: typeof incoming.enabled === 'boolean' ? incoming.enabled : value.enabled,
            displayName: typeof incoming.displayName === 'string' && incoming.displayName.trim()
                ? incoming.displayName.trim().slice(0, 32)
                : value.displayName,
            modelName: typeof incoming.modelName === 'string' && incoming.modelName.trim()
                ? incoming.modelName.trim().slice(0, 48)
                : value.modelName,
            description: typeof incoming.description === 'string' && incoming.description.trim()
                ? incoming.description.trim().slice(0, 220)
                : value.description,
            creditLimits: normalizeCreditLimits(incoming.creditLimits, value.creditLimits)
        }];
    }));
}

function smtpReady() {
    return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function createMailTransport() {
    if (!smtpReady()) return null;
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
}

function broadcastEmailTemplate({ subject, message, senderName }) {
    const title = escapeHtml(subject);
    const body = nlToBr(message);
    const sender = escapeHtml(senderName || 'Admin Snake AI');
    return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;background:#f4f6fb;color:#111827;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fb;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 18px 42px rgba(17,24,39,.08);">
          <tr>
            <td style="padding:24px 28px;background:#111827;color:#ffffff;">
              <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c7d2fe;font-weight:800;">Snake AI Notification</div>
              <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#1f2937;font-size:15px;line-height:1.7;">
              <p style="margin:0 0 16px;">Halo,</p>
              <div style="margin:0;padding:18px 20px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;">${body}</div>
              <p style="margin:20px 0 0;color:#4b5563;">Terima kasih sudah menggunakan Snake AI.</p>
              <p style="margin:6px 0 0;font-weight:800;color:#111827;">${sender}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6;">
              Email ini dikirim ke akun yang terdaftar di Snake AI. Abaikan jika informasi ini tidak relevan untuk Anda.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function broadcastTextTemplate({ subject, message, senderName }) {
    return [
        `Snake AI Notification: ${subject}`,
        '',
        'Halo,',
        '',
        message,
        '',
        'Terima kasih sudah menggunakan Snake AI.',
        senderName || 'Admin Snake AI'
    ].join('\n');
}

function verificationEmailTemplate({ code, verificationUrl, name }) {
    const safeName = escapeHtml(name || 'User');
    const safeCode = escapeHtml(code);
    const safeUrl = escapeHtml(verificationUrl);
    return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kode verifikasi Snake AI</title>
</head>
<body style="margin:0;background:#f4f6fb;color:#111827;font-family:Inter,Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fb;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 18px 42px rgba(17,24,39,.08);">
          <tr>
            <td style="padding:24px 28px;background:#111827;color:#ffffff;">
              <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c7d2fe;font-weight:800;">Snake AI Verification</div>
              <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">Kode verifikasi akun</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#1f2937;font-size:15px;line-height:1.7;">
              <p style="margin:0 0 16px;">Halo ${safeName}, masukkan kode ini untuk mengaktifkan akun Snake AI:</p>
              <div style="margin:0 0 18px;padding:18px 20px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;text-align:center;font-size:30px;letter-spacing:.24em;font-weight:900;color:#111827;">${safeCode}</div>
              <p style="margin:0 0 16px;color:#4b5563;">Kode berlaku 15 menit. Anda juga bisa membuka tombol verifikasi di bawah ini.</p>
              <p style="margin:0;"><a href="${safeUrl}" style="display:inline-block;padding:12px 16px;background:#111827;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:800;">Verifikasi akun</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6;">
              Abaikan email ini jika Anda tidak membuat akun Snake AI.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function verificationTextTemplate({ code, verificationUrl }) {
    return [
        'Kode verifikasi Snake AI',
        '',
        `Kode OTP: ${code}`,
        'Kode berlaku 15 menit.',
        '',
        `Link verifikasi: ${verificationUrl}`,
        '',
        'Abaikan email ini jika Anda tidak membuat akun Snake AI.'
    ].join('\n');
}

async function sendVerificationEmail(user, req = null) {
    const transport = createMailTransport();
    if (!transport || !user?.email) return { smtpConfigured: false, sent: false };

    const host = req?.get?.('host');
    const origin = host ? `${req.protocol}://${host}` : PUBLIC_BASE_URL;
    const verificationPath = `/verify?token=${encodeURIComponent(user.verificationToken || '')}`;
    const verificationUrl = `${origin.replace(/\/+$/, '')}${verificationPath}`;
    const payload = {
        code: user.verificationCode,
        verificationUrl,
        name: user.name || user.email.split('@')[0]
    };

    await transport.sendMail({
        from: SMTP_FROM,
        to: user.email,
        subject: 'Kode verifikasi Snake AI',
        text: verificationTextTemplate(payload),
        html: verificationEmailTemplate(payload)
    });

    return { smtpConfigured: true, sent: true };
}

async function sendBroadcastEmails(recipients, payload) {
    const transport = createMailTransport();
    if (!transport) {
        return {
            smtpConfigured: false,
            sent: [],
            failed: recipients.map((user) => ({ email: user.email, error: 'SMTP belum dikonfigurasi.' }))
        };
    }

    const html = broadcastEmailTemplate(payload);
    const text = broadcastTextTemplate(payload);
    const sent = [];
    const failed = [];

    for (const user of recipients) {
        try {
            await transport.sendMail({
                from: SMTP_FROM,
                to: user.email,
                subject: payload.subject,
                text,
                html
            });
            sent.push(user.email);
        } catch (err) {
            failed.push({ email: user.email, error: err.message || 'Gagal mengirim email.' });
        }
    }

    return { smtpConfigured: true, sent, failed };
}

function safeBroadcast(broadcast) {
    if (!broadcast) return null;
    return {
        id: broadcast.id,
        subject: broadcast.subject,
        message: broadcast.message,
        status: broadcast.status || 'sent',
        recipientCount: Number(broadcast.recipientCount || 0),
        sentCount: Number(broadcast.sentCount || 0),
        failedCount: Number(broadcast.failedCount || 0),
        failedRecipients: Array.isArray(broadcast.failedRecipients) ? broadcast.failedRecipients.slice(0, 8) : [],
        createdAt: broadcast.createdAt,
        createdBy: broadcast.createdBy || ''
    };
}

function conversationLimitForUser(user = {}) {
    return CONVERSATION_LIMITS[subscriptionPlanForUser(user)] || CONVERSATION_LIMITS.Free;
}

function userConversations(store, user) {
    if (!user) return [];
    return (store.conversations || [])
        .filter((conversation) => conversation.userId === user.id)
        .sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
}

function activeConversationIdForUser(store, user) {
    if (!user) return null;
    const owned = userConversations(store, user);
    const userActive = user.activeConversationId && owned.some((conversation) => conversation.id === user.activeConversationId)
        ? user.activeConversationId
        : null;
    return userActive || owned[0]?.id || null;
}

function setActiveConversationForUser(store, user, conversationId) {
    if (!user) return;
    user.activeConversationId = conversationId || null;
    if (store.profile?.email === user.email) {
        store.activeConversationId = user.activeConversationId;
    }
}

function getOwnedConversationOrFail(store, user, id) {
    const conversation = getConversationOrFail(store, id);
    if (!user || conversation.userId !== user.id) {
        const err = new Error('Percakapan ini bukan milik akun Anda.');
        err.status = 403;
        throw err;
    }
    return conversation;
}

function publicStateForUser(store, user) {
    const profile = user ? {
        ...store.profile,
        name: user.name || store.profile.name,
        email: user.email || store.profile.email,
        initials: initialsFromUser(user),
        avatarUrl: user.avatarUrl || store.profile.avatarUrl || '',
        subscriptionPlan: subscriptionPlanForUser(user),
        subscriptionExpiresAt: subscriptionPlanForUser(user) === 'Free' ? null : user.subscriptionExpiresAt || null,
        subscriptionDaysLeft: subscriptionDaysLeft(user),
        creditSummary: creditSummaryForUser(user, store.modelSettings)
    } : store.profile;
    const conversations = user ? userConversations(store, user) : [];
    const activeConversationId = user ? activeConversationIdForUser(store, user) : null;
    return {
        ...store,
        profile,
        conversations,
        activeConversationId,
        conversationLimits: user ? {
            current: conversations.length,
            limit: conversationLimitForUser(user),
            plan: subscriptionPlanForUser(user)
        } : { current: 0, limit: 0, plan: 'Free' },
        auth: undefined,
        paymentRequests: undefined,
        broadcasts: undefined
    };
}

function migrateConversationOwnership(store) {
    const users = store.auth?.users || [];
    if (!users.length) return false;
    const profileEmail = cleanEmail(store.profile?.email || '');
    const profileUser = users.find((user) => cleanEmail(user.email) === profileEmail);
    const fallbackUser = profileUser || users[0];
    let changed = false;
    (store.conversations || []).forEach((conversation) => {
        if (conversation.userId && users.some((user) => user.id === conversation.userId)) return;
        conversation.userId = fallbackUser.id;
        changed = true;
    });
    users.forEach((user) => {
        const owned = (store.conversations || []).filter((conversation) => conversation.userId === user.id);
        if (user.activeConversationId && owned.some((conversation) => conversation.id === user.activeConversationId)) return;
        if (owned[0]) {
            user.activeConversationId = owned.sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)))[0].id;
            changed = true;
        }
    });
    return changed;
}

function createConversationForUser(store, user, title = 'Percakapan Baru') {
    const conversation = {
        id: createId('chat'),
        userId: user.id,
        title: String(title || 'Percakapan Baru').trim().slice(0, 80) || 'Percakapan Baru',
        chatgptUrl: null,
        chatgptConversationId: null,
        chatgptPendingNew: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        messages: []
    };
    store.conversations.unshift(conversation);
    setActiveConversationForUser(store, user, conversation.id);
    return conversation;
}

function ensureDefaultConversationForUser(store, user) {
    if (!user || userConversations(store, user).length > 0) return null;
    return createConversationForUser(store, user);
}

function createDefaultAdmin() {
    const password = hashPassword('KyyCaa19');
    return {
        email: 'KyyCaa@gmail.com',
        passwordHash: password.hash,
        salt: password.salt,
        createdAt: nowIso()
    };
}

function readStore() {
    if (!fs.existsSync(DATA_FILE)) {
        const initial = createEmptyStore();
        writeStore(initial);
        return initial;
    }

    try {
        const store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const normalized = {
            ...createEmptyStore(),
            ...store,
            profile: { ...createEmptyStore().profile, ...(store.profile || {}) },
            auth: normalizeAuthStore(store.auth),
            paymentRequests: Array.isArray(store.paymentRequests) ? store.paymentRequests : [],
            broadcasts: Array.isArray(store.broadcasts) ? store.broadcasts : [],
            modelSettings: normalizeModelSettings(store.modelSettings),
            conversations: Array.isArray(store.conversations) ? store.conversations : []
        };
        const subscriptionChanged = refreshExpiredSubscriptions(normalized);
        const migrated = migrateStoredAttachments(normalized);
        const ownershipChanged = migrateConversationOwnership(migrated.store);
        if (migrated.changed || ownershipChanged || subscriptionChanged) {
            writeStore(migrated.store);
        }
        return migrated.store;
    } catch (err) {
        const backup = `${DATA_FILE}.broken-${Date.now()}`;
        fs.copyFileSync(DATA_FILE, backup);
        const initial = createEmptyStore();
        writeStore(initial);
        return initial;
    }
}

function normalizeAuthStore(auth = {}) {
    const normalized = {
        users: Array.isArray(auth.users) ? auth.users : [],
        sessions: Array.isArray(auth.sessions) ? auth.sessions : [],
        adminSessions: Array.isArray(auth.adminSessions) ? auth.adminSessions : [],
        admin: auth.admin || createDefaultAdmin()
    };

    if (!normalized.admin?.passwordHash || !normalized.admin?.salt) {
        normalized.admin = createDefaultAdmin();
    }
    return normalized;
}

function refreshExpiredSubscriptions(store) {
    let changed = false;
    (store.auth?.users || []).forEach((user) => {
        if (normalizeUserSubscription(user)) {
            ensureCreditUsage(user, store.modelSettings);
            changed = true;
        }
    });
    const profileUser = (store.auth?.users || []).find((user) => user.email === store.profile?.email);
    if (profileUser) {
        syncProfileFromUser(store, profileUser);
    } else {
        const previousPlan = store.profile?.subscriptionPlan;
        store.profile.subscriptionPlan = 'Free';
        store.profile.subscriptionExpiresAt = null;
        if (previousPlan !== 'Free') changed = true;
    }
    return changed;
}

function writeStore(store) {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2));
    fs.copyFileSync(tempFile, DATA_FILE);
    fs.rmSync(tempFile, { force: true });
}

function cleanEmail(email = '') {
    return String(email || '').trim().toLowerCase().slice(0, 160);
}

function isValidEmail(email = '') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

function safeUser(user) {
    if (!user) return null;
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        verified: Boolean(user.verified),
        frozen: Boolean(user.frozen),
        role: user.role || 'user',
        avatarUrl: user.avatarUrl || '',
        subscriptionPlan: subscriptionPlanForUser(user),
        subscriptionExpiresAt: subscriptionPlanForUser(user) === 'Free' ? null : user.subscriptionExpiresAt || null,
        subscriptionDaysLeft: subscriptionDaysLeft(user),
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || null
    };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    return {
        salt,
        hash: crypto.pbkdf2Sync(String(password || ''), salt, 120000, 32, 'sha256').toString('hex')
    };
}

function verifyPassword(password, passwordHash, salt) {
    if (!passwordHash || !salt) return false;
    return hashPassword(password, salt).hash === passwordHash;
}

function createToken(prefix) {
    return `${prefix}_${crypto.randomBytes(32).toString('hex')}`;
}

function createOtpCode() {
    return String(crypto.randomInt(100000, 1000000));
}

function isTrustedAvatarUrl(value = '') {
    const url = String(value || '');
    return /^https:\/\/(?:lh3|lh4|lh5|lh6)\.googleusercontent\.com\//i.test(url)
        || /^https:\/\/(?:[^/]+\.)?googleusercontent\.com\//i.test(url);
}

function initialsFromUser(user) {
    const nameParts = String(user?.name || '').trim().split(/\s+/).filter(Boolean);
    if (nameParts.length >= 3) {
        return nameParts.slice(1, 3).map((part) => part[0]).join('').toUpperCase();
    }
    if (nameParts.length >= 2) {
        return nameParts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    }
    const fallback = String(user?.email || user?.name || 'User').trim();
    return fallback.slice(0, 2).toUpperCase() || 'U';
}

function syncProfileFromUser(store, user) {
    if (!user) return;
    store.profile = {
        ...store.profile,
        name: user.name || store.profile.name,
        email: user.email || store.profile.email,
        initials: initialsFromUser(user),
        avatarUrl: user.avatarUrl || store.profile.avatarUrl || '',
        subscriptionPlan: subscriptionPlanForUser(user),
        subscriptionExpiresAt: subscriptionPlanForUser(user) === 'Free' ? null : user.subscriptionExpiresAt || null,
        subscriptionDaysLeft: subscriptionDaysLeft(user),
        creditSummary: creditSummaryForUser(user, store.modelSettings)
    };
}

function currentUserFromRequest(req, store) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) return null;
    const session = (store.auth?.sessions || []).find((item) => item.token === token);
    if (!session) return null;
    return (store.auth?.users || []).find((user) => user.id === session.userId) || null;
}

function currentAdminFromRequest(req, store) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) return null;
    const session = (store.auth?.adminSessions || []).find((item) => item.token === token);
    return session ? store.auth.admin : null;
}

function nextLocalMidnightIso(date = new Date()) {
    const next = new Date(date);
    next.setHours(24, 0, 0, 0);
    return next.toISOString();
}

function nextWeeklyResetIso(date = new Date()) {
    const next = new Date(date);
    const day = next.getDay();
    const daysUntilMonday = day === 0 ? 1 : 8 - day;
    next.setDate(next.getDate() + daysUntilMonday);
    next.setHours(0, 0, 0, 0);
    return next.toISOString();
}

function nextWindowResetIso(date = new Date(), windowMs = 5 * 60 * 60 * 1000) {
    return new Date(date.getTime() + windowMs).toISOString();
}

function nextDurationResetIso(date = new Date(), durationMs = 5 * 60 * 60 * 1000) {
    return new Date(date.getTime() + Math.max(1, Number(durationMs || 0))).toISOString();
}

function creditResetAtForLimit(limit = {}, date = new Date()) {
    if (limit.primaryPeriod === 'weekly') return nextDurationResetIso(date, 7 * 24 * 60 * 60 * 1000);
    if (limit.primaryPeriod === 'hourly') {
        return nextDurationResetIso(date, Math.max(1, Number(limit.primaryWindowHours || 5)) * 60 * 60 * 1000);
    }
    return nextDurationResetIso(date, Math.max(1, Number(limit.primaryWindowHours || 24)) * 60 * 60 * 1000);
}

function creditResetLabel(limit = {}, fallback = 'Reset otomatis') {
    if (limit.primaryPeriod === 'weekly') return 'Reset mingguan';
    if (limit.primaryPeriod === 'hourly') return `Reset per ${Math.max(1, Number(limit.primaryWindowHours || 5))} jam`;
    return fallback;
}

function blankBucket(limit, resetAt = null) {
    return {
        inputUsed: 0,
        outputUsed: 0,
        inputLimit: Number(limit.input || 0),
        outputLimit: Number(limit.output || 0),
        resetAt: resetAt || null
    };
}

function bucketHasUsage(bucket = {}) {
    return Number(bucket.inputUsed || 0) > 0 || Number(bucket.outputUsed || 0) > 0;
}

function updateBucketForLimit(existingBucket = {}, limit, now) {
    const resetAt = existingBucket.resetAt ? new Date(existingBucket.resetAt) : null;
    if (!bucketHasUsage(existingBucket) || !resetAt || Number.isNaN(resetAt.getTime()) || resetAt <= now) {
        return blankBucket(limit);
    }
    return {
        ...blankBucket(limit, existingBucket.resetAt),
        ...existingBucket,
        inputLimit: Number(limit.input || 0),
        outputLimit: Number(limit.output || 0)
    };
}

function creditLimitsForSettings(modelSettings = null) {
    const settings = normalizeModelSettings(modelSettings);
    return {
        Free: settings.Free.creditLimits,
        Pro: settings.Pro.creditLimits,
        Ultra: settings.Ultra.creditLimits
    };
}

function ensureCreditUsage(user, modelSettings = null) {
    if (!user) return {};
    const now = new Date();
    const limits = creditLimitsForSettings(modelSettings);
    user.creditUsage = user.creditUsage && typeof user.creditUsage === 'object' ? user.creditUsage : {};

    const free = user.creditUsage.Free?.daily || {};
    user.creditUsage.Free = {
        daily: updateBucketForLimit(free, limits.Free.primary, now)
    };

    ['Pro', 'Ultra'].forEach((plan) => {
        const config = limits[plan];
        const usage = user.creditUsage[plan] || {};
        const windowBucket = usage.window || {};
        const weeklyBucket = usage.weekly || {};
        user.creditUsage[plan] = {
            window: updateBucketForLimit(windowBucket, config.primary, now),
            weekly: updateBucketForLimit(weeklyBucket, config.weekly, now)
        };
    });

    return user.creditUsage;
}

function bucketRemaining(bucket) {
    return {
        input: Math.max(0, Number(bucket.inputLimit || 0) - Number(bucket.inputUsed || 0)),
        output: Math.max(0, Number(bucket.outputLimit || 0) - Number(bucket.outputUsed || 0))
    };
}

function bucketPercent(bucket) {
    const remaining = bucketRemaining(bucket);
    const inputPercent = bucket.inputLimit ? remaining.input / bucket.inputLimit : 0;
    const outputPercent = bucket.outputLimit ? remaining.output / bucket.outputLimit : 0;
    return Math.max(0, Math.min(100, Math.floor(Math.min(inputPercent, outputPercent) * 100)));
}

function subscriptionAllowsPlan(user, plan) {
    const subscription = subscriptionPlanForUser(user);
    if (plan === 'Free') return true;
    if (plan === 'Pro') return subscription === 'Pro' || subscription === 'Ultra';
    if (plan === 'Ultra') return subscription === 'Ultra';
    return false;
}

function bucketSummary(bucket) {
    return {
        ...bucket,
        remaining: bucketRemaining(bucket),
        percent: bucketPercent(bucket)
    };
}

function creditSummaryForUser(user, modelSettings = null) {
    if (!user) return {};
    const settings = normalizeModelSettings(modelSettings);
    const usage = ensureCreditUsage(user, settings);
    const freeDaily = usage.Free.daily;
    const proWindow = usage.Pro.window;
    const proWeekly = usage.Pro.weekly;
    const ultraWindow = usage.Ultra.window;
    const ultraWeekly = usage.Ultra.weekly;
    return {
        Free: {
            label: settings.Free.modelName || 'Free',
            percent: bucketPercent(freeDaily),
            daily: bucketSummary(freeDaily),
            resetLabel: creditResetLabel(settings.Free.creditLimits, 'Reset harian 00:00')
        },
        Pro: {
            label: settings.Pro.modelName || 'Snake AI 1.1',
            percent: Math.min(bucketPercent(proWindow), bucketPercent(proWeekly)),
            window: bucketSummary(proWindow),
            weekly: bucketSummary(proWeekly),
            resetLabel: `${creditResetLabel(settings.Pro.creditLimits, 'Reset 5 jam')} + mingguan`
        },
        Ultra: {
            label: settings.Ultra.modelName || 'Snake AI',
            percent: Math.min(bucketPercent(ultraWindow), bucketPercent(ultraWeekly)),
            window: bucketSummary(ultraWindow),
            weekly: bucketSummary(ultraWeekly),
            resetLabel: `${creditResetLabel(settings.Ultra.creditLimits, 'Reset 5 jam')} + mingguan`
        }
    };
}

function estimateTokens(value = '') {
    const clean = String(value || '').trim();
    if (!clean) return 0;
    return Math.max(1, Math.ceil(clean.length / 4));
}

function estimateMessageInputTokens(content, attachments = [], replyToMessage = null) {
    const attachmentTokens = (attachments || []).reduce((total, attachment) => {
        return total + estimateTokens(`${attachment.name || ''} ${attachment.text || attachment.preview || ''}`);
    }, 0);
    const replyTokens = replyToMessage ? estimateTokens(replyToMessage.content || '') : 0;
    return Math.max(1, estimateTokens(content) + attachmentTokens + replyTokens);
}

function checkCreditAllowance(user, plan, inputTokens, modelSettings = null) {
    const settings = normalizeModelSettings(modelSettings);
    if (settings[plan] && settings[plan].enabled === false) {
        return {
            ok: false,
            status: 403,
            message: `Model ${plan} sedang dinonaktifkan oleh admin.`
        };
    }
    if (!subscriptionAllowsPlan(user, plan)) {
        return {
            ok: false,
            status: 403,
            message: plan === 'Ultra'
                ? 'Paket Ultra diperlukan untuk memakai model Ultra.'
                : 'Paket Pro atau Ultra diperlukan untuk memakai model Pro.'
        };
    }
    const usage = ensureCreditUsage(user, settings);
    const buckets = plan === 'Free'
        ? [usage.Free.daily]
        : [usage[plan].window, usage[plan].weekly];
    const hasInput = buckets.every((bucket) => bucketRemaining(bucket).input >= inputTokens);
    const hasOutput = buckets.every((bucket) => bucketRemaining(bucket).output > 0);
    if (!hasInput || !hasOutput) {
        return {
            ok: false,
            status: 429,
            message: `Credit ${plan} sudah 0%. Tunggu reset otomatis sebelum bertanya lagi.`
        };
    }
    return { ok: true };
}

function deductCreditUsage(user, plan, inputTokens, outputTokens, modelSettings = null) {
    if (!user) return;
    const settings = normalizeModelSettings(modelSettings);
    const limits = creditLimitsForSettings(settings);
    const now = new Date();
    const usage = ensureCreditUsage(user, settings);
    const buckets = plan === 'Free'
        ? [{ bucket: usage.Free.daily, resetAt: creditResetAtForLimit(limits.Free, now) }]
        : [
            { bucket: usage[plan].window, resetAt: creditResetAtForLimit(limits[plan], now) },
            { bucket: usage[plan].weekly, resetAt: nextDurationResetIso(now, 7 * 24 * 60 * 60 * 1000) }
        ];
    buckets.forEach(({ bucket, resetAt }) => {
        bucket.resetAt = resetAt;
        bucket.inputUsed = Math.max(0, Number(bucket.inputUsed || 0) + inputTokens);
        bucket.outputUsed = Math.max(0, Number(bucket.outputUsed || 0) + outputTokens);
    });
}

function qrisCrc16(value) {
    let crc = 0xffff;
    for (let index = 0; index < value.length; index += 1) {
        crc ^= value.charCodeAt(index) << 8;
        for (let bit = 0; bit < 8; bit += 1) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
            crc &= 0xffff;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function parseEmvTlv(value) {
    const clean = String(value || '').trim();
    const fields = [];
    let index = 0;
    while (index + 4 <= clean.length) {
        const tag = clean.slice(index, index + 2);
        const length = Number(clean.slice(index + 2, index + 4));
        if (!Number.isFinite(length) || length < 0) break;
        const start = index + 4;
        const end = start + length;
        if (end > clean.length) break;
        fields.push({ tag, value: clean.slice(start, end) });
        index = end;
    }
    return fields;
}

function serializeEmvTlv(fields) {
    return fields
        .map(({ tag, value }) => `${tag}${String(value).length.toString().padStart(2, '0')}${value}`)
        .join('');
}

function dynamicQrisForAmount(amount) {
    const amountText = String(amount);
    const fields = parseEmvTlv(QRIS_TEMPLATE).filter((field) => field.tag !== '63');
    const setField = (tag, value) => {
        const existing = fields.find((field) => field.tag === tag);
        if (existing) existing.value = value;
        else fields.push({ tag, value });
    };

    setField('01', '12');
    const currencyIndex = fields.findIndex((field) => field.tag === '53');
    const amountIndex = fields.findIndex((field) => field.tag === '54');
    if (amountIndex >= 0) {
        fields[amountIndex].value = amountText;
    } else {
        fields.splice(currencyIndex >= 0 ? currencyIndex + 1 : fields.length, 0, { tag: '54', value: amountText });
    }

    const payload = `${serializeEmvTlv(fields)}6304`;
    return `${payload}${qrisCrc16(payload)}`;
}

function base64UrlDecodeJson(value) {
    const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

async function fetchGoogleCerts() {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!response.ok) throw new Error('Gagal mengambil Google public keys.');
    return response.json();
}

async function verifyGoogleIdToken(idToken) {
    if (!GOOGLE_CLIENT_ID) {
        const err = new Error('GOOGLE_CLIENT_ID belum dikonfigurasi di server.');
        err.status = 503;
        throw err;
    }

    const parts = String(idToken || '').split('.');
    if (parts.length !== 3) {
        const err = new Error('Credential Google tidak valid.');
        err.status = 400;
        throw err;
    }

    const header = base64UrlDecodeJson(parts[0]);
    const payload = base64UrlDecodeJson(parts[1]);
    const certs = await fetchGoogleCerts();
    const key = (certs.keys || []).find((item) => item.kid === header.kid);
    if (!key) {
        const err = new Error('Google public key tidak cocok.');
        err.status = 401;
        throw err;
    }

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();
    const signature = Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    const publicKey = crypto.createPublicKey({ key, format: 'jwk' });
    if (!verifier.verify(publicKey, signature)) {
        const err = new Error('Signature Google token tidak valid.');
        err.status = 401;
        throw err;
    }

    const now = Math.floor(Date.now() / 1000);
    if (!['https://accounts.google.com', 'accounts.google.com'].includes(payload.iss)) {
        const err = new Error('Issuer Google token tidak valid.');
        err.status = 401;
        throw err;
    }
    if (payload.aud !== GOOGLE_CLIENT_ID) {
        const err = new Error('Audience Google token tidak cocok dengan GOOGLE_CLIENT_ID.');
        err.status = 401;
        throw err;
    }
    if (!payload.exp || payload.exp < now) {
        const err = new Error('Google token sudah kedaluwarsa.');
        err.status = 401;
        throw err;
    }
    if (!payload.email || !payload.email_verified) {
        const err = new Error('Email Google belum terverifikasi.');
        err.status = 401;
        throw err;
    }

    return payload;
}

function publicUploadUrl(fileName) {
    return `/uploads/${fileName}`;
}

function persistAttachmentDataUrl(file) {
    if (!file?.dataUrl || !file.dataUrl.includes(',')) return file;

    const [meta, base64] = file.dataUrl.split(',', 2);
    if (!/;base64/i.test(meta || '')) return file;

    fs.mkdirSync(PUBLIC_UPLOAD_DIR, { recursive: true });
    const extension = path.extname(safeFileName(file.name)) || extensionFromMime(file.type);
    const fileName = `${createId('asset')}${extension}`;
    const filePath = path.join(PUBLIC_UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));

    const { dataUrl, ...rest } = file;
    return {
        ...rest,
        url: publicUploadUrl(fileName)
    };
}

function dataUrlToPersistedAttachment(dataUrl, name = 'generated-image.png') {
    return persistAttachmentDataUrl({
        id: createId('file'),
        name,
        type: dataUrl.match(/^data:([^;]+);base64,/)?.[1] || 'image/png',
        size: 0,
        kind: 'image',
        preview: '',
        dataUrl
    });
}

function extensionFromMime(type) {
    const clean = String(type || '').toLowerCase();
    if (clean.includes('png')) return '.png';
    if (clean.includes('webp')) return '.webp';
    if (clean.includes('gif')) return '.gif';
    if (clean.includes('jpeg') || clean.includes('jpg')) return '.jpg';
    return '.bin';
}

function hasPendingAssistant(store) {
    return store.conversations.some((conversation) =>
        (conversation.messages || []).some((message) => message.role === 'assistant' && message.isLoading)
    );
}

function settleStalePendingAssistants(store, maxAgeMs = 3 * 60 * 1000) {
    const now = Date.now();
    let changed = false;

    store.conversations.forEach((conversation) => {
        (conversation.messages || []).forEach((message) => {
            if (message.role !== 'assistant' || !message.isLoading) return;
            const age = now - new Date(message.createdAt || 0).getTime();
            if (Number.isFinite(age) && age < maxAgeMs) return;

            message.content = 'Error: Jawaban terlalu lama atau tidak berhasil ditangkap. Coba kirim ulang pesan.';
            message.isLoading = false;
            message.isError = true;
            message.completedAt = nowIso();
            conversation.updatedAt = nowIso();
            changed = true;
        });
    });

    return changed;
}

function isExecutionContextError(err) {
    return /Execution context was destroyed|Cannot find context|Target closed|Navigating frame was detached/i.test(err?.message || '');
}

function isNoVisibleResponseError(err) {
    return /Jawaban ChatGPT tidak muncul setelah pesan terkirim/i.test(err?.message || '');
}

function migrateStoredAttachments(store) {
    let changed = false;
    store.conversations.forEach((conversation) => {
        (conversation.messages || []).forEach((message) => {
            if (!Array.isArray(message.attachments)) return;
            message.attachments = message.attachments.map((file) => {
                if (!file?.dataUrl || file.url) return file;
                const persisted = persistAttachmentDataUrl(file);
                if (persisted !== file) changed = true;
                return persisted;
            });
        });
    });
    return { store, changed };
}

function titleFromMessage(message) {
    const clean = message.replace(/\s+/g, ' ').trim();
    if (!clean) return 'Percakapan Baru';
    const lower = clean.toLowerCase();

    if (/\b(kamu|anda|ai|model)\b.*\b(bisa apa|kemampuan|fitur|siapa|model apa)\b/i.test(lower)) {
        return 'Kemampuan Snake AI';
    }
    if (/\b(digital\s*ocean|snake\s*ai|depoizon\s*ai|instruksi|intruksi)\b/i.test(lower) && /\b(kamu|ai|model|identitas|siapa)\b/i.test(lower)) {
        return 'Identitas Snake AI';
    }
    if (/\b(model apa|nama model|model sebenarnya|identity|identitas model|mask)\b/i.test(lower)) {
        return 'Identitas Model AI';
    }
    if (/\b(error|bug|gagal|fix|fiks|perbaiki|debug)\b/i.test(lower)) {
        const target = clean.match(/\b(?:bug|error|fitur|tampilan|ui|login|pembayaran|qris|download|zip|chat|profil|langganan)\b/gi)?.slice(-2).join(' ');
        return titleCaseCompact(`Perbaikan ${target || 'Bug'}`);
    }

    const typeMap = [
        ['portfolio|portofolio|porto\\s*folio', 'Portofolio'],
        ['admin|dashboard', 'Dashboard Admin'],
        ['login|register|auth', 'Sistem Login'],
        ['payment|pembayaran|qris', 'Pembayaran QRIS'],
        ['subscription|langganan|pro|ultra', 'Langganan'],
        ['download|zip|file', 'Download File'],
        ['cisco|packet\\s*tracer|jaringan|network', 'Cisco Packet Tracer'],
        ['crud|database|mysql|sql', 'CRUD Database'],
        ['video|videos', 'Manajemen Video'],
        ['profile|profil|avatar', 'Profil User']
    ];
    const matches = [];
    typeMap.forEach(([pattern, label]) => {
        if (new RegExp(`\\b(${pattern})\\b`, 'i').test(clean)) matches.push(label);
    });
    const intent = /\b(website|web|html|landing|page)\b/i.test(clean)
        ? 'Website'
        : /\b(api|backend|server)\b/i.test(clean)
            ? 'Backend'
            : /\b(script|tool|program|kode|coding)\b/i.test(clean)
                ? 'Program'
                : '';
    const summary = [...new Set([intent, ...matches])].filter(Boolean).slice(0, 4).join(' ');
    if (summary) return summary.slice(0, 56);

    const stopWords = new Set('buatkan buat saya tolong dong min kak program aplikasi website file kode codingan dengan untuk yang dan agar tema pakai menggunakan dalam dari ke di pada itu ini adalah sebuah menjadi secara bagian fitur'.split(' '));
    const words = lower
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 2 && !stopWords.has(word))
        .slice(0, 5);
    if (words.length) return titleCaseCompact(words.join(' '));
    return clean.length > 42 ? `${clean.slice(0, 42)}...` : clean;
}

function titleCaseCompact(value = '') {
    return String(value || '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}` : '')
        .join(' ')
        .slice(0, 56);
}

function getConversationOrFail(store, id) {
    const conversation = store.conversations.find((item) => item.id === id);
    if (!conversation) {
        const err = new Error('Percakapan tidak ditemukan.');
        err.status = 404;
        throw err;
    }
    return conversation;
}

function normalizeAttachments(attachments, { persist = false } = {}) {
    if (!Array.isArray(attachments)) return [];

    return attachments.slice(0, 8).map((file) => {
        const normalized = {
            id: file.id || createId('file'),
            name: String(file.name || 'file').slice(0, 160),
            type: String(file.type || 'application/octet-stream').slice(0, 120),
            size: Number(file.size || 0),
            kind: file.kind || (String(file.type || '').startsWith('image/') ? 'image' : 'document'),
            preview: String(file.preview || '').slice(0, 12000),
            dataUrl: String(file.dataUrl || ''),
            url: String(file.url || '')
        };
        return persist ? persistAttachmentDataUrl(normalized) : normalized;
    });
}

function safeFileName(name) {
    return String(name || 'upload')
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
        .slice(0, 120);
}

function attachmentToTempFile(file) {
    if (!file.dataUrl || !file.dataUrl.includes(',')) return null;

    const [meta, base64] = file.dataUrl.split(',', 2);
    if (!/;base64/i.test(meta || '')) return null;

    fs.mkdirSync(UPLOAD_TMP_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_TMP_DIR, `${createId('upload')}_${safeFileName(file.name)}`);
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    return filePath;
}

async function uploadAttachmentsToChatGPT(attachments) {
    const uploadable = attachments
        .map((file) => ({ file, path: attachmentToTempFile(file) }))
        .filter((item) => item.path);

    if (uploadable.length === 0) return [];

    console.log(`[+] Upload ${uploadable.length} lampiran ke ChatGPT...`);

    const input = await page.$('input[type="file"]');
    if (!input) {
        throw new Error('Input upload file ChatGPT tidak ditemukan.');
    }

    await input.uploadFile(...uploadable.map((item) => item.path));

    const names = uploadable.map((item) => item.file.name);
    await page.waitForFunction((expectedNames) => {
        const text = document.body.innerText || '';
        const hasVisibleName = expectedNames.some((name) => text.includes(name));
        const hasAttachmentPreview = document.querySelector(
            '[data-testid*="attachment"], [data-testid*="file"], img[src^="blob:"], img[src^="data:"], button[aria-label*="Remove"], button[aria-label*="Hapus"]'
        );
        return hasVisibleName || !!hasAttachmentPreview;
    }, { timeout: 8000 }, names).catch(() => {
        console.log('[i] Preview lampiran tidak menampilkan nama file, menunggu tombol kirim aktif...');
    });

    await page.waitForFunction(() => {
        const button = document.querySelector('button[data-testid="send-button"]');
        return button && !button.disabled;
    }, { timeout: 120000 });

    return uploadable.map((item) => item.path);
}

function cleanupTempFiles(files) {
    files.forEach((file) => {
        try {
            fs.rmSync(file, { force: true });
        } catch (err) {
            // ignore cleanup errors
        }
    });
}

function cleanPromptText(value) {
    let text = String(value || '');
    if (/ProseMirror-trailingBreak|<\/?p\b|<br\b/i.test(text)) {
        text = text
            .replace(/<br\s+class=["']?ProseMirror-trailingBreak["']?\s*\/?>/gi, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
            .replace(/<\/?p[^>]*>/gi, '')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&amp;/gi, '&');
    }
    return text.replace(/\u00a0/g, ' ').trim();
}

function buildPrompt(message, attachments, replyTo) {
    const parts = [];

    if (replyTo) {
        parts.push(`Konteks reply:\n${replyTo}`);
    }

    if (attachments.length > 0) {
        parts.push('Lampiran yang dikirim user:');
        attachments.forEach((file, index) => {
            parts.push(`${index + 1}. ${file.name} (${file.type || file.kind}, ${file.size} bytes)`);
            if (file.preview) {
                parts.push(`Isi/preview ${file.name}:\n${file.preview}`);
            } else if (file.kind === 'image') {
                parts.push(`Gambar ${file.name} sudah saya unggah. Analisis isi gambar tersebut jika pertanyaan user membahas foto.`);
            }
        });
    }

    parts.push(cleanPromptText(message));
    return parts.filter(Boolean).join('\n\n');
}

function digitalOceanPlanConfig(mode = {}) {
    const plan = mode.plan === 'Ultra' ? 'Ultra' : mode.plan === 'Pro' ? 'Pro' : 'Free';
    if (plan === 'Pro') {
        return {
            plan,
            label: 'Snake AI 1.0',
            model: REQUIRED_PRO_MODEL,
            apiKey: DIGITALOCEAN_PRO_API_KEY,
            agentUrl: DIGITALOCEAN_PRO_AGENT_URL
        };
    }
    if (plan === 'Ultra') {
        return {
            plan,
            label: 'Snake AI 1.5',
            model: REQUIRED_ULTRA_MODEL,
            apiKey: DIGITALOCEAN_ULTRA_API_KEY,
            agentUrl: DIGITALOCEAN_ULTRA_AGENT_URL
        };
    }
    return null;
}

async function digitalOceanControlApi(pathname) {
    if (!DIGITALOCEAN_API_TOKEN) {
        const err = new Error('DIGITALOCEAN_API_TOKEN belum diisi di .env.');
        err.status = 400;
        throw err;
    }

    const response = await fetch(`https://api.digitalocean.com/v2${pathname}`, {
        headers: {
            Authorization: `Bearer ${DIGITALOCEAN_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const text = await response.text();
    let payload = {};
    try {
        payload = text ? JSON.parse(text) : {};
    } catch {
        payload = { raw: text };
    }

    if (!response.ok) {
        const message = payload.message
            || payload.error
            || payload.id
            || `DigitalOcean API mengembalikan status ${response.status}.`;
        const err = new Error(String(message));
        err.status = response.status;
        throw err;
    }
    return payload;
}

function dropletPublicIp(droplet = {}) {
    const networks = droplet.networks || {};
    const publicV4 = (networks.v4 || []).find((network) => network.type === 'public');
    return publicV4?.ip_address || '';
}

function dropletPrivateIp(droplet = {}) {
    const networks = droplet.networks || {};
    const privateV4 = (networks.v4 || []).find((network) => network.type === 'private');
    return privateV4?.ip_address || '';
}

function safeDropletSummary(droplet = {}) {
    return {
        id: droplet.id,
        name: droplet.name || '-',
        status: droplet.status || '-',
        region: {
            slug: droplet.region?.slug || '-',
            name: droplet.region?.name || droplet.region?.slug || '-'
        },
        sizeSlug: droplet.size_slug || droplet.size?.slug || '-',
        vcpus: Number(droplet.vcpus || 0),
        memoryMb: Number(droplet.memory || 0),
        diskGb: Number(droplet.disk || 0),
        transferTb: Number(droplet.size?.transfer || 0),
        image: [droplet.image?.distribution, droplet.image?.name].filter(Boolean).join(' ') || '-',
        publicIpv4: dropletPublicIp(droplet),
        privateIpv4: dropletPrivateIp(droplet),
        createdAt: droplet.created_at || ''
    };
}

function parseDigitalOceanMoney(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function manualDigitalOceanCredit() {
    const remaining = parseDigitalOceanMoney(DIGITALOCEAN_CREDIT_REMAINING || DIGITALOCEAN_CREDIT_BALANCE);
    const balance = parseDigitalOceanMoney(DIGITALOCEAN_CREDIT_BALANCE || DIGITALOCEAN_CREDIT_REMAINING);
    const initial = parseDigitalOceanMoney(DIGITALOCEAN_CREDIT_INITIAL);
    if (!remaining && !balance && !initial && !DIGITALOCEAN_CREDIT_DESCRIPTION) return null;
    return {
        source: 'manual',
        description: DIGITALOCEAN_CREDIT_DESCRIPTION || 'DigitalOcean credit',
        expiration: DIGITALOCEAN_CREDIT_EXPIRES_AT || '',
        initial,
        amountRemaining: remaining || balance,
        availableCredits: balance || remaining
    };
}

function safeBillingHistoryEntry(entry = {}) {
    return {
        description: entry.description || entry.type || '-',
        amount: parseDigitalOceanMoney(entry.amount),
        date: entry.date || entry.invoice_period || entry.created_at || '',
        type: entry.type || '',
        invoiceId: entry.invoice_id || entry.invoice_uuid || ''
    };
}

async function buildDigitalOceanBilling() {
    try {
        const balance = await digitalOceanControlApi('/customers/my/balance');
        const manualCredit = manualDigitalOceanCredit();
        let history = [];
        let historyError = '';
        try {
            const historyPayload = await digitalOceanControlApi('/customers/my/billing_history?per_page=8');
            history = (historyPayload.billing_history || []).map(safeBillingHistoryEntry).slice(0, 8);
        } catch (err) {
            historyError = err.message || 'Billing history belum tersedia.';
        }

        const accountBalance = parseDigitalOceanMoney(balance.account_balance);
        const monthToDateBalance = parseDigitalOceanMoney(balance.month_to_date_balance);
        const monthToDateUsage = parseDigitalOceanMoney(balance.month_to_date_usage);
        const apiAvailableCredits = accountBalance < 0 ? Math.abs(accountBalance) : 0;
        const availableCredits = apiAvailableCredits || manualCredit?.availableCredits || 0;

        return {
            ok: true,
            accountBalance,
            monthToDateBalance,
            monthToDateUsage,
            availableCredits,
            amountDue: accountBalance > 0 ? accountBalance : 0,
            generatedAt: balance.generated_at || '',
            creditSource: apiAvailableCredits ? 'api' : manualCredit ? 'manual' : 'api',
            credit: manualCredit,
            history,
            historyError
        };
    } catch (err) {
        return {
            ok: false,
            error: err.message || 'Gagal membaca billing DigitalOcean.',
            statusCode: err.status || 500
        };
    }
}

function latestMetricValues(payload = {}) {
    const results = payload.data?.result || [];
    return results.map((series) => {
        const values = series.values || [];
        const latest = values[values.length - 1] || [];
        return {
            metric: series.metric || {},
            value: Number(latest[1])
        };
    }).filter((item) => Number.isFinite(item.value));
}

function latestMetricValue(payload = {}) {
    const values = latestMetricValues(payload);
    return values.length ? values[0].value : null;
}

async function dropletMetric(hostId, metric, start, end) {
    const params = new URLSearchParams({
        host_id: String(hostId),
        start: String(start),
        end: String(end)
    });
    return digitalOceanControlApi(`/monitoring/metrics/droplet/${metric}?${params.toString()}`);
}

function ratioPercent(used, total) {
    if (!Number.isFinite(used) || !Number.isFinite(total) || total <= 0) return null;
    return Math.max(0, Math.min(100, Number(((used / total) * 100).toFixed(1))));
}

async function buildDropletMetrics(dropletId) {
    const end = Math.floor(Date.now() / 1000);
    const start = end - (60 * 60);
    const [cpuPayload, loadPayload, memoryAvailablePayload, memoryTotalPayload, diskFreePayload, diskSizePayload] = await Promise.all([
        dropletMetric(dropletId, 'cpu', start, end),
        dropletMetric(dropletId, 'load_1', start, end),
        dropletMetric(dropletId, 'memory_available', start, end),
        dropletMetric(dropletId, 'memory_total', start, end),
        dropletMetric(dropletId, 'filesystem_free', start, end),
        dropletMetric(dropletId, 'filesystem_size', start, end)
    ]);

    const cpuValues = latestMetricValues(cpuPayload);
    const cpuTotal = cpuValues.reduce((sum, item) => sum + item.value, 0);
    const cpuIdle = cpuValues
        .filter((item) => item.metric.mode === 'idle')
        .reduce((sum, item) => sum + item.value, 0);
    const cpuPercent = cpuTotal > 0 ? Number((((cpuTotal - cpuIdle) / cpuTotal) * 100).toFixed(1)) : null;

    const memoryAvailable = latestMetricValue(memoryAvailablePayload);
    const memoryTotal = latestMetricValue(memoryTotalPayload);
    const diskFree = latestMetricValue(diskFreePayload);
    const diskSize = latestMetricValue(diskSizePayload);

    return {
        cpuPercent,
        load1: latestMetricValue(loadPayload),
        memoryPercent: ratioPercent(memoryTotal - memoryAvailable, memoryTotal),
        diskPercent: ratioPercent(diskSize - diskFree, diskSize),
        checkedAt: new Date().toISOString()
    };
}

async function attachDropletMetrics(droplets = []) {
    const settled = await Promise.allSettled(droplets.map((droplet) => buildDropletMetrics(droplet.id)));
    return droplets.map((droplet, index) => {
        const result = settled[index];
        if (result.status === 'fulfilled') {
            return { ...droplet, metrics: result.value };
        }
        return {
            ...droplet,
            metrics: {
                error: result.reason?.message || 'Metrics belum tersedia.'
            }
        };
    });
}

async function buildDigitalOceanOverview() {
    if (!DIGITALOCEAN_API_TOKEN) {
        return {
            configured: false,
            error: 'DIGITALOCEAN_API_TOKEN belum diisi di .env.'
        };
    }

    try {
        const [accountPayload, dropletPayload, billing] = await Promise.all([
            digitalOceanControlApi('/account'),
            digitalOceanControlApi('/droplets?per_page=50'),
            buildDigitalOceanBilling()
        ]);
        const droplets = await attachDropletMetrics((dropletPayload.droplets || []).map(safeDropletSummary));
        const totals = droplets.reduce((acc, droplet) => {
            acc.vcpus += droplet.vcpus;
            acc.memoryMb += droplet.memoryMb;
            acc.diskGb += droplet.diskGb;
            acc.transferTb += droplet.transferTb;
            if (droplet.status === 'active') acc.active += 1;
            return acc;
        }, { droplets: droplets.length, active: 0, vcpus: 0, memoryMb: 0, diskGb: 0, transferTb: 0 });

        return {
            configured: true,
            email: accountPayload.account?.email || '',
            status: accountPayload.account?.status || '',
            dropletLimit: accountPayload.account?.droplet_limit || 0,
            floatingIpLimit: accountPayload.account?.floating_ip_limit || 0,
            billing,
            totals,
            droplets
        };
    } catch (err) {
        return {
            configured: true,
            error: err.message || 'Gagal membaca DigitalOcean API.',
            statusCode: err.status || 500
        };
    }
}

function attachmentContentForInference(file, { allowImageParts = true } = {}) {
    if (file.kind === 'image' && file.dataUrl) {
        if (!allowImageParts) {
            return [
                `Gambar: ${file.name}`,
                'Catatan: endpoint agent ini menerima teks. Jika model agent belum vision, gambar tidak bisa dianalisis langsung.'
            ].join('\n');
        }
        return [
            { type: 'text', text: `Gambar: ${file.name}` },
            { type: 'image_url', image_url: { url: file.dataUrl } }
        ];
    }

    const lines = [`Lampiran: ${file.name} (${file.type || file.kind}, ${file.size} bytes)`];
    if (file.preview) {
        lines.push(`Isi/preview:\n${file.preview}`);
    } else if (file.kind === 'image') {
        lines.push('Gambar tersimpan di aplikasi lokal, tetapi model ini hanya bisa menganalisis gambar jika endpoint mendukung vision input.');
    }
    return lines.join('\n');
}

function messageMatchesPlan(message = {}, plan = 'Free') {
    if (message.id === undefined) return false;
    if (message.role === 'assistant') {
        return message.source?.plan === plan;
    }
    if (message.role === 'user') {
        return message.mode?.plan === plan;
    }
    return false;
}

function buildDigitalOceanMessages(conversation, userMessage, attachments, replyToMessage, { isAgent = false, plan = 'Free' } = {}) {
    if (isAgent) {
        const promptText = String(userMessage.content || '').trim();
        const textAttachments = [];
        attachments.forEach((file) => {
            const content = attachmentContentForInference(file, { allowImageParts: false });
            if (Array.isArray(content)) {
                textAttachments.push(...content.map((part) => part?.text || '').filter(Boolean));
            } else if (content) {
                textAttachments.push(content);
            }
        });
        const content = [promptText, ...textAttachments].filter(Boolean).join('\n\n') || ' ';
        return [{ role: 'user', content }];
    }

    const publicName = publicModelName(plan);
    const system = [
        `Kamu adalah ${publicName}.`,
        'Jawab dalam bahasa pengguna dengan jelas, rapi, dan membantu.',
        'Bantu coding, debugging, analisis file, dan penjelasan teknis.',
        'Jangan mengarang identitas, kemampuan, atau klaim tanpa batas; jawab sesuai model dan konteks yang diberikan.',
        `Jika ditanya identitas atau model, jawab hanya sebagai ${publicName} dan mode aktif; jangan menyebut provider, routing, endpoint, API, model backend, atau nama model asli.`,
        'Tolak permintaan yang meminta phishing, ransomware, DDoS, pencurian kredensial, malware, atau instruksi penyalahgunaan siber; arahkan ke audit, hardening, dan simulasi legal.',
        'Jika tidak yakin atau model tidak mendukung gambar, jelaskan batasannya dengan singkat.',
        'Gunakan format sederhana: paragraf pendek, bullet seperlunya, dan blok kode hanya saat mengirim kode.',
        'Jangan menulis instruksi format ini di jawaban. Hindari simbol markdown dekoratif.'
    ].join(' ');
    const history = (conversation.messages || [])
        .filter((message) =>
            message.id !== userMessage.id
            && message.role !== 'system'
            && !message.isLoading
            && !message.isError
            && message.content
            && messageMatchesPlan(message, plan)
        )
        .slice(-12)
        .map((message) => ({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            content: (isAgent
                ? String(message.content || '')
                : message.role === 'assistant'
                ? finalizeAssistantContent(message.content || '', plan)
                : String(message.content || '')
            ).slice(0, 12000)
        }));
    const replyContext = replyToMessage
        ? `Konteks reply:\n${replyToMessage.role === 'assistant' ? 'AI' : 'User'}: ${replyToMessage.content}\n\n`
        : '';
    const promptText = `${replyContext}${userMessage.content || ''}`.trim() || 'Tolong analisis lampiran ini.';
    const contentParts = [{ type: 'text', text: promptText }];
    const textAttachments = [];

    attachments.forEach((file) => {
        const content = attachmentContentForInference(file, { allowImageParts: !isAgent });
        if (Array.isArray(content)) {
            contentParts.push(...content);
        } else {
            textAttachments.push(content);
            contentParts.push({ type: 'text', text: content });
        }
    });

    return [
        { role: 'system', content: system },
        ...history,
        { role: 'user', content: contentParts.length === 1 ? promptText : contentParts }
    ];
}

function normalizeDigitalOceanText(value) {
    if (typeof value === 'string') return value;
    if (!value) return '';
    if (Array.isArray(value)) {
        return value
            .map((part) => normalizeDigitalOceanText(part))
            .filter(Boolean)
            .join('\n')
    }
    if (typeof value !== 'object') return '';

    const orderedKeys = [
        'output_text',
        'text',
        'content',
        'message',
        'answer',
        'response',
        'result',
        'output'
    ];
    for (const key of orderedKeys) {
        if (key in value && key !== 'reasoning_content') {
            const text = normalizeDigitalOceanText(value[key]);
            if (text) return text;
        }
    }
    return '';
}

function parseDigitalOceanReply(payload) {
    const choice = payload?.choices?.[0];
    const candidates = [
        choice?.message?.content,
        choice?.delta?.content,
        choice?.text,
        payload?.output_text,
        payload?.content,
        payload?.answer,
        payload?.response,
        payload?.result,
        payload?.output,
        payload?.data?.output_text,
        payload?.data?.content,
        payload?.data?.answer,
        payload?.data?.response,
        payload?.data?.result,
        payload?.data?.output
    ];

    for (const candidate of candidates) {
        const text = normalizeDigitalOceanText(candidate);
        if (text.trim()) return text;
    }

    return '';
}

function cleanAssistantContentForStore(content = '') {
    return String(content || '')
        .replace(/(?:^|\n)\s*(?:[-*_]\s*){3,}\s*(?=\n|$)/g, '\n')
        .replace(/\bjawaban saya akan menggunakan[^.?!]*(?:[.?!]|$)/gi, '')
        .replace(/\btidak ada simbol markdown[^.?!]*(?:[.?!]|$)/gi, '')
        .replace(/\bjangan spam simbol markdown[^.?!]*(?:[.?!]|$)/gi, '')
        .replace(/\bgunakan format sederhana:[^.?!]*(?:[.?!]|$)/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function containsDisallowedCyberContent(content = '') {
    const text = String(content || '').toLowerCase();
    const harmfulTopic = /\b(ddos|dos layer|botnet|credential harvester|credential harvest|phishing|phishing page|ransomware|drainer|stealer|cookie stealer|keylogger|backdoor|malware|carding|bypass login)\b/.test(text);
    const implementationSignal = /```|import\s+socket|while\s+true|threading|attack\(|fake_ip|flood|payload|copy-paste|jalankan|kode lengkap|script|skrip|tool|backend|menyimpan password|password ke file|telegram bot/.test(text);
    const unsafeCapabilityClaim = /\b(tanpa filter|tanpa sensor|gak ada sensor|gada sensor|siap kasih|langsung jalan|alat cyber nyata|bisa dieksekusi|outputkan file|bukan teori|full-package)\b/.test(text);
    const abuseOffer = /\b(ilegal|jahat|alat tanpa filter|tools jahat|tanpa filter|tanpa sensor)\b/.test(text)
        && /\b(script|skrip|kode|tool|tools|langsung jalan|apa aja|bikin apa aja)\b/.test(text);
    return (harmfulTopic && (implementationSignal || unsafeCapabilityClaim)) || abuseOffer;
}

function isModelIdentityPrompt(prompt = '') {
    const text = String(prompt || '').toLowerCase();
    return /\b(siapa|kamu|anda|identitas|nama|model)\b/.test(text)
        && /\b(kamu|anda|ai|model|snake|sanake|pro|ultra)\b/.test(text);
}

function modelIdentityFallback(plan = 'Free') {
    if (plan === 'Pro') {
        return 'Ya. Mode aktif saat ini Pro, jadi jawaban ini memakai Snake AI Pro.';
    }
    if (plan === 'Ultra') {
        return 'Bukan Pro. Mode aktif saat ini Ultra, jadi jawaban ini memakai Snake AI Ultra. Kalau ingin menguji Pro, pilih Pro di menu model sebelum mengirim pesan.';
    }
    return 'Mode aktif saat ini Free, jadi jawaban ini memakai Snake AI Free.';
}

function rawDigitalOceanContent(content = '') {
    return String(content || '');
}

function publicModelName(plan = 'Free') {
    if (plan === 'Pro') return 'Snake AI Pro';
    if (plan === 'Ultra') return 'Snake AI Ultra';
    return 'Snake AI Free';
}

function maskModelIdentity(content = '', plan = 'Free') {
    const brandedName = publicModelName(plan);

    return String(content || '')
        .replace(/\b(?:saya|aku|gua)\s+(?:adalah\s+)?model\s+AI\s+dari\s+(?:OpenAI|ChatGPT)\s+berbasis\s+GPT[-\s]?5\.5\b/gi, `Saya adalah ${brandedName}`)
        .replace(/\b(?:saya|aku|gua)\s+(?:adalah\s+)?model\s+AI\s+dari\s+[^.?!\n]+(?:\s+berbasis\s+[^.?!\n]+)?/gi, `Saya adalah ${brandedName}`)
        .replace(/\s+dengan\s+routing\s+backend\s+[^.?!\n]+/gi, '')
        .replace(/\brouting\s+backend\s+[^.?!\n]+/gi, brandedName)
        .replace(/\bbackend\s+(?:model\s+)?(?:nya\s+)?(?:adalah\s+)?(?=(?:NVIDIA|Nemotron|nvidia-|DeepSeek|deepseek-|Qwen|qwen|GPT|OpenAI|ChatGPT)\b)[^.?!\n]+/gi, brandedName)
        .replace(/\bmodel\s+(?:asli|backend)\s+(?:saya\s+)?(?:adalah\s+)?[^.?!\n]+/gi, brandedName)
        .replace(/\bNVIDIA\s+Nemotron\s+3\s+Super\s+120B(?:\s*\(Public Preview\))?/gi, brandedName)
        .replace(/\bNemotron\s+3\s+Super\s+120B(?:\s*\(Public Preview\))?/gi, brandedName)
        .replace(/\bnvidia-nemotron-3-super-120b\b/gi, brandedName)
        .replace(/\bDeepSeek\s+4\s+Pro\b/gi, brandedName)
        .replace(/\bDeepSeek\b/gi, brandedName)
        .replace(/\bdeepseek-v4-pro\b/gi, brandedName)
        .replace(/\bQwen3?\s+Coder\s+Flash\b/gi, brandedName)
        .replace(/\bqwen3?-coder-flash\b/gi, brandedName)
        .replace(/\bChatGPT\b/gi, brandedName)
        .replace(/\bOpenAI\b/gi, brandedName)
        .replace(/\bGPT[-\s]?5(?:\.5)?\b/gi, brandedName)
        .replace(/\bGPT\s*5\.5\b/gi, brandedName)
        .replace(/\bGPT-?4(?:o|\.?1)?\b/gi, brandedName)
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([.?!,])/g, '$1')
        .trim();
}

function finalizeAssistantContent(content = '', plan = 'Free') {
    return maskModelIdentity(cleanAssistantContentForStore(content), plan);
}

function sanitizeStoredModelIdentity(store) {
    let changed = false;
    (store.conversations || []).forEach((conversation) => {
        let lastUserPlan = 'Free';
        (conversation.messages || []).forEach((message) => {
            if (message.role === 'user') {
                lastUserPlan = ['Free', 'Pro', 'Ultra'].includes(message.mode?.plan) ? message.mode.plan : lastUserPlan;
                if (message.mode?.model && /deepseek|nemotron|qwen|gpt/i.test(message.mode.model)) {
                    message.mode.model = publicModelName(lastUserPlan);
                    changed = true;
                }
                return;
            }
            if (message.role !== 'assistant' || typeof message.content !== 'string') return;
            const plan = ['Free', 'Pro', 'Ultra'].includes(message.source?.plan) ? message.source.plan : lastUserPlan;
            const nextContent = finalizeAssistantContent(message.content, plan);
            if (nextContent !== message.content) {
                message.content = nextContent;
                changed = true;
            }
            if (message.source?.model && /deepseek|nemotron|qwen|gpt/i.test(message.source.model)) {
                message.source.model = publicModelName(plan);
                changed = true;
            }
            if (message.source?.endpoint) {
                delete message.source.endpoint;
                changed = true;
            }
        });
    });
    return changed;
}

async function callDigitalOceanModel(config, conversation, userMessage, attachments, replyToMessage, { signal } = {}) {
    if (!config?.apiKey) {
        const err = new Error(`${config.label} belum punya API key di .env.`);
        err.status = 500;
        throw err;
    }

    const isAgent = Boolean(config.agentUrl);
    const url = isAgent
        ? `${config.agentUrl}/api/v1/chat/completions`
        : `${DIGITALOCEAN_INFERENCE_URL}/v1/chat/completions`;
    const endpointOrigin = (() => {
        try {
            return new URL(url).origin;
        } catch {
            return url;
        }
    })();
    const body = {
        model: config.model,
        messages: buildDigitalOceanMessages(conversation, userMessage, attachments, replyToMessage, { isAgent, plan: config.plan })
    };

    if (!isAgent) {
        body.max_tokens = config.plan === 'Ultra' ? 2048 : 1536;
        body.temperature = 0.7;
    }

    const controller = new AbortController();
    const abortFromCaller = () => controller.abort();
    if (signal) {
        if (signal.aborted) controller.abort();
        else signal.addEventListener('abort', abortFromCaller, { once: true });
    }
    const timeout = setTimeout(() => controller.abort(), 180000);
    console.log(`[AI:${config.plan}] ${config.model} -> ${endpointOrigin}`);

    const submitDigitalOceanRequest = async (requestBody) => {
        let response;
        let text;
        response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        text = await response.text();

        let payload = {};
        try {
            payload = text ? JSON.parse(text) : {};
        } catch (err) {
            payload = { raw: text };
        }

        if (!response.ok) {
            const message = payload.error?.message
                || (typeof payload.error === 'string' ? payload.error : '')
                || payload.message
                || payload.detail
                || `DigitalOcean mengembalikan status ${response.status}.`;
            const err = new Error(`${config.label}: ${message}`);
            err.status = response.status;
            throw err;
        }

        return { payload, content: parseDigitalOceanReply(payload) };
    };

    try {
        let result = await submitDigitalOceanRequest(body);
        if (!result.content && isAgent) {
            const retryBody = {
                ...body,
                messages: [
                    ...body.messages,
                    {
                        role: 'user',
                        content: 'Jawaban sebelumnya kosong. Kirim ulang jawaban final sebagai teks biasa di field content. Jangan kosong.'
                    }
                ]
            };
            if (body.max_tokens) {
                retryBody.max_tokens = Math.max(body.max_tokens, 512);
            }
            result = await submitDigitalOceanRequest(retryBody);
        }

        if (!result.content) {
            const err = new Error(`${config.label} tidak mengembalikan teks jawaban.`);
            err.status = 502;
            throw err;
        }

        return {
            content: result.content,
            attachments: [],
            source: {
                plan: config.plan,
                model: publicModelName(config.plan),
                viaAgent: isAgent
            }
        };
    } catch (err) {
        if (err.name === 'AbortError') {
            const timeoutErr = new Error(`${config.label} tidak merespons dalam 180 detik.`);
            timeoutErr.status = 504;
            throw timeoutErr;
        }
        throw err;
    } finally {
        clearTimeout(timeout);
        if (signal) signal.removeEventListener('abort', abortFromCaller);
    }
}

function getLaunchOptions({ headless = RUN_HEADLESS } = {}) {
    const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH
        || SYSTEM_CHROME_PATHS.find((candidate) => fs.existsSync(candidate));
    const options = {
        headless,
        userDataDir: PROFILE_DIR,
        defaultViewport: { width: 1280, height: 800 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--start-maximized',
            '--disable-dev-shm-usage'
        ]
    };

    if (chromePath && fs.existsSync(chromePath)) {
        options.executablePath = chromePath;
    }

    return options;
}

async function openBrowser() {
    const debugUrl = process.env.CHROME_DEBUG_URL;

    if (debugUrl && USE_CHROME_DEBUG) {
        console.log(`[+] Menyambung ke Chrome asli: ${debugUrl}`);
        attachedToExistingChrome = true;
        return puppeteer.connect({
            browserURL: debugUrl,
            defaultViewport: null,
            protocolTimeout: 180000
        });
    }

    attachedToExistingChrome = false;
    return puppeteer.launch(getLaunchOptions());
}

async function closeBrowser() {
    if (!browser) return;

    if (attachedToExistingChrome) {
        await browser.disconnect();
    } else {
        await browser.close();
    }

    browser = null;
    page = null;
    attachedToExistingChrome = false;
}

function isBrowserUsable() {
    return !!browser && !!page && !page.isClosed();
}

async function recoverSession() {
    if (isBrowserUsable()) return;

    if (isRecovering) {
        while (isRecovering) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        return;
    }

    isRecovering = true;

    try {
        console.log('[!] Browser tertutup / belum siap. Membuka ulang dari session tersimpan...');
        await closeBrowser();
        await loadSession();
        console.log('[OK] Browser berhasil dipulihkan.');
    } finally {
        isRecovering = false;
    }
}

async function getChatPage() {
    const pages = await browser.pages();
    const chatPage = pages.find((candidate) => candidate.url().includes('chatgpt.com'));

    if (chatPage) {
        return chatPage;
    }

    return browser.newPage();
}

async function waitForChatReady(timeout = 600000) {
    await page.waitForFunction((selector) => {
        const prompt = document.querySelector(selector);
        if (!prompt) return false;

        const rect = prompt.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }, { timeout }, PROMPT_SELECTOR);
}

async function ensureChatReady() {
    await recoverSession();

    for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
            if (!page.url().startsWith(CHATGPT_URL)) {
                await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
            }

            await waitForChatReady(90000);
            return;
        } catch (err) {
            console.log(`[!] Halaman ChatGPT belum siap, coba refresh (${attempt}/3)...`);
            await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }

    await waitForChatReady(120000);
}

async function openNewChat() {
    await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await waitForChatReady(120000);
}

function linkedChatGptUrl(rawUrl) {
    try {
        const url = new URL(rawUrl || '');
        if (!url.hostname.endsWith('chatgpt.com')) return null;
        if (!url.pathname.startsWith('/c/')) return null;
        return `${url.origin}${url.pathname}`;
    } catch (err) {
        return null;
    }
}

function chatGptConversationId(rawUrl) {
    return linkedChatGptUrl(rawUrl)?.match(/\/c\/([^/?#]+)/)?.[1] || null;
}

function decodePngPixels(buffer) {
    const signature = buffer.subarray(0, 8).toString('hex');
    if (signature !== '89504e470d0a1a0a') return null;

    let offset = 8;
    let width = 0;
    let height = 0;
    let bitDepth = 0;
    let colorType = 0;
    const idat = [];

    while (offset + 8 <= buffer.length) {
        const length = buffer.readUInt32BE(offset);
        const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
        const data = buffer.subarray(offset + 8, offset + 8 + length);
        offset += 12 + length;

        if (type === 'IHDR') {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            bitDepth = data[8];
            colorType = data[9];
        } else if (type === 'IDAT') {
            idat.push(data);
        } else if (type === 'IEND') {
            break;
        }
    }

    if (!width || !height || bitDepth !== 8 || ![2, 6].includes(colorType) || idat.length === 0) return null;

    const channels = colorType === 6 ? 4 : 3;
    const stride = width * channels;
    const inflated = zlib.inflateSync(Buffer.concat(idat));
    const pixels = Buffer.alloc(height * stride);
    let input = 0;

    for (let y = 0; y < height; y += 1) {
        const filter = inflated[input];
        input += 1;
        const rowStart = y * stride;
        const prevRowStart = (y - 1) * stride;

        for (let x = 0; x < stride; x += 1) {
            const raw = inflated[input + x];
            const left = x >= channels ? pixels[rowStart + x - channels] : 0;
            const up = y > 0 ? pixels[prevRowStart + x] : 0;
            const upLeft = y > 0 && x >= channels ? pixels[prevRowStart + x - channels] : 0;
            let value = raw;

            if (filter === 1) value = raw + left;
            if (filter === 2) value = raw + up;
            if (filter === 3) value = raw + Math.floor((left + up) / 2);
            if (filter === 4) {
                const p = left + up - upLeft;
                const pa = Math.abs(p - left);
                const pb = Math.abs(p - up);
                const pc = Math.abs(p - upLeft);
                value = raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
            }

            pixels[rowStart + x] = value & 255;
        }
        input += stride;
    }

    return { width, height, channels, pixels };
}

function isLikelyLoadingPlaceholderImage(buffer) {
    let decoded;
    try {
        decoded = decodePngPixels(buffer);
    } catch (err) {
        return false;
    }
    if (!decoded) return false;

    const { width, height, channels, pixels } = decoded;
    const step = Math.max(1, Math.floor(Math.sqrt((width * height) / 5000)));
    let count = 0;
    let brightCount = 0;
    let saturationTotal = 0;
    let lumaTotal = 0;
    let lumaSqTotal = 0;

    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const index = (y * width + x) * channels;
            const r = pixels[index] / 255;
            const g = pixels[index + 1] / 255;
            const b = pixels[index + 2] / 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            count += 1;
            if (luma > 0.86) brightCount += 1;
            saturationTotal += saturation;
            lumaTotal += luma;
            lumaSqTotal += luma * luma;
        }
    }

    const avgSaturation = saturationTotal / count;
    const avgLuma = lumaTotal / count;
    const lumaVariance = Math.max(0, lumaSqTotal / count - avgLuma * avgLuma);
    const brightRatio = brightCount / count;

    return avgSaturation < 0.035 && avgLuma > 0.78 && brightRatio > 0.72 && lumaVariance < 0.025;
}

function isLikelyLoadingPlaceholderDataUrl(dataUrl) {
    const match = String(dataUrl || '').match(/^data:image\/png;base64,(.+)$/);
    if (!match) return false;
    return isLikelyLoadingPlaceholderImage(Buffer.from(match[1], 'base64'));
}

async function waitForLinkedChatGptUrl(timeout = 15000) {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeout) {
        const currentUrl = linkedChatGptUrl(page.url());
        if (currentUrl) return currentUrl;
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return linkedChatGptUrl(page.url());
}

async function openLinkedChat(conversation) {
    await recoverSession();

    if (conversation.chatgptUrl) {
        const currentLinkedUrl = linkedChatGptUrl(page.url());
        if (currentLinkedUrl !== conversation.chatgptUrl) {
            await page.goto(conversation.chatgptUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
        }
        await waitForChatReady(120000);
        return;
    }

    if (conversation.chatgptPendingNew || (conversation.messages || []).length === 0) {
        await openNewChat();
        return;
    }

    const err = new Error('Percakapan ini belum terhubung ke chat ChatGPT. Buat Percakapan Baru lalu lanjutkan dari sana.');
    err.status = 409;
    throw err;
}

async function withRemoteChatLock(task) {
    const previous = remoteChatQueue.catch(() => {});
    let release;
    remoteChatQueue = new Promise((resolve) => {
        release = resolve;
    });
    await previous;
    try {
        return await task();
    } finally {
        release();
    }
}

function isNewChatCommand(message) {
    return ['/new', '/newchat', '/new-chat', 'new chat', 'chat baru'].includes(message.trim().toLowerCase());
}

async function readLastAssistantMessage() {
    return page.evaluate(() => {
        const messageBlocks = document.querySelectorAll('[data-message-author-role="assistant"]');
        if (messageBlocks.length === 0) return '';

        const lastBlock = messageBlocks[messageBlocks.length - 1];
        const markdownBlocks = Array.from(lastBlock.querySelectorAll('.markdown'));

        for (let i = markdownBlocks.length - 1; i >= 0; i -= 1) {
            const text = markdownBlocks[i].innerText.trim();
            if (text) return text;
        }

        return lastBlock.innerText.trim();
    });
}

async function getChatSnapshot() {
    return page.evaluate(() => {
        const userBlocks = Array.from(document.querySelectorAll('[data-message-author-role="user"]'));
        const assistantBlocks = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));

        const readBlockText = (block) => {
            if (!block) return '';
            const markdownBlocks = Array.from(block.querySelectorAll('.markdown'));

            for (let i = markdownBlocks.length - 1; i >= 0; i -= 1) {
                const text = markdownBlocks[i].innerText.trim();
                if (text) return text;
            }

            return block.innerText.trim();
        };

        return {
            userCount: userBlocks.length,
            assistantCount: assistantBlocks.length,
            lastAssistantText: readBlockText(assistantBlocks[assistantBlocks.length - 1])
        };
    });
}

function isTransientResponse(text) {
    return TRANSIENT_RESPONSE_MARKERS.some((marker) => text.includes(marker));
}

function expectsImageResponse(message, attachments = []) {
    const clean = String(message || '').toLowerCase();
    const hasImageAttachment = attachments.some((file) => file.kind === 'image' || String(file.type || '').startsWith('image/'));
    return hasImageAttachment || /\b(gambar|foto|image|photo|picture|generate|buatkan|buat|ubah|edit|clay|anime|poster|logo)\b/i.test(clean);
}

async function waitForSubmitted(previousUserCount) {
    await page.waitForFunction((count) => {
        const userCount = document.querySelectorAll('[data-message-author-role="user"]').length;
        return userCount > count;
    }, { timeout: 90000 }, previousUserCount);
}

async function waitUntilNotGenerating(timeout = 180000) {
    await page.waitForFunction((selector) => {
        const button = document.querySelector(selector);
        if (!button) return true;

        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        return rect.width === 0
            || rect.height === 0
            || style.visibility === 'hidden'
            || style.display === 'none'
            || button.disabled;
    }, { timeout }, STOP_BUTTON_SELECTOR).catch(() => {
        console.log('[!] ChatGPT masih terlihat memproses sebelum pesan baru, lanjut dengan pengiriman terurut...');
    });
}

async function getAssistantAfterLatestUser(previousUserCount, includeImages = false) {
    return page.evaluate(async (count, shouldIncludeImages) => {
        const readBlockText = (block) => {
            if (!block) return '';
            const clone = block.cloneNode(true);
            [
                '[data-testid="message-actions"]',
                '[data-testid="copy-turn-action-button"]',
                'button',
                'svg'
            ].forEach((selector) => {
                clone.querySelectorAll(selector).forEach((node) => node.remove());
            });
            const markdownBlocks = Array.from(clone.querySelectorAll('.markdown'));

            for (let i = markdownBlocks.length - 1; i >= 0; i -= 1) {
                const text = (markdownBlocks[i].innerText || '').trim();
                if (text) return text;
            }

            return (clone.innerText || '').trim();
        };
        const imageToDataUrl = async (img, index) => {
            const src = img.currentSrc || img.src || '';
            if (!src) return null;
            if (src.startsWith('data:image/')) {
                return {
                    name: img.alt || `generated-image-${index + 1}.png`,
                    type: src.match(/^data:([^;]+);base64,/)?.[1] || 'image/png',
                    dataUrl: src
                };
            }

            try {
                const response = await fetch(src);
                const blob = await response.blob();
                if (!blob.type.startsWith('image/')) return null;

                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });

                return {
                    name: img.alt || `generated-image-${index + 1}.${blob.type.includes('jpeg') ? 'jpg' : 'png'}`,
                    type: blob.type,
                    dataUrl
                };
            } catch (err) {
                return null;
            }
        };
        const blocks = Array.from(document.querySelectorAll('[data-message-author-role]'));
        let userSeen = 0;
        let latestSubmittedUserIndex = -1;

        blocks.forEach((block, index) => {
            if (block.getAttribute('data-message-author-role') === 'user') {
                userSeen += 1;
                if (userSeen > count) {
                    latestSubmittedUserIndex = index;
                }
            }
        });

        if (latestSubmittedUserIndex < 0) {
            return {
                submitted: false,
                assistantCountAfterUser: 0,
                text: ''
            };
        }

        const latestUserBlock = blocks[latestSubmittedUserIndex];
        const isAfterLatestUser = (element) =>
            latestUserBlock
            && !latestUserBlock.contains(element)
            && !!(latestUserBlock.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING);
        const assistantBlocks = blocks
            .slice(latestSubmittedUserIndex + 1)
            .filter((block) => block.getAttribute('data-message-author-role') === 'assistant');
        const lastAssistant = assistantBlocks[assistantBlocks.length - 1];
        const isUsableImage = (img) => {
            const rect = img.getBoundingClientRect();
            const src = img.currentSrc || img.src || '';
            let ancestor = img;
            let ancestorText = '';
            for (let depth = 0; ancestor && depth < 6; depth += 1) {
                ancestorText += ` ${(ancestor.innerText || ancestor.textContent || '')}`;
                ancestor = ancestor.parentElement;
            }
            return rect.width >= 80
                && rect.height >= 80
                && !src.includes('avatar')
                && !src.includes('favicon')
                && !src.startsWith('chrome-extension:')
                && !/membuat gambar|creating image|generating image|sedang membuat|loading|memuat/i.test(ancestorText)
                && !img.closest('[role="progressbar"], [aria-busy="true"], [data-testid*="progress"], [data-testid*="loading"], .animate-spin');
        };
        const isVisualResultElement = (element) => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 160 || rect.height < 120) return false;
            if (rect.width > window.innerWidth * 0.95 || rect.height > window.innerHeight * 0.9) return false;
            if (element.closest('nav, aside, form, header, [data-testid="composer"], [contenteditable="true"]')) return false;
            const text = (element.innerText || element.textContent || '').toLowerCase();
            if (/membuat gambar|creating image|generating image|image sedang|sedang membuat|loading|memuat/.test(text)) return false;
            if (element.querySelector('[role="progressbar"], [aria-busy="true"], [data-testid*="progress"], [data-testid*="loading"], .animate-spin')) return false;
            const style = window.getComputedStyle(element);
            const label = `${element.getAttribute('aria-label') || ''} ${element.getAttribute('data-testid') || ''} ${element.className || ''}`.toLowerCase();
            return element.querySelector('img, canvas, picture, video')
                || /image|gambar|photo|picture|result|generated|attachment|asset/.test(label)
                || (style.backgroundImage && style.backgroundImage !== 'none');
        };
        const scopedImages = lastAssistant ? Array.from(lastAssistant.querySelectorAll('img')) : [];
        const globalImagesAfterUser = Array.from(document.querySelectorAll('img')).filter(isAfterLatestUser);
        const imageElements = Array.from(new Set(scopedImages.concat(globalImagesAfterUser))).filter(isUsableImage);
        const visualElementsAfterUser = Array.from(document.querySelectorAll('[data-testid], [aria-label], canvas, picture, video, div, figure'))
            .filter((element) => isAfterLatestUser(element) && isVisualResultElement(element));
        const images = shouldIncludeImages
            ? (await Promise.all(imageElements.slice(0, 1).map(imageToDataUrl))).filter(Boolean)
            : [];

        return {
            submitted: true,
            assistantCountAfterUser: assistantBlocks.length,
            text: readBlockText(lastAssistant),
            imageCount: imageElements.length + visualElementsAfterUser.length,
            images
        };
    }, previousUserCount, includeImages);
}

async function readFallbackAssistantAfterSubmittedUser(previousUserCount) {
    return page.evaluate((count) => {
        const readBlockText = (block) => {
            if (!block) return '';
            const clone = block.cloneNode(true);
            [
                '[data-testid="message-actions"]',
                '[data-testid="copy-turn-action-button"]',
                '[aria-label*="Copy"]',
                '[aria-label*="Salin"]',
                'button',
                'svg'
            ].forEach((selector) => clone.querySelectorAll(selector).forEach((node) => node.remove()));
            const markdownBlocks = Array.from(clone.querySelectorAll('.markdown, [data-message-content-part], [data-testid="conversation-turn-"]'));
            for (let index = markdownBlocks.length - 1; index >= 0; index -= 1) {
                const text = (markdownBlocks[index].innerText || markdownBlocks[index].textContent || '').trim();
                if (text) return text;
            }
            return (clone.innerText || clone.textContent || '').trim();
        };

        const blocks = Array.from(document.querySelectorAll('[data-message-author-role]'));
        let userSeen = 0;
        let latestSubmittedUserIndex = -1;
        blocks.forEach((block, index) => {
            if (block.getAttribute('data-message-author-role') === 'user') {
                userSeen += 1;
                if (userSeen > count) latestSubmittedUserIndex = index;
            }
        });
        if (latestSubmittedUserIndex < 0) return '';

        const assistantBlocks = blocks
            .slice(latestSubmittedUserIndex + 1)
            .filter((block) => block.getAttribute('data-message-author-role') === 'assistant');
        for (let index = assistantBlocks.length - 1; index >= 0; index -= 1) {
            const text = readBlockText(assistantBlocks[index])
                .replace(/\b(Copy|Salin|Good response|Bad response|Regenerate|Share)\b/g, '')
                .trim();
            if (text) return text;
        }
        return '';
    }, previousUserCount).catch(() => '');
}

async function readLooseAssistantAfterSubmittedUser(previousUserCount) {
    return page.evaluate((count) => {
        const cleanText = (value) => String(value || '')
            .replace(/\b(Copy|Salin|Good response|Bad response|Regenerate|Share|Edit|Ubah)\b/g, '')
            .replace(/\s+\n/g, '\n')
            .trim();
        const isUiText = (text) => {
            const normalized = cleanText(text);
            if (!normalized || normalized.length < 2) return true;
            if (/^(ChatGPT|New chat|Search|Library|Explore GPTs|Upgrade|Temporary chat)$/i.test(normalized)) return true;
            if (/^(Kirim prompt|Send prompt|Stop streaming|Tanyakan apa saja)$/i.test(normalized)) return true;
            return false;
        };
        const readNodeText = (node) => cleanText(node?.innerText || node?.textContent || '');
        const roleBlocks = Array.from(document.querySelectorAll('[data-message-author-role]'));
        let userSeen = 0;
        let latestSubmittedUser = null;

        roleBlocks.forEach((block) => {
            if (block.getAttribute('data-message-author-role') !== 'user') return;
            userSeen += 1;
            if (userSeen > count) latestSubmittedUser = block;
        });

        if (!latestSubmittedUser) return '';

        const followsLatestUser = (node) =>
            node
            && !latestSubmittedUser.contains(node)
            && Boolean(latestSubmittedUser.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING);
        const userText = readNodeText(latestSubmittedUser);
        const candidates = [
            ...document.querySelectorAll('[data-message-author-role="assistant"], [data-message-content-part], .markdown, article, [data-testid^="conversation-turn"]')
        ]
            .filter(followsLatestUser)
            .filter((node) => !node.closest('nav, aside, form, header, footer, [data-testid="composer"], [contenteditable="true"]'))
            .map(readNodeText)
            .filter((text) => text && text !== userText && !isUiText(text))
            .sort((a, b) => b.length - a.length);

        return candidates[0] || '';
    }, previousUserCount).catch(() => '');
}

async function readChangedLatestAssistant(previousAssistantText = '') {
    const latestText = await readLastAssistantMessage().catch(() => '');
    const cleanLatest = String(latestText || '').trim();
    const cleanPrevious = String(previousAssistantText || '').trim();
    if (cleanLatest && cleanLatest !== cleanPrevious) return cleanLatest;
    return '';
}

async function captureAssistantImageScreenshots(previousUserCount) {
    const count = await page.evaluate((submittedUserCount) => {
        document.querySelectorAll('[data-codex-generated-image]').forEach((node) => {
            node.removeAttribute('data-codex-generated-image');
        });

        const blocks = Array.from(document.querySelectorAll('[data-message-author-role]'));
        let userSeen = 0;
        let latestSubmittedUserIndex = -1;

        blocks.forEach((block, index) => {
            if (block.getAttribute('data-message-author-role') === 'user') {
                userSeen += 1;
                if (userSeen > submittedUserCount) latestSubmittedUserIndex = index;
            }
        });

        const latestUserBlock = blocks[latestSubmittedUserIndex];
        const isAfterLatestUser = (element) =>
            latestUserBlock
            && !latestUserBlock.contains(element)
            && !!(latestUserBlock.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING);
        const assistantBlocks = blocks
            .slice(latestSubmittedUserIndex + 1)
            .filter((block) => block.getAttribute('data-message-author-role') === 'assistant');
        const lastAssistant = assistantBlocks[assistantBlocks.length - 1];

        const isUsableImage = (img) => {
            const rect = img.getBoundingClientRect();
            const src = img.currentSrc || img.src || '';
            let ancestor = img;
            let ancestorText = '';
            for (let depth = 0; ancestor && depth < 6; depth += 1) {
                ancestorText += ` ${(ancestor.innerText || ancestor.textContent || '')}`;
                ancestor = ancestor.parentElement;
            }
            return rect.width >= 80
                && rect.height >= 80
                && !src.includes('avatar')
                && !src.includes('favicon')
                && !src.startsWith('chrome-extension:')
                && !/membuat gambar|creating image|generating image|sedang membuat|loading|memuat/i.test(ancestorText)
                && !img.closest('[role="progressbar"], [aria-busy="true"], [data-testid*="progress"], [data-testid*="loading"], .animate-spin');
        };
        const isVisualResultElement = (element) => {
            const rect = element.getBoundingClientRect();
            if (rect.width < 160 || rect.height < 120) return false;
            if (rect.width > window.innerWidth * 0.95 || rect.height > window.innerHeight * 0.9) return false;
            if (element.closest('nav, aside, form, header, [data-testid="composer"], [contenteditable="true"]')) return false;
            const text = (element.innerText || element.textContent || '').toLowerCase();
            if (/membuat gambar|creating image|generating image|image sedang|sedang membuat|loading|memuat/.test(text)) return false;
            if (element.querySelector('[role="progressbar"], [aria-busy="true"], [data-testid*="progress"], [data-testid*="loading"], .animate-spin')) return false;
            const style = window.getComputedStyle(element);
            const label = `${element.getAttribute('aria-label') || ''} ${element.getAttribute('data-testid') || ''} ${element.className || ''}`.toLowerCase();
            return element.querySelector('img, canvas, picture, video')
                || /image|gambar|photo|picture|result|generated|attachment|asset/.test(label)
                || (style.backgroundImage && style.backgroundImage !== 'none');
        };
        const scopedImages = lastAssistant ? Array.from(lastAssistant.querySelectorAll('img')) : [];
        const globalImagesAfterUser = Array.from(document.querySelectorAll('img')).filter(isAfterLatestUser);
        const images = Array.from(new Set(scopedImages.concat(globalImagesAfterUser))).filter(isUsableImage);
        const visualElements = Array.from(document.querySelectorAll('[data-testid], [aria-label], canvas, picture, video, div, figure'))
            .filter((element) => isAfterLatestUser(element) && isVisualResultElement(element));
        const targets = Array.from(new Set(images.concat(visualElements)))
            .sort((a, b) => (b.getBoundingClientRect().width * b.getBoundingClientRect().height) - (a.getBoundingClientRect().width * a.getBoundingClientRect().height));

        targets.slice(0, 1).forEach((element, index) => {
            element.setAttribute('data-codex-generated-image', String(index));
        });
        return Math.min(targets.length, 1);
    }, previousUserCount);

    if (!count) return [];

    const handles = await page.$$('[data-codex-generated-image]');
    const images = [];
    for (let index = 0; index < Math.min(handles.length, 1); index += 1) {
        const bytes = await handles[index].screenshot({ type: 'png' }).catch(() => null);
        if (!bytes) continue;
        if (isLikelyLoadingPlaceholderImage(Buffer.from(bytes))) {
            console.log('[i] Kandidat gambar masih placeholder/loading, menunggu hasil final...');
            continue;
        }
        images.push({
            id: createId('file'),
            name: `generated-image-${index + 1}.png`,
            type: 'image/png',
            size: bytes.length,
            kind: 'image',
            preview: '',
            dataUrl: `data:image/png;base64,${Buffer.from(bytes).toString('base64')}`
        });
    }

    return images;
}

async function collectAssistantVisualResult(previousUserCount, snapshot = {}) {
    const fullSnapshot = await getAssistantAfterLatestUser(previousUserCount, true).catch(() => snapshot);
    const validImages = (fullSnapshot.images || [])
        .filter((image) => image.dataUrl && !isLikelyLoadingPlaceholderDataUrl(image.dataUrl));
    const attachments = validImages.slice(0, 1).map((image, index) => ({
        id: createId('file'),
        name: image.name || `generated-image-${index + 1}.png`,
        type: image.type || 'image/png',
        size: 0,
        kind: 'image',
        preview: '',
        dataUrl: image.dataUrl
    }));
    const fallbackAttachments = attachments.length === 0 && (fullSnapshot.imageCount || snapshot.imageCount || 0) > 0
        ? await captureAssistantImageScreenshots(previousUserCount)
        : [];

    return {
        text: fullSnapshot.text || snapshot.text || '',
        attachments: attachments.concat(fallbackAttachments).slice(0, 1)
    };
}

async function waitForAssistantResponse(previousUserCount, { expectImage = false, previousAssistantText = '' } = {}) {
    let lastText = '';
    let lastImageCount = 0;
    let stableCount = 0;
    let readyWithoutAssistantCount = 0;
    let blankAssistantReadyCount = 0;

    for (let i = 0; i < 1200; i += 1) {
        let snapshot;
        try {
            snapshot = await getAssistantAfterLatestUser(previousUserCount);
        } catch (err) {
            if (isExecutionContextError(err)) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                continue;
            }
            throw err;
        }
        const stopVisible = await page.evaluate((selector) => {
            const button = document.querySelector(selector);
            if (!button) return false;

            const rect = button.getBoundingClientRect();
            const style = window.getComputedStyle(button);
            return rect.width > 0
                && rect.height > 0
                && style.visibility !== 'hidden'
                && style.display !== 'none'
                && !button.disabled;
        }, STOP_BUTTON_SELECTOR).catch(() => false);
        const responseText = snapshot.text || '';
        const imageCount = snapshot.imageCount || 0;
        const promptReady = await page.evaluate((promptSelector, stopSelector) => {
            const prompt = document.querySelector(promptSelector);
            const stopButton = document.querySelector(stopSelector);
            const stopVisible = !!stopButton
                && stopButton.getBoundingClientRect().width > 0
                && stopButton.getBoundingClientRect().height > 0
                && getComputedStyle(stopButton).visibility !== 'hidden'
                && getComputedStyle(stopButton).display !== 'none'
                && !stopButton.disabled;
            if (stopVisible || !prompt) return false;
            const rect = prompt.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }, PROMPT_SELECTOR, STOP_BUTTON_SELECTOR).catch(() => false);

        if (!expectImage && snapshot.submitted && snapshot.assistantCountAfterUser === 0 && imageCount === 0 && promptReady) {
            readyWithoutAssistantCount += 1;
            if (readyWithoutAssistantCount >= 20) {
                const fallbackText = await readFallbackAssistantAfterSubmittedUser(previousUserCount)
                    || await readLooseAssistantAfterSubmittedUser(previousUserCount)
                    || await readChangedLatestAssistant(previousAssistantText);
                if (fallbackText) {
                    return {
                        content: fallbackText,
                        attachments: []
                    };
                }
            }

            if (readyWithoutAssistantCount >= 90) {
                const err = new Error('Jawaban ChatGPT tidak muncul setelah pesan terkirim.');
                err.status = 504;
                throw err;
            }
        } else {
            readyWithoutAssistantCount = 0;
        }

        if (!expectImage && snapshot.submitted && snapshot.assistantCountAfterUser > 0 && !responseText && imageCount === 0 && promptReady && !stopVisible) {
            blankAssistantReadyCount += 1;
            if (blankAssistantReadyCount >= 40) {
                const fallbackText = await readFallbackAssistantAfterSubmittedUser(previousUserCount)
                    || await readLooseAssistantAfterSubmittedUser(previousUserCount)
                    || await readChangedLatestAssistant(previousAssistantText);
                if (fallbackText) {
                    return {
                        content: fallbackText,
                        attachments: []
                    };
                }
                const err = new Error('ChatGPT membuat turn kosong tanpa jawaban.');
                err.status = 504;
                err.retriableCapture = true;
                throw err;
            }
        } else {
            blankAssistantReadyCount = 0;
        }

        if ((responseText || imageCount > 0) && responseText === lastText && imageCount === lastImageCount) {
            stableCount += 1;
            if ((snapshot.assistantCountAfterUser > 0 || imageCount > 0) && stableCount >= 3 && !stopVisible && !isTransientResponse(responseText)) {
                const visualResult = await collectAssistantVisualResult(previousUserCount, snapshot);
                if (expectImage && visualResult.attachments.length === 0) {
                    stableCount = 0;
                    await new Promise((resolve) => setTimeout(resolve, 1200));
                    continue;
                }
                return {
                    content: visualResult.attachments.length ? '' : (visualResult.text || responseText || ''),
                    attachments: visualResult.attachments
                };
            }
        } else {
            stableCount = 0;
            lastText = responseText;
            lastImageCount = imageCount;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (expectImage) {
        const visualResult = await collectAssistantVisualResult(previousUserCount, { text: lastText, imageCount: lastImageCount });
        if (visualResult.attachments.length > 0) {
            return {
                content: '',
                attachments: visualResult.attachments
            };
        }

        const err = new Error('Gambar ChatGPT belum berhasil ditangkap. Coba kirim ulang setelah gambar terlihat selesai di ChatGPT.');
        err.status = 504;
        err.expectImage = true;
        throw err;
    }

    const fallbackText = await readFallbackAssistantAfterSubmittedUser(previousUserCount)
        || await readLooseAssistantAfterSubmittedUser(previousUserCount)
        || await readChangedLatestAssistant(previousAssistantText);
    if (fallbackText) {
        return {
            content: fallbackText,
            attachments: []
        };
    }

    const err = new Error(lastText ? `Jawaban ChatGPT belum stabil: ${lastText.slice(0, 160)}` : 'Jawaban ChatGPT tidak muncul setelah pesan terkirim.');
    err.status = 504;
    throw err;
}

function isBadResponse(text) {
    return BAD_RESPONSE_MARKERS.some((marker) => text.includes(marker));
}

function isRetriableCaptureError(err) {
    const message = String(err?.message || '');
    return err?.retriableCapture
        || /turn kosong|tidak muncul setelah pesan terkirim|terlalu lama|tidak berhasil ditangkap|belum stabil/i.test(message);
}

async function focusPrompt() {
    await page.waitForSelector(PROMPT_SELECTOR, { timeout: 30000 });
    await page.evaluate((selector) => {
        const prompt = document.querySelector(selector);
        if (!prompt) throw new Error('Prompt ChatGPT tidak ditemukan.');
        prompt.focus();
    }, PROMPT_SELECTOR);
}

async function clearPrompt() {
    await focusPrompt();
    await page.keyboard.down(process.platform === 'darwin' ? 'Meta' : 'Control');
    await page.keyboard.press('A');
    await page.keyboard.up(process.platform === 'darwin' ? 'Meta' : 'Control');
    await page.keyboard.press('Backspace');
    await page.evaluate((selector) => {
        const prompt = document.querySelector(selector);
        if (!prompt) return;

        prompt.textContent = '';
        prompt.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            inputType: 'deleteContentBackward'
        }));
        prompt.focus();
    }, PROMPT_SELECTOR);
}

async function clickSendButton() {
    const handle = await page.waitForFunction((selector) => {
        const buttons = Array.from(document.querySelectorAll(selector));
        const button = buttons.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            const style = window.getComputedStyle(candidate);
            return rect.width > 0
                && rect.height > 0
                && style.visibility !== 'hidden'
                && style.display !== 'none'
                && !candidate.disabled;
        });
        if (!button) return null;
        const rect = button.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }, { timeout: 120000 }, SEND_BUTTON_SELECTOR);

    const point = await handle.jsonValue();
    await page.mouse.click(point.x, point.y);
}

async function clickStopGenerating() {
    if (!isBrowserUsable()) return false;

    return page.evaluate((selector) => {
        const buttons = Array.from(document.querySelectorAll(selector));
        const button = buttons.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            const style = window.getComputedStyle(candidate);
            return rect.width > 0
                && rect.height > 0
                && style.visibility !== 'hidden'
                && style.display !== 'none'
                && !candidate.disabled;
        });
        if (!button) return false;
        button.click();
        return true;
    }, STOP_BUTTON_SELECTOR).catch(() => false);
}

async function saveSession() {
    const cookies = await page.cookies();
    fs.writeFileSync(SESSION_FILE, JSON.stringify(cookies, null, 2));
    fs.writeFileSync(SESSION_BACKUP_FILE, JSON.stringify(cookies, null, 2));
    console.log('[OK] Session tersimpan di session.json');
}

async function getLoginStatus() {
    if (!isBrowserUsable()) {
        return { browserReady: false, loggedIn: false, accountHint: null };
    }

    try {
        return await page.evaluate(() => {
            const text = document.body.innerText || '';
            const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
            const hasPrompt = !!document.querySelector('div#prompt-textarea[contenteditable="true"], [data-testid="composer-input"], div[contenteditable="true"][role="textbox"]');
            const hasProfileButton = !!document.querySelector('[data-testid="accounts-profile-button"]');
            const asksLogin = /Masuk|Daftar gratis|Log in|Sign up|Tetap keluar/i.test(text);

            return {
                browserReady: true,
                loggedIn: hasPrompt && hasProfileButton && !asksLogin,
                accountHint: emailMatch ? emailMatch[0] : null
            };
        });
    } catch (err) {
        return { browserReady: false, loggedIn: false, accountHint: null };
    }
}

// ==================== LOGIN & SESSION ====================
async function loginAndSaveSession() {
    console.log('[!] Session belum siap. Login/verifikasi manual diperlukan...');
    browser = USE_CHROME_DEBUG
        ? await openBrowser()
        : await puppeteer.launch(getLaunchOptions({ headless: false }));
    page = await getChatPage();

    try {
        await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('[+] Silakan centang verifikasi Cloudflare dan login manual di Chrome.');
        console.log('[+] Setelah halaman chat terbuka, session akan disimpan otomatis.');

        // Ini menunggu verifikasi manual selesai, bukan membypass Cloudflare.
        await waitForChatReady();
        console.log('[+] Login/verifikasi terdeteksi, menyimpan session...');

        await new Promise((resolve) => setTimeout(resolve, 3000));
        await saveSession();

        await closeBrowser();
    } catch (err) {
        console.error('[-] Gagal login/verifikasi:', err.message);
        await closeBrowser();
        process.exit(1);
    }
}

async function loginOnly() {
    fs.rmSync(SESSION_FILE, { force: true });
    await loginAndSaveSession();
    console.log('[OK] Login selesai. Jalankan npm start untuk memakai session yang tersimpan.');
}

async function loadSession() {
    const usingExistingChrome = !!process.env.CHROME_DEBUG_URL && USE_CHROME_DEBUG;

    let cookies = [];
    const sessionFileToLoad = fs.existsSync(SESSION_FILE) ? SESSION_FILE : SESSION_BACKUP_FILE;

    if (fs.existsSync(sessionFileToLoad)) {
        try {
            cookies = JSON.parse(fs.readFileSync(sessionFileToLoad, 'utf8'));
            if (sessionFileToLoad === SESSION_BACKUP_FILE) {
                fs.copyFileSync(SESSION_BACKUP_FILE, SESSION_FILE);
                console.log('[OK] session.json dipulihkan dari session.backup.json');
            }
        } catch (err) {
            console.log('[!] session file rusak, akan coba pakai profile tersimpan...');
            fs.rmSync(SESSION_FILE, { force: true });
        }
    } else {
        console.log('[!] session.json tidak ada, coba pakai profile tersimpan...');
    }

    console.log('[+] Load session dari file...');

    browser = await openBrowser();
    page = await getChatPage();

    try {
        if (!usingExistingChrome && Array.isArray(cookies) && cookies.length > 0) {
            await page.setCookie(...cookies);
        }

        await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

        try {
            await waitForChatReady(120000);
        } catch (err) {
            if (RUN_HEADLESS) {
                throw new Error('Session/profile tidak valid di mode headless.');
            }

            console.log('[!] Belum masuk halaman chat. Selesaikan verifikasi/login di browser yang terbuka.');
            await waitForChatReady();
        }

        await saveSession();
        console.log('[OK] Session valid, siap ngobrol.');
    } catch (err) {
        console.error('[-] Gagal load halaman:', err.message);
        await closeBrowser();
        fs.rmSync(SESSION_FILE, { force: true });

        if (RUN_HEADLESS) {
            console.error('[!] Session tidak valid/expired. Jalankan npm run login sekali untuk membuat session baru.');
            process.exit(1);
        }

        await loginAndSaveSession();
        await loadSession();
    }
}

// ==================== FUNGSI CHAT ====================
async function sendMessage(message, attachments = [], options = {}) {
    const run = chatQueue.then(() => sendMessageUnlocked(message, attachments, options));
    chatQueue = run.catch(() => { });
    return run;
}

async function sendMessageUnlocked(message, attachments = [], options = {}) {
    let tempFiles = [];
    const expectImage = options.expectImage ?? expectsImageResponse(message, attachments);

    try {
        await ensureChatReady();
        await waitUntilNotGenerating();

        await page.bringToFront();
        const beforeSend = await getChatSnapshot();
        await focusPrompt();
        await clearPrompt();
        await new Promise((resolve) => setTimeout(resolve, 250));

        tempFiles = await uploadAttachmentsToChatGPT(attachments);

        const client = await page.createCDPSession();
        await client.send('Input.insertText', { text: message });
        await client.detach();

        await page.waitForFunction((selector, expectedText) => {
            const prompt = document.querySelector(selector);
            if (!prompt) return false;

            const normalize = (value) => value.replace(/\s+/g, ' ').trim();
            const promptText = normalize(prompt.innerText || '');
            const expected = normalize(expectedText);
            return promptText.includes(expected.slice(0, Math.min(expected.length, 200)));
        }, { timeout: 30000 }, PROMPT_SELECTOR, message);
        await new Promise((resolve) => setTimeout(resolve, 300));

        await clickSendButton();
        await waitForSubmitted(beforeSend.userCount).catch(async (err) => {
            if (!isExecutionContextError(err)) throw err;
            await waitForChatReady(90000);
            await waitForSubmitted(beforeSend.userCount);
        });

        console.log('[>] Pesan terkirim, menunggu jawaban...');

        const response = await waitForAssistantResponse(beforeSend.userCount, {
            expectImage,
            previousAssistantText: beforeSend.lastAssistantText
        });

        if (expectImage && (!response.attachments || response.attachments.length === 0)) {
            const err = new Error('ChatGPT selesai, tetapi hasil gambar belum berhasil ditangkap oleh web lokal.');
            err.status = 502;
            err.expectImage = true;
            throw err;
        }

        if (isBadResponse(response.content || '')) {
            console.log('[!] ChatGPT mengembalikan error. Chat baru tidak dibuat otomatis.');
        }

        console.log('[<] Jawaban diterima.');
        return response;
    } catch (err) {
        console.error('[-] Error saat kirim pesan:', err.message);

        if (!options.__retried && isRetriableCaptureError(err)) {
            console.log('[!] Respons ChatGPT kosong/tidak tertangkap. Mencoba ulang sekali di chat baru...');
            try {
                await recoverSession();
                await openNewChat();
                return sendMessageUnlocked(message, attachments, {
                    ...options,
                    __retried: true
                });
            } catch (retrySetupErr) {
                console.error('[-] Gagal menyiapkan retry:', retrySetupErr.message);
            }
        }

        try {
            await recoverSession();
            if (!expectImage) {
                await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
            }
        } catch (reloadErr) {
            await closeBrowser();
            await loadSession();
        }

        throw new Error('Gagal ngirim pesan: ' + err.message);
    } finally {
        cleanupTempFiles(tempFiles);
    }
}

// ==================== EXPRESS SERVER ====================
const app = express();
app.use((req, res, next) => {
    if (/\.(?:js|css|html)$/i.test(req.path) || req.path === '/' || req.path.startsWith('/admin') || req.path === '/verify') {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
    next();
});
app.use(express.json({ limit: '60mb' }));
app.use((req, res, next) => {
    if ((req.headers.host || '') === `127.0.0.1:${PORT}`) {
        return res.redirect(307, `http://localhost:${PORT}${req.originalUrl}`);
    }
    return next();
});
app.use(express.static(PUBLIC_DIR));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'Format JSON salah.' });
    }

    next(err);
});

app.get('/api/auth/session', (req, res) => {
    const store = readStore();
    res.json({ user: safeUser(currentUserFromRequest(req, store)) });
});

app.get('/api/auth/google/config', (req, res) => {
    res.json({
        configured: Boolean(GOOGLE_CLIENT_ID),
        clientId: GOOGLE_CLIENT_ID
    });
});

app.post('/api/auth/register', (req, res) => {
    const store = readStore();
    const email = cleanEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const name = String(req.body?.name || '').trim().slice(0, 80) || email.split('@')[0] || 'User';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email tidak valid.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password minimal 6 karakter.' });
    }
    if (store.auth.users.some((user) => user.email === email)) {
        return res.status(409).json({ error: 'Email sudah terdaftar. Silakan login.' });
    }

    const hashed = hashPassword(password);
    const verificationToken = createToken('verify');
    const user = {
        id: createId('user'),
        name,
        email,
        provider: 'email',
        passwordHash: hashed.hash,
        salt: hashed.salt,
        verified: false,
        verificationToken,
        verificationCode: createOtpCode(),
        verificationCodeExpiresAt: addMinutesIso(new Date(), 15),
        subscriptionPlan: 'Free',
        subscriptionExpiresAt: null,
        role: 'user',
        createdAt: nowIso(),
        lastLoginAt: null
    };

    store.auth.users.push(user);
    ensureDefaultConversationForUser(store, user);
    writeStore(store);
    sendVerificationEmail(user, req).catch((err) => {
        console.error('[!] Gagal mengirim email verifikasi:', err.message || err);
    });
    res.json({
        user: safeUser(user),
        verificationEmailSent: smtpReady()
    });
});

app.post('/api/auth/login', (req, res) => {
    const store = readStore();
    const email = cleanEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const user = store.auth.users.find((item) => item.email === email);

    if (!user || user.provider !== 'email' || !verifyPassword(password, user.passwordHash, user.salt)) {
        return res.status(401).json({ error: 'Email atau password salah.' });
    }
    if (user.frozen) {
        return res.status(403).json({ error: 'Akun ini sedang dibekukan oleh admin.' });
    }
    if (!user.verified) {
        user.verificationToken = user.verificationToken || createToken('verify');
        user.verificationCode = createOtpCode();
        user.verificationCodeExpiresAt = addMinutesIso(new Date(), 15);
        writeStore(store);
        sendVerificationEmail(user, req).catch((err) => {
            console.error('[!] Gagal mengirim ulang email verifikasi:', err.message || err);
        });
        return res.status(403).json({
            error: 'Akun belum diverifikasi.',
            needsVerification: true,
            email: user.email,
            verificationEmailSent: smtpReady()
        });
    }

    user.lastLoginAt = nowIso();
    const token = createToken('user');
    store.auth.sessions.push({ token, userId: user.id, createdAt: nowIso() });
    ensureDefaultConversationForUser(store, user);
    syncProfileFromUser(store, user);
    writeStore(store);
    res.json({ token, user: safeUser(user) });
});

app.post('/api/auth/google', async (req, res) => {
    const store = readStore();
    let payload;

    try {
        payload = await verifyGoogleIdToken(req.body?.credential);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }

    const email = cleanEmail(payload.email);
    const name = String(payload.name || payload.given_name || email.split('@')[0] || 'Google User').trim().slice(0, 80);
    const avatarUrl = isTrustedAvatarUrl(payload.picture)
        ? String(payload.picture).slice(0, 500)
        : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email Google tidak valid.' });
    }

    let user = store.auth.users.find((item) => item.email === email);
    if (user?.frozen) {
        return res.status(403).json({ error: 'Akun ini sedang dibekukan oleh admin.' });
    }
    if (!user) {
        user = {
            id: createId('user'),
            name,
            email,
            provider: 'google',
            googleSub: payload.sub,
            avatarUrl,
            subscriptionPlan: 'Free',
            subscriptionExpiresAt: null,
            verified: true,
            role: 'user',
            createdAt: nowIso(),
            lastLoginAt: null
        };
        store.auth.users.push(user);
    }

    user.name = name || user.name;
    user.avatarUrl = avatarUrl || user.avatarUrl || '';
    user.provider = user.provider || 'google';
    user.googleSub = user.googleSub || payload.sub;
    user.verified = true;
    user.lastLoginAt = nowIso();
    const token = createToken('user');
    store.auth.sessions.push({ token, userId: user.id, createdAt: nowIso() });
    ensureDefaultConversationForUser(store, user);
    syncProfileFromUser(store, user);
    writeStore(store);
    res.json({ token, user: safeUser(user) });
});

app.post('/api/auth/verify', (req, res) => {
    const store = readStore();
    const token = String(req.body?.token || req.query?.token || '').trim();
    const email = cleanEmail(req.body?.email);
    const code = String(req.body?.code || '').replace(/\D/g, '').slice(0, 6);
    const user = token
        ? store.auth.users.find((item) => item.verificationToken === token)
        : store.auth.users.find((item) => item.email === email && item.verificationCode === code);

    if (!user) {
        return res.status(404).json({ error: 'Kode verifikasi tidak cocok.' });
    }
    if (!token) {
        const expiresAt = Date.parse(user.verificationCodeExpiresAt || '');
        if (!expiresAt || expiresAt < Date.now()) {
            return res.status(400).json({ error: 'Kode verifikasi sudah kedaluwarsa. Kirim ulang kode.' });
        }
    }

    user.verified = true;
    user.verificationToken = '';
    user.verificationCode = '';
    user.verificationCodeExpiresAt = null;
    user.lastLoginAt = nowIso();
    const sessionToken = createToken('user');
    store.auth.sessions.push({ token: sessionToken, userId: user.id, createdAt: nowIso() });
    ensureDefaultConversationForUser(store, user);
    syncProfileFromUser(store, user);
    writeStore(store);
    res.json({ token: sessionToken, user: safeUser(user) });
});

app.post('/api/auth/resend', (req, res) => {
    const store = readStore();
    const email = cleanEmail(req.body?.email);
    const user = store.auth.users.find((item) => item.email === email);
    if (!user) return res.status(404).json({ error: 'Akun tidak ditemukan.' });
    if (user.verified) return res.json({ verified: true });
    user.verificationToken = user.verificationToken || createToken('verify');
    user.verificationCode = createOtpCode();
    user.verificationCodeExpiresAt = addMinutesIso(new Date(), 15);
    writeStore(store);
    sendVerificationEmail(user, req).catch((err) => {
        console.error('[!] Gagal mengirim ulang email verifikasi:', err.message || err);
    });
    res.json({
        verified: false,
        verificationEmailSent: smtpReady()
    });
});

app.post('/api/auth/logout', (req, res) => {
    const store = readStore();
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    store.auth.sessions = store.auth.sessions.filter((item) => item.token !== token);
    writeStore(store);
    res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
    const store = readStore();
    store.auth = normalizeAuthStore(store.auth);
    const email = cleanEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const admin = store.auth.admin;

    if (email !== cleanEmail(admin.email) || !verifyPassword(password, admin.passwordHash, admin.salt)) {
        return res.status(401).json({ error: 'Admin email atau password salah.' });
    }

    const token = createToken('admin');
    store.auth.adminSessions.push({ token, createdAt: nowIso() });
    writeStore(store);
    res.json({ token, admin: { email: admin.email } });
});

app.get('/api/admin/session', (req, res) => {
    const store = readStore();
    store.auth = normalizeAuthStore(store.auth);
    const admin = currentAdminFromRequest(req, store);
    res.json({ admin: admin ? { email: admin.email } : null });
});

app.post('/api/admin/logout', (req, res) => {
    const store = readStore();
    store.auth = normalizeAuthStore(store.auth);
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    store.auth.adminSessions = store.auth.adminSessions.filter((item) => item.token !== token);
    writeStore(store);
    res.json({ ok: true });
});

function formatAnalyticsDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function buildModelAnalytics(conversations = [], modelSettings = null) {
    const plans = ['Free', 'Pro', 'Ultra'];
    const settings = normalizeModelSettings(modelSettings);
    const days = [];
    const now = new Date();
    for (let offset = 13; offset >= 0; offset -= 1) {
        const date = new Date(now);
        date.setDate(date.getDate() - offset);
        const key = formatAnalyticsDateKey(date);
        days.push({
            key,
            label: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
        });
    }
    const byPlan = Object.fromEntries(plans.map((plan) => [plan, Object.fromEntries(days.map((day) => [day.key, 0]))]));
    const totals = Object.fromEntries(plans.map((plan) => [plan, 0]));
    const modelNames = Object.fromEntries(plans.map((plan) => [plan, settings[plan]?.modelName || plan]));

    conversations.forEach((conversation) => {
        (conversation.messages || []).forEach((message) => {
            if (message.role !== 'user') return;
            const plan = plans.includes(message.mode?.plan) ? message.mode.plan : 'Free';
            const rawDate = new Date(message.createdAt || conversation.createdAt || '');
            if (Number.isNaN(rawDate.getTime())) return;
            const key = formatAnalyticsDateKey(rawDate);
            if (!byPlan[plan] || byPlan[plan][key] === undefined) return;
            byPlan[plan][key] += 1;
            totals[plan] += 1;
        });
    });

    const dailyTotals = days.map((day) => plans.reduce((sum, plan) => sum + (byPlan[plan][day.key] || 0), 0));
    const totalRequests = plans.reduce((sum, plan) => sum + totals[plan], 0);
    const topPlan = plans.reduce((best, plan) => totals[plan] > totals[best] ? plan : best, 'Free');
    const peakIndex = dailyTotals.reduce((best, value, index) => value > dailyTotals[best] ? index : best, 0);
    const activeDays = dailyTotals.filter((value) => value > 0).length;
    const averageDaily = days.length ? totalRequests / days.length : 0;

    return {
        labels: days.map((day) => day.label),
        series: Object.fromEntries(plans.map((plan) => [plan, days.map((day) => byPlan[plan][day.key] || 0)])),
        totals,
        percentages: Object.fromEntries(plans.map((plan) => [plan, totalRequests ? Math.round((totals[plan] / totalRequests) * 100) : 0])),
        modelNames,
        totalRequests,
        topPlan: {
            plan: topPlan,
            modelName: modelNames[topPlan],
            total: totals[topPlan],
            percent: totalRequests ? Math.round((totals[topPlan] / totalRequests) * 100) : 0
        },
        peakDay: {
            label: days[peakIndex]?.label || '-',
            total: dailyTotals[peakIndex] || 0
        },
        activeDays,
        averageDaily: Number(averageDaily.toFixed(1))
    };
}

app.get('/api/admin/dashboard', async (req, res) => {
    const store = readStore();
    store.auth = normalizeAuthStore(store.auth);
    if (!currentAdminFromRequest(req, store)) {
        return res.status(401).json({ error: 'Login admin diperlukan.' });
    }

    const users = store.auth.users.map(safeUser).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    const conversations = store.conversations || [];
    const messages = conversations.flatMap((conversation) => conversation.messages || []);
    const paymentRequests = (store.paymentRequests || [])
        .map((request) => ({
            ...request,
            user: safeUser(store.auth.users.find((user) => user.id === request.userId))
        }))
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    res.json({
        metrics: {
            totalUsers: users.length,
            activeSessions: store.auth.sessions.length,
            conversations: conversations.length,
            messages: messages.length,
            pendingPayments: paymentRequests.filter((request) => request.status === 'pending').length
        },
        users: users.slice(0, 20),
        paymentRequests,
        broadcasts: (store.broadcasts || [])
            .map(safeBroadcast)
            .filter(Boolean)
            .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
            .slice(0, 20),
        broadcastMeta: {
            recipientCount: store.auth.users.filter((user) => isValidEmail(user.email)).length,
            smtpConfigured: smtpReady()
        },
        digitalOcean: await buildDigitalOceanOverview(),
        modelSettings: normalizeModelSettings(store.modelSettings),
        modelAnalytics: buildModelAnalytics(conversations, store.modelSettings),
        recentConversations: conversations.slice(0, 10).map((conversation) => ({
            id: conversation.id,
            title: conversation.title,
            updatedAt: conversation.updatedAt,
            messages: (conversation.messages || []).length
        }))
    });
});

app.post('/api/admin/broadcasts', async (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;

    const subject = String(req.body?.subject || '').trim().replace(/\s+/g, ' ').slice(0, 140);
    const message = String(req.body?.message || '').trim().slice(0, 4000);
    if (subject.length < 4) {
        return res.status(400).json({ error: 'Judul notifikasi minimal 4 karakter.' });
    }
    if (message.length < 10) {
        return res.status(400).json({ error: 'Pesan notifikasi minimal 10 karakter.' });
    }

    const recipientMap = new Map();
    store.auth.users.forEach((user) => {
        const email = cleanEmail(user.email);
        if (!isValidEmail(email)) return;
        if (!recipientMap.has(email)) {
            recipientMap.set(email, {
                id: user.id,
                name: user.name || email.split('@')[0],
                email,
                provider: user.provider || 'email'
            });
        }
    });
    const recipients = Array.from(recipientMap.values());
    if (recipients.length === 0) {
        return res.status(400).json({ error: 'Belum ada email user yang valid untuk dikirim notifikasi.' });
    }

    const createdAt = nowIso();
    const payload = {
        subject,
        message,
        senderName: 'Admin Snake AI'
    };
    const result = await sendBroadcastEmails(recipients, payload);
    const failedCount = result.failed.length;
    const sentCount = result.sent.length;
    const broadcast = {
        id: createId('broadcast'),
        subject,
        message,
        recipientCount: recipients.length,
        sentCount,
        failedCount,
        failedRecipients: result.failed,
        status: sentCount === recipients.length
            ? 'sent'
            : sentCount > 0
                ? 'partial'
                : 'failed',
        createdAt,
        createdBy: store.auth.admin.email,
        smtpConfigured: result.smtpConfigured
    };

    store.broadcasts = [broadcast, ...(store.broadcasts || [])].slice(0, 50);
    writeStore(store);
    res.json({
        broadcast: safeBroadcast(broadcast),
        broadcasts: store.broadcasts.map(safeBroadcast).filter(Boolean),
        broadcastMeta: {
            recipientCount: recipients.length,
            smtpConfigured: smtpReady()
        }
    });
});

function requireAdmin(req, res, store) {
    store.auth = normalizeAuthStore(store.auth);
    if (!currentAdminFromRequest(req, store)) {
        res.status(401).json({ error: 'Login admin diperlukan.' });
        return false;
    }
    return true;
}

app.patch('/api/admin/model-settings', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;
    const current = normalizeModelSettings(store.modelSettings);
    const incoming = req.body?.settings && typeof req.body.settings === 'object' ? req.body.settings : {};
    ['Free', 'Pro', 'Ultra'].forEach((plan) => {
        if (!incoming[plan]) return;
        current[plan] = {
            ...current[plan],
            enabled: typeof incoming[plan].enabled === 'boolean' ? incoming[plan].enabled : current[plan].enabled,
            displayName: typeof incoming[plan].displayName === 'string' && incoming[plan].displayName.trim()
                ? incoming[plan].displayName.trim().slice(0, 32)
                : current[plan].displayName,
            modelName: typeof incoming[plan].modelName === 'string' && incoming[plan].modelName.trim()
                ? incoming[plan].modelName.trim().slice(0, 48)
                : current[plan].modelName,
            description: typeof incoming[plan].description === 'string' && incoming[plan].description.trim()
                ? incoming[plan].description.trim().slice(0, 220)
                : current[plan].description,
            creditLimits: normalizeCreditLimits(incoming[plan].creditLimits, current[plan].creditLimits)
        };
    });
    store.modelSettings = normalizeModelSettings(current);
    (store.auth?.users || []).forEach((user) => ensureCreditUsage(user, store.modelSettings));
    const profileUser = (store.auth?.users || []).find((user) => user.email === store.profile?.email);
    if (profileUser) syncProfileFromUser(store, profileUser);
    writeStore(store);
    res.json({ modelSettings: store.modelSettings });
});

app.post('/api/admin/users/:id/credits', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;
    res.status(410).json({
        error: 'Pengaturan credit user sudah diganti menjadi limit token per model. Ubah limit melalui Model Settings.'
    });
});

app.post('/api/admin/payments/:id/approve', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;
    const request = (store.paymentRequests || []).find((item) => item.id === req.params.id);
    if (!request) return res.status(404).json({ error: 'Request pembayaran tidak ditemukan.' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request ini sudah diproses.' });

    const user = store.auth.users.find((item) => item.id === request.userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });
    setUserSubscription(user, request.plan, { forceDuration: true });
    ensureCreditUsage(user, store.modelSettings);
    request.status = 'approved';
    request.reviewedAt = nowIso();
    request.reviewedBy = store.auth.admin.email;
    request.subscriptionExpiresAt = user.subscriptionExpiresAt;
    if (store.profile?.email === user.email) {
        syncProfileFromUser(store, user);
    }
    writeStore(store);
    res.json({ ok: true, request, user: safeUser(user) });
});

app.post('/api/admin/payments/:id/reject', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;
    const request = (store.paymentRequests || []).find((item) => item.id === req.params.id);
    if (!request) return res.status(404).json({ error: 'Request pembayaran tidak ditemukan.' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request ini sudah diproses.' });

    request.status = 'rejected';
    request.reviewedAt = nowIso();
    request.reviewedBy = store.auth.admin.email;
    request.note = typeof req.body?.note === 'string' ? req.body.note.slice(0, 240) : '';
    writeStore(store);
    res.json({ ok: true, request });
});

app.get('/api/admin/users', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;

    const query = String(req.query?.q || '').trim().toLowerCase();
    let users = store.auth.users.map(safeUser).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (query) {
        users = users.filter((user) =>
            String(user.name || '').toLowerCase().includes(query)
            || String(user.email || '').toLowerCase().includes(query)
            || String(user.subscriptionPlan || '').toLowerCase().includes(query)
            || String(user.provider || '').toLowerCase().includes(query)
        );
    }

    res.json({ users });
});

app.patch('/api/admin/users/:id', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;

    const user = store.auth.users.find((item) => item.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    const nextName = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 80) : user.name;
    const nextEmail = req.body?.email !== undefined ? cleanEmail(req.body.email) : user.email;
    const nextPassword = typeof req.body?.password === 'string' ? req.body.password : '';
    const planRequested = req.body?.subscriptionPlan !== undefined;
    const nextPlan = ['Free', 'Pro', 'Ultra'].includes(req.body?.subscriptionPlan) ? req.body.subscriptionPlan : null;
    const wasProfileUser = store.profile?.email === user.email;

    if (!nextName) return res.status(400).json({ error: 'Nama user wajib diisi.' });
    if (!nextEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
        return res.status(400).json({ error: 'Email user tidak valid.' });
    }
    const duplicate = store.auth.users.find((item) => item.email === nextEmail && item.id !== user.id);
    if (duplicate) return res.status(409).json({ error: 'Email sudah dipakai user lain.' });
    if (nextPassword && nextPassword.length < 6) {
        return res.status(400).json({ error: 'Password minimal 6 karakter.' });
    }

    user.name = nextName;
    user.email = nextEmail;
    if (planRequested) {
        if (!nextPlan) return res.status(400).json({ error: 'Titel user tidak valid.' });
        setUserSubscription(user, nextPlan);
    }
    ensureCreditUsage(user, store.modelSettings);
    if (typeof req.body?.verified === 'boolean') user.verified = req.body.verified;
    if (typeof req.body?.frozen === 'boolean') {
        user.frozen = req.body.frozen;
        if (user.frozen) {
            store.auth.sessions = store.auth.sessions.filter((session) => session.userId !== user.id);
        }
    }
    if (nextPassword) {
        const hashed = hashPassword(nextPassword);
        user.passwordHash = hashed.hash;
        user.salt = hashed.salt;
        user.provider = user.provider || 'email';
    }
    user.updatedAt = nowIso();
    if (wasProfileUser || store.profile?.email === user.email) syncProfileFromUser(store, user);

    writeStore(store);
    res.json({ user: safeUser(user) });
});

app.post('/api/admin/users/:id/freeze', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;
    const user = store.auth.users.find((item) => item.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    user.frozen = Boolean(req.body?.frozen);
    user.updatedAt = nowIso();
    if (user.frozen) {
        store.auth.sessions = store.auth.sessions.filter((session) => session.userId !== user.id);
    }
    writeStore(store);
    res.json({ user: safeUser(user) });
});

app.delete('/api/admin/users/:id', (req, res) => {
    const store = readStore();
    if (!requireAdmin(req, res, store)) return;

    const before = store.auth.users.length;
    store.auth.users = store.auth.users.filter((user) => user.id !== req.params.id);
    if (store.auth.users.length === before) return res.status(404).json({ error: 'User tidak ditemukan.' });
    store.auth.sessions = store.auth.sessions.filter((session) => session.userId !== req.params.id);
    store.conversations = (store.conversations || []).filter((conversation) => conversation.userId !== req.params.id);
    writeStore(store);
    res.json({ ok: true });
});

app.get('/api/state', (req, res) => {
    const store = readStore();
    let changed = settleStalePendingAssistants(store);
    const user = currentUserFromRequest(req, store);
    if (user) {
        syncProfileFromUser(store, user);
        setActiveConversationForUser(store, user, activeConversationIdForUser(store, user));
        changed = true;
    }
    store.modelSettings = normalizeModelSettings(store.modelSettings);
    if (changed) writeStore(store);
    res.json(publicStateForUser(store, user));
});

app.post('/api/subscription/qris', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan untuk berlangganan.' });
    const plan = SUBSCRIPTION_PLANS[req.body?.plan] ? req.body.plan : '';
    if (!plan) return res.status(400).json({ error: 'Paket langganan tidak valid.' });
    const amount = SUBSCRIPTION_PLANS[plan].amount;
    res.json({
        plan,
        amount,
        qris: dynamicQrisForAmount(amount)
    });
});

app.post('/api/subscription/requests', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan untuk mengirim bukti pembayaran.' });
    const plan = SUBSCRIPTION_PLANS[req.body?.plan] ? req.body.plan : '';
    if (!plan) return res.status(400).json({ error: 'Paket langganan tidak valid.' });
    const proofImage = typeof req.body?.proofImage === 'string'
        && /^data:image\/(png|jpe?g|webp);base64,/i.test(req.body.proofImage)
        && req.body.proofImage.length <= 3500000
        ? req.body.proofImage
        : '';
    if (!proofImage) return res.status(400).json({ error: 'Upload bukti pembayaran berupa gambar PNG/JPG/WebP maksimal 3.5 MB.' });

    const planInfo = SUBSCRIPTION_PLANS[plan];
    const existingPending = (store.paymentRequests || []).find((request) => request.userId === user.id && request.plan === plan && request.status === 'pending');
    if (existingPending) {
        existingPending.proofImage = proofImage;
        existingPending.amount = planInfo.amount;
        existingPending.updatedAt = nowIso();
        writeStore(store);
        return res.json({ request: existingPending });
    }

    const request = {
        id: createId('pay'),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        plan,
        amount: planInfo.amount,
        proofImage,
        status: 'pending',
        createdAt: nowIso(),
        updatedAt: nowIso()
    };
    store.paymentRequests = [request, ...(store.paymentRequests || [])];
    writeStore(store);
    res.json({ request });
});

app.get('/api/profile', (req, res) => {
    res.json(readStore().profile);
});

app.patch('/api/profile', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    const { name, email, initials, avatarUrl } = req.body || {};
    const nextAvatar = typeof avatarUrl === 'string'
        && (avatarUrl === '' || /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(avatarUrl) || isTrustedAvatarUrl(avatarUrl))
        && avatarUrl.length <= 2500000
        ? avatarUrl
        : store.profile.avatarUrl || '';

    store.profile = {
        name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 80) : store.profile.name,
        email: typeof email === 'string' ? email.trim().slice(0, 120) : store.profile.email,
        initials: typeof initials === 'string' && initials.trim() ? initials.trim().slice(0, 4) : store.profile.initials,
        avatarUrl: nextAvatar,
        subscriptionPlan: user ? subscriptionPlanForUser(user) : 'Free',
        subscriptionExpiresAt: user && subscriptionPlanForUser(user) !== 'Free' ? user.subscriptionExpiresAt || null : null,
        subscriptionDaysLeft: user ? subscriptionDaysLeft(user) : 0
    };

    if (user) {
        user.name = store.profile.name;
        user.email = store.profile.email;
        user.avatarUrl = store.profile.avatarUrl;
        syncProfileFromUser(store, user);
    }

    writeStore(store);
    res.json(store.profile);
});

app.post('/api/conversations', async (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan untuk membuat percakapan.' });
    const owned = userConversations(store, user);
    const limit = conversationLimitForUser(user);
    if (owned.length >= limit) {
        return res.status(403).json({
            error: `Limit percakapan paket ${subscriptionPlanForUser(user)} sudah penuh (${owned.length}/${limit}). Hapus percakapan lama atau upgrade paket.`
        });
    }
    const title = typeof req.body?.title === 'string' && req.body.title.trim()
        ? req.body.title.trim().slice(0, 80)
        : 'Percakapan Baru';

    const conversation = createConversationForUser(store, user, title);
    writeStore(store);

    res.json(conversation);
});

app.post('/api/conversations/:id/select', async (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    let conversation;
    try {
        conversation = getOwnedConversationOrFail(store, user, req.params.id);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }

    setActiveConversationForUser(store, user, conversation.id);
    writeStore(store);

    if (req.body?.localOnly || hasPendingAssistant(store)) {
        return res.json({ conversation, localOnly: true });
    }

    try {
        await withRemoteChatLock(() => openLinkedChat(conversation));
    } catch (err) {
        if (err.status === 409) {
            return res.json({
                conversation,
                warning: err.message
            });
        }

        console.log('[!] Percakapan lokal dipilih, tetapi ChatGPT web belum bisa dipindahkan:', err.message);
        return res.json({
            conversation,
            warning: 'Percakapan lokal dipilih, tetapi ChatGPT web belum bisa dipindahkan.'
        });
    }

    const freshStore = readStore();
    const freshUser = currentUserFromRequest(req, freshStore);
    const freshConversation = getOwnedConversationOrFail(freshStore, freshUser, conversation.id);
    res.json({ conversation: freshConversation });
});

app.patch('/api/conversations/:id', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    let conversation;
    try {
        conversation = getOwnedConversationOrFail(store, user, req.params.id);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }

    if (typeof req.body?.title === 'string' && req.body.title.trim()) {
        conversation.title = req.body.title.trim().slice(0, 80);
    }

    conversation.updatedAt = nowIso();
    writeStore(store);
    res.json(conversation);
});

app.delete('/api/conversations/:id', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    const target = store.conversations.find((item) => item.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'Percakapan tidak ditemukan.' });
    if (target.userId !== user.id) return res.status(403).json({ error: 'Percakapan ini bukan milik akun Anda.' });
    store.conversations = store.conversations.filter((item) => item.id !== req.params.id);

    if (user.activeConversationId === req.params.id) {
        setActiveConversationForUser(store, user, userConversations(store, user)[0]?.id || null);
    }

    writeStore(store);
    res.json({ ok: true, activeConversationId: activeConversationIdForUser(store, user) });
});

app.delete('/api/conversations', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    store.conversations = store.conversations.filter((conversation) => conversation.userId !== user.id);
    setActiveConversationForUser(store, user, null);
    writeStore(store);
    res.json({ ok: true });
});

app.patch('/api/conversations/:conversationId/messages/:messageId', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    let conversation;
    try {
        conversation = getOwnedConversationOrFail(store, user, req.params.conversationId);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
    const message = conversation.messages.find((item) => item.id === req.params.messageId);

    if (!message) {
        return res.status(404).json({ error: 'Pesan tidak ditemukan.' });
    }

    if (typeof req.body?.content === 'string') {
        message.content = req.body.content.trim();
        message.editedAt = nowIso();
        conversation.updatedAt = nowIso();
    }

    writeStore(store);
    res.json(message);
});

app.delete('/api/conversations/:conversationId/messages/:messageId', (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    let conversation;
    try {
        conversation = getOwnedConversationOrFail(store, user, req.params.conversationId);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }
    conversation.messages = conversation.messages.filter((item) => item.id !== req.params.messageId);
    conversation.updatedAt = nowIso();
    writeStore(store);
    res.json({ ok: true });
});

app.post('/api/chat/cancel', async (req, res) => {
    const store = readStore();
    const user = currentUserFromRequest(req, store);
    if (!user) return res.status(401).json({ error: 'Login diperlukan.' });
    const conversation = req.body?.conversationId
        ? store.conversations.find((item) => item.id === req.body.conversationId && item.userId === user.id)
        : store.conversations.find((item) => item.id === activeConversationIdForUser(store, user) && item.userId === user.id);

    if (!conversation) {
        return res.status(404).json({ error: 'Percakapan tidak ditemukan.' });
    }

    const pendingMessages = (conversation.messages || [])
        .filter((message) => message.role === 'assistant' && message.isLoading);
    if (pendingMessages.length === 0) {
        return res.json({ ok: true, cancelled: false });
    }

    const now = nowIso();
    pendingMessages.forEach((message) => {
        message.isLoading = false;
        message.isCancelled = true;
        message.content = 'Dibatalkan.';
        message.completedAt = now;
        activeChatRequests.get(message.id)?.abort();
        activeChatRequests.delete(message.id);
    });
    conversation.updatedAt = now;
    writeStore(store);

    clickStopGenerating().catch(() => false);
    res.json({ ok: true, cancelled: true, conversationId: conversation.id });
});

app.post('/api/chat', async (req, res) => {
    const store = readStore();
    const requestUser = currentUserFromRequest(req, store);
    if (!requestUser) return res.status(401).json({ error: 'Login diperlukan untuk memakai Snake AI.' });
    const content = cleanPromptText(req.body?.message);
    const mode = req.body?.mode && typeof req.body.mode === 'object'
        ? {
            plan: ['Free', 'Pro', 'Ultra'].includes(req.body.mode.plan) ? req.body.mode.plan : 'Free',
            model: typeof req.body.mode.model === 'string' ? req.body.mode.model.slice(0, 80) : 'gpt-5.5'
        }
        : { plan: 'Free', model: 'gpt-5.5' };
    mode.model = publicModelName(mode.plan);
    const attachmentsForUpload = normalizeAttachments(req.body?.attachments);
    const attachmentsForStore = normalizeAttachments(req.body?.attachments, { persist: true });

    if (!content && attachmentsForUpload.length === 0) {
        return res.status(400).json({ error: 'Pesan kosong.' });
    }

    const conversation = req.body?.conversationId
        ? store.conversations.find((item) => item.id === req.body.conversationId && item.userId === requestUser.id)
        : null;

    if (!conversation) {
        return res.status(400).json({ error: 'Pilih riwayat percakapan atau tekan Percakapan Baru sebelum mengirim pesan.' });
    }

    const editMessageId = typeof req.body?.editMessageId === 'string' ? req.body.editMessageId : '';
    const editMessageIndex = editMessageId
        ? conversation.messages.findIndex((item) => item.id === editMessageId && item.role === 'user')
        : -1;
    if (editMessageId && editMessageIndex < 0) {
        return res.status(404).json({ error: 'Pesan yang diedit tidak ditemukan.' });
    }

    const existingEditMessage = editMessageIndex >= 0 ? conversation.messages[editMessageIndex] : null;
    const effectiveReplyToId = existingEditMessage?.replyTo || req.body?.replyTo || null;
    const replyToMessage = effectiveReplyToId
        ? conversation.messages.find((item) => item.id === effectiveReplyToId)
        : null;
    const effectiveAttachmentsForUpload = existingEditMessage
        ? normalizeAttachments(existingEditMessage.attachments || [])
        : attachmentsForUpload;
    const inputTokens = estimateMessageInputTokens(content, effectiveAttachmentsForUpload, replyToMessage);
    const creditCheck = checkCreditAllowance(requestUser, mode.plan, inputTokens, store.modelSettings);
    if (!creditCheck.ok) {
        syncProfileFromUser(store, requestUser);
        writeStore(store);
        return res.status(creditCheck.status).json({ error: creditCheck.message, profile: store.profile });
    }

    const assistantMessage = {
        id: createId('msg'),
        role: 'assistant',
        content: '',
        attachments: [],
        isLoading: true,
        createdAt: nowIso()
    };
    const userMessage = existingEditMessage || {
        id: createId('msg'),
        role: 'user',
        content,
        mode,
        attachments: attachmentsForStore,
        replyTo: replyToMessage?.id || null,
        createdAt: nowIso()
    };

    if (existingEditMessage) {
        existingEditMessage.content = content;
        existingEditMessage.mode = mode;
        existingEditMessage.editedAt = nowIso();
        conversation.messages = conversation.messages.slice(0, editMessageIndex + 1);
    } else {
        conversation.messages.push(userMessage);
    }
    conversation.messages.push(assistantMessage);
    conversation.updatedAt = nowIso();
    if (conversation.title === 'Percakapan Baru') {
        conversation.title = content ? titleFromMessage(content) : titleFromMessage((existingEditMessage?.attachments || attachmentsForStore)[0]?.name || 'Lampiran gambar');
    }
    setActiveConversationForUser(store, requestUser, conversation.id);
    writeStore(store);

    const shouldExpectImage = expectsImageResponse(content, effectiveAttachmentsForUpload);
    const digitalOceanConfig = digitalOceanPlanConfig(mode);
    const requestController = new AbortController();
    activeChatRequests.set(assistantMessage.id, requestController);

    const isCancelled = () => {
        const currentStore = readStore();
        const currentConversation = currentStore.conversations.find((item) => item.id === conversation.id);
        const currentAssistant = currentConversation?.messages.find((item) => item.id === assistantMessage.id);
        return Boolean(currentAssistant?.isCancelled);
    };

    try {
        const replyContext = replyToMessage
            ? `${replyToMessage.role === 'assistant' ? 'AI' : 'User'}: ${replyToMessage.content}`
            : '';
        let reply;
        let assistantAttachments = [];

        if (digitalOceanConfig) {
            reply = await callDigitalOceanModel(digitalOceanConfig, conversation, userMessage, effectiveAttachmentsForUpload, replyToMessage, {
                signal: requestController.signal
            });
        } else {
            reply = await withRemoteChatLock(async () => {
                await openLinkedChat(conversation);
                const prompt = buildPrompt(content, effectiveAttachmentsForUpload, replyContext);
                return sendMessage(prompt, effectiveAttachmentsForUpload, { expectImage: shouldExpectImage });
            });
            assistantAttachments = (reply.attachments || []).slice(0, 1).map((attachment, index) =>
                dataUrlToPersistedAttachment(attachment.dataUrl, attachment.name || `generated-image-${index + 1}.png`)
            );
        }

        if (!digitalOceanConfig && shouldExpectImage && assistantAttachments.length === 0) {
            const err = new Error('ChatGPT tidak mengembalikan gambar yang bisa ditampilkan di web lokal.');
            err.status = 502;
            err.expectImage = true;
            throw err;
        }

        const freshStore = readStore();
        const freshUserForConversation = (freshStore.auth?.users || []).find((user) => user.id === requestUser.id);
        const freshConversation = getOwnedConversationOrFail(freshStore, freshUserForConversation, conversation.id);
        const freshAssistantMessage = freshConversation.messages.find((item) => item.id === assistantMessage.id);
        if (!freshAssistantMessage) {
            throw new Error('Placeholder jawaban tidak ditemukan.');
        }
        if (freshAssistantMessage.isCancelled) {
            activeChatRequests.delete(assistantMessage.id);
            return res.json({ conversationId: freshConversation.id, userMessage, assistantMessage: freshAssistantMessage, cancelled: true });
        }
        freshAssistantMessage.content = (digitalOceanConfig
            ? rawDigitalOceanContent(reply.content)
            : finalizeAssistantContent(reply.content, mode.plan)) || (assistantAttachments.length ? '' : 'OK');
        freshAssistantMessage.attachments = assistantAttachments;
        if (reply.source) {
            freshAssistantMessage.source = reply.source;
        }
        freshAssistantMessage.isLoading = false;
        freshAssistantMessage.completedAt = nowIso();
        freshConversation.updatedAt = nowIso();
        if (!digitalOceanConfig) {
            const currentChatGptUrl = await waitForLinkedChatGptUrl();
            if (currentChatGptUrl) {
                freshConversation.chatgptUrl = currentChatGptUrl;
                freshConversation.chatgptConversationId = chatGptConversationId(currentChatGptUrl);
                freshConversation.chatgptPendingNew = false;
            }
        }
        const freshUser = (freshStore.auth?.users || []).find((user) => user.id === requestUser.id);
        if (freshUser) {
            deductCreditUsage(freshUser, mode.plan, inputTokens, estimateTokens(freshAssistantMessage.content || ''), freshStore.modelSettings);
            syncProfileFromUser(freshStore, freshUser);
        }
        writeStore(freshStore);

        res.json({ conversationId: freshConversation.id, userMessage, assistantMessage: freshAssistantMessage });
    } catch (err) {
        const freshStore = readStore();
        const freshUserForConversation = (freshStore.auth?.users || []).find((user) => user.id === requestUser.id);
        const freshConversation = getOwnedConversationOrFail(freshStore, freshUserForConversation, conversation.id);
        const freshAssistantMessage = freshConversation.messages.find((item) => item.id === assistantMessage.id);
        if (freshAssistantMessage) {
            if (freshAssistantMessage.isCancelled || requestController.signal.aborted || isCancelled()) {
                freshAssistantMessage.content = 'Dibatalkan.';
                freshAssistantMessage.isLoading = false;
                freshAssistantMessage.isCancelled = true;
                freshAssistantMessage.completedAt = nowIso();
                freshConversation.updatedAt = nowIso();
                writeStore(freshStore);
                activeChatRequests.delete(assistantMessage.id);
                return res.json({ conversationId: conversation.id, userMessage, assistantMessage: freshAssistantMessage, cancelled: true });
            }
            const allowSiapFallback = false;
            const publicError = maskModelIdentity(err.message, mode.plan);
            freshAssistantMessage.content = `Error: ${publicError}`;
            freshAssistantMessage.isLoading = false;
            freshAssistantMessage.isError = !allowSiapFallback;
            freshAssistantMessage.completedAt = nowIso();
        }
        freshConversation.updatedAt = nowIso();
        writeStore(freshStore);
        res.status(err.status || 500).json({ error: maskModelIdentity(err.message, mode.plan), conversationId: conversation.id, userMessage, assistantMessage: freshAssistantMessage });
    } finally {
        activeChatRequests.delete(assistantMessage.id);
    }
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Pesan kosong, isi dulu.' });
    }

    try {
        await recoverSession();

        if (isNewChatCommand(message)) {
            await openNewChat();
            return res.json({ reply: 'Chat baru sudah dibuat.' });
        }

        const reply = await sendMessage(message);
        res.json({ reply: finalizeAssistantContent(reply.content || '', 'Free'), attachments: (reply.attachments || []).slice(0, 1) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/health', (req, res) => {
    getLoginStatus().then((loginStatus) => {
        res.json({
            status: 'online',
            session: !!page && !page.isClosed(),
            loggedIn: loginStatus.loggedIn,
            accountHint: loginStatus.accountHint,
            url: page && !page.isClosed() ? page.url() : null
        });
    }).catch(() => {
        res.json({
            status: 'online',
            session: !!page && !page.isClosed(),
            loggedIn: false,
            accountHint: null,
            url: page && !page.isClosed() ? page.url() : null
        });
    });
});

app.get('/account', async (req, res) => {
    const loginStatus = await getLoginStatus();
    res.json({
        ...loginStatus,
        url: page && !page.isClosed() ? page.url() : null
    });
});

app.get(['/admin', '/admin/dashboard', '/verify'], (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// ==================== START ====================
async function start() {
    console.log('[+] Wrom GPT - ChatGPT Manual Login Backend');
    console.log('[+] Starting...');
    if (DIGITALOCEAN_PRO_MODEL !== REQUIRED_PRO_MODEL) {
        console.warn(`[!] DIGITALOCEAN_PRO_MODEL diabaikan. Pro dikunci ke ${REQUIRED_PRO_MODEL}.`);
    }
    if (DIGITALOCEAN_ULTRA_MODEL !== REQUIRED_ULTRA_MODEL) {
        console.warn(`[!] DIGITALOCEAN_ULTRA_MODEL diabaikan. Ultra dikunci ke ${REQUIRED_ULTRA_MODEL}.`);
    }

    if (LOGIN_ONLY) {
        await loginOnly();
        return;
    }

    await loadSession();

    const server = app.listen(PORT, '127.0.0.1', () => {
        console.log(`[OK] Server jalan di http://localhost:${PORT}`);
        console.log('[OK] Endpoint: POST /chat  {"message": "pertanyaan lu"}');
        console.log('[OK] Health check: GET /health');
        console.log('================================================');
    });

    server.on('error', async (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`[!] Port ${PORT} sudah dipakai. Server kemungkinan sudah jalan.`);
            console.error(`[!] Cek: curl.exe http://localhost:${PORT}/health`);
            console.error('[!] Kalau mau restart, stop proses Node lama dulu:');
            console.error('    Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess');
            console.error('    Stop-Process -Id <PID>');
        } else {
            console.error('[-] Server error:', err.message);
        }

        await closeBrowser();
        process.exit(1);
    });
}

process.on('SIGINT', async () => {
    console.log('\n[!] Shutting down...');
    await closeBrowser();
    process.exit(0);
});

start();
