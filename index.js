const Web3 = require("web3"); 
const { BN, Long, units } = require('@zilliqa-js/util');
const { sign } = require("@zilliqa-js/crypto");
const { Zilliqa } = require("@zilliqa-js/zilliqa");

class Account {
    constructor({address, privateKey, publicKey}) {
        this.address = address;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
};

class Contract {
    constructor(address, abi) {
        this.address = address;
        this.abi = abi;
    }
}

class IWallet {
    configTx(txParams = {}) {}
    async connect() {}
    async isInstalled() {}
    async isConnected() {}
    async signMsg(msg) {}
    async contract(contract = new Contract()){}
    async callFunction(contract = new Contract(), method, params, txParams) {}
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

class EVMWallet {
    constructor(web3 = new Web3(), account = new Account()) {
        this.web3 = web3;
        this.account = account;
        this.isConnected = false;
        this.isMetaMask = false;
        this.isZil = false;
        this.txParams = {};
    }
    configTx(txParams = {}) {
        this.txParams = txParams;
        return this;
    }
    async connect(provider, isMetaMask) {
        this.isConnected = false;
        this.isMetaMask = isMetaMask;
        if (isMetaMask && this.isInstalled()) {
            await window.ethereum.request({ method: "eth_accounts" });
            await window.ethereum.request({ method: "eth_requestAccounts" });
            this.web3 = new Web3(window.ethereum);
            return;
        } else if (isMetaMask) {
            throw new Error("MetaMask not installed!");
        }
        this.web3 = new Web3(provider);
        this.account = web3.eth.accounts.privateKeyToAccount(this.account.privateKey);
        this.isConnected = true;
    }
    async isInstalled() {
        return window && window.ethereum && window.ethereum.isMetaMask;
    }
    async isConnected() {
        if(this.isMetaMask && this.isInstalled()) {
            return window.ethereum.isConnected();
        }
        return this.isConnected;
    }
    async signMsg(msg) {
        return this.web3.eth.sign(msg, this.account.address);
    }
    async contract(contract = new Contract()) {
        return new this.web3.Contract(contract.abi, contract.address);
    }
    async callFunction(contract = new Contract(), method, params) {
        const contractAPI = this.contract(contract);
        const transactonHash = await contractAPI.method[method](...params).call(this.txParams);
        let transactionReceipt = null;
        while (transactionReceipt == null) {
            transactionReceipt = await this.web3.eth.getTransactionReceipt(transactonHash);
            await sleep(expectedBlockTime)
        }
        return transactionReceipt;
    }
};

class ZilWallet {
    constructor({zilliqa = new Zilliqa(), account = new Account()}) {
        this.zilliqa = zilliqa;
        this.account = account;
        this.isConnected = false;
        this.isZilPay = false;
        this.isZil = true;
        this.txParams = {};
    }
    configTx(txParams = {}) {
        this.txParams = txParams;
        return this;
    }
    async connect(provider, isZilPay) {
        this.isZilPay = isZilPay;
        this.isConnected = false;
        if(isZilPay && this.isInstalled()) {
           await window.zilPay.wallet.connect();
        } else if (isZilPay) {
            throw new Error("ZilPay not installed!");
        }
        this.zilliqa = new Zilliqa(provider);
        this.zilliqa.wallet.addByPrivateKey(this.account.privateKey);
        this.isConnected = true;
    }
    async isInstalled() {
        return window && window.zilPay;
    }
    async isConnected() {
        return this.isConnected;
    }
    async signMsg(msg) {
        return this.isZilPay ? window.zilPay.wallet.sign(msg) : sign(msg, this.account.privateKey, this.account.publicKey);
    }
    async contract(contract = new Contract()) {
        if(this.isZilPay) {
            return window.zilPay.contracts.at(contract.address, contract.abi);
        }
        return this.zilliqa.contract.at(contract.address, contract.abi);
    }
    async callFunction(contract = new Contract(), method, params) {
        // TODO
        const contractAPI = this.contract(contract);
        const tx = await contractAPI.call(method, params, {...this.txParams, version: VERSION}, true);
    }
};

class HardhatWallet {
    constructor(web3, account, contract) {
        this.web3 = web3;
        this.isConnected = true;
        this.account = account;
        this.contractAPI = contract;
        this.txParams = undefined;
    }

    configTx(txParams = {}) {
        this.txParams = txParams;
        return this;
    }

    async connect(account) {
        this.isConnected = true;
        this.account = account;
        this.contractAPI = this.contractAPI.connect(this.account);
        return this;
    }

    async isInstalled() {
        return false;
    }
    async isConnected() {
        return this.isConnected;
    }
    async signMsg(msg) {
        return this.web3.eth.sign(msg, this.account.address);
    }
    async contract(contractAPI) {
        this.contractAPI = contractAPI.connect(this.account);
        return this.contractAPI;
    }
    async callFunction(contractAPI, method, params) {
        const contract = await this.contract(contractAPI);
        const tx = this.txParams ? await contract[method](...params, this.txParams) : await contract[method](...params);
        this.txParams = undefined;
        return tx;
    }
};

class IGBridge {
    configTx(txParams) {}
    async signMsg(msg) {}
    async transfer(chainId, token, amount, to) {}
    async claim(chainId, from, to, token, amount, nonce, proofs) {}
    async aprove(token, spender) {}
};


class Gbridge  {

    constructor(web3 = new IWallet(), {bridge = new Contract(), manager = new Contract(), storage = new Contract()}) {
        this.web3 = web3;
        this.bridge = bridge;
        this.manger = manager;
        this.storage = storage;
    }

    configTx(txParams) {
        this.web3 = this.web3.configTx(txParams);
        return this;
    }

    connect(web3 = new IWallet()) {
        this.web3 = web3;
        return this;
    }

    async signMsg(msg) {
        return this.web3.signMsg(msg);
    }
    async transfer(chainId, token, amount, to) {
        const params = this.web3.isZil ? [
            { "vname": "chainId", "type": "String", "value": chainId },
            { "vname": "to", "type": "ByStr20", "value": to },
            { "vname": "token", "type": "ByStr20", "value": token },
            { "vname": "amount", "type": "Uint256", "value": amount }
        ] : [chainId, token, amount, to];

        return this.web3.callFunction(this.bridge, "Transfer", params);
    }
    async claim(chainId, from, to, token, amount, nonce, proofs) {
        const params = this.web3.isZil ?  [
            { "vname": "chainId", "type": "String", "value": chainId },
            { "vname": "from", "type": "ByStr20", "value": from },
            { "vname": "to", "type": "ByStr20", "value": to },
            { "vname": "token", "type": "ByStr20", "value": token },
            { "vname": "amount", "type": "Uint256", "value": amount },
            { "vname": "nonce", "type": "Uint256", "value": nonce },
            { "vname": "proofs", "type": "List (Pair (ByStr20) (ByStr64))", "value": proofs }
        ] : [chainId, from, to, token, amount, nonce, proofs];
        
        return this.web3.callFunction(this.bridge, "Claim", params);
    }
    async aprove(token = new Contract(), spender, amount) {
        const params = this.wallet.isZil ? [
            { "vname": "spender", "type": "ByStr20", "value": spender },
            { "vname": "amount", "type": "Uint128", "value": amount }
        ] : [spender, amount];
        const method = this.web3.isZil ? "IncreaseAllowance" : "approve";
        return this.web3.callFunction(token, method, params);
    }

};


module.exports = {Account, Contract, IWallet, HardhatWallet, EVMWallet, ZilWallet, IGBridge, Gbridge};