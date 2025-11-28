const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Login - Selenium (Lar Temporário)', function () {
  this.timeout(60000);
  let driver;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const screenshotsDir = path.join(__dirname, 'screenshots');
  const headless = process.env.SELENIUM_HEADLESS !== 'false'; // set SELENIUM_HEADLESS=false to see browser

  before(async () => {
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

    const options = new chrome.Options()
      .addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1200,900');

    if (headless) {
      options.addArguments('--headless=new');
    }

    // try to get browser logs
    try {
      options.set('goog:loggingPrefs', { browser: 'ALL' });
    } catch (e) {}

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  // Limpa sessão entre testes para evitar redirecionamentos por usuário já autenticado
  beforeEach(async () => {
    try {
      await driver.manage().deleteAllCookies();
      // limpa storages do contexto da página
      await driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
    } catch (e) {
      // ignora se não houver página carregada ainda
    }
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  async function ensureDir() {
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  async function takeScreenshot(name) {
    await ensureDir();
    try {
      const img = await driver.takeScreenshot();
      fs.writeFileSync(path.join(screenshotsDir, `${name}.png`), img, 'base64');
    } catch (e) {
      // ignore screenshot failures
    }
  }

  async function saveBrowserLogs(name) {
    await ensureDir();
    try {
      const logs = await driver.manage().logs().get('browser');
      const out = logs.map(l => `[${new Date(l.timestamp).toISOString()}] ${l.level.name}: ${l.message}`).join('\n');
      fs.writeFileSync(path.join(screenshotsDir, `${name}.log`), out, 'utf8');
    } catch (e) {
      // ignore if not supported
    }
  }

  async function savePageSource(name) {
    await ensureDir();
    try {
      const src = await driver.getPageSource();
      fs.writeFileSync(path.join(screenshotsDir, `${name}.html`), src, 'utf8');
    } catch (e) {}
  }

  it('login válido redireciona para /escalas', async function () {
    const testEmail = process.env.TEST_EMAIL;
    const testPassword = process.env.TEST_PASSWORD;
    if (!testEmail || !testPassword) {
      this.skip();
    }

    await driver.get(`${baseUrl}/login`);
    await driver.wait(until.elementLocated(By.css('#email')), 10000);
    const emailEl = await driver.findElement(By.css('#email'));
    const passEl = await driver.findElement(By.css('#password'));

    await emailEl.clear();
    await emailEl.sendKeys(testEmail);
    await passEl.clear();
    await passEl.sendKeys(testPassword);

    const submit = await driver.findElement(By.css('button[type="submit"]'));
    await submit.click();

    await driver.wait(until.urlContains('/escalas'), 15000);
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/escalas'), `URL atual inesperada: ${url}`);
  });

  it('login inválido exibe erro na UI', async () => {
    await driver.get(`${baseUrl}/login`);
    await driver.wait(until.elementLocated(By.css('#email')), 10000);
    const emailEl = await driver.findElement(By.css('#email'));
    const passEl = await driver.findElement(By.css('#password'));

    await emailEl.clear();
    await emailEl.sendKeys('invalido@example.com');
    await passEl.clear();
    await passEl.sendKeys('senha-errada');

    const submit = await driver.findElement(By.css('button[type="submit"]'));
    await submit.click();

    // tenta localizar o alerta com várias estratégias
    try {
      const alertEl = await driver.wait(
        until.elementLocated(By.css('[role="alert"], .alert, .toast, [data-alert]')),
        8000
      );
      const txt = await alertEl.getText();
      assert.ok(txt && txt.trim().length > 0, 'Esperava mensagem de erro visível');
      return;
    } catch (e) {
      // fallback: busca por texto parcial visível na página (p.ex. "senha" ou "inválido")
    }

    try {
      // busca texto parcial via XPath (mais tolerante)
      const xpathCandidates = [
        "//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'senha')]",
        "//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'inválid')]",
        "//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'email')]"
      ];
      for (const xp of xpathCandidates) {
        const els = await driver.findElements(By.xpath(xp));
        if (els.length > 0) {
          const text = await els[0].getText();
          if (text && text.trim().length > 0) {
            return; // encontrou mensagem de erro textual
          }
        }
      }

      // se chegou aqui, falhou em localizar mensagem — captura artefatos e falha o teste
      const stamp = `fail-${Date.now()}`;
      await takeScreenshot(`login-invalid-${stamp}`);
      await savePageSource(`login-invalid-${stamp}`);
      await saveBrowserLogs(`login-invalid-${stamp}`);
      // também loga URL atual para ajudar diagnóstico
      const currentUrl = await driver.getCurrentUrl();
      console.error('URL atual durante falha:', currentUrl);
      throw new Error('Mensagem de erro não encontrada na UI (ver screenshots/logs em tests/selenium/screenshots)');
    } catch (err) {
      throw err;
    }
  });
});