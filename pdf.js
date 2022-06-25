const fs = require('fs')
const path = require('path')
const utils = require('util')
const html_to_pdf = require('html-pdf-node');
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
async function generatePdf() {
    getTemplateHtml().then(async (res) => {
        var options = {
            format: 'A4',
            "border": "10px",
            "type": "pdf",
            margin: {
                'left': 90,
                'top': 20,
                'bottom': 20
            }
        }

        let file = { content: res };
        return new Promise((resolve) => {
            html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
                const string = pdfBuffer.toString('base64');
                resolve(string)
                console.log(string)
                console.log("PDF Generated")

            })
        })
    }).catch(err => {
        console.error(err)
    });
}
generatePdf();
