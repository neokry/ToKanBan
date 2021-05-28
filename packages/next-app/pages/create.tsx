import { ethers } from "ethers";
import { useState } from "react";
import Layout from "../components/layout";
import { web3 } from "../containers";
import { KanbanFactory } from "../typechain";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pm, setPM] = useState("");
  const { kanbanFactory } = web3.useContainer();
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    if (!kanbanFactory) return;
    setLoading(true);
    const kb = kanbanFactory as KanbanFactory;
    const address = ethers.utils.getAddress(pm);
    const tx = await kb.createKanban(title, description, address);
    await tx.wait();
    setTitle("");
    setDescription("");
    setPM("");
    setLoading(false);
  };

  return (
    <div className="w-full h-screen">
      <Layout>
        <div className="mt-6 p-4 flex items-center justify-around">
          <div>
            <div className="text-3xl font-light">Create a new board</div>
            <div className="mt-6 w-full">
              <input
                placeholder="Title"
                className="bg-gray-100 w-full p-2"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <input
                placeholder="Description"
                className="bg-gray-100 w-full p-2 mt-4"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <input
                placeholder="Project Manager Address (0x01aC...)"
                className="bg-gray-100 w-full p-2 mt-4"
                onChange={(e) => setPM(e.target.value)}
                value={pm}
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
