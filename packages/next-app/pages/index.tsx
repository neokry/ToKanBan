import { useEffect, useState } from "react";
import Header from "../components/header";
import Layout from "../components/layout";
import { getKanbanBoards } from "../data/functions";
import { useRouter } from "next/router";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [kanbans, setKanbans] = useState<any[] | null>(null);
  const router = useRouter();

  const loadBoards = async () => {
    setLoading(true);
    const kbs = await getKanbanBoards();
    setKanbans(kbs);
    setLoading(false);
  };

  const onCreate = () => {
    router.push("/create");
  };

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <div className="w-screen h-screen">
      <Layout>
        <div className="mt-2 flex flex-wrap">
          {kanbans &&
            kanbans.map((kb) => (
              <KanbanPlacard
                title={kb.title}
                description={kb.description}
                id={kb.id}
              />
            ))}
          <div className="w-1/3 h-52 p-4">
            <button
              onClick={() => onCreate()}
              className="w-full h-full border shadow-lg text-6xl text-gray-300 flex items-center justify-around"
            >
              +
            </button>
          </div>
        </div>
      </Layout>
    </div>
  );
}

function KanbanPlacard({ title, description, id }) {
  const router = useRouter();

  return (
    <div className="w-1/3 h-52 p-4">
      <button
        className="w-full p-2 h-full border shadow-lg"
        onClick={() => {
          router.push("/" + id);
        }}
      >
        <div className="text-2xl font-light">{title}</div>
        <div className="mt-2 text-gray-500">{description}</div>
      </button>
    </div>
  );
}
