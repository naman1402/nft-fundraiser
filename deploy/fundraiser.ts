import verify  from "../utils/verify"
import { network } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const chain = ["hardhat", "localhost"]

const deployFundraiser = async(hre: HardhatRuntimeEnvironment) => {
    let blockConfirmations = 0
    if(!chain.includes(network.name)) {
        blockConfirmations = 6
    }

    const { deployments, getNamedAccounts } = hre
    const { deploy, log } = deployments
    const {deployer } = await getNamedAccounts()
    const Fundraiser = await deploy("Fundraiser", {
        from: deployer,
        args: [],
        log: true,
        waitForConfirmations: blockConfirmations
    })

    if(chain.includes(network.name)) {
        console.log(network.name)
    }
    else {
        await verify(Fundraiser.address, [])
    }
    log("----------------------------------")

}

export default deployFundraiser
deployFundraiser.tags = ["all"]