// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <=0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Kanban.sol";

contract KanbanFactory {

  event kanbanCreated(uint id, address creator, address instance, address pm, string title, string description);

  using Counters for Counters.Counter;

  Counters.Counter private _kanbanIds;
  mapping(uint => KanbanInfo) public kanbanInfo;
  address private baseKanbanAddress;

  struct KanbanInfo {
    address instance;
    string title;
    string description;
  }
  
  constructor(address _baseKanbanAddress) {
    baseKanbanAddress = _baseKanbanAddress;
  }

  function createKanban(string memory _title, string memory _description, address _pm) public {
    _kanbanIds.increment();
    address instance = Clones.clone(baseKanbanAddress);
    kanbanInfo[_kanbanIds.current()].instance = instance;
    kanbanInfo[_kanbanIds.current()].title = _title;
    kanbanInfo[_kanbanIds.current()].description = _description;
    Kanban(instance).setPM(_pm);
    emit kanbanCreated(_kanbanIds.current(), msg.sender, instance, _pm, _title, _description);
  }

}