const express = require("express");
const router = express.Router();

const SimulationEvent = require("../models/SimulationEvent");

router.get("/stats", async (req, res) => {

try {

const totalEmails = await SimulationEvent.countDocuments();

const clicked = await SimulationEvent.countDocuments({
clicked: true
});

const credentials = await SimulationEvent.countDocuments({
credentialsEntered: true
});

const events = await SimulationEvent.find({
clicked: true
});

let totalResponseTime = 0;

events.forEach(event => {

if(event.clickedAt && event.sentAt){

const diff = event.clickedAt - event.sentAt;

totalResponseTime += diff;

}

});

const avgResponseTime =
events.length > 0
? totalResponseTime / events.length / 1000
: 0;

res.json({

totalEmails,
clicked,
credentials,
clickRate: totalEmails ? (clicked / totalEmails) * 100 : 0,
credentialRate: clicked ? (credentials / clicked) * 100 : 0,
averageResponseTimeSeconds: avgResponseTime

});

}

catch(err){

console.log(err);

res.status(500).json({
error:"Analytics failed"
});

}

});

module.exports = router;