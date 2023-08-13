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
// deployer's balance: 0.013486354321429408 ETHER
// mockup address: 0xBb7027d4Bd8B022F653541E8a38D6094611376A3
// 2. mode
// chainId: 919
// deployer address: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// deployer's balance: 0.19827967085447798 ETHER
// mockup address: 0xb6c87a438b1FE7EE0D30048559F84b078FFc08E9
// 3. optimism
// chainId: 420
// deployer address: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// deployer's balance: 0.03701527366508496 ETHER
// mockup address: 0x2857E9799E4B7d3ad9ecC3e00c4599fdCa9756Ad
// 4. zora
// chainId: 999
// deployer address: 0xa40aa030A3ba4f42FDCd2B7bC33d5B03770290ea
// deployer's balance: 0.017483613222884394 ETHER
// mockup address: 0x2857E9799E4B7d3ad9ecC3e00c4599fdCa9756Ad