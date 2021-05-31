import { dataSource, log } from "@graphprotocol/graph-ts";
import {
  assigned,
  taskRequested,
  taskCompleted,
  taskForReviewed,
  taskReviewRevoke,
  taskSubmitted,
  contractPaid,
} from "../generated/templates/Kanban/Kanban";
import { KanbanBoard, Raider, Task, TaskRequest } from "../generated/schema";

let context = dataSource.context();
let kanbanId = context.getString("id");

export function handleAssigned(event: assigned): void {
  let task = new Task(event.params.task_id.toHexString() + kanbanId);
  task.raider = event.params.raiderApproved.toHexString();
  task.save();
}

export function handleTaskRequested(event: taskRequested): void {
  let taskId = event.params.task_id.toHexString();
  let raiderId = event.params.raider.toHexString();
  let requestId = event.params.requestId.toHexString();
  let taskRequest = new TaskRequest(requestId);

  let raider = new Raider(raiderId);
  raider.save();

  taskRequest.task = taskId + kanbanId;
  taskRequest.raider = raiderId;

  taskRequest.save();
}

export function handleTaskCompleted(event: taskCompleted): void {
  let task = new Task(event.params.task_id.toHexString() + kanbanId);
  task.completed = true;
  task.save();
}

export function handleTaskForReviewed(event: taskForReviewed): void {
  let task = new Task(event.params.task_id.toHexString() + kanbanId);
  task.reviewed = true;
  task.save();
}

export function handleTaskReviewRevoke(event: taskReviewRevoke): void {
  let task = new Task(event.params.task_id.toHexString() + kanbanId);
  task.reviewed = false;
  task.save();
}

export function handleTaskSubmitted(event: taskSubmitted): void {
  let task = new Task(event.params.task_id.toHexString() + kanbanId);

  task.taskID = event.params.task_id.toHexString();
  task.kanban = kanbanId;
  task.title = event.params.title;
  task.detail = event.params.detail;
  task.funds = event.params.funds;
  task.reviewed = false;
  task.completed = false;

  task.save();

  let kanbanBoard = KanbanBoard.load(kanbanId);
  kanbanBoard.funds = kanbanBoard.funds.minus(event.params.funds);
  kanbanBoard.save();
}

export function handleContractPaid(event: contractPaid): void {
  let kanbanBoard = KanbanBoard.load(kanbanId);
  kanbanBoard.funds = event.params.fundAmount.plus(kanbanBoard.funds);
  kanbanBoard.save();
}
