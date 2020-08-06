function successHtml(homeURL, orderId, txnId, txnDate) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <script type="text/javascript">
            var seconds = 10
            window.onload = function() {            
                function timer(){
                    seconds -= 1
                    document.getElementById('seconds').textContent  = 'Redirecting to Seed Ganesha in ' + seconds + ' ' + 'seconds';
                    if(seconds === 0){1
                        window.location.href='${homeURL}'
                    }
                }
                setInterval(timer, 1000);
            }
            </script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script async src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

        <style>

            dl dt {
                margin-left: 0;
            }
        </style>
        <title>Document</title>
    </head>

    <body>
        <div id="Box">
            <div class="container">
                <div class="row">
                    <div class="col-sm-3"></div>
                    <div class="col-sm-6">
                        <h2 style="text-align: center; font-size: 20px;">Payment Sucess</h2>
                        <div class="alert alert-success">
                            <strong>Success!</strong>
                        </div>
                        <dl class="dl-horizontal">
                            <dt>Order-ID</dt>
                            <dd>${orderId}</dd>
                            <dt>Transaction-ID</dt>
                            <dd>${txnId}</dd>
                            <dt>Transaction-Date</dt>
                            <dd>${txnDate}</dd>
                        </dl>
                        <div class="alert alert-success">
                            <strong>Please find your inbox or spam for order details!</strong>
                        </div>
                        <div class="row">
                        <div class="col-sm-3">
                            <a href="http://localhost:8000">Click here for seed-ganesh.com</a>
                            </div>
                            <div id="seconds" class="col-sm-9">Redirecting to Seed Ganesha in 10 seconds</div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`
}



function errorHtml(homeURL) {
    return `<!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
     <script async src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
     <script async src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
     <script type="text/javascript">
     var seconds = 10
     window.onload = function() {            
         function timer(){
             seconds -= 1
             document.getElementById('seconds').textContent  = 'Redirecting to Seed Ganesha in ' + seconds + ' seconds';
             if(seconds === 0){
                 window.location.href='${homeURL}'
             }
         }
         setInterval(timer, 1000);
     }
     </script>
     <style>
 
         dl dt {
             margin-left: 0;
         }
     </style>
     <title>Document</title>
 </head>
 
 <body>
     <div id="Box">
         <div class="container">
             <div class="row">
                 <div class="col-sm-3"></div>
                 <div class="col-sm-6">
                     <h2 style="text-align: center; font-size: 20px;">Payment Error</h2>
                     <div class="alert alert-danger">
                         <strong>Payment Error! Please contact us if you have faced any deduction amount.</strong>
                     </div>
                     <div class="row">
                     <div class="col-sm-3">
                         <a href='${homeURL}'>Click here for seed-ganesh.com</a>
                         </div>
                         <div id="seconds" class="col-sm-9">Redirecting to Seed Ganesha in 10 seconds</div>
                         </div>
                 </div>
             </div>
         </div>
     </div>
 </body>
 </html>`
}

module.exports = {
    errorHtml,
    successHtml
}