require('dotenv').config()

const mailjet = require('node-mailjet')
    .connect(process.env.API_KEY, process.env.API_SECRET_KEY)



const queryEmail = (name, email, message, number, currentTime, currentDate) => {
    const customerHTMLtemplate = `
    <h2>Hi Admin, <h2>
    <h3>The Below Query is from Customer (${name}) on ${currentDate} at ${currentTime}</h3>
    <h4>Query and customer details</h4>
    <hr />
    <div>
    <table style="font - family: arial, sans-serif;border-collapse: collapse;width: 100%;">
        <tr>
            <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Customer Name</th>
            <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Customer Email</th>
            <th style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">Customer Mobile</th>
        </tr>
        <tr>
            <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${name}</td>
            <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${email}</td>
            <td style=" border: 1px solid #dddddd;text-align: left;padding: 8px;">${number}</td>
        </tr>
    </table>
    <hr/>
    <br/>
    <div>
    Customer Query Message:
    <br/>
    <br/>
    <div>${message}</div>
    <br/>
    <br/>
    <br/>
    <hr/>
    Thanks and Regards<br/>from Admin team.
    </div>
    </div>
    `
    return new Promise((res, rej) => {
        const request = mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "itsmh0305@gmail.com",
                            "Name": "Ganesha Eco Store"
                        },
                        "To": [
                            {
                                "Email": `${process.env.ADMIN_EMAIL}`,
                                "Name": 'ADMIN'
                            }
                        ],
                        "Subject": `Hi Admin this is a query from ${name} on ${currentDate} at ${currentTime}`,
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

module.exports = queryEmail