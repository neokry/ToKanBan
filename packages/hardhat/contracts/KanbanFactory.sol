// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <=0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KanbanFactory {

  event kanbanCreated(uint id, address creator, address instance);

  using Counters for Counters.Counter;

  Counters.Counter private _kanbanIds;
  mapping(uint => address) public kanbanInstances;
  address private baseKanbanAddress;
  
  constructor(address _baseKanbanAddress) {
    baseKanbanAddress = _baseKanbanAddress;
  }

  function createKanban() public {
    _kanbanIds.increment();
    address instance = Clones.clone(baseKanbanAddress);
    kanbanInstances[_kanbanIds.current()] = instance;
    emit kanbanCreated(_kanbanIds.current(), msg.sender, instance);
  }

}