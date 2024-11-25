const { ethers } = require("ethers");
const Blockchain = require("../../domain/interfaces/blockchain");

class EthersAdapter extends Blockchain {
  constructor(providerUrl, privateKey, contractAddress, abi) {
    super();
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(contractAddress, abi, wallet);
  }

  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);

      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  async transferTokens(from, to, amount) {
    const tx = await this.contract.transfer(
      to,
      ethers.utils.parseUnits(amount, 18)
    );
    return tx.wait();
  }

  async mintTokens(to, amount) {
    const tx = await this.contract.mint(
      to,
      ethers.utils.parseUnits(amount, 18)
    );
    return tx.wait();
  }
}

module.exports = EthersAdapter;
