var express = require('express');
var router = express.Router();
const { check } = require('express-validator/check');

const MissyCoin = require('../middleware/MissyCoin');

const responseMiddleware = (req, res, next) => {
  return res.json(req.responseValue);
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'MissyCoin' });
});

router.post('/transactions/new', [
  check('sender', 'Sender must be a String').exists(),
  check('recipient', 'recipient must be a String').exists(),
  check('amount', 'Sender must be an Int Value').isInt().exists()
], MissyCoin.newTransaction, responseMiddleware)

router.get('/mine', MissyCoin.mine, responseMiddleware)

router.get('/chain', MissyCoin.getChain, responseMiddleware)

module.exports = router;
