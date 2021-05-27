import kanbanFactoryABI from "../abis/KanbanFactory.json";
import { ethers } from "ethers"; // Ethers

export default class Kanban {
  signer;
  contract;

  constructor(signer) {
    this.signer = signer;
  }

  async connect(address) {
    const KanbanFactory = new ethers.Contract(
      address,
      kanbanFactoryABI.abi,
      this.signer
    );
    this.contract = await KanbanFactory.attach(address);
  }

  async createKanban() {
    if (!this.contract) return;
    const tx = await this.contract.createKanban();
    await tx.wait();
  }
}
