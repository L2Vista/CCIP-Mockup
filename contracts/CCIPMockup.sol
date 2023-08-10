// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

contract CCIPMockup {
    event CCIPSendRequested(
        bytes32 indexed sourceChainSelector,
        uint256 sequenceNumber,
        uint256 feeTokenAmount,
        address sender,
        uint256 nonce,
        uint256 gasLimit,
        uint256 strict,
        address receiver,
        bytes data,
        uint256 tokenAmounts,
        address feeToken,
        uint256 messageId
    );

    event Transmitted(bytes32 indexed configDigest, uint32 epoch);

    function sendMessage(
        uint32 _destinationDomain,
        bytes calldata _messageBody
    ) external {
        bytes memory zeroBytes;
        emit CCIPSendRequested(
            combine(_destinationDomain, _messageBody),
            0,
            0,
            address(0),
            0,
            0,
            0,
            address(0),
            zeroBytes,
            0,
            address(0),
            0
        );
    }

    function receiveMessage(bytes32 configDigest) external {
        emit Transmitted(configDigest, 0);
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
