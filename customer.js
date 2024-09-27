const { getFirestore, setDoc, doc, onSnapshot, collection, deleteDoc, query, where, getDoc } = require("firebase/firestore");
let express = require('express');
let router = express.Router();
const moment = require('moment');

const momenttz = require('moment-timezone');

// Get the current local time
const timezone = "Asia/Ho_Chi_Minh";
const targetTime = '02:00:00'; // 9 AM

const firestore = getFirestore();
let ticket = [];
let basket = [];
let mode = 1;
///////apply = 0: no discount even in special context (ignore mode)
/////// apply = 1: discount after 9 (using mode)
////////// apply = 2: discount optional (ignore mode)
//// after 9, put 0; before 9, put 1

const unsubTicket = onSnapshot(collection(firestore, "ticket_database"), (querySnapshot) => {
    ticket = [];
    querySnapshot.forEach((doc) => {
        ticket.push(doc.data());
    })
});

const unsubBasket = onSnapshot(collection(firestore, "basket_database"), (querySnapshot) => {
    basket = [];
    querySnapshot.forEach((doc) => {
        basket.push(doc.data());
    })
});

router.get("/ticket", (req, res) => {
    const currentDateTime = momenttz().tz(timezone);
    const isPastTargetTime = currentDateTime.isAfter(momenttz(targetTime, 'HH:mm:ss'));
    console.log(currentDateTime);
    if (isPastTargetTime) {
        console.log(`It is past ${targetTime} in UTC+7.`);
        mode = 0;
      } else {
        console.log(`It is not past ${targetTime} in UTC+7.`);
        mode = 1;
      }
    res.json({mode: mode, ticket: ticket});
})

router.post("/customer/basket", (req, res) => {
    let result = basket.filter((value, index) => {
        if(value.phone == req.body.searchkey || value.uid == req.body.searchkey || value.booking_code == req.body.phone) return true;
        return false;
    });
    res.json(result);
})

router.post("/customer/buy", (req, res) => {
    let id = "B" + moment().format('YYYYMMDDhhmmss') + "_" + Math.floor(Math.random() * 1000);
    let data = req.body;
    data.id = id;
    setDoc(doc(firestore, "basket_database", id), data).then((val) => {
        res.status(201).send("success");
    }).catch((err) => {
        console.log(err);
        res.status(400).send("bad request");
    });
})

router.get("/manager/basket", (req, res) => {
    res.json(basket);
})

router.post("/manager/basket/update", (req, res) => {
    setDoc(doc(firestore, "basket_database", req.body.id), req.body, {merge: true}).then((val) => {
        res.status(201).send("success");
    }).catch((err) => {
        console.log(err);
        res.status(400).send("bad request");
    });
})

router.post("/manager/ticket/add", (req, res) => {
    //let id = "T" + moment().format('YYYYMMDDhhmmss') + "_" + Math.floor(Math.random() * 1000);
    setDoc(doc(firestore, "ticket_database", req.body.ticket_id), req.body).then((val) => {
        res.status(201).send("success");
    }).catch((err) => {
        console.log(err);
        res.status(400).send("bad request");
    });
})

router.post("/manager/ticket/update", (req, res) => {///////////////// Check if it could read the id in the body or not
    setDoc(doc(firestore, "ticket_database", req.body.ticket_id), req.body, {merge: true}).then((val) => {
        res.status(201).send("success");
    }).catch((err) => {
        console.log(err);
        res.status(400).send("bad request");
    });
})

router.post("/manager/ticket/delete", (req, res) => {
    deleteDoc(doc(firestore, "ticket_database", req.body.ticket_id)).then((val) => {
        res.status(201).send("success");
    }).catch((err) => {
        console.log(err);
        res.status(400).send("bad request");
    });
})

module.exports = router;