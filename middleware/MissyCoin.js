const Blockchain = require('./blockchain');
const { validationResult } = require('express-validator/check');

class MissyCoin {
  constructor() {
    this.blockchain = new Blockchain();
    this.getChain = this.getChain.bind(this);
    this.mine = this.mine.bind(this);
    this.newTransaction = this.newTransaction.bind(this);
  }

  getChain(req, res, next) {
    req.responseValue = {
      message: 'Get chain',
      chain: this.blockchain.chain,
    }

    return next();
  }

  mine(req, res, next) {
    const lastBlock = this.blockchain.lastBlock();
    const lastProof = lastBlock.proof;
    const proof = this.blockchain.proofOfWork(lastProof);

    // create a new transaction from 0 (this node) to our node (NODE_NAME) of one MissyCoin
    this.blockchain.newTransaction('0', process.env.NODE_NAME, 1);

    // forge new block by adding it to the chain
    const previousHash = this.blockchain.hash(lastProof);
    const newBlock = this.blockchain.newBlock(proof, previousHash);
    const responseValue = Object.assign({ message: 'New block mined' }, newBlock);

    req.responseValue = responseValue;

    return next();
  }

  newTransaction(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    const trx = req.body;
    const index = this.blockchain.newTransaction(
      trx.sender,
      trx.recipient,
      trx.amount
    );
    const responseValue = {
      message: `Transaction will be added to block ${index}`
    };

    req.responseValue = responseValue;

    return next();
  }
}

module.exports = new MissyCoin();
