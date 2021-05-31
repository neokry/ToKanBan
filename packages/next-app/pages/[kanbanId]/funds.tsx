import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { web3 } from "../../containers";
import { Kanban } from "../../typechain";

export default function Funds() {
  const [funds, setFunds] = useState("");
  const { selectKanban, kanban, address } = web3.useContainer();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { kanbanId } = router.query;

  const onFund = async () => {
    setLoading(true);
    const kb = kanban as Kanban;
    const value = ethers.utils.parseEther(funds);
    const tx = await kb.payContract(value, { value: value });
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
            <div className="text-3xl font-light">Add funds to board</div>
            <div className="mt-6 w-96">
              <input
                type="number"
                placeholder="Fund Amount (ETH)"
                className="bg-gray-100 w-full p-2 mt-2"
                onChange={(e) => setFunds(e.target.value)}
                value={funds}
              />
              <div className="flex justify-end w-full mt-6">
                <button
                  className="p-2 px-9 border mr-4"
                  onClick={() => {
                    router.push("/" + kanbanId);
                  }}
                >
                  Go Back
                </button>
                <button
                  className="text-white bg-blue-400 p-2 px-9"
                  onClick={() => {
                    onFund();
                  }}
                >
                  {loading ? "Adding Funds..." : "Add Funds"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
