## Problem

With Fantom it is possible to delegate your FTM coins to a validator.

If you are using fWallet, you have the option to claim the rewards or to claim and restake all pending rewards.

There is no option to claim and restake a fraction of the pending rewards or even add additional coins to 
your delegation.

## Solution

This script solves this problem currently. In the current state, it takes a user defined amount of FTM coins and
adds those to a delegation of a user defined validator id.


## How to use

All you have to do it to enter three values into a .env file. It should look like this:

```bash
STAKING_AMOUNT='1.0'
PRIVKEY='Hex without 0x'
VALIDATOR_ID=56
```