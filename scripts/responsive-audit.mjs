import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.AUDIT_URL ?? 'http://localhost:3003';
const port = Number(process.env.CDP_PORT ?? 9333);
const userDataDir = mkdtempSync(path.join(tmpdir(), 'redacao-responsive-'));

const viewports = [
  { name: 'mobile-sm', width: 360, height: 740 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'notebook', width: 1024, height: 768 },
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'desktop-lg', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
];

const pages = [
  { name: 'landing', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'cadastro', path: '/cadastro' },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeTempDir(tempDir) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      rmSync(tempDir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 5) {
        console.warn(`Could not remove temporary Chrome profile: ${error.message}`);
        return;
      }
      await sleep(250);
    }
  }
}

async function getJson(url, attempts = 50) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      lastError = error;
    }
    await sleep(120);
  }
  throw lastError ?? new Error(`Unable to fetch ${url}`);
}

class CdpClient {
  constructor(wsUrl) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.ws = new WebSocket(wsUrl);
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result ?? {});
        return;
      }

      const callbacks = this.listeners.get(message.method);
      if (callbacks) callbacks.forEach((callback) => callback(message.params ?? {}, message.sessionId));
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId;
    this.nextId += 1;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  once(method, predicate = () => true) {
    return new Promise((resolve) => {
      const callback = (params, sessionId) => {
        if (!predicate(params, sessionId)) return;
        const callbacks = this.listeners.get(method) ?? [];
        this.listeners.set(
          method,
          callbacks.filter((item) => item !== callback),
        );
        resolve({ params, sessionId });
      };
      const callbacks = this.listeners.get(method) ?? [];
      callbacks.push(callback);
      this.listeners.set(method, callbacks);
    });
  }

  close() {
    this.ws.close();
  }
}

const auditExpression = `(() => {
  const pick = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      selector,
      width: Math.round(rect.width),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      top: Math.round(rect.top),
    };
  };

  const sectionWithText = (text) => {
    const lower = text.toLowerCase();
    return Array.from(document.querySelectorAll('section')).find((section) =>
      section.textContent?.toLowerCase().includes(lower)
    );
  };

  const rectOf = (element, label) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      selector: label,
      width: Math.round(rect.width),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      top: Math.round(rect.top),
    };
  };

  const featuresSection = sectionWithText('Aprenda as técnicas');
  const featuresGrid = featuresSection?.querySelector('.grid');
  const mentorsSection = document.querySelector('#mentores');
  const offenders = Array.from(document.querySelectorAll('body *'))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === 'string' ? element.className.slice(0, 120) : '',
        width: Math.round(rect.width),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        top: Math.round(rect.top),
      };
    })
    .filter((item) => item.width > 0 && (item.right > window.innerWidth + 2 || item.left < -2 || item.width > window.innerWidth + 2))
    .sort((a, b) => Math.abs(b.right - window.innerWidth) - Math.abs(a.right - window.innerWidth))
    .slice(0, 8);

  return {
    url: location.pathname,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    sections: [
      rectOf(featuresSection, 'features-section'),
      rectOf(featuresGrid, 'features-grid'),
      ...Array.from(featuresGrid?.children ?? []).map((item, index) => rectOf(item, 'feature-card-' + (index + 1))),
      rectOf(mentorsSection, 'mentors-section'),
      rectOf(mentorsSection?.firstElementChild, 'mentors-grid'),
      pick('header > div'),
    ].filter(Boolean),
    offenders,
  };
})()`;

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank',
], { stdio: 'ignore' });

try {
  const version = await getJson(`http://127.0.0.1:${port}/json/version`);
  const client = new CdpClient(version.webSocketDebuggerUrl);
  await client.open();

  const target = await client.send('Target.createTarget', { url: 'about:blank' });
  const attached = await client.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
  const sessionId = attached.sessionId;

  await client.send('Page.enable', {}, sessionId);
  await client.send('Runtime.enable', {}, sessionId);

  const results = [];

  for (const page of pages) {
    for (const viewport of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width < 768,
      }, sessionId);

      const loaded = client.once('Page.loadEventFired', (_params, eventSessionId) => eventSessionId === sessionId);
      await client.send('Page.navigate', { url: `${baseUrl}${page.path}` }, sessionId);
      await loaded;
      await sleep(500);

      const evaluated = await client.send('Runtime.evaluate', {
        expression: auditExpression,
        returnByValue: true,
        awaitPromise: true,
      }, sessionId);

      results.push({
        page: page.name,
        breakpoint: viewport.name,
        ...evaluated.result.value,
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  client.close();
} finally {
  chrome.kill();
  await removeTempDir(userDataDir);
}
