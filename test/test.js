require("chai").should();
const snx = require("synthetix");

describe("LimitOrder", function() {

    let account0, account1, account2;
    let limitOrder;
    let sUSD, sBTC;

    beforeEach(async () => {
        [account0, account1, account2] = await ethers.getSigners();

        let proxy = snx.getTarget({ network: 'kovan', contract: 'ReadProxyAddressResolver' }).address;

        let synths = snx.getTokens({network: 'kovan'});
        sUSD = new ethers.Contract(synths.filter(({ symbol }) => symbol === 'sUSD')[0].address, erc20, account0);
        sBTC = new ethers.Contract(synths.filter(({ symbol }) => symbol === 'sBTC')[0].address, erc20, account0);

        let LimitOrder = await ethers.getContractFactory("LimitOrder");
        limitOrder = await LimitOrder.deploy(proxy);
        await limitOrder.deployed();
    });

    it("Should be able to fetch sBTC price", async function() {
        this.timeout(1_000_000);
        let rate = await limitOrder.getPrice();
        rate.gt(0).should.equal(true);
    });

    it("Should be able to place a buy limit order", async function() {
        this.timeout(1_000_000);
        await sUSD.approve(limitOrder.address, 1);
        let initialBalance = await sUSD.balanceOf(account0.getAddress());
        await limitOrder.placeBuyOrder(1, 12000);
        let finalBalance = await sUSD.balanceOf(account0.getAddress());
        finalBalance.sub(initialBalance).eq(-1).should.equal(true);
        let order = await limitOrder.getOrder(0);
        order.price.eq(12000).should.equal(true);
    });

    it("should be able to place a sell limit order", async function() {
        this.timeout(1_000_000);
        await sBTC.approve(limitOrder.address, 1);
        let initialBalance = await sBTC.balanceOf(account0.getAddress());
        await limitOrder.placeSellOrder(1, 12000);
        let finalBalance = await sBTC.balanceOf(account0.getAddress());
        finalBalance.sub(initialBalance).eq(-1).should.equal(true);
        let order = await limitOrder.getOrder(0);
        order.price.eq(12000).should.equal(true);
    });

    it("should be able to cancel an order", async function() {
        this.timeout(1_000_000);
        await sUSD.approve(limitOrder.address, 1);
        let initialBalance = await sUSD.balanceOf(account0.getAddress());
        await limitOrder.placeBuyOrder(1, 12000);
        let order = await limitOrder.getOrder(0);
        order.price.eq(12000).should.equal(true);
        let orderCount = await limitOrder.getOrderCount();
        orderCount.should.equal(1);
        await limitOrder.cancelOrder(0);
        orderCount = await limitOrder.getOrderCount();
        orderCount.should.equal(0);
        let finalBalance = await sUSD.balanceOf(account0.getAddress());
        initialBalance.should.equal(finalBalance);
    })
});


const erc20 = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]