const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");

describe("ToKanBan", function () {
  before(async function () {
    this.Kanban = await ethers.getContractFactory("ToKanBan");
  });

  beforeEach(async function () {
    this.kanban = await this.Kanban.deploy();
    await this.kanban.deployed();
  });

  it("Should set PM", async function () {
    const accounts = await ethers.getSigners();
    await this.kanban.setPM(accounts[0].address);

    const pm = await this.kanban.pm();

    expect(pm).equals(accounts[0].address);
  });

  it("Should submit tasks", async function () {
    const accounts = await ethers.getSigners();
    await this.kanban.setPM(accounts[0].address);

    const value = ethers.utils.parseEther("1");
    const details = "A sample task";
    await this.kanban.submitTask(value, details, { value: value });

    const task = await this.kanban.taskLog(0);

    expect(task.funds.value).equals(value.value);
    expect(task.details).equals(details);
  });

  it("Should request tasks", async function () {
    const accounts = await ethers.getSigners();
    await this.kanban.setPM(accounts[0].address);

    const value = ethers.utils.parseEther("1");
    const details = "A sample task";
    await this.kanban.submitTask(value, details, { value: value });
    await this.kanban.requestTask(0);

    const raider = await this.kanban.viewRequests(0, 0);
    expect(raider[0]).equals(accounts[0].address);
  });

  it("Should assign task to raider", async function () {
    const accounts = await ethers.getSigners();
    await this.kanban.setPM(accounts[0].address);

    const value = ethers.utils.parseEther("1");
    const details = "A sample task";
    await this.kanban.submitTask(value, details, { value: value });
    await this.kanban.requestTask(0);
    await this.kanban.assignTaskToRaider(0, 0);

    const task = await this.kanban.taskLog(0);
    expect(task.raider).equals(accounts[0].address);
    expect(task.assigned).to.be.true;
  });

  it("Should send tasks for review", async function () {
    const accounts = await ethers.getSigners();
    await this.kanban.setPM(accounts[0].address);

    const value = ethers.utils.parseEther("1");
    const details = "A sample task";
    await this.kanban.submitTask(value, details, { value: value });
    await this.kanban.requestTask(0);
    await this.kanban.assignTaskToRaider(0, 0);
    await this.kanban.taskForReview(0);

    const task = await this.kanban.taskLog(0);
    expect(task.reviewed).to.be.true;
  });

  it("Should complete tasks", async function () {
    const accounts = await ethers.getSigners();
    await this.kanban.setPM(accounts[0].address);

    const value = ethers.utils.parseEther("1");
    const details = "A sample task";
    await this.kanban.submitTask(value, details, { value: value });
    await this.kanban.requestTask(0);
    await this.kanban.assignTaskToRaider(0, 0);
    await this.kanban.taskForReview(0);
    await this.kanban.taskComplete(0);

    const task = await this.kanban.taskLog(0);

    expect(task.closed).to.be.true;
    expect(task.funds.toHexString()).equals(BigNumber.from("0").toHexString());
  });
});
