const { ethers } = require("hardhat");
const chainInfo = require("../config/chainInfo");

require("dotenv").config();

const PRIVATE_KEY = process.env.PK;

async function deploy(url) {
  const provider = new ethers.JsonRpcProvider(url);
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);
  
  const { chainId } = await provider.getNetwork();
  console.log(`chainId: ${chainId}`);

  const deployerBalance = await provider.getBalance(await deployer.getAddress());

  console.log(`deployer address: ${await deployer.getAddress()}`);
  console.log(`deployer's balance: ${deployerBalance.toString() / 10 ** 18} ETHER`);

  const CCIPMockup = await ethers.getContractFactory("CCIPMockup", deployer);
  const mockup = await CCIPMockup.deploy();
  await mockup.waitForDeployment();

  console.log(`mockup address: ${await mockup.getAddress()}`);
}

async function main() {
  console.log("1. base");
  await deploy(chainInfo.base.url);
  console.log("2. mode");
  await deploy(chainInfo.mode.url);
  console.log("3. optimism");
  await deploy(chainInfo.optimism.url);
  console.log("4. zora");
  await deploy(chainInfo.zora.url);
}

main();

// 1. base
// chainId: 84531
// deployer address: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// deployer's balance: 0.018704469002768547 ETHER
// mockup address: 0x073EfC27ad791F735ca1EdF1F9cfe647B8D99aBf
// 2. mode
// chainId: 919
// deployer address: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// deployer's balance: 0.19876867428026332 ETHER
// mockup address: 0xC25d83872376c8b0EdA5f4C7eD5D59c05C1C2887
// 3. optimism
// chainId: 420
// deployer address: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// deployer's balance: 0.038756731779200145 ETHER
// mockup address: 0xdB57E2c22989116Cec1Ad7D59D2edE8123124A35
// 4. zora
// chainId: 999
// deployer address: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// deployer's balance: 0.018781881923745677 ETHER
// mockup address: 0xd7a26F297590BF33440f96B93aBd6568E1ce5d58