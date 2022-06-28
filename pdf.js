const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)
async function getTemplateHtml() {
    console.log("Loading template file in memory")
    try {
        const invoicePath = path.resolve("./test.html");
        return await readFile(invoicePath, 'utf8');
    } catch (err) {
        return Promise.reject("Could not load html template");
    }
}
 function datasgg() {
    getTemplateHtml().then(async (res) => {
        return new Promise(async(resolve) => {
            let options = {
                format: 'A4',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            };
            let file = { content: res };
            const s = await generatePdf(file, options)
            console.log(s)
        })
    }).catch(err => {
        console.error(err)
    });
}


async function generatePdf(file, options, callback) {
    const inlineCss = require('inline-css')
    var Promise = require('bluebird');
    let args = [
        '--use-gl=egl',
    ];
    if (options.args) {
        args = options.args;
        delete options.args;
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: args
    });
    const page = await browser.newPage();

    if (file.content) {
        data = await inlineCss(file.content, { url: "/" });
        const template = hb.compile(data, { strict: true });
        const result = template(data);
        const html = result;
        await page.setContent(html, {
            waitUntil: 'networkidle0',
        });
    } else {
        await page.goto(file.url, {
            waitUntil: ['load', 'networkidle0'],
        });
    }

    return Promise.props(page.pdf(options))
        .then(async function (data) {
            await browser.close();
            return Buffer.from(Object.values(data));
        }).asCallback(callback);
}


datasgg()