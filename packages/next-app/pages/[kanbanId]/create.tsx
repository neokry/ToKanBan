import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { web3 } from "../../containers";
import { Kanban } from "../../typechain";

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [funds, setFunds] = useState("");
  const { selectKanban, kanban, address } = web3.useContainer();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { kanbanId } = router.query;

  const onCreate = async () => {
    setLoading(true);
    const kb = kanban as Kanban;
    const value = ethers.utils.parseEther(funds);
    const tx = await kb.submitTask(value, title, details);
    await tx.wait();
    setLoading(false);
  };

  useEffect(() => {
    if (!kanbanId || !address) return;
    selectKanban(kanbanId);
  }, [kanbanId, address]);

  return (
    <div className="w-full h-screen">
      <Layout>
        <div className="mt-6 p-4 flex items-center justify-around">
          <div>
            <div className="text-3xl font-light">Create a new task</div>
            <div className="mt-6 w-96">
              <input
                placeholder="Title"
                className="bg-gray-100 w-full p-2"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <textarea
                rows={3}
                placeholder="Details"
                className="bg-gray-100 w-full p-2 mt-4"
                onChange={(e) => setDetails(e.target.value)}
                value={details}
              />
              <input
                type="number"
                placeholder="Funds (ETH)"
                className="bg-gray-100 w-full p-2 mt-4"
                onChange={(e) => setFunds(e.target.value)}
                value={funds}
              />
              <div className="flex justify-end w-full">
                <button
                  className="text-white bg-blue-400 p-2 px-9 mt-6"
                  onClick={() => {
                    onCreate();
                  }}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
