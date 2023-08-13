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
    const messageId = mockup.interface.parseLog(receipt.logs[0]).args[0][11];
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
        { fromChain: "zora", toChain: "mode", },
        { fromChain: "mode", toChain: "zora", },
    ];

    for (let i = 0; i < chainSet.length; i++) {
        const { fromChain, toChain } = chainSet[i];
        await sendReceive(fromChain, toChain);
    }
}

main();

// base -> mode
// send hash: 0xe4de2698f6a9311d9203dbfea0adb94c10d95b9a32d8da58849fdc71c00f8e08
// message id: 0xaee14a2120f303213306b4703b45c71f2717cae20e57a76c3a04fdc0c8c86661
// receive hash: 0xf61aadc7a29a17d24a8ca752f66c69990e6a1ada2a7af4bec17ca3c773659f74
// mode -> base
// send hash: 0x514457e0679e4a799c9761e03b914341d8ba08eb137e9215d66038f7cf971dff
// message id: 0x7465610efd32693b3687cb1678fcc88a25b5cc3ab2cc003ee6fe55ff7ca7f797
// receive hash: 0x82d0677fb71bea80ea09c47820a95bf2acffc83b56076811a08905055ef56ee9
// optimism -> zora
// send hash: 0x31be1f3cd3096d8234ef7481f091e254a1b235e15a5671a1a435434192334f18
// message id: 0x76db30fe506fddf5920820b705c73abd0ffa4213252b203b4e1e8484060fc900
// receive hash: 0x402de26d1f047acb0363bd4f3778d0ca37447b4461c29060ae4fcd6e942b63fe
// zora -> optimism
// send hash: 0x3b8f0b7be8c04a74b478fab5e188d2048216452ee7c2adff56ec476e1e5209c4
// message id: 0x9e48a7a0818c81414811058365718add2a16c28678529f83b618044b172703fe
// receive hash: 0x762790bc5acec39bd558c49d7e1bdbc5d1227bcfe5a683d94d144a69c2357265
// zora -> mode
// send hash: 0x002071c63d7823bc06f71b2b845950ae35cf86573432f2e4bc0b6b08056bda8a
// message id: 0x597ba0e2fdb57453148137a471aca9522b9721285089cb350eb1e50d960dd614
// receive hash: 0x4f6e27a2db9a2d8754f43e569cff7d5fc43bef89e20f6b33af25b6e9de244998
// mode -> zora
// send hash: 0x5ee555f87efa2abc774132e71426f17e5f630d97bc8b648945bd323e26fbe888
// message id: 0x365378e1ae5e7f7100878b7589c25991d90b2c28bf8c5ac0657518a607832755
// receive hash: 0xa8722b94d2b2f0b5d303058814b95e478d2576bc953b7a1142e2b0fc04e94e57