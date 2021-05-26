// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <=0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ToKanBan is ReentrancyGuard{
    //Events
    event taskSubmitted(uint task_id, uint funds, string detail);
    event taskRequested(uint task_id, address raider, uint requestId);
    event assigned(uint  task_id,address raiderApproved);
    event taskForReviewed(uint task_id);
    event taskReviewRevoke(uint task_id);
    event taskCompleted(uint task_id, uint fundReleased);
    
    //Globals
    using Counters for Counters.Counter;
    
    Counters.Counter private _taskIds;
    address public pm;
    address public client; //address that transfer ether to the contract
    uint public contractBalance=0; //to check if there is enough fund inthe contract
    
    constructor() {
        pm = msg.sender;
    }
    
    //the contract can receive ether from external contract
    function payContract() external payable {
        client=msg.sender;
        contractBalance = contractBalance + msg.value;    
    }
    
    //task log would record all the task within a Project/contract
    mapping(uint => task) public taskLog;
    
    //structure of each task which would need to be requested by Raider and approved by PM
    struct task{
        //task details
        string details; //describing the details of the task
        uint funds; //funds allocated to the task 

        //raider details
        address payable[] requests;
        bool assigned;
        address payable raider;
        bool reviewed;
        mapping(address => bool) approvals;
        bool closed;
    }

    // Modfier restricting access to PM
    modifier onlyPM(){
        require(pm == msg.sender,"Only the PM can access this ");
        _;
    }
    
    //Submitting a task 
    function submitTask(uint _funds,string memory _details) public onlyPM{
        require(_funds >= contractBalance,"Not enough funds"); //checking if the contract has enough funds before allocating funds to the task
        uint id = _taskIds.current();
        
        taskLog[id].funds= _funds;
        taskLog[id].details= _details;
        taskLog[id].reviewed=false;
        taskLog[id].closed=false;
        taskLog[id].approvals[pm]=false;
        taskLog[id].approvals[client]= false;

        contractBalance=contractBalance-_funds;
        _taskIds.increment();
        emit taskSubmitted(id, _funds, _details);
    }

    //Task requested by a raider
    function requestTask(uint _id) public{
        taskLog[_id].requests.push(payable(msg.sender));
        uint requestId = taskLog[_id].requests.length;
        emit taskRequested(_id, msg.sender, requestId);
    }
    
    //View Raider who have requested a Task
    function viewRequests(uint _taskid, uint _requestId) view public returns(address, uint){
        return (taskLog[_taskid].requests[_requestId], taskLog[_taskid].funds);
    }

    //Raider approved by PM
    function assignTaskToRaider(uint _taskid, uint _requestId) public onlyPM{
        taskLog[_taskid].raider = taskLog[_taskid].requests[_requestId];
        taskLog[_taskid].assigned=true;
        emit assigned(_taskid,taskLog[_taskid].requests[_requestId]);
    }
    
    //task sent for review by PM by Raider
    function taskForReview(uint _taskid) public{
        require((taskLog[_taskid].raider==msg.sender), "Dont have the access to send the task for review"); 
        taskLog[_taskid].reviewed=true;
        emit taskForReviewed(_taskid);
    }
    
    
    //task reviewed but not accepted
    function taskReviewRevoked(uint _taskid) public {
        require(pm==msg.sender || client == msg.sender,"You are not the approver");
        taskLog[_taskid].reviewed=false;
        emit taskReviewRevoke(_taskid);
    }
    
    //task Approved by PM and Client
    function taskApproved(uint _taskid) public nonReentrant{
        require(taskLog[_taskid].reviewed==true,"The task has not been sent for review");
        require(pm==msg.sender || client == msg.sender,"You are not the approver");
        if(pm==msg.sender){
            taskLog[_taskid].approvals[pm]= true;
        }
        
        if(client==msg.sender){
            taskLog[_taskid].approvals[client]= true;
        }
            
        if(taskLog[_taskid].approvals[client]== true && taskLog[_taskid].approvals[pm]== true){
            uint funds = taskLog[_taskid].funds;
            address payable raider = taskLog[_taskid].raider;

            raider.transfer(funds);
            taskLog[_taskid].funds=0;
            taskLog[_taskid].closed=true;
            emit taskCompleted(_taskid, funds);    
        }
    }
}    
