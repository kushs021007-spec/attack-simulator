const API = "http://localhost:5000"

/* SEND PHISHING EMAIL */

async function sendCampaign(){

const email = document.getElementById("email").value
const status = document.getElementById("status")

if(!email){

status.innerText="Enter an email"
return

}

try{

const res = await fetch(`${API}/api/campaigns/create`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email})

})

const data = await res.json()

if(data.success){

status.innerText="Phishing email sent successfully"
loadStats()

}else{

status.innerText="Email sending failed"

}

}catch(err){

console.error(err)
status.innerText="Server error"

}

}


/* LOAD ANALYTICS */

async function loadStats(){

try{

const res = await fetch(`${API}/api/analytics/stats`)

const data = await res.json()

document.getElementById("totalEmails").innerText = data.totalEmails
document.getElementById("clicked").innerText = data.clicked
document.getElementById("credentials").innerText = data.credentials
document.getElementById("clickRate").innerText = data.clickRate.toFixed(2)
document.getElementById("credentialRate").innerText = data.credentialRate.toFixed(2)
document.getElementById("responseTime").innerText = data.averageResponseTimeSeconds.toFixed(2)

}catch(err){

console.log(err)

}

}


/* LOAD STATS WHEN PAGE OPENS */

loadStats()