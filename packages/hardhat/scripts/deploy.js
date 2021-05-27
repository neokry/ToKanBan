const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Kanban = await hre.ethers.getContractFactory("Kanban");
  const kanban = await Kanban.deploy();

  await kanban.deployed();

  console.log("Kanban deployed to:", kanban.address);

  const KanbanFactory = await hre.ethers.getContractFactory("KanbanFactory");
  const kanbanFactory = await KanbanFactory.deploy(kanban.address);

  await kanbanFactory.deployed();

  console.log("Kanban factory deployed to:", kanbanFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
