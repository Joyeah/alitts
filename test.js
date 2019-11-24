const puppeteer = require('puppeteer-core');
const config = require('config');

let  executablePath= "I:/_JRH/project/.local-chromium/win64-609904/chrome-win/chrome.exe" ;
(async () => {
  const browser = await puppeteer.launch({executablePath: executablePath, headless:false});
  const page = await browser.newPage();
  console.log('page open');
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();