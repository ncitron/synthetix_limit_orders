const should = require("chai").should();
const snx = require("synthetix");

describe("LimitOrder", function() {

    let deployer, account1, account2;
    let limitOrder;

    beforeEach(async () => {
        [deployer, account1, account2] = await ethers.getSigners();
        let proxy = snx.getTarget({ network: 'kovan', contract: 'ReadProxyAddressResolver' }).address;

        let LimitOrder = await ethers.getContractFactory("LimitOrder");
        limitOrder = await LimitOrder.deploy(proxy);
    });

    it("Should be able to fetch sBTC price", async () => {
        await limitOrder.deployed();
        let rate = await limitOrder.getPrice();
        rate.gt(0).should.equal(true);
    });

    it("Should be able to place an order", async () => {
        
    });

    it("Should be able to fetch all orders", async () => {

    });
});
