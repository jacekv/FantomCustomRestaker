import { ethers } from 'ethers';
import dotenv from 'dotenv';

import { ABI } from './abi.js';

dotenv.config();

const SFCADDRESS = '0xfc00face00000000000000000000000000000000';

if (!process.env.STAKING_AMOUNT) {
    console.log('Staking amount is not set');
    process.exit(1);
}

if (!process.env.PRIVKEY) {
    console.log('Private key is not set');
    process.exit(1);
}

if (!process.env.VALIDATOR_ID) {
    console.log('Validator id is not set');
    process.exit(1);
}

const STAKING_AMOUNT = process.env.STAKING_AMOUNT;
const PRIVKEY = process.env.PRIVKEY;
const VALIDATOR_ID = process.env.VALIDATOR_ID;

let USER_ADDRESS = '';
console.log();
const provider = new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/');
const wallet = new ethers.Wallet(PRIVKEY, provider);

const sfcContract = new ethers.Contract(SFCADDRESS, ABI, wallet);

wallet.getAddress()
    .then((address) => {
        console.log(`Address of wallet is: ${address}`);
        USER_ADDRESS = address;
        return wallet.getBalance();
    })
    .then((balance) => {
        console.log(`Balance of wallet is: ${ethers.utils.formatEther(balance)} FTM`);
        return sfcContract.pendingRewards(USER_ADDRESS, VALIDATOR_ID);
    })
    .then((pendingRewards) => {
        console.log(`Pending rewards: ${ethers.utils.formatEther(pendingRewards)} FTM`);
        return Promise.all([
            sfcContract.getUnlockedStake(USER_ADDRESS, VALIDATOR_ID),
           sfcContract.getLockedStake(USER_ADDRESS, VALIDATOR_ID)
        ]);
    })
    .then((stake) => {
        console.log(`Currently unlocked staked: ${ethers.utils.formatEther(stake[0].add(stake[1]))} FTM`);
        console.log(`Staking ${STAKING_AMOUNT} FTM to ${VALIDATOR_ID}`);
        return sfcContract.delegate(VALIDATOR_ID, {value: ethers.utils.parseEther(STAKING_AMOUNT)});
    })
    .then((tx) => {
        console.log('Transaction send...');
        return tx.wait();
    })
    .then((receipt) => {
        console.log('Status:', receipt.status);
        return sfcContract.getUnlockedStake(USER_ADDRESS, VALIDATOR_ID);
    })
    .then((stake) => {
        console.log(`Currently staked: ${ethers.utils.formatEther(stake)} FTM`);
    });