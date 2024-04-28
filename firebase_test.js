// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getFirestore, setDoc, doc } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let datum = new URLSearchParams({
    amount: 290000,
    orderDescription: 'Mua ve',
    orderType: 'other',
    orderId: '12345'
});
fetch('https://merchantserver.onrender.com/order/create_payment_url', {
    method: 'POST',
    redirect: 'follow',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: datum
}).then((val) => {
    console.log("hoho");
}).catch(console.error);

