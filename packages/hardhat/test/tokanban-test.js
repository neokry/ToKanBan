const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { ethers } = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");

chai.use(chaiAsPromised);
const expect = chai.expect;

// Helpers to improve the test language
const given = (description, fun) => describe("Given " + description, fun);
const then = (description, fun) => it(description, fun);


describe("ToKanBan", function () {
  before(async function () {
    this.Kanban = await ethers.getContractFactory("ToKanBan");
    this.accounts = await ethers.getSigners();
  });

  beforeEach(async function () {
    this.kanban = await this.Kanban.deploy();
    await this.kanban.deployed();
  });

  given("no PM has been set", async function () {
    then("setPM succeeds", async function () {
      await this.kanban.setPM(this.accounts[0].address);
      const pm = await this.kanban.pm();

      expect(pm).equals(this.accounts[0].address);
    });

    then("submitTask fails", async function () {
      await expect(
        this.kanban.submitTask(1000, "Update the README")
      ).to.be.rejectedWith("This function requires a PM to have been set");
    });

    then("assignTaskToRaider fails", async function () {
      await expect(
        this.kanban.assignTaskToRaider(1, 1)
      ).to.be.rejectedWith("This function requires a PM to have been set");
    });

    then("taskReviewRevoked fails", async function () {
      await expect(
        this.kanban.taskReviewRevoked(1)
      ).to.be.rejectedWith("This function requires a PM to have been set");
    });

    then("taskComplete fails", async function () {
      await expect(
        this.kanban.taskComplete(1)
      ).to.be.rejectedWith("This function requires a PM to have been set");
    });
  });


  given("a PM has been set", async function () {

    beforeEach(async function() {
      await this.kanban.setPM(this.accounts[0].address);
    })

    then("submitTask succeeds", async function () {
      const value = ethers.utils.parseEther("1");
      const details = "A sample task";
      await this.kanban.submitTask(value, details, { value: value });

      const task = await this.kanban.taskLog(0);

      expect(task.funds.value).equals(value.value);
      expect(task.details).equals(details);
    });

    then("taskComplete succeeds", async function () {
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

    then("assignTaskToRaider succeeds", async function () {
      const value = ethers.utils.parseEther("1");
      const details = "A sample task";
      await this.kanban.submitTask(value, details, { value: value });
      await this.kanban.requestTask(0);
      await this.kanban.assignTaskToRaider(0, 0);

      const task = await this.kanban.taskLog(0);
      expect(task.raider).equals(this.accounts[0].address);
      expect(task.assigned).to.be.true;
    });

  });

  it("Should request tasks", async function () {
    await this.kanban.setPM(this.accounts[0].address);

    const value = ethers.utils.parseEther("1");
    const details = "A sample task";
    await this.kanban.submitTask(value, details, { value: value });
    await this.kanban.requestTask(0);

    const raider = await this.kanban.viewRequests(0, 0);
    expect(raider[0]).equals(this.accounts[0].address);
  });

  it("Should send tasks for review", async function () {
    await this.kanban.setPM(this.accounts[0].address);

    const value = ethers.utils.parseEther("1");
    const details = "A sample task";
    await this.kanban.submitTask(value, details, { value: value });
    await this.kanban.requestTask(0);
    await this.kanban.assignTaskToRaider(0, 0);
    await this.kanban.taskForReview(0);

    const task = await this.kanban.taskLog(0);
    expect(task.reviewed).to.be.true;
  });

});
