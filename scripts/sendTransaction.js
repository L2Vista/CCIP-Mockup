const { ethers } = require("hardhat");
const chainInfo = require("../config/chainInfo");

require("dotenv").config();

const PRIVATE_KEY = process.env.PK;

async function send(url, contractAddr, toChain, message) {
    const provider = new ethers.JsonRpcProvider(url);
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

    const mockup = await ethers.getContractAt("CCIPMockup", contractAddr);
    const tx = await mockup.connect(deployer).sendMessage(toChain, message);
    await tx.wait();
    console.log(`send hash: ${tx.hash}`);
    
    const receipt = await provider.getTransactionReceipt(tx.hash);
    const messageId = receipt.logs[0].topics[1];
    console.log(`message id: ${messageId}`);

    return messageId;
}

async function receive(url, contractAddr, fromChain, messageId) {
    const provider = new ethers.JsonRpcProvider(url);
    const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

    const mockup = await ethers.getContractAt("CCIPMockup", contractAddr);
    const tx = await mockup.connect(deployer).receiveMessage(messageId);
    await tx.wait();
    console.log(`receive hash: ${tx.hash}`);
}

async function sendReceive(fromChain, toChain) {
    const message = "0x00";

    console.log(`${fromChain} -> ${toChain}`);
    const messageId = await send(
        chainInfo[fromChain].url,
        chainInfo[fromChain].contractAddr,
        chainInfo[toChain].chainId,
        message
    );
    await receive(
        chainInfo[toChain].url,
        chainInfo[toChain].contractAddr,
        chainInfo[fromChain].chainId,
        messageId
    );
}

async function main() {
    // base, mode, optimism, zora
    const chainSet = [
        { fromChain: "base", toChain: "mode", },
        { fromChain: "mode", toChain: "base", },
        { fromChain: "optimism", toChain: "zora", },
        { fromChain: "zora", toChain: "optimism", },
    ];

    for (let i = 0; i < chainSet.length; i++) {
        const { fromChain, toChain } = chainSet[i];
        await sendReceive(fromChain, toChain);
    }
}

main();
// base -> mode
// send hash: 0x19a67d76791cdb0bddb271ae898cb69155be92f08855fce43864ff26ebc39b36
// message id: 0xc529446a5885c34316e3fd9a83ce53f8927b4687aa9af9e0a388f98fe4c5101b
// receive hash: 0x65edafca8bc16cea9d6795946f55948680005030faf781287539a56a4ffe1966
// mode -> base
// send hash: 0xce0129da7d122159fae294ec414c51f94648fc4eb99103fd712a86b6e348b706
// message id: 0x820163b1c0acef0c2fe62c4c0bbccfaef9a2fdd276614c3de76fb8bfed8d6d03
// receive hash: 0x0672509340a388c593181293e2643f7acad517416ae516974867ef6b6012d5ae
// optimism -> zora
// send hash: 0xf3b37e2583feeda534dd7ac37893304983ececdac4bfec70792c1ffad6b7e000
// message id: 0x2d0a227c39c69e76dbb00e23c75217e640d835490db3604b091ad04782df167d
// receive hash: 0x20c5a791efef4752c3319bc659ba677d92d45366aa9389af516acdf8f2f28f57
// zora -> optimism
// send hash: 0xa82c95ceb3a44b5a2bf752af8f066c9a2a4a908860c98f3514161be596260d2d
// message id: 0xbb8d87aff4e3c472b9fa2c0ef975ccd6abdda519075c5147630f21653279f8ef
// receive hash: 0x86dd15421efcad59df688a7ff32fd69dd435432051c5cfe374b114eb96f4ecff