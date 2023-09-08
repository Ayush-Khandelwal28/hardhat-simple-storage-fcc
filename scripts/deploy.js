const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying Contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  const deployedAddress = await simpleStorage.deployed();
  console.log("Contract deployed to:", deployedAddress);

  // if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6);
    console.log("Verifying contract...")
    await verify(simpleStorage.address, []);
  // }

  const currvalue = await simpleStorage.retrieve();
  console.log(`Current value is ${currvalue}`);

  const transactionReport = await simpleStorage.store(28);
  await transactionReport.wait(1);
  const updatedvalue = await simpleStorage.retrieve();
  console.log(`Current value is ${updatedvalue}`);

}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify",
      {
        address: contractAddress,
        constructorArguments: args,
      });
  }
  catch (e) {
    if (e.message.toLowerCase().includes("already verified")) console.log("Already Verified");
    else console.log(e);
  }
}


main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
