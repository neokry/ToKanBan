const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Kanban = await hre.ethers.getContractFactory("ToKanBan");
  const kanban = await Kanban.deploy();

  await kanban.deployed();

  console.log("ToKanBan deployed to:", kanban.address);
  //0xE1E0d2291911001b1B975F3ED9920816d7397995
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
