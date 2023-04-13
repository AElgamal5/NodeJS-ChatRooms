const moment = require("moment");

function msgFormat(userName, text) {
  return {
    userName,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = msgFormat;
