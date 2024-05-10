const asynchandler = require('express-async-handler');

const check = asynchandler(async (req, res) => {
  res.status(200).json({ message: 'successfully' });
})


module.exports = {
    check
};
