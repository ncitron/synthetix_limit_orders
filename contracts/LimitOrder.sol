//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

import "synthetix/contracts/interfaces/IAddressResolver.sol";
import "synthetix/contracts/interfaces/IExchangeRates.sol";
import "synthetix/contracts/interfaces/ISynth.sol";


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
    ISynth sUSD;
    ISynth sBTC;

    constructor(IAddressResolver _resolver) {
        resolver =_resolver;
        address addr = resolver.getAddress('ExchangeRates');
        exchangeRates = IExchangeRates(addr);
        sUSD = ISynth(resolver.getSynth('sUSD'));
        sBTC = ISynth(resolver.getSynth('sBTC'));
    }

    function getPrice() public view returns (uint256) {
        return exchangeRates.rateForCurrency('sBTC');
    }

    function placeBuyOrder(uint256 _amount, uint256 _price) external payable {
        require(_amount > 0 || _price > 0, 'amount and price must be positive values');
        sUSD.transferFromAndSettle(msg.sender, address(this), _amount);
        orders.push(Order({user: msg.sender, isBuy: true, amount: _amount, price: _price}));
    }

    function placeSellOrder(uint256 _amount, uint256 _price) external payable {
        require(_amount > 0 || _price > 0, 'amount and price must be positive values');
        sBTC.transferFromAndSettle(msg.sender, address(this), _amount);
        orders.push(Order({user: msg.sender, isBuy: false, amount: _amount, price: _price}));
    }

    function getOrders() public view returns (Order[] memory) {
        return orders;
    }
    
    function cancel() public {

    }

    function execute() public {

    }
}
