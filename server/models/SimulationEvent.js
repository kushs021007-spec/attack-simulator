const mongoose = require("mongoose");

const SimulationEventSchema = new mongoose.Schema({

  email: String,

  token: String,

  sentAt: {
    type: Date,
    default: Date.now
  },

  clicked: {
    type: Boolean,
    default: false
  },

  clickedAt: Date,

  credentialsEntered: {
    type: Boolean,
    default: false
  },

  ip: String

});

module.exports = mongoose.model("SimulationEvent", SimulationEventSchema);