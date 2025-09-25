const hre = require("hardhat");

async function main() {
  // Deploy LendingPlatform
  const LendingPlatform = await hre.ethers.getContractFactory("LendingPlatform");
  const lendingPlatform = await LendingPlatform.deploy();
  await lendingPlatform.deployed();
  console.log("LendingPlatform deployed to:", lendingPlatform.address);

  // Deploy FriendCollateral
  const FriendCollateral = await hre.ethers.getContractFactory("FriendCollateral");
  const friendCollateral = await FriendCollateral.deploy();
  await friendCollateral.deployed();
  console.log("FriendCollateral deployed to:", friendCollateral.address);

  // Deploy PhysicalMeetLogger
  const PhysicalMeetLogger = await hre.ethers.getContractFactory("PhysicalMeetLogger");
  const physicalMeetLogger = await PhysicalMeetLogger.deploy();
  await physicalMeetLogger.deployed();
  console.log("PhysicalMeetLogger deployed to:", physicalMeetLogger.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
