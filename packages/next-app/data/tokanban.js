import tokanbanABI from "../abis/ToKanBan.json";
import { ethers } from "ethers"; // Ethers

const address = "0x047712a5f9d102C0D78c5bc6D61BEf8e973f99AB";

export default class Tokanban {
  signer;
  contract;

  constructor(signer) {
    this.signer = signer;
  }

  async setupContract() {
    const Kanban = new ethers.Contract(address, tokanbanABI.abi, this.signer);
    this.contract = await Kanban.attach(address);
  }

  async submitTask(funds, details) {
    if (!this.contract) await this.setupContract();
    const value = ethers.utils.parseEther(funds);
    await this.contract.submitTask(value, details, { value: value });
  }

  async isPM() {
    if (!this.contract) await this.setupContract();
    const addr = await this.signer.getAddress();
    console.log("contract", this.contract);
    const pm = await this.contract.pm();
    return addr == pm;
  }
}
