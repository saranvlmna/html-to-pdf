const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const { resolve } = require('path')
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
 function generatePdf() {
    let data = {};
    getTemplateHtml().then(async (res) => {
        return new Promise(async(resolve) => {
            console.log("Compiing the template with handlebars")
            const template = hb.compile(res, { strict: true });
            const result = template(data);
            const html = result;
            const browser = await puppeteer.launch(
                {
                    executablePath: '/usr/bin/chromium-browser'
                }
            );
            const page = await browser.newPage()
            await page.setContent(html)
            await page.pdf({
                margin: {
                    format: 'A4',
                    'left': 90,
                    'top': 30,
                    'bottom': 30
                }
    
            }).then((res) => {
                const string = res.toString('base64');
                resolve(string)
                console.log(string)
            })
            await browser.close();
            
        })
    }).catch(err => {
        console.error(err)
    });
}




generatePdf();