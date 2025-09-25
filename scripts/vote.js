const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  await hre.fhevm.initializeCLIApi();   // önemli

  const CONTRACT_ADDR = process.env.CONTRACT_ADDR ?? "0xbE6962010697f1B914166209a0E5B18A56bf5708";
  const RAW = process.env.CHOICE ?? "1";
  const choice = Number(RAW);
  if (!(choice === 0 || choice === 1)) throw new Error(`CHOICE must be 0 or 1. Got: ${RAW}`);

  const [signer] = await ethers.getSigners();

  const builder = hre.fhevm.createEncryptedInput(CONTRACT_ADDR, await signer.getAddress());
  builder.add8(choice);
  const encrypted = await builder.encrypt();

  const externalChoice = encrypted.handles[0];
  const attestation = encrypted.inputProof;

  const contract = await ethers.getContractAt("FHEFashionPoll", CONTRACT_ADDR, signer);
  const tx = await contract.vote(externalChoice, attestation);
  const rc = await tx.wait();
  console.log("✅ Sent tx:", tx.hash, " Mined in block:", rc.blockNumber);

  const tallies = await contract.getTallies();
  console.log("Encrypted tallies (yes, no):", tallies);
}

main().catch((e) => { console.error(e); process.exit(1); });
