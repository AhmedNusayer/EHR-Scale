// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EHR {
    struct Record {
        string recordHash;
        uint256 timestamp;
    }

    mapping(address => Record[]) private patientRecords;
    event RecordAdded(address indexed patient, string recordHash, uint256 timestamp);

    function addRecord(string memory _recordHash) public {
        patientRecords[msg.sender].push(Record(_recordHash, block.timestamp));
        emit RecordAdded(msg.sender, _recordHash, block.timestamp);
    }

    function getRecords() public view returns (Record[] memory) {
        return patientRecords[msg.sender];
    }
}
