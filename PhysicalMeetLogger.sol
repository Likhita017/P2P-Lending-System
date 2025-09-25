// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PhysicalMeetLogger {
    uint public meetCount;
    struct Meet {
        uint id;
        uint loanId;
        address initiator;
        string location; // short text or IPFS hash
        string notes;    // optional
        uint timestamp;
    }
    mapping(uint => Meet) public meets;
    event MeetLogged(uint id, uint loanId, address initiator, string location, string notes, uint timestamp);

    function logMeet(uint loanId, string calldata location, string calldata notes) external {
        meetCount++;
        meets[meetCount] = Meet(meetCount, loanId, msg.sender, location, notes, block.timestamp);
        emit MeetLogged(meetCount, loanId, msg.sender, location, notes, block.timestamp);
    }
}
