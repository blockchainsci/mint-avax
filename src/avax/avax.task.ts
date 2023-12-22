import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { AVAX_MAX_FEE, AVAX_RPCURL, AVAX_TEST, AVAX_TOKEN_JSON, GAS_RATE } from 'src/constant';
import { getPrivateKeys } from 'src/libs/utils';

const BIG_ZERO = new BigNumber(0);

// 转成16进制
function convertToHexa(str: string = '') {
    const res = [];
    const { length: len } = str;
    for (let n = 0, l = len; n < l; n++) {
        const hex = Number(str.charCodeAt(n)).toString(16);
        res.push(hex);
    };
    return `0x${res.join('')}`;
};

// 获取当前账户的 nonce
async function getCurrentNonce(wallet: ethers.Wallet) {
    try {
        const nonce = await wallet.getNonce("pending");
        return nonce;
    } catch (error) {
        console.error("Error fetching nonce:", error.message);
        throw error;
    }
}

// 获取当前主网 gas 价格
async function getGasPrice(provider: ethers.JsonRpcProvider): Promise<BigNumber> {
    let feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    // const gas1 = feeData.maxFeePerGas;
    // const gas2 = feeData.maxPriorityFeePerGas;
    if (!gasPrice) {
        return BIG_ZERO;
    }
    return new BigNumber(gasPrice.toString());
}

// 获取链上实时 gasLimit
async function getGasLimit(provider: ethers.JsonRpcProvider, hexData: string, address: string): Promise<BigNumber> {
    const gasLimit = await provider.estimateGas({
        to: address,
        value: ethers.parseEther("0"),
        data: hexData,
    });

    return new BigNumber(gasLimit.toString());
}


// 转账交易
async function sendTransaction(provider: ethers.JsonRpcProvider, wallet: ethers.Wallet) {
    let address = await wallet.getAddress();
    // let hexData = config.tokenDataHex;
    let hexData = convertToHexa(AVAX_TOKEN_JSON);
    // 获取实时 gasPrice
    const currentGasPrice = await getGasPrice(provider);

    const increasedGasPrice = currentGasPrice.multipliedBy(1.02).integerValue(BigNumber.ROUND_CEIL);
    const gasLimit = await getGasLimit(provider, hexData, address);
    const maxTransactionCost = new BigNumber(ethers.parseEther(AVAX_MAX_FEE.toString()).toString());
    const transactionCost = increasedGasPrice.multipliedBy(gasLimit).integerValue(BigNumber.ROUND_CEIL);

    if (transactionCost.gte(maxTransactionCost)) {
        console.log(`GAS费太高为${ethers.formatEther(transactionCost.toString())} AVAX`);
        return;
    }

    console.log(address, `GAS费${ethers.formatEther(transactionCost.toString())} AVAX`);
    const currentNonce = await getCurrentNonce(wallet);

    let gasPrice = BigInt(increasedGasPrice.integerValue(BigNumber.ROUND_CEIL).toString());
    const transaction: ethers.TransactionRequest = {
        to: address,
        // 替换为你要转账的金额
        value: ethers.parseEther("0"),
        // 十六进制数据
        data: hexData,
        // 设置 nonce
        nonce: currentNonce,
        // 设置 gas 价格
        // gasPrice: BigInt(increasedGasPrice.toString()),
        // 限制gasLimit，根据当前网络转账的设置，不知道设置多少的去区块浏览器看别人转账成功的是多少
        gasLimit: BigInt(gasLimit.multipliedBy(GAS_RATE).integerValue().toString()),

        maxFeePerGas: BigInt(increasedGasPrice.multipliedBy(GAS_RATE).integerValue(BigNumber.ROUND_CEIL).toString())
    };
    try {
        const tx = await wallet.sendTransaction(transaction);
        await tx.wait();
        console.log(`Transaction with nonce ${currentNonce} hash:`, address, tx.hash);
    } catch (error) {
        console.error(`Error in transaction with nonce ${currentNonce}:`, address, error.message);
    }
}

@Injectable()
export class AvaxService {
    private _addresses: string[] = [];
    private _privateKeys: string[] = [];

    private _providers: { [address: string]: ethers.JsonRpcProvider; } = Object.create(null);
    private _wallets: { [address: string]: ethers.Wallet; } = Object.create(null);

    constructor() {
        let content = getPrivateKeys('avax.txt');
        content.split('\n').forEach(line => {
            if (line.includes('|')) {
                let [address, privateKey] = line.split('|');
                this._addresses.push(address);
                this._privateKeys.push(privateKey);
                const provider = new ethers.JsonRpcProvider(AVAX_RPCURL);
                const wallet = new ethers.Wallet(privateKey.trim(), provider);
                this._providers[address] = provider;
                this._wallets[address] = wallet;
            }
        });
        this._run();
    }


    private async _run() {
        if (AVAX_TEST) {
            const tasks = this._addresses.map(address => {
                return sendTransaction(this._providers[address], this._wallets[address]);
            });
            await Promise.all(tasks);
        } else {
            // 一直冲
            while (true) {
                const tasks = this._addresses.map(address => {
                    return sendTransaction(this._providers[address], this._wallets[address]);
                });
                await Promise.all(tasks);
            }
        }
    }
}
