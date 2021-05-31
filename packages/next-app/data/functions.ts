import client from ".";
import {
  KANBAN_BOARDS,
  KANBAN_BOARD_BY_ID,
  TASK_REQUESTS_BY_TASK_ID,
} from "./queries";

export const getKanbanBoards = async () => {
  // Collect kanban boards
  let kanbans = await client.request(KANBAN_BOARDS);
  kanbans = kanbans.kanbanBoards;

  // Return kanban boards
  return kanbans;
};

export const getKanbanBoardById = async (id) => {
  // Collect kanban board
  let kanban = await client.request(KANBAN_BOARD_BY_ID(id));
  kanban = kanban.kanbanBoard;

  // Return kanban board
  return kanban;
};

export const getTaskRequests = async (taskId: string, kanbanId: string) => {
  // Collect kanban board
  let requests = await client.request(
    TASK_REQUESTS_BY_TASK_ID(taskId + kanbanId)
  );

  requests = requests.tasks[0].requests;
  requests = requests.map((x) => {
    return { raider: x.raider.id, requestId: x.id };
  });

  // Return kanban board
  return requests;
};
