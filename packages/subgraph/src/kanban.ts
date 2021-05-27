import { dataSource } from "@graphprotocol/graph-ts";
import {
  assigned,
  taskRequested,
  taskCompleted,
  taskForReviewed,
  taskReviewRevoke,
  taskSubmitted,
} from "../generated/Contract/Contract";
import { Raider, Task, TaskRequest } from "../generated/schema";

let context = dataSource.context();
let kanbanId = context.getString("id");

export function handleAssigned(event: assigned): void {
  let task = new Task(event.params.task_id.toHexString());
  task.raider = event.params.raiderApproved.toHexString();
  task.save();
}

export function handleTaskRequested(event: taskRequested): void {
  let taskId = event.params.task_id.toHexString();
  let raiderId = event.params.raider.toHexString();
  let taskRequest = new TaskRequest(taskId + "-" + raiderId);

  let raider = new Raider(raiderId);
  raider.save();

  taskRequest.task = taskId;
  taskRequest.raider = raiderId;

  taskRequest.save();
}

export function handleTaskCompleted(event: taskCompleted): void {
  let task = new Task(event.params.task_id.toHexString());
  task.completed = true;
  task.save();
}

export function handleTaskForReviewed(event: taskForReviewed): void {
  let task = new Task(event.params.task_id.toHexString());
  task.reviewed = true;
  task.save();
}

export function handleTaskReviewRevoke(event: taskReviewRevoke): void {
  let task = new Task(event.params.task_id.toHexString());
  task.reviewed = false;
  task.save();
}

export function handleTaskSubmitted(event: taskSubmitted): void {
  let task = new Task(event.params.task_id.toHexString());

  task.kanban = kanbanId;
  task.detail = event.params.detail;
  task.funds = event.params.funds;
  task.reviewed = false;
  task.completed = false;

  task.save();
}
