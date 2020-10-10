//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

import "synthetix/contracts/interfaces/IAddressResolver.sol";
import "synthetix/contracts/interfaces/IExchangeRates.sol";


contract LimitOrder {

    struct Order {
        address user;
        bool isBuy;
        uint256 amount;
        uint256 price;
    }

    Order[] orders;
    IAddressResolver resolver;
    IExchangeRates exchangeRates;

    constructor(IAddressResolver _resolver) {
        resolver =_resolver;
        address addr = resolver.getAddress('ExchangeRates');
        exchangeRates = IExchangeRates(addr);
    }

    function getPrice() public view returns (uint256) {
        return exchangeRates.rateForCurrency('sBTC');
    }

    function placeOrder(bool _isBuy, uint256 _amount, uint256 _price) external payable {
        require(_amount < 0 || _price < 0, 'amount and price must be positive values');
        //TODO: transfer custody of funds to contract
        orders.push(Order({user: msg.sender, isBuy: _isBuy, amount: _amount, price: _price}));
    }

    function getOrders() public view returns (Order[] memory) {
        return orders;
    }

    function execute() public {

    }
}
