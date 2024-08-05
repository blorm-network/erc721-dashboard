// src/nftContract.js

import Web3 from 'web3';
import ABI from './Blop9.json';

const CONTRACT_ADDRESS = "0x4982ac90C1cA9044633448B9b347B506F4ebb55a";

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contract = new web3.eth.Contract(ABI.abi, CONTRACT_ADDRESS);

export const getMintedTokens = async () => {
  return await contract.methods.totalSupply().call();
};

export const getMintFee = async () => {
  return await contract.methods.fee().call();
};

export const getTokenDetails = async (tokenId) => {
  return await contract.methods.tokenURI(tokenId).call();
};

export const getTransactionHistory = async (account) => {
  const events = await contract.getPastEvents('Transfer', {
    filter: { from: account },
    fromBlock: 0,
    toBlock: 'latest',
  });
  return events;
};
