// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LendingPlatform {
    uint public loanCounter;
    bool private locked;

    struct Loan {
        uint id;
        address payable borrower;
        uint amount;            // principal in wei
        uint interestPercent;   // integer percent, e.g., 5 = 5%
        uint durationDays;
        address payable lender;
        bool funded;
        bool repaid;
    }

    mapping(uint => Loan) public loans;
    event LoanCreated(uint id, address borrower, uint amount, uint interestPercent, uint durationDays);
    event LoanFunded(uint id, address lender);
    event LoanRepaid(uint id);

    modifier noReentrant() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    function createLoan(uint amountWei, uint interestPercent, uint durationDays) external {
        require(amountWei > 0, "amount>0");
        loanCounter++;
        loans[loanCounter] = Loan({
            id: loanCounter,
            borrower: payable(msg.sender),
            amount: amountWei,
            interestPercent: interestPercent,
            durationDays: durationDays,
            lender: payable(address(0)),
            funded: false,
            repaid: false
        });
        emit LoanCreated(loanCounter, msg.sender, amountWei, interestPercent, durationDays);
    }

    // Lender funds the loan by sending exactly the amount (or more - excess refunded)
    function fundLoan(uint loanId) external payable noReentrant {
        Loan storage loan = loans[loanId];
        require(loan.id == loanId, "invalid loan");
        require(!loan.funded, "already funded");
        require(msg.value >= loan.amount, "send >= principal");

        loan.funded = true;
        loan.lender = payable(msg.sender);

        // send principal to borrower
        (bool sent, ) = loan.borrower.call{value: loan.amount}("");
        require(sent, "transfer to borrower failed");

        // refund any excess to lender
        uint excess = msg.value - loan.amount;
        if (excess > 0) {
            (bool r, ) = payable(msg.sender).call{value: excess}("");
            require(r, "refund failed");
        }
        emit LoanFunded(loanId, msg.sender);
    }

    // Borrower repays principal + interest
    function repayLoan(uint loanId) external payable noReentrant {
        Loan storage loan = loans[loanId];
        require(loan.id == loanId, "invalid loan");
        require(loan.funded, "not funded");
        require(!loan.repaid, "already repaid");
        require(msg.sender == loan.borrower, "only borrower");

        uint repaymentAmount = loan.amount + (loan.amount * loan.interestPercent) / 100;
        require(msg.value >= repaymentAmount, "send >= repayment");

        loan.repaid = true;

        // pay lender
        (bool sent, ) = loan.lender.call{value: repaymentAmount}("");
        require(sent, "transfer to lender failed");

        // refund extra if any
        uint extra = msg.value - repaymentAmount;
        if (extra > 0) {
            (bool re, ) = loan.borrower.call{value: extra}("");
            require(re, "refund extra failed");
        }
        emit LoanRepaid(loanId);
    }
}
