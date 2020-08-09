const express = require('express')
const path = require('path')
const bodyParser = require("body-parser");
const https = require('https');
const firebase = require('firebase')
const sendCustEmail = require('./helper/SendConfirmation');
const sendAdminEmail = require('./helper/SendConfirmationSeller');
const queryEmail = require('./helper/QueryEmail');
const checksum_lib = require('./Paytm/checksum')
const PaytmChecksum = require('./Paytm/PaytmChecksum');
const initialisation = require('./helper/FireBaseInit')
const { setData, updateData } = require('./helper/Firebase.service')
const { v4: uuidv4 } = require('uuid');
const { successHtml, errorHtml } = require('./templates');
const { custEmail, adminEmail } = require('./helper/SendConfirmationCashLess');
require('dotenv').config()
initialisation()

const port = process.env.PORT || 3000
const app = express();

app.use((req, res, next) => {
    // var allowedOrigins = ['https://seed-ganesh.netlify.app'];
    // var origin = req.headers.origin;
    // if (allowedOrigins.indexOf(origin) > -1) {
    // }
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", 'GET', 'POST');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to home route')
})
app.post('/send-email', (req, res) => {
    const { formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate, paymentMode, orderID } = req.body
    sendCustEmail(formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate, paymentMode, orderID).then(data => {
        if (data.body.Messages[0].Status === 'success') {
            return
        }
        res.send({
            status: 400,
            error: 'server Error'
        })
    })
        .then(() => sendAdminEmail(formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate, paymentMode, orderID))
        .then(data => {
            const custDetails = {}
            const variantName = Object.keys(totalCartProducts).map(prop => prop)
            const productSummary = { ...totalCartProducts }
            formDetails.forEach(formData => {
                custDetails[formData.formName] = formData.value
            })
            variantName.forEach(variant => {
                productSummary[variant].quantity = inputQuantityValue[variant]
            })
            const payload = {
                _ID: uuidv4(),
                orderID,
                customerDetail: { ...custDetails },
                productBooked: { ...productSummary },
                totalPrice,
                paymentMode: 'Paytm/UPI',
                bookedOn: currentDate,
                bookedAt: currentTime,
            }
            setData(payload, 'orders', orderID)
            res.send({
                status: 201,
                data: data.body
            })
        }).catch(err => {
            res.send({
                status: 404,
                data: err
            })
        })
})

