// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FundRaiser is ERC721URIStorage{

    error FundRaiser_NotOwnerOfNFT();
    error FundRaiser_Completed();

    event StartCampaign(address indexed owner, uint256 indexed id, uint256 reqAmount, uint256 when);
    event ExtendCampaign(address indexed owner, uint256 indexed id,  uint256 additionalAmount);

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








    
}



