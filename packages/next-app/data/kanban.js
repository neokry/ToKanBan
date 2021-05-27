import kanbanABI from "../abis/Kanban.json";
import { ethers } from "ethers"; // Ethers

export default class Kanban {
  signer;
  contract;

  constructor(signer) {
    this.signer = signer;
  }

  async connect(address) {
    const Kanban = new ethers.Contract(address, kanbanABI.abi, this.signer);
    this.contract = await Kanban.attach(address);
  }

  async submitTask(funds, details) {
    if (!this.contract) return;
    const value = ethers.utils.parseEther(funds);
    await this.contract.submitTask(value, details, { value: value });
  }

  async isPM() {
    if (!this.contract) return;
    const addr = await this.signer.getAddress();
    console.log("contract", this.contract);
    const pm = await this.contract.pm();
    return addr == pm;
  }

  async requestTask(taskId) {
    if (!this.contract) return;
    const tx = await this.contract.requestTask(taskId);
    await tx.wait();
  }

  async assignTask(taskId, requestId) {
    if (!this.contract) return;
    const tx = await this.contract.assignTaskToRaider(taskId, requestId);
    await tx.wait();
  }

  async taskForReview(taskId) {
    if (!this.contract) return;
    const tx = await this.contract.taskForReview(taskId);
    await tx.wait();
  }

  async taskReviewRevoked(taskId) {
    if (!this.contract) return;
    const tx = await this.contract.taskReviewRevoked(taskId);
    await tx.wait();
  }

  async taskComplete(taskId) {
    if (!this.contract) return;
    const tx = await this.contract.taskComplete(taskId);
    await tx.wait();
  }
}
