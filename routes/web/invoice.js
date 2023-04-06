const puppeteer = require('puppeteer');

async function savePageAsPDF(html, path) {
  const browser = await puppeteer.launch();
  const pdfPage = await browser.newPage();
  await pdfPage.setContent(html);
  await pdfPage.pdf({ path: path, format: 'A4' });
  await browser.close();
}

module.exports = { savePageAsPDF };