import { gql } from "graphql-request"; // graphql query language

// Collect information on all kanban boards
export const KANBAN_BOARDS = gql`
  {
    kanbanBoards {
      id
      address
      title
      description
    }
  }
`;

// Collect information on a single board
export const KANBAN_BOARD_BY_ID = (id) => {
  return gql`
    {
      kanbanBoard(id: "${id}") {
        id
        pm
        address
        title
        funds
        description
        tasks {
          requests {
            raider {
              id
            }
          }
          id
          title
          detail
          funds
          completed
          raider {
            id
          }
        }
      }
    }
  `;
};

export const TASK_REQUESTS_BY_TASK_ID = (taskId, kanbanId) => {
  return gql`
    {
        tasks(where: { id: "${taskId}", kanban: "${kanbanId}" }) {
            requests {
                id
                raider {
                    id
                }
            }
        }
    }
  `;
};
