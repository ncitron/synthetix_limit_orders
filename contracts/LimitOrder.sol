//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;
pragma experimental ABIEncoderV2;

import "synthetix/contracts/interfaces/IAddressResolver.sol";
import "synthetix/contracts/interfaces/IExchangeRates.sol";
import "synthetix/contracts/interfaces/ISynth.sol";
import "synthetix/contracts/interfaces/IERC20.sol";

interface ISynthERC20 is ISynth, IERC20 {}

contract LimitOrder {

    struct Order {
        address user;
        bool isBuy;
        uint256 amount;
        uint256 price;
    }

    mapping(uint256 => Order) orders;
    uint idCounter;
    IAddressResolver resolver;
    IExchangeRates exchangeRates;
    ISynthERC20 sUSD;
    ISynthERC20 sBTC;

    constructor(IAddressResolver _resolver) {
        idCounter = 0;
        resolver =_resolver;
        address addr = resolver.getAddress('ExchangeRates');
        exchangeRates = IExchangeRates(addr);
        sUSD = ISynthERC20(resolver.getSynth('sUSD'));
        sBTC = ISynthERC20(resolver.getSynth('sBTC'));
    }

    function getPrice() public view returns (uint256) {
        return exchangeRates.rateForCurrency('sBTC');
    }

    function placeBuyOrder(uint256 _amount, uint256 _price) external payable returns (uint256) {
        require(_amount > 0 || _price > 0, 'amount and price must be positive values');
        sUSD.transferFromAndSettle(msg.sender, address(this), _amount);
        orders[idCounter] = Order({user: msg.sender, isBuy: true, amount: _amount, price: _price});
        idCounter++;
        return idCounter-1;
    }

    function placeSellOrder(uint256 _amount, uint256 _price) external payable returns (uint256) {
        require(_amount > 0 || _price > 0, 'amount and price must be positive values');
        sBTC.transferFromAndSettle(msg.sender, address(this), _amount);
        orders[idCounter] = Order({user: msg.sender, isBuy: false, amount: _amount, price: _price});
        idCounter++;
        return idCounter-1;
    }

    function getOrder(uint256 id) public view returns (Order memory) {
        return orders[id];
    }

    function getOrderCount() public view returns (uint256) {
        return idCounter;
    }
    
    function cancelOrder(uint256 id) public {
        Order memory order = orders[id];
        require(idCounter > 0, 'there are no orders to cancel');
        require(msg.sender == order.user, 'only order creators can cancel');
        if(order.isBuy) {
            sUSD.approve(address(this), order.amount);
            sUSD.transferFromAndSettle(address(this), msg.sender, order.amount);
        } else {
            sBTC.approve(address(this), order.amount);
            sBTC.transferFromAndSettle(address(this), msg.sender, order.amount);
        }
        orders[id] = orders[idCounter-1];
        delete orders[idCounter-1];
        idCounter--;
    }

    function execute() public {

    }
}
