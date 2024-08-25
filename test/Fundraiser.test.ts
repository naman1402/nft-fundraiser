import { ethers, hardhatArguments } from "hardhat"
import { FundRaiser, FundRaiser__factory } from "../typechain-types"
import { parseEther } from "ethers"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { assert } from "console"
import { deployContract } from "@nomicfoundation/hardhat-ethers/types"
import { expect } from "chai"
import { token } from "../typechain-types/@openzeppelin/contracts"

describe("Fundraiser Test", () => {
    let tokenURI = "www.google.com"
    let requiredAmt = parseEther("10")
    let fundraiser: FundRaiser
    let deployer: SignerWithAddress
    let user: SignerWithAddress
    let accounts: SignerWithAddress[]
    let campaign: FundRaiser.CStructOutput

    beforeEach(async() => {
        ;[deployer, user, ...accounts] = await ethers.getSigners()
        fundraiser = await ethers.getContractAt("FundRaiser", deployer)
    })

    it("Constructor", async () => {
        assert(fundraiser.name(), "FundRaiser")
        assert( fundraiser.symbol(), "FRC")
    })

    it("get latest token id", async() => {
        assert( fundraiser.getLatestId(), "0")
    })


    describe("startCampaign", () => {
        beforeEach(async () => {
            await fundraiser.startCampaign(tokenURI, requiredAmt)
        })

        it("check ownership", async() => {
            console.log(await fundraiser.ownerOf(1))
            assert(await fundraiser.ownerOf(1), deployer.address)
        })

        it("check tokenURI", async () => {
            assert(await fundraiser.tokenURI(1), tokenURI)
        })
        
    })


    describe("extendCampaign", () => {
        
    })

    describe("donateCampaign", () => {
        
    })

    describe("withdraw", () => {

    })

    describe("endCampaign", () => {

    })
})


