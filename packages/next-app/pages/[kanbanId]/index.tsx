import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { web3 } from "../../containers";
import { getKanbanBoardById } from "../../data/functions";
import { Kanban } from "../../typechain";
import TaskRequests from "./[taskId]/requests";

export default function KanbanBoard() {
  const router = useRouter();
  const { kanbanId } = router.query;
  const { kanban, selectKanban } = web3.useContainer();
  const [isPM, setIsPM] = useState(null);
  const [kanbanInfo, setKanbanInfo] = useState(null);
  const [newTasks, setNewTasks] = useState(null);
  const [inProgressTasks, setInProgressTasks] = useState(null);
  const [forReviewTasks, setForReviewTasks] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(null);
  const { address } = web3.useContainer();

  const loadBoard = async () => {
    const kb = await getKanbanBoardById(kanbanId);
    const newTasks = kb.tasks.filter((x) => x.raider == null);
    setNewTasks(newTasks);
    const inProgress = kb.tasks.filter((x) => x.raider && !x.reviewed);
    setInProgressTasks(inProgress);
    setKanbanInfo(kb);
  };

  const checkIsPM = () => {
    const pm = ethers.utils.getAddress(kanbanInfo.pm);
    const check = pm.localeCompare(address) === 0;
    setIsPM(check);
  };

  const onAdd = () => {
    router.push("/" + kanbanId + "/create");
  };

  const onFund = () => {
    router.push("/" + kanbanId + "/funds");
  };

  useEffect(() => {
    if (!kanbanId) return;
    loadBoard();
  }, [kanbanId]);

  useEffect(() => {
    if (!kanbanInfo || !address) return;
    checkIsPM();
  }, [address, kanbanInfo]);

  useEffect(() => {
    if (!kanbanId || !address) return;
    selectKanban(kanbanId);
  }, [kanbanId, address]);

  return (
    <div>
      <Layout>
        <div className="p-3">
          {kanbanInfo ? (
            <div className="mx-5 text-2xl font-light flex items-center justify-between">
              <div>{kanbanInfo.title}</div>
              <div className="flex items-center">
                <div className="mr-6">
                  Total Funds: {ethers.utils.formatEther(kanbanInfo.funds)}
                  <span className="text-base">ETH</span>
                </div>
                <button
                  className="text-lg border p-2 px-4 border-gray-400 rounded-lg"
                  onClick={() => onFund()}
                >
                  Add Funds
                </button>
              </div>
            </div>
          ) : (
            <div className="mx-5 text-2xl font-light">Board loading...</div>
          )}
          <div className="flex mt-6">
            <div className="w-1/3 px-6">
              <div className="text-gray-500">New Tasks</div>
              {newTasks &&
                newTasks.map((task) => (
                  <NewTask
                    task={task}
                    isPM={isPM}
                    kanban={kanban}
                    address={address}
                  />
                ))}
              <button
                className="h-32 w-full p-3 m-2 border text-gray-400 text-4xl"
                onClick={() => onAdd()}
              >
                +
              </button>
            </div>
            <div className="w-1/3 px-6">
              <div className="text-gray-500">In Progress</div>
              {inProgressTasks &&
                inProgressTasks.map((task) => (
                  <ProgressTask
                    task={task}
                    isPM={isPM}
                    kanban={kanban}
                    taskForReview={(data) => setForReviewTasks(data)}
                  />
                ))}
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

function NewTask({ task, isPM, kanban, address }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { kanbanId } = router.query;
  const { id, title, detail, requests, funds } = task;
  const [hasRequest, setHasRequest] = useState(false);

  const onRequest = async () => {
    setLoading(true);
    const kb = kanban as Kanban;
    const tx = await kb.requestTask(id);
    await tx.wait();
    setLoading(false);
  };

  const onViewRequests = () => {
    router.push("/" + kanbanId + "/" + id + "/requests");
  };

  useEffect(() => {
    if (!requests || !address) return;
    requests.map((x) => {
      const tmp = ethers.utils.getAddress(x.raider.id);
      if (tmp.localeCompare(address) === 0) setHasRequest(true);
    });
  }, [address, requests]);

  return (
    <div className="h-40 w-full p-3 m-2 border text-gray-400">
      <div className="text-2xl text-black">{title}</div>
      <div className="h-6">{detail}</div>
      <div className="text-sm mt-2">{ethers.utils.formatEther(funds)} ETH</div>
      {isPM ? (
        <button
          onClick={() => onViewRequests()}
          className="w-full mt-4 bg-blue-400 text-white p-2"
        >
          View Requests
        </button>
      ) : hasRequest ? (
        <div className="w-full mt-4 bg-blue-200 text-white p-2 flex justify-around">
          Task Requested
        </div>
      ) : (
        <button
          onClick={() => onRequest()}
          className="w-full mt-4 bg-blue-400 text-white p-2"
        >
          {loading ? "Requesting Task..." : "Request Task"}
        </button>
      )}
    </div>
  );
}

function ProgressTask({ task, kanban, isPM, taskForReview }) {
  const { id, title, detail, requests, funds,raider } = task;
  const [loading, setLoading] = useState(false);
  
  const onSubmitTask = async () => {
    const kb = kanban as Kanban;
    const tasklog = await kb.taskLog(id); 
    taskForReview(tasklog.reviewed);
  };

  return (
    <div className="h-40 w-full p-3 m-2 border text-gray-400">
      <div className="text-2xl text-black">{title}</div>
      <div className="h-6">{detail}</div>
      <div className="h-6">{raider.id}</div>
      <div className="text-sm mt-2">{ethers.utils.formatEther(funds)} ETH</div>
      <button
          onClick={() => onSubmitTask()}
          className="w-full mt-4 bg-blue-400 text-white p-2"
      >
          Submit Task
        </button>
    </div>
  );
}