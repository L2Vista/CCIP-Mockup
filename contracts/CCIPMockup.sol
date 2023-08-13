// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Client} from "./libraries/Client.sol";
import {Internal} from "./libraries/Internal.sol";

// import "hardhat/console.sol";

contract CCIPMockup {
    Client.EVMTokenAmount[] tokenAmounts;

    event CCIPSendRequested(Internal.EVM2EVMMessage message);

    event ExecutionStateChanged(
        uint64 indexed sequenceNumber,
        bytes32 indexed messageId,
        Internal.MessageExecutionState state,
        bytes returnData
    );

    function sendMessage(
        uint32 _destinationDomain,
        bytes calldata _messageBody
    ) external {
        Internal.EVM2EVMMessage memory message = Internal.EVM2EVMMessage({
            sourceChainSelector: 0,
            sequenceNumber: 0,
            feeTokenAmount: 0,
            sender: address(0),
            nonce: 0,
            gasLimit: 0,
            strict: true,
            receiver: address(0),
            data: new bytes(0),
            tokenAmounts: tokenAmounts,
            feeToken: address(0),
            messageId: combine(_destinationDomain, _messageBody)
        });
        
        emit CCIPSendRequested(message);
    }

    function receiveMessage(bytes32 messageId) external {
        emit ExecutionStateChanged(
            0,
            messageId,
            Internal.MessageExecutionState.SUCCESS,
            new bytes(0)
        );
    }

    function combine(
        uint32 _uint32,
        bytes memory _bytes
    ) public view returns (bytes32) {
        uint32 timestamp = uint32(block.timestamp); // Convert timestamp to uint32. This truncates the timestamp so be cautious.

        bytes32 uint32Bytes = bytes32(uint256(_uint32) << (28 * 8));
        bytes32 timestampBytes = bytes32(uint256(timestamp) << (24 * 8));

        bytes32 allTogether = uint32Bytes | timestampBytes;

        for (uint256 i = 0; i < _bytes.length; i++) {
            allTogether |= bytes32(uint256(uint8(_bytes[i])) << ((23 - i) * 8));
        }

        return keccak256(abi.encodePacked(allTogether));
    }
}
