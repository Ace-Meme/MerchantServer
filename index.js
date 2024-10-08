const express = require("express");
const app = express();
//==================================================
const { initializeApp } = require('firebase/app');
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY9xbzGkS5eojokY-_cyJpyJpQtabrD7c",
  authDomain: "superchat-92a58.firebaseapp.com",
  projectId: "superchat-92a58",
  storageBucket: "superchat-92a58.appspot.com",
  messagingSenderId: "777835468914",
  appId: "1:777835468914:web:bf18e1b12fa5585a300aeb",
  measurementId: "G-QVNFTYEHKF"
};

// Initialize Firebase
const firestore = getFirestore(initializeApp(firebaseConfig));
//=================
const bodyParser = require('body-parser');

const port = process.env.PORT || 3001;
const path = require('path');
let cors = require('cors');

const order = require('./vn_pay');
const customer = require('./customer');

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/order', order);
app.use('/app', customer);
////=====================================================================
function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

app.get('/IPN', function (req, res, next) {
  var vnp_Params = req.query;
  var secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  let config = require('config');
  vnp_Params = sortObject(vnp_Params);
  var secretKey = config.get('vnp_HashSecret');
  var querystring = require('qs');
  var signData = querystring.stringify(vnp_Params, { encode: false });
  var crypto = require("crypto");     
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     
  console.log("IPN");

  if(secureHash === signed){
      var orderId = vnp_Params['vnp_TxnRef'];
      var rspCode = vnp_Params['vnp_ResponseCode'];
      console.log("IPN right");
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      res.status(200).json({RspCode: '00', Message: 'success'})
      
  }
  else {
      res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
  }
});

///=======================================================================================================

app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>`
