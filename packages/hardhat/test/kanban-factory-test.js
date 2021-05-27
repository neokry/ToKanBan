const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("KanbanFactory", function () {
  before(async function () {
    this.Kanban = await ethers.getContractFactory("Kanban");
    this.KanbanFactory = await ethers.getContractFactory("KanbanFactory");
    this.accounts = await ethers.getSigners();
  });

  beforeEach(async function () {
    this.kanban = await this.Kanban.deploy();
    await this.kanban.deployed();

    this.kanbanFactory = await this.KanbanFactory.deploy(this.kanban.address);
    await this.kanbanFactory.deployed();
  });

  it("Should create new kanbans", async function () {
    await this.kanbanFactory.createKanban();
    const instance = await this.kanbanFactory.kanbanInstances(1);
    expect(instance).is.not.null;
    expect(instance).is.not.empty;
  });
});
