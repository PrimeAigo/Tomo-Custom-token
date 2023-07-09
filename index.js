const express = require('express');
const Web3 = require('web3')
const web3 = new Web3('https://rpc.tomochain.com')

const abi = require('./rrr.json')

const app = express()

app.get('/', (req, res) => {
  const { privateKey, address } = web3.eth.accounts.create()
  res.json({ privateKey, address })
})

app.get('/sendkeraluda/:amount/:privateKey/:toAddress/:contractAddress', async (req, res) => {
const { amount, privateKey, toAddress, contractAddress } = req.params
const contractInstance = new web3.eth.Contract(abi, contractAddress)
const gasPrice = await web3.eth.getGasPrice()
const data = contractInstance.methods.transfer(toAddress, `${amount}000000000000000000`).encodeABI();
const tx = {
from: await web3.eth.accounts.privateKeyToAccount(privateKey).address,
to: contractAddress,
data,
gas: 216440,
gasPrice,
chainId: 88,
}

try {
const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey)
const sentTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
res.json({ from: tx.from, to: toAddress, amount, txHash: sentTx.transactionHash })
} catch (error) {
res.status(500).json({ error: error.message })
}
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
