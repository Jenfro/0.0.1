let mongoose = require("mongoose");

let UserSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ""
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

let Session = (module.exports = mongoose.model(
  "UserSession",
  UserSessionSchema
));

module.exports = Session;
