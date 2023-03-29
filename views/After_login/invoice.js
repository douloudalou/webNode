var easyinvoice = require('easyinvoice');
let fs = require('fs')
let details = require('../../routes/web/home.js')
var data = {
//"documentTitle": "RECEIPT", //Defaults to INVOICE
"currency": "SGD",
"taxNotation": "gst", //or gst
"marginTop": 25,
"marginRight": 25,
"marginLeft": 25,
"marginBottom": 25,
"logoExtension": "../../webNode/views/small lbsx.png", //or base64
//"logoExtension": "png", //only when logo is base64
"sender": {
    "company": "SwimPerceptors",
    "country": "Singapore"
},
"client": {
    "Parent": `${details.rents_name}`,
    "Perceptees": `${details.ceptees_name}`,
    "Address": `${details.address}`
},
"invoiceNumber": "2020.0001",
"invoiceDate": "05-01-2020",
"products": [
    {
        "quantity": "4",
        "description": "Lessons completed",
        "price": 50
    }
],
"bottomNotice": "Kindly pay your invoice within 15 days."
};
easyinvoice.createInvoice(data, async function (result) {
    //The response will contain a base64 encoded PDF file
    await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
});