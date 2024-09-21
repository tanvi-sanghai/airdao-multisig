// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error TxNotExists(uint transactionIndex);
error TxAlreadyApproved(uint transactionIndex);
error TxAlreadySent(uint transactionIndex);

contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount, uint balance);
    event CreateWithdrawTx(address indexed owner, uint indexed transactionindex, address indexed to, uint amount);
    event ApproveWithdrawTx(address indexed owner, uint indexed transactionIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint immutable public quoremRequired;

    struct WithdrawTx{ address payable to; uint amount; uint approvals; bool sent; }

    mapping(uint => mapping(address => bool)) public isApproved;
    WithdrawTx[] public withdrawals;

    constructor(address[] memory _owners, uint _quoremRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _quoremRequired > 0 && _quoremRequired <= _owners.length,
            "invalid number of required quorum"
        );
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }
        quoremRequired = _quoremRequired;
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender] == true, "Address must be one of the owners");
        _;
    }

    modifier transactionExists(uint _transactionIndex) {
        if (_transactionIndex >= withdrawals.length) {
            revert TxNotExists(_transactionIndex);
        }
        _;
    }

    modifier transactionNotApproved(uint _transactionIndex) {
        if (isApproved[_transactionIndex][msg.sender]) {
            revert TxAlreadyApproved(_transactionIndex);
        }
        _;
    }

    modifier transactionNotSent(uint _transactionIndex) {
        if(withdrawals[_transactionIndex].sent) {
            revert TxAlreadySent(_transactionIndex);
        }
        _;
    }

    function createWithdrawTx(address payable _to, uint _amount) external onlyOwner {
        WithdrawTx memory txn = WithdrawTx({ to: _to, amount: _amount, approvals: 0, sent: false });
        uint txnIndex = withdrawals.length;
        withdrawals.push(txn);
        emit CreateWithdrawTx(msg.sender, txnIndex, _to, _amount);
    }

    function approveWithdrawTx(uint _txnIndex) external onlyOwner transactionExists(_txnIndex) transactionNotApproved(_txnIndex) transactionNotSent(_txnIndex) {
        isApproved[_txnIndex][msg.sender] = true;
        WithdrawTx storage txn = withdrawals[_txnIndex];
        txn.approvals += 1;
        if(txn.approvals >= quoremRequired) {
            txn.sent = true;
            (bool success, ) = txn.to.call{value: txn.amount}("");
            require(success, "transaction failed");
            emit ApproveWithdrawTx(msg.sender, _txnIndex);
        }
    }

   
}