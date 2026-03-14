const express = require("express");
const router = express.Router();

const sendPhishingEmail = require("../services/emailService");

router.post("/create", async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Email is required"
    });
  }

  try {

    const token = await sendPhishingEmail(email);

    res.json({
      success: true,
      message: "Phishing email sent",
      token: token
    });

  } catch (error) {

    console.error("Campaign error:", error);

    res.status(500).json({
      error: "Failed to send email"
    });

  }

});

module.exports = router;