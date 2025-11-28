const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Cats CRUD - Selenium (Lar Temporário)', function () {
  this.timeout(120000);
  let driver;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const screenshotsDir = path.join(__dirname, 'screenshots');
  const headless = process.env.SELENIUM_HEADLESS !== 'false';

  before(async () => {
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

    const options = new chrome.Options()
      .addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1200,900');
    if (headless) options.addArguments('--headless=new');
    try { options.set('goog:loggingPrefs', { browser: 'ALL' }); } catch (e) {}

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  // limpa sessão entre testes
  beforeEach(async () => {
    try {
      await driver.manage().deleteAllCookies();
      await driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
    } catch (e) {}
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  async function takeScreenshot(name) {
    try {
      const img = await driver.takeScreenshot();
      fs.writeFileSync(path.join(screenshotsDir, `${name}.png`), img, 'base64');
    } catch (e) {}
  }

  async function savePageSource(name) {
    try {
      const src = await driver.getPageSource();
      fs.writeFileSync(path.join(screenshotsDir, `${name}.html`), src, 'utf8');
    } catch (e) {}
  }

  async function saveBrowserLogs(name) {
    try {
      const logs = await driver.manage().logs().get('browser');
      const out = logs.map(l => `[${new Date(l.timestamp).toISOString()}] ${l.level.name}: ${l.message}`).join('\n');
      fs.writeFileSync(path.join(screenshotsDir, `${name}.log`), out, 'utf8');
    } catch (e) {}
  }

  async function loginIfNeeded() {
    const testEmail = process.env.TEST_EMAIL;
    const testPassword = process.env.TEST_PASSWORD;
    if (!testEmail || !testPassword) {
      throw new Error('Defina TEST_EMAIL e TEST_PASSWORD para executar estes testes.');
    }

    await driver.get(`${baseUrl}/login`);
    // se já autenticado, rota pode redirecionar; detectar e retornar
    try {
      await driver.wait(until.elementLocated(By.css('#email')), 3000);
    } catch (e) {
      // se não encontrou, pode estar logado; garantir loggout forçado
      // tentar forçar logout se houver botão/profile => navegar para /logout se existir
    }

    // preencher e submeter
    try {
      const emailEl = await driver.findElement(By.css('#email'));
      const passEl = await driver.findElement(By.css('#password'));
      await emailEl.clear(); await emailEl.sendKeys(testEmail);
      await passEl.clear(); await passEl.sendKeys(testPassword);
      const submit = await driver.findElement(By.css('button[type="submit"]'));
      await submit.click();
      await driver.wait(until.urlContains('/escalas'), 10000);
    } catch (err) {
      // se já autenticado, ok
    }
  }

  // utilitário para encontrar card por nome (retorna element ou null)
  async function findCardByName(name) {
    // tenta localizar elemento que contém o nome
    const xpath = `//*[contains(normalize-space(.),"${name}")]`;
    const els = await driver.findElements(By.xpath(xpath));
    if (els.length === 0) return null;
    // preferir elementos que sejam visíveis e não o header/footers
    for (const el of els) {
      const displayed = await el.isDisplayed().catch(() => false);
      if (displayed) return el;
    }
    return null;
  }

  it('cria um novo gato (cadastro)', async function () {
    await loginIfNeeded();

    const timestamp = Date.now();
    const catName = `TesteCat ${timestamp}`;
    const catBreed = 'SRD';
    const catAge = '1 ano';
    const catDesc = 'Gato de teste criado pelo Selenium';

    // função que tenta abrir várias rotas de criação até achar um formulário
    async function openCreatePageTryPaths() {
      const paths = [
        '/cats/new',
        '/cats/novo',
        '/gatos/novo',
        '/gatos/new',
        '/cats/create',
        '/cats/add',
        '/cats/novo/'
      ];
      const selectorsToDetect = ['input', 'textarea', 'form', 'button[type="submit"]'];

      for (const p of paths) {
        try {
          await driver.get(`${baseUrl}${p}`);
          // espera por body primeiro
          await driver.wait(until.elementLocated(By.css('body')), 3000);
          // verifica se algum seletor de formulário existe
          for (const sel of selectorsToDetect) {
            const els = await driver.findElements(By.css(sel));
            if (els.length) return; // encontrou elemento que indica o formulário
          }
        } catch (e) {
          // tenta próxima rota
        }
      }

      // se chegou aqui, nenhuma rota funcionou
      const stamp = `create-page-missing-${Date.now()}`;
      await takeScreenshot(stamp);
      await savePageSource(stamp);
      await saveBrowserLogs(stamp);
      throw new Error(`Não encontrou página de criação de gato em nenhuma rota testada (ver screenshots/html: ${stamp})`);
    }

    try {
      // tenta abrir a página de criação (várias rotas)
      await openCreatePageTryPaths();

      // estratégias robustas para localizar o campo de nome
      const nameSelectors = [
        '#name',
        'input[name="name"]',
        'input[placeholder*="Nome"]',
        'input[placeholder*="nome"]',
        "//label[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'nome')]/following::input[1]"
      ];

      let nameEl = null;
      for (const sel of nameSelectors) {
        try {
          if (sel.startsWith('//')) {
            const els = await driver.findElements(By.xpath(sel));
            if (els.length) { nameEl = els[0]; break; }
          } else {
            const els = await driver.findElements(By.css(sel));
            if (els.length) { nameEl = els[0]; break; }
          }
        } catch (e) {}
      }

      if (!nameEl) {
        const stamp = `create-field-missing-${Date.now()}`;
        await takeScreenshot(stamp);
        await savePageSource(stamp);
        await saveBrowserLogs(stamp);
        throw new Error('Campo de nome não encontrado na página de criação (ver screenshots/html)');
      }

      // preenche e submete (mesma lógica anterior)
      const breedElCandidates = await driver.findElements(By.css('#breed, input[name="breed"], input[placeholder*="Raça"], input[placeholder*="raça"]'));
      const ageElCandidates = await driver.findElements(By.css('#age, input[name="age"], input[placeholder*="ano"], input[placeholder*="idade"]'));
      const descElCandidates = await driver.findElements(By.css('#description, textarea[name="description"], textarea[placeholder*="descri"]'));

      await nameEl.clear(); await nameEl.sendKeys(catName);
      if (breedElCandidates.length) { await breedElCandidates[0].clear(); await breedElCandidates[0].sendKeys(catBreed); }
      if (ageElCandidates.length) { await ageElCandidates[0].clear(); await ageElCandidates[0].sendKeys(catAge); }
      if (descElCandidates.length) { await descElCandidates[0].clear(); await descElCandidates[0].sendKeys(catDesc); }

      // submeter
      let submit = null;
      try { submit = await driver.findElement(By.css('button[type="submit"]')); } catch (e) {}
      if (!submit) {
        const candidates = await driver.findElements(By.xpath("//button[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'salvar') or contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'adicionar') or contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'criar')]"));
        if (candidates.length) submit = candidates[0];
      }
      if (!submit) {
        const stamp = `create-submit-missing-${Date.now()}`;
        await takeScreenshot(stamp);
        await savePageSource(stamp);
        await saveBrowserLogs(stamp);
        throw new Error('Botão de submissão não encontrado na página de criação (ver screenshots/html)');
      }

      await submit.click();

      // aguarda redirecionamento/atualização da lista
      await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return url.includes('/cats') || url.includes('/gatos') || url.includes('/cats/');
      }, 15000);

      // garantir que o item apareça na lista
      await driver.get(`${baseUrl}/cats`);
      await driver.wait(until.elementLocated(By.css('body')), 2000);
      await driver.wait(async () => {
        const found = await findCardByName(catName);
        return !!found;
      }, 15000);

      this.createdCatName = catName;
    } catch (err) {
      const stamp = `create-fail-${Date.now()}`;
      await takeScreenshot(stamp);
      await savePageSource(stamp);
      await saveBrowserLogs(stamp);
      throw err;
    }
  });

  it('edita o gato criado', async function () {
    await loginIfNeeded();

    const originalName = this.createdCatName;
    if (!originalName) this.skip();

    const newName = `${originalName} EDIT`;

    try {
      await driver.get(`${baseUrl}/cats`);
      await driver.wait(until.elementLocated(By.css('body')), 2000);

      // localizar o card pelo nome
      const card = await (async () => {
        const xpath = `//*[contains(normalize-space(.),"${originalName}")]`;
        const els = await driver.findElements(By.xpath(xpath));
        for (const el of els) {
          if (await el.isDisplayed()) return el;
        }
        return null;
      })();
      if (!card) throw new Error('Card do gato criado não encontrado para edição');

      // tentar encontrar dentro do card um botão "Editar" ou ícone
      let editBtn;
      try {
        editBtn = await card.findElement(By.xpath(".//button[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'editar') or contains(translate(@aria-label,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'editar') or contains(@title,'Editar')]"));
      } catch (e) {
        // fallback buscar botão próximo ao texto
        const parent = await card.findElement(By.xpath("./ancestor::*[1]"));
        const candidates = await parent.findElements(By.xpath(".//button"));
        if (candidates.length) editBtn = candidates[0];
      }
      if (!editBtn) throw new Error('Botão de editar não encontrado no card');

      await editBtn.click();

      // aguardar o formulário de edição
      await driver.wait(until.elementLocated(By.css('input#name, input[name="name"], textarea[name="description"]')), 5000);

      // atualizar nome
      const nameEls = await driver.findElements(By.css('#name, input[name="name"], input[placeholder*="Nome"]'));
      if (!nameEls.length) throw new Error('Campo de nome no formulário de edição não encontrado');
      await nameEls[0].clear(); await nameEls[0].sendKeys(newName);

      // submeter
      let submit;
      try { submit = await driver.findElement(By.css('button[type="submit"]')); } catch (e) {
        const b = await driver.findElements(By.xpath("//button[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'salvar') or contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'atualizar')]"));
        submit = b[0];
      }
      if (!submit) throw new Error('Botão de submissão do formulário de edição não encontrado');
      await submit.click();

      // aguardar lista e novo nome aparecer
      await driver.get(`${baseUrl}/cats`);
      await driver.wait(async () => {
        const found = await findCardByName(newName);
        return !!found;
      }, 10000);

      this.editedCatName = newName;
    } catch (err) {
      const stamp = `edit-fail-${Date.now()}`;
      await takeScreenshot(stamp);
      await savePageSource(stamp);
      await saveBrowserLogs(stamp);
      throw err;
    }
  });

  it('remove o gato editado', async function () {
    await loginIfNeeded();

    const nameToRemove = this.editedCatName || this.createdCatName;
    if (!nameToRemove) this.skip();

    try {
      await driver.get(`${baseUrl}/cats`);
      await driver.wait(until.elementLocated(By.css('body')), 2000);

      // localizar o card pelo nome
      const card = await (async () => {
        const xpath = `//*[contains(normalize-space(.),"${nameToRemove}")]`;
        const els = await driver.findElements(By.xpath(xpath));
        for (const el of els) {
          if (await el.isDisplayed()) return el;
        }
        return null;
      })();
      if (!card) throw new Error('Card do gato a remover não encontrado');

      // tentar localizar botão remover/excluir dentro do contexto
      let delBtn;
      try {
        delBtn = await card.findElement(By.xpath(".//button[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'remover') or contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'excluir') or contains(translate(@aria-label,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'excluir') or contains(@title,'Excluir')]"));
      } catch (e) {
        // fallback: procurar botão com ícone perto do card
        const parent = await card.findElement(By.xpath("./ancestor::*[1]"));
        const candidates = await parent.findElements(By.xpath(".//button"));
        // escolher último botão (pode ser delete)
        if (candidates.length) delBtn = candidates[candidates.length - 1];
      }
      if (!delBtn) throw new Error('Botão de remoção não encontrado no card');

      await delBtn.click();

      // pode aparecer modal de confirmação — tentar clicar botão Confirmar/Sim/Remover
      try {
        const confirmXpath = "//button[contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'confirm') or contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'sim') or contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'remover') or contains(translate(.,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'excluir')]";
        await driver.wait(until.elementLocated(By.xpath(confirmXpath)), 5000);
        const confirmBtn = await driver.findElement(By.xpath(confirmXpath));
        await confirmBtn.click();
      } catch (e) {
        // sem modal, ok
      }

      // aguardar que o card não esteja mais presente
      await driver.wait(async () => {
        const found = await findCardByName(nameToRemove);
        return !found;
      }, 10000);
    } catch (err) {
      const stamp = `delete-fail-${Date.now()}`;
      await takeScreenshot(stamp);
      await savePageSource(stamp);
      await saveBrowserLogs(stamp);
      throw err;
    }
  });
});