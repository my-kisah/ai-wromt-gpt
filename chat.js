const readline = require('readline');
const { spawn } = require('child_process');

const API_URL = process.env.CHAT_API_URL || 'http://127.0.0.1:3000/chat';
const HEALTH_URL = process.env.CHAT_HEALTH_URL || 'http://127.0.0.1:3000/health';

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isServerReady() {
    try {
        const response = await fetch(HEALTH_URL);
        return response.ok;
    } catch (err) {
        return false;
    }
}

async function startServerIfNeeded() {
    if (await isServerReady()) return;

    console.log('Server belum jalan, menyalakan server background...');

    const child = spawn(process.execPath, ['server.js'], {
        cwd: __dirname,
        detached: true,
        stdio: 'ignore',
        windowsHide: true
    });

    child.unref();

    for (let i = 0; i < 30; i += 1) {
        await wait(1000);
        if (await isServerReady()) return;
    }

    throw new Error('Server belum siap. Jalankan npm start dan cek apakah session masih valid.');
}

async function ask(message) {
    await startServerIfNeeded();

    let response;

    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
    } catch (err) {
        await wait(1000);
        await startServerIfNeeded();
        response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
    }

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : { error: await response.text() };

    if (!response.ok) {
        throw new Error(data.error || `Request gagal: HTTP ${response.status}`);
    }

    return data.reply;
}

const oneShotMessage = process.argv.slice(2).join(' ').trim();

if (oneShotMessage) {
    ask(oneShotMessage)
        .then((reply) => {
            console.log(reply);
            process.exit(0);
        })
        .catch((err) => {
            console.error(`Error: ${err.message}`);
            process.exit(1);
        });
} else {
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Kamu: '
});

console.log('Chat siap. Ketik pesan lalu Enter. Ketik /exit untuk keluar.');
rl.prompt();

rl.on('line', async (line) => {
    const message = line.trim();

    if (!message) {
        rl.prompt();
        return;
    }

    if (message === '/exit' || message === '/quit') {
        rl.close();
        return;
    }

    rl.pause();

    try {
        console.log('AI: sedang menjawab...');
        const reply = await ask(message);
        console.log(`AI: ${reply}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
    } finally {
        rl.resume();
        rl.prompt();
    }
});

rl.on('close', () => {
    console.log('Chat ditutup.');
    process.exit(0);
});
}
