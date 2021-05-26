// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <=0.8.0;

import "./ToKanBan.sol";

contract ToKanBanFactory {
  uint contractID = 0;
  mapping(uint => ToKanBan) ChildContracts;  

  function createKanBanBoard(address _client) external returns (uint, ToKanBan){
      contractID++;
      ChildContracts[contractID] = new ToKanBan(msg.sender,_client);
      return (contractID,ChildContracts[contractID]);
  }
  
  function getToKanBanBoard(uint _contractid) external view returns (ToKanBan) {
        return ChildContracts[_contractid];
    }
      
}
