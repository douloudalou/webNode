const puppeteer = require('puppeteer');
const {writeFile} = require('fs')

function wf(content) {
    let date = new Date();

    now  = (new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Singapore' }).format(date));

    writeFile(`NodeConsole.txt`, `{${now}} ${content}\n`, { flag: 'a+' }, err => {
        if (err) throw `err: ${err}`
    })
}

function savePageAsPDF(html, path) {
  const browser = puppeteer.launch();
  const pdfPage = browser.newPage();
  pdfPage.setContent(html);
  pdfPage.pdf({ path: path, format: 'A4' });
  browser.close();
  wf(`done generating invoice`)
}

module.exports = { savePageAsPDF };