app.post('/paynow', (req, res) => {
    const { formDetails, totalCartProducts, inputQuantityValue, totalPrice, currentTime, currentDate, paymentMode, orderID } = req.body
    var paymentDetails = {
        amount: req.body.amount,
        customerId: req.body.customerId,
        orderId: req.body.orderID,
        customerEmail: req.body.email,
        customerPhone: req.body.phone
    }
    if (!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
        res.status(400).send('Payment failed')
    } else {
        var paytmParams = {};
        var resParams = {};
        resParams['MID'] = process.env.MID;
        resParams['WEBSITE'] = process.env.PAY_WEBSITE;
        resParams['CHANNEL_ID'] = 'WEB';
        resParams['INDUSTRY_TYPE_ID'] = 'Retail';
        resParams['ORDER_ID'] = paymentDetails.orderId;
        resParams['CUST_ID'] = paymentDetails.customerId;
        resParams['TXN_AMOUNT'] = paymentDetails.amount;
        resParams['CALLBACK_URL'] = `${process.env.CALLBACK_URL}/callback`;
        resParams['EMAIL'] = paymentDetails.customerEmail;
        resParams['MOBILE_NO'] = paymentDetails.customerPhone;
        paytmParams.body = {
            "requestType": "Payment",
            "mid": process.env.MID,
            "websiteName": process.env.PAY_WEBSITE,
            "orderId": paymentDetails.orderId,
            "callbackUrl": `${process.env.CALLBACK_URL}/callback`,
            "txnAmount": {
                "value": paymentDetails.amount,
                "currency": "INR",
            },
            "userInfo": {
                "custId": paymentDetails.customerId,
            },
        };
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAY_KEY).then(function (checksum) {

            paytmParams.head = {
                "signature": checksum
            };

            var post_data = JSON.stringify(paytmParams);

            var options = {
                /* for Staging */
                hostname: process.env.PAYMENT_API_PAYTM,
                /* for Production */
                // hostname: 'securegw.paytm.in',
                port: 443,
                path: `/theia/api/v1/initiateTransaction?mid=${process.env.MID}&orderId=${paymentDetails.orderId}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function () {
                    const custDetails = {}
                    const variantName = Object.keys(totalCartProducts).map(prop => prop)
                    const productSummary = { ...totalCartProducts }
                    formDetails.forEach(formData => {
                        custDetails[formData.formName] = formData.value
                    })
                    variantName.forEach(variant => {
                        productSummary[variant].quantity = inputQuantityValue[variant]
                    })
                    const payload = {
                        _ID: uuidv4(),
                        orderID,
                        customerDetail: { ...custDetails },
                        productBooked: { ...productSummary },
                        totalPrice,
                        paymentMode: 'Paytm/UPI',
                        paid: false,
                        bookedOn: currentDate,
                        bookedAt: currentTime,
                    }
                    setData(payload, 'orders', orderID)
                    res.status(200).send({ mid: resParams.MID, orderId: resParams.ORDER_ID, txnToken: JSON.parse(response).body.txnToken })
                });
            });

            post_req.write(post_data);
            post_req.end();
        });
    }
})

app.post('/callback', (req, res) => {
    let paytmCheckSum = '';
    const reqBody = req.body;

    const paytmParamsShallow = {};
    for (const key in reqBody) {
        if (key === "CHECKSUMHASH") {
            paytmCheckSum = reqBody[key]
        } else {
            paytmParamsShallow[key] = reqBody[key]
        }
    }

    const isValidCheckSum = checksum_lib.verifychecksum(paytmParamsShallow, process.env.PAY_KEY, paytmCheckSum)
    if (isValidCheckSum) {
        console.log('checksum matched')
        var paytmParams = {};
        paytmParams.body = {
            "mid": paytmParamsShallow["MID"],
            "orderId": paytmParamsShallow['ORDERID'],
        };
        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAY_KEY).then(function (checksum) {
            paytmParams.head = {
                "signature": checksum
            };
            var post_data = JSON.stringify(paytmParams);

            var options = {
                hostname: process.env.PAYMENT_API_PAYTM,
                port: 443,
                path: '/v3/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };
            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function () {
                    const HOME_URL = process.env.HOME_URL
                    const resp = JSON.parse(response)
                    if (resp.body && resp.body.resultInfo && resp.body.resultInfo.resultStatus === 'TXN_SUCCESS') {
                        let dbData
                        let customerDetail
                        let totalPrice
                        let productBooked
                        let currentDate
                        let currentTime
                        firebase.database().ref('orders').child(reqBody['ORDERID']).on('value', data => {
                            dbData = data.val()
                            customerDetail = { ...data.val().customerDetail }
                            totalPrice = data.val().totalPrice
                            currentDate = data.val().bookedAt
                            currentTime = data.val().bookedOn
                            productBooked = { ...data.val().productBooked }
                            updateData({
                                ...dbData,
                                transactionID: resp.body.txnId,
                                transactionDate: resp.body.txnDate,
                                transactionAmount: resp.body.txnAmount,
                                paid: true,
                                bankTransactionId: resp.body.bankTxnId
                            }, 'orders', reqBody['ORDERID'])
                            custEmail(customerDetail, productBooked, totalPrice, currentTime, currentDate, 'Card/NetBanking/UPI', reqBody['ORDERID'], resp.body.txnId, resp.body.txnDate).then(data => {
                                if (data.body.Messages[0].Status === 'success') {
                                    return
                                }
                            })
                                .then(() => adminEmail(customerDetail, productBooked, totalPrice, currentTime, currentDate, 'Card/NetBanking/UPI', reqBody['ORDERID'], resp.body.txnId, resp.body.txnDate))
                                .then(data => {
                                    res.status(200).send(successHtml(HOME_URL, resp.body.orderId, resp.body.txnId, resp.body.txnDate))
                                    return
                                })
                                .catch(() => {
                                    return
                                })
                        })
                    } else {
                        res.status(200).send(errorHtml(HOME_URL))
                    }
                });
            });
            post_req.write(post_data);
            post_req.end();
        });
    } else {
        console.log("checksum doesn't matched")
        res.status(400).send({
            message: 'Payment Error'
        })
    }
})

app.post('/query-message', (req, res) => {
    const { email, name, message, number, currentTime, currentDate } = req.body
    queryEmail(name, email, message, number, currentTime, currentDate).then(data => {
        if (data.body.Messages[0].Status === 'success') {
            return data
        }
        res.send({
            status: 400,
            error: 'server Error'
        })
    })
        .then(data => {
            res.send({
                status: 201,
                data: data.body
            })
        }).catch(err => {
            console.log(err, '=====')
            res.send({
                status: 404,
                data: err
            })
        })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
