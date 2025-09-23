// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleVoting {
    // Vote counts
    uint256 public yesCount;
    uint256 public noCount;
    
    // Prevent double voting
    mapping(address => bool) public hasVoted;
    
    // Events
    event Voted(address indexed voter, bool choice);
    
    /// @notice Vote on the fashion poll
    /// @param choice true for Yes, false for No
    function vote(bool choice) external {
        require(!hasVoted[msg.sender], "Already voted");
        
        if (choice) {
            yesCount++;
        } else {
            noCount++;
        }
        
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, choice);
    }
    
    /// @notice Get current vote tallies
    /// @return yes Number of yes votes
    /// @return no Number of no votes
    function getTallies() external view returns (uint256 yes, uint256 no) {
        return (yesCount, noCount);
    }
    
    /// @notice Get total number of votes
    function getTotalVotes() external view returns (uint256) {
        return yesCount + noCount;
    }
}