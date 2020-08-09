require('dotenv').config()

const mailjet = require('node-mailjet')
    .connect(process.env.API_KEY, process.env.API_SECRET_KEY)


function custEmail(customerDetail, productBooked, totalPrice, currentTime, currentDate, paymentMode, orderID, transID, transTime) {
    return new Promise((res, rej) => {
        const adminNumber = 9176636367
        let orderSummaryInputValues = '';
        let forField = `<div>
                            <p>${customerDetail.Name}</p>
                            <p>${customerDetail.Email}</p>
                            <p>${customerDetail.Mobile_Number}</p>
                            <p>${customerDetail.Address}</p>
                            <p>${customerDetail.City}</p>
                            <p>${customerDetail.State}</p>
                            <p>${customerDetail.Pincode}</p>
                        </div >`;
        let emailID = customerDetail.Email
        let name = customerDetail.Name
        Object.keys(productBooked).map(orderProp => {
            orderSummaryInputValues += ` <tr>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderID}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderProp}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${productBooked[orderProp].quantity}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${productBooked[orderProp].price}</td></tr>`
        })

        const customerHTMLtemplate = `
    <h2>Hi ${name}, <h2>
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
        <h4>Payment Details</h4>
        <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">TransactionID</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">TransactionDate</th>
            </tr>
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>${transID}</b></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>${transTime}</b></td>
            </tr>
        </table>
        <hr/>
        <div style="font-size: 16px;text-decoration: underline;text-align: center"><b>Address Details:</b></div>
        <hr/>
    <div>
        ${forField}
    </div>
    <hr/>
    <div>
    <h3>Thank you for purchasing with us, </h3>
    <hr/>
    <div>
     Thanks and Regards <br/>
     For any queries contact:
     ${adminNumber}
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
                                "Email": emailID,
                                "Name": name
                            }
                        ],
                        "Subject": `Hi ${name} Greetings from Seed Ganesha for your orderID ${orderID} on ${currentDate} at ${currentTime}`,
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


function adminEmail(customerDetail, productBooked, totalPrice, currentTime, currentDate, paymentMode, orderID, transID, transTime) {
    return new Promise((res, rej) => {
        let orderSummaryInputValues = '';
        let forField = `<div>
                            <span style="display: inline-block">
                                <p><b>Name</b></p>
                            </span>
                            <span style="display: inline-block; word-wrap: break-word">
                                <p>${customerDetail.Name}</p>
                            </span>
                            <br/>
                            <span style="display: inline-block">
                            <p><b>Email</b></p>
                            </span>
                            <span style="display: inline-block; word-wrap: break-word">
                            <p>${customerDetail.Email}</p>
                            </span>
                            <br/>
                            <span style="display: inline-block">
                            <p><b>Mobile_Number</b></p>
                            </span>
                            <span style="display: inline-block; word-wrap: break-word">
                            <p>${customerDetail.Mobile_Number}</p>
                            </span>
                            <br/>
                            <span style="display: inline-block">
                            <p><b>Address</b></p>
                            </span>
                            <span style="display: inline-block; word-wrap: break-word">
                            <p>${customerDetail.Address}</p>
                            </span>
                            <br/>
                            <span style="display: inline-block">
                            <p><b>City</b></p>
                            </span>
                            <span style="display: inline-block; word-wrap: break-word">
                            <p>${customerDetail.City}</p>
                            </span>
                            <br/>
                            <span style="display: inline-block">
                            <p><b>State</b></p>
                            </span>
                            <span style="display: inline-block; word-wrap: break-word">
                            <p>${customerDetail.State}</p>
                            </span>
                            <br/>
                            <span style="display: inline-block">
                            <p><b>Pincode</b></p>
                            </span>
                            <span style="display: inline-block; word-wrap: break-word">
                            <p>${customerDetail.Pincode}</p>
                            </span>
                            <br/>
                        </div >`;
        let emailID = customerDetail.Email
        let name = customerDetail.Name
        Object.keys(productBooked).map(orderProp => {
            orderSummaryInputValues += ` <tr>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${orderProp}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${productBooked[orderProp].quantity}</td>
                    <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${productBooked[orderProp].price}</td></tr>`
        })

        const customerHTMLtemplate = `
    <h2>Hi Admin, <h2>
    <h3>Please find the Customer (${name}) order details below</h3>
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
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${name}</td>
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
            <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>Payment Mode</b></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>${paymentMode}</b></td>
            </table>
            <hr/>
            <h4>Payment Details</h4>
            <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
            <tr>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">TransactionID</th>
                <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">TransactionDate</th>
            </tr>
            <tr>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>${transID}</b></td>
                <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;"><b>${transTime}</b></td>
            </tr>
        </table>
            <hr/>
    <div style="float: left; margin-left: 10px">
        <h4 style="text-decoration: underline;text-align: center">Address Details:</h4><hr />
        ${forField}
    </div> 
    <div>
    <br/>
    <br/>
    <br/>
    <hr/>
    </div>
    <div style="margin-left: 10px">
    Thanks and Regards<br/>from Admin team.
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
                        "Subject": `Hi Admin this is the order from ${name} on ${currentDate} at ${currentTime}`,
                        "HTMLPart": `${customerHTMLtemplate} `,
                        "CustomID": "AppGettingStartedTest"
                    }
                ]
            })
        request
            .then((result) => {
                console.log(result,'=====')
                res(result)
            })
            .catch((err) => {
                console.log(err,'=====')
                rej(err)
            })
    })
}
module.exports = {
    custEmail,
    adminEmail
}