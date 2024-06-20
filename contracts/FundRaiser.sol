// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FundRaiser is ERC721URIStorage{

    error FundRaiser_NotOwnerOfNFT();
    error FundRaiser_Completed();
    error FundRaiser_ZeroDonation();
    error FundRaiser_CampaignNotExists();
    error FundRaiser_OverPaid();
    error FundRaiser_NotEnoughRaised();
    error FundRaiser_TransferFailed();

    event StartCampaign(address indexed owner, uint256 indexed id, uint256 reqAmount, uint256 when);
    event ExtendCampaign(address indexed owner, uint256 indexed id,  uint256 additionalAmount);
    event Donation(address indexed donationFrom, uint256 indexed id, uint256 amount);
    event Withdraw(address indexed withdrawTo, uint256 indexed id, uint256 amount);
    event EndCampaign(uint256 indexed id);
    

    struct C {
        uint256 amtRaised;
        uint256 reqAmt;
        bool completed;
        uint256 started;
    }

    mapping(uint256 => C) private s_IdToCampaign;
    uint256 s_id;

    constructor() ERC721("FundRaiser", "FRC") {}

    modifier onlyNFTOwner(uint256 id) {
        if (ownerOf(id) != msg.sender) {
            revert FundRaiser_NotOwnerOfNFT();
        }
        _;
    }

    modifier campaignCompleted(uint256 id) {
        if(s_IdToCampaign[id].completed == true) {
            revert FundRaiser_Completed();
        }
        _;
    }

    function startCampaign(string calldata URI, uint256 amount) external {
        s_id ++;
        _setTokenURI(s_id, URI);
        _safeMint(msg.sender, s_id);
        s_IdToCampaign[s_id].reqAmt = amount;
        s_IdToCampaign[s_id].started = block.timestamp;

        emit StartCampaign(msg.sender, s_id, amount, block.timestamp);
    }

    function extendCampaign(uint256 id, uint256 additionalAmount) external onlyNFTOwner(id) campaignCompleted(id) {
        s_IdToCampaign[s_id].reqAmt += additionalAmount;
        emit ExtendCampaign(msg.sender, id, additionalAmount);
    }

    function donateToCampaign(uint256 id) payable external campaignCompleted(id) {
        if (msg.value == 0) {
            revert FundRaiser_ZeroDonation();
        }
        if (ownerOf(id)==address(0)) {
            revert FundRaiser_CampaignNotExists();
        }
        C storage campaign = s_IdToCampaign[id];

        if(campaign.amtRaised + msg.value > campaign.reqAmt) {
            revert FundRaiser_OverPaid();
        }
        campaign.amtRaised += msg.value;
        emit Donation(msg.sender, id,  msg.value);
    }

    function withdrawFromCampaign(uint256 id, uint256 amount) external onlyNFTOwner(id) campaignCompleted(id) {
        C storage campaign = s_IdToCampaign[id];
        if(amount > campaign.amtRaised) {
            revert FundRaiser_NotEnoughRaised();
        }
        campaign.amtRaised -= amount;
        campaign.reqAmt -= amount;

        (bool success, ) = msg.sender.call{value:amount}("");
        if(!success) {
            revert FundRaiser_TransferFailed();
        }

        emit Withdraw(msg.sender, id, amount);
    } 

    function endCampaign(uint256 id) external onlyNFTOwner(id) campaignCompleted(id) {
        s_IdToCampaign[id].completed = true;
        (bool success, ) = msg.sender.call{value:s_IdToCampaign[id].amtRaised}("");
        if (!success) {
            revert FundRaiser_TransferFailed();
        }

        emit EndCampaign(id);
    }

    // getter function
    function getCampaign(uint id) external view returns (C memory) {
        return s_IdToCampaign[id];
    }

    function getLatestId() external view returns (uint256) {
        return s_id;
    }
 
}



