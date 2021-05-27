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
    const title = "test title";
    const description = "test description";
    await this.kanbanFactory.createKanban(title, description);

    const info = await this.kanbanFactory.kanbanInfo(1);
    expect(info.instance).is.not.null;
    expect(info.instance).is.not.empty;
    expect(info.title).equals(title);
    expect(info.description).equals(description);
  });
});
