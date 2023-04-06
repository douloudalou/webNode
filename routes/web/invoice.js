const puppeteer = require('puppeteer');
const {writeFile} = require('fs')

function wf(content) {
    let date = new Date();

    now  = (new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Singapore' }).format(date));

    writeFile(`NodeConsole.txt`, `{${now}} ${content}\n`, { flag: 'a+' }, err => {
        if (err) throw `err: ${err}`
    })
}

async function savePageAsPDF(html, path) {
  const browser = await puppeteer.launch();
  const pdfPage = await browser.newPage();
  await pdfPage.setContent(html);
  await pdfPage.pdf({ path: path, format: 'A4' });
  await browser.close();
  wf(`done generating invoice`)
}

module.exports = { savePageAsPDF };