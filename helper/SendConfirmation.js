require('dotenv').config()

const mailjet = require('node-mailjet')
    .connect(process.env.API_KEY, process.env.API_SECRET_KEY)


const sendCustEmail = (formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate, paymentMode, orderID) => {
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
        <h4>Payment summary</h4>
        <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>Payment Mode</b></td>
            <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>${paymentMode}</b></td>
        </table>
        <hr/>
        <div style="font-size: 16px;text-decoration: underline;text-align: center"><b>Address Details:</b></div>
        <hr/>
    <div>
        ${forField}
    </div>
    <hr/>
    <div>
    <h3>Thank you for purchasing with Ganesha Seed, </h3>
    <br/>
    Please contact us for any query regarding your orders.
    <hr/>
    <div>
     Thanks and Regards <br/>
     xxx<br/>yyyy<br/>zzzz<br/>99999999999
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


module.exports = sendCustEmail