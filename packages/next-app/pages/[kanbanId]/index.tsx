import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { getKanbanBoardById } from "../../data/functions";

export default function Kanban() {
  const router = useRouter();
  const { kanbanId } = router.query;
  const [kanban, setKanban] = useState(null);

  const loadBoard = async () => {
    const kb = await getKanbanBoardById(kanbanId);
    setKanban(kb);
  };

  const onAdd = () => {
    router.push("/" + kanbanId + "/create");
  };

  useEffect(() => {
    loadBoard();
  }, []);

  return (
    <div>
      <Layout>
        <div className="p-3">
          <div className="ml-5 text-2xl font-light">
            {kanban && kanban.title}
          </div>
          <div className="flex mt-6">
            <div className="w-1/3 px-6">
              <div className="text-gray-500">New Tasks</div>
              <button
                className="h-32 w-full p-3 m-2 border text-gray-400 text-4xl"
                onClick={() => onAdd()}
              >
                +
              </button>
            </div>
            <div className="w-1/3 px-6">
              <div className="text-gray-500">For Review</div>
            </div>
            <div className="w-1/3 px-6">
              <div className="text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

function Task({ title, description, funds }) {
  <button className="h-32 w-full p-3 m-2 border text-gray-400 text-4xl">
    <div>{title}</div>
    <div>{description}</div>
    <div>{funds}</div>
  </button>;
}
