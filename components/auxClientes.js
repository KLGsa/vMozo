const dotenv = require("dotenv");
dotenv.config();

const isOwner = (from) => {
    const owner = process.env.OWNER_PHONE
    let flag
    owner === from ? flag = true : flag = false
    return flag
  }

module.exports = {isOwner}