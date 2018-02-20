class Blockchain {
  constructor() {
    this.chain = [];
    this.currentTransactions = [];

    this.newBlock = this.newBlock.bind(this);
    this.newTransaction = this.newTransaction.bind(this);
    this.lastBlock = this.lastBlock.bind(this);
    this.proofOfWork = this.proofOfWork.bind(this);
  }

  newBlock(proof, previousHash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: new Date(),
      transactions: this.currentTransactions,
      proof,
      previousHash,
    }

    this.currentTransactions = [];
    this.chain.push(block);
    return block;
  }

  newTransaction(sender, recipient, amount) {
    const lastBlock = this.lastBlock();

    this.currentTransactions.push({
      sender,
      recipient,
      amount,
    });

    return lastBlock.index + 1;
  }

  hash(block) {
    const blockString = JSON.stringify(block);
    const hash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
      .update(blockString)
      .digest('hex');

    return hash;
  }

  lastBlock() {
    return this.chain.slice(-1)[0];
  }

  validProof(lastProof, proof) {
    const guessHash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
      .update(`${lastProof}${proof}`)
      .digest('hex');

    return guessHash.subString(0, 5) === process.env.RESOLUTION_HASH
  }

  proofOfWork(lastProof) {
    let proof = 0;

    while (true) {
      if (!this.validProof(lastProof, proof)) {
        proof++;
      } else {
        break;
      }
    }

    return proof;
  }
}

module.exports = Blockchain;
