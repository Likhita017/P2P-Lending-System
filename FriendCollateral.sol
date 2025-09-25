// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FriendCollateral {
    mapping(uint => uint) public collateralAmount;
    mapping(uint => address) public collateralOwner;
    event CollateralDeposited(uint indexed loanId, address indexed owner, uint amount);
    event CollateralWithdrawn(uint indexed loanId, address indexed to, uint amount);

    function depositCollateral(uint loanId) external payable {
        require(msg.value > 0, "no ether");
        require(collateralAmount[loanId] == 0, "exists");
        collateralAmount[loanId] = msg.value;
        collateralOwner[loanId] = msg.sender;
        emit CollateralDeposited(loanId, msg.sender, msg.value);
    }

    function withdrawCollateral(uint loanId) external {
        require(collateralOwner[loanId] == msg.sender, "not owner");
        uint amount = collateralAmount[loanId];
        require(amount > 0, "none");
        collateralAmount[loanId] = 0;
        collateralOwner[loanId] = address(0);
        (bool sent,) = payable(msg.sender).call{value: amount}("");
        require(sent, "withdraw failed");
        emit CollateralWithdrawn(loanId, msg.sender, amount);
    }
}
