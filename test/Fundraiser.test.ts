import { ethers, hardhatArguments } from "hardhat"
import { FundRaiser, FundRaiser__factory } from "../typechain-types"
import { parseEther } from "ethers"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { assert } from "console"
import { deployContract } from "@nomicfoundation/hardhat-ethers/types"
import { expect } from "chai"

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

        it("check ownership", async () => {
            assert(await fundraiser.ownerOf(1), deployer.address)
            // console.log(fundraiser.ownerOf(1))
            // console.log(deployer.address) //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        })

        it("check token uri", async () => {
            assert(await fundraiser.tokenURI(1), tokenURI)
        })

        it("check required amount", async () => {
            campaign = await fundraiser.getCampaign(1)
            assert(campaign.reqAmt.toString(), requiredAmt.toString())
        })

        it("StartCampaign event", async () => {
            await expect(fundraiser.startCampaign(tokenURI, requiredAmt))
                .to.emit(fundraiser, "StartCampaign")
                .withArgs(deployer.address, 2, requiredAmt)
        })
    })


    describe("extendCampaign", () => {
        let extendAmount = parseEther("5")
        beforeEach(async () => {
            await fundraiser.startCampaign(tokenURI, requiredAmt)
        })
        it("check onlyNFTOwner modifier", async () => {
            await expect(fundraiser.connect(user).extendCampaign(1, extendAmount)).to.be.revertedWithCustomError(fundraiser, "FundRaiser_NotOwnerOfNFT")
        })
        it("check notCompleted modifier", async () => {
            let tx = await fundraiser.endCampaign(1)
            await tx.wait()
            await expect(fundraiser.extendCampaign(1, extendAmount)).to.be.revertedWithCustomError(fundraiser, "FundRaiser_Completed")
        })
        it("ExtendCampaign event", async () => {
            await expect(fundraiser.extendCampaign(1, extendAmount)).to.emit(fundraiser, "ExtendCampaign").withArgs(deployer.address, 1, extendAmount)
        })
    })

    describe("donateCampaign", () => {
        let oneEth = parseEther("1")
        beforeEach(async () => {
            await fundraiser.startCampaign(tokenURI, requiredAmt)
        })

        it("check notCompleted modifier", async () => {
            let txn = await fundraiser.endCampaign(1)
            await txn.wait()
            await expect(fundraiser.connect(user).donateToCampaign(1)).to.be.revertedWithCustomError(fundraiser, "FundRaiser_Completed")
        })
        it("check ZeroDonation error", async() => {
            await expect(fundraiser.connect(user).donateToCampaign(1)).to.be.revertedWithCustomError(fundraiser, "FundRaiser_ZeroDonation")
        })
        it("check OverPaid error", async () => {
            await expect(fundraiser.connect(user).donateToCampaign(1, {value: parseEther("11") })).to.revertedWithCustomError(fundraiser, "FundRaiser_OverPaid")
        })
    })
})


