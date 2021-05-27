import { DataSourceContext } from "@graphprotocol/graph-ts";
import { kanbanCreated } from "../generated/KanbanFactory/KanbanFactory";
import { KanbanBoard } from "../generated/schema";
import { Kanban } from "../generated/templates";
import { log } from "@graphprotocol/graph-ts";

export function handleKanbanCreated(event: kanbanCreated): void {
  log.info("Making kanban", []);
  let kanbanBoard = new KanbanBoard(event.params.id.toHexString());
  kanbanBoard.creator = event.params.creator;
  kanbanBoard.address = event.params.instance;
  kanbanBoard.title = event.params.title;
  kanbanBoard.description = event.params.description;
  kanbanBoard.save();

  let context = new DataSourceContext();
  context.setString("id", event.params.id.toHexString());
  Kanban.createWithContext(event.params.instance, context);
}
