usePlugin("@nomiclabs/buidler-waffle");

module.exports = {
    defaultNetwork: "kovan",
    networks: {
        buidlerevm: {
        },
        kovan: {
            url: "https://kovan.infura.io/v3/b6c1c2a638ef45098692c3557068e65d",
            accounts: [
                '0xfde315b3c9c8e1d050e8d3497ec3deac17066b1ed6c9443414d65dfb346b4914',   //0x06BDa46e6867d89f6ef5F03CCe1f331c86d51760
                '0x1bc9cecc20495c85d9109901b475d1fdbf81eca456235c5f6f5c0ab265d960ac',   //0x69b687a22F7EC4F6A630Ef717F55C54A4acB1A14
                '0xeaae5bf1dde0b363c00d442656a86dc97c926f800e46a3fac6f5046fc58fa865'    //0x420810AC4146e3830ad94BCA5a7Fc7200d062D3A
            ],
            timeout: 240000
        }
    },
    solc: {
        version: "0.7.3",
    },
};
