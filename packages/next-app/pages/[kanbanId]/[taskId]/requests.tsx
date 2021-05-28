import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/layout";
import { web3 } from "../../../containers";
import { getTaskRequests } from "../../../data/functions";
import { Kanban } from "../../../typechain";

export default function TaskRequests() {
  const router = useRouter();
  const { kanbanId, taskId } = router.query;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectKanban, address, kanban } = web3.useContainer();
  const [selectedRequest, setSelectedRequest] = useState("");

  const onSelect = async () => {
    setLoading(true);
    const kb = kanban as Kanban;
    console.log("task", taskId, "req", selectedRequest);
    const tx = await kb.assignTaskToRaider(taskId as string, "0x0");
    await tx.wait();
    setLoading(false);
  };

  const load = async () => {
    const reqs = await getTaskRequests(taskId, kanbanId);
    if (reqs) {
      setRequests(reqs);
      console.log("reqs", reqs);
      setSelectedRequest(reqs[0].requestId);
    }
  };

  useEffect(() => {
    if (!kanbanId || !taskId) return;
    load();
  }, [kanbanId, taskId]);

  useEffect(() => {
    if (!kanbanId || !address) return;
    selectKanban(kanbanId);
  }, [kanbanId, address]);

  return (
    <div className="w-full h-screen">
      <Layout>
        <div className="mt-6 p-4 flex items-center justify-around">
          <div>
            <div className="text-3xl font-light">
              Select a raider for this task
            </div>
            <div className="mt-6">
              <select
                onChange={(e) => setSelectedRequest(e.target.value)}
                value={selectedRequest}
                className="bg-gray-100 p-3"
              >
                {requests &&
                  requests.map((req) => (
                    <option value={req.requestId}>{req.raider}</option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end w-full">
              <button
                className="text-white bg-blue-400 p-2 px-9 mt-6"
                onClick={() => {
                  onSelect();
                }}
              >
                {loading ? "Selecting..." : "Select"}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
