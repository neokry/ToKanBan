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
        address
        title
        description
        tasks {
          id
          title
          detail
          funds
          raider {
            id
          }
        }
      }
    }
  `;
};

export const TASK_REQUESTS_BY_TASK_ID = (id) => {
  return gql`
    {
        task(id: "${id}") {
            requests {
                raider {
                    id
                }
            }
        }
    }
  `;
};
