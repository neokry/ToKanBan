const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Kanban = await hre.ethers.getContractFactory("ToKanBan");
  const kanban = await Kanban.deploy();

  await kanban.deployed();

  console.log("ToKanBan deployed to:", kanban.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
