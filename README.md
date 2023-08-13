# CCIPMockup Contract
The `CCIPMockup` contract serves as a mock representation of cross-chain interaction processes, allowing users to simulate the sending and receiving of messages across chains.

**Methods:**
1. **sendMessage(uint32 _destinationDomain, bytes calldata _messageBody):**
- For simulating the process of sending a message to another chain.
- Emits a `CCIPSendRequested` event upon request.
2. **receiveMessage(bytes32 messageId):**
- To simulate the message receipt from another chain.
- Emits an `ExecutionStateChanged` event to signify a successful message receipt.
3. **combine(uint32 _uint32, bytes memory _bytes):**
- Utility function to combine various data types and generate a unique ID.
- Returns a keccak256 hash for the combined data.

## Dependencies
- **Client.sol:** Contains definitions related to client-side functionalities.
- **Internal.sol:** Holds internal data structures and enumerations for the functioning of the mockup contract.

## Setup and Usage
1. **Installation:**
```shell
npm install
```
- Clone the repository to your local system.
- Ensure you have the necessary dependencies installed.

2. **Deployment:**
```shell
npx hardhat run scripts/deploy.js
```
- Compile the contracts using the Solidity compiler.
- Deploy the `CCIPMockup` contract to your desired Ethereum network.

3. **Interaction:**
```shell
npx hardhat run scripts/sendTransaction.js
```
- Use the `sendMessage` function to simulate cross-chain message sending.
- Use the `receiveMessage` function to simulate the receipt of a cross-chain message.

## Conclusion
If you'd like to contribute to the project, please fork the repository, make your changes, and submit a pull request. We appreciate all contributions and feedback!