import { ethers } from "hardhat";

async function main() {
  const Factory = await ethers.getContractFactory("SimpleVoting");
  const voting = await Factory.deploy();
  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("SimpleVoting deployed:", address);
  
  // Verify on Etherscan
  console.log("Waiting for block confirmations...");
  await voting.deploymentTransaction()?.wait(5);
  
  console.log("Contract deployed successfully!");
  console.log("Address:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});