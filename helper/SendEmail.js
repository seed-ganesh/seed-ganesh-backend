require('dotenv').config()
const mailjet = require('node-mailjet')
    .connect(process.env.API_KEY, process.env.API_SECRET_KEY)

const address = require('../templates/Address')

function sendCustEmailAlone(formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate, paymentMode, orderID) {
    return new Promise((res, rej) => {
        let orderSummaryInputValues = '';
        let forField = '';
        let emailID = formDetails.filter(formDetail => formDetail.type === 'email' && formDetail.value)[0]
        let name = formDetails.filter(formDetail => formDetail.formName === 'Name' && formDetail.value)[0]
        Object.keys(inputQuantityValue).map(orderProp => {
            orderSummaryInputValues += ` <tr>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderID}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderProp}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${inputQuantityValue[orderProp]}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${totalCartProducts[orderProp].price}</td></tr>`
        })

        formDetails.map(addressFields => {
            addressFields.value.length > 0 ?
                forField += `<div><p>${addressFields.value}</p></div > ` : null
        })

        const customerHTMLtemplate = `
    <h2>Hi ${name.value}, <h2>
    <p>Please find your order details below</p>
    <h4>Order summary</h4>
    <hr />
    <div> 
        <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">OrderID</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Size</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Quantity</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Price</th>
            </tr>
            ${orderSummaryInputValues}
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Total Price</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"> ${totalPrice}</td>
            </tr>
        </table>
        </div>
        <hr/>
        <div style="font-size: 16px;text-decoration: underline;text-align: center"><b>Address Details:</b></div>
        <hr/>
    <div>
        ${forField}
    </div>
    <hr/>
    <div>
    <h3>Thank you for purchasing with us, </h3>
    <div>
     <b>contact:</b>
     <br/>
     <br/>
     ${address}
    <hr/>
    <div>
        Happy ganesh chaturthi :).
    </div>
    </div>
    </div>
     `
        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": process.env.SENDER_EMAIL,
                            "Name": "seed-Ganesh"
                        },
                        "To": [
                            {
                                "Email": emailID.value,
                                "Name": name.value
                            }
                        ],
                        "Subject": `Hi ${name.value} Greetings from Seed Ganesha for your orderID ${orderID} on ${currentDate} at ${currentTime}`,
                        "HTMLPart": `${customerHTMLtemplate} `,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            })
        request
            .then((result) => {
                res(result)
            })
            .catch((err) => {
                rej(err)
            })
    })

}


function sendAdminEmailAlone(formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate, paymentMode, orderID) {
    return new Promise((res, rej) => {
        let orderSummaryInputValues = '';
        let forField = '';
        let emailID = formDetails.filter(formDetail => formDetail.type === 'email' && formDetail.value)[0]
        let name = formDetails.filter(formDetail => formDetail.formName === 'Name' && formDetail.value)[0]
        Object.keys(inputQuantityValue).map(orderProp => {
            orderSummaryInputValues += ` <tr>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderProp}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${inputQuantityValue[orderProp]}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${totalCartProducts[orderProp].price}</td></tr>`
        })

        formDetails.map(addressFields => {
            addressFields.value.length > 0 ?
                forField += `<div><span style="display: inline-block"><p>${addressFields.formName}: </p></span><span style="display: inline-block; word-wrap: break-word"><p><b>${addressFields.value}</b></p></span></div> ` : null
        })

        const customerHTMLtemplate = `
        <div>
    <h2>Hi Admin, <h2>
    <h3>Please find the Customer (${name.value}) order details below</h3>
    <h4>Order summary</h4>
    <hr />
    <div> 
        <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Order ID</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Customer Name</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Ordered Date</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Ordered Time</th>
            </tr>
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderID}</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${name.value}</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${currentDate}</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${currentTime} </td>
            </tr>
            <br/>
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Size</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Quantity</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Price</th>
            </tr>
            ${orderSummaryInputValues}
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Total Price</td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"> ${totalPrice}</td>
            </tr>
        </table>
        <hr/>
    <div style="margin-left: 10px">
        <h4>Address Details:</h4>
        <hr />
        ${forField}
    </div> 
    <br/>
    <hr/>
    <div style="margin-left: 10px">
    <h4>Thanks and Regards<br/><br/>from Admin team.</h4>
    </div>
    </div>
    </div>
    `
        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": process.env.SENDER_EMAIL,
                            "Name": "seed-Ganesh"
                        },
                        "To": [
                            {
                                "Email": `${process.env.ADMIN_EMAIL}`,
                                "Name": 'ADMIN'
                            }
                        ],
                        "Subject": `Hi Admin this is the order from ${name.value} on ${currentDate} at ${currentTime}`,
                        "HTMLPart": `${customerHTMLtemplate} `,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            })
        request
            .then((result) => {
                res(result)
            })
            .catch((err) => {
                rej(err)
            })
    })
}
module.exports = {
    sendCustEmailAlone,
    sendAdminEmailAlone
}