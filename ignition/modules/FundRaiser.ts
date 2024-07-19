const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules")

export default buildModule("FundRaiser", (m: any) => {

    const fundRaiser = m.contract("FundRaiser", [])
    return fundRaiser;
})

// deployed on localhost (chain id 31337)
/**
 * Executed FundRaiser#FundRaiser

[ FundRaiser ] successfully deployed 🚀

Deployed Addresses

FundRaiser#FundRaiser - 0x5FbDB2315678afecb367f032d93F642f64180aa3
*/