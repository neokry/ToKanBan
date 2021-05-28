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
          <button
            onClick={() => onCreate()}
            className="w-1/3 h-40 m-3 border shadow-lg text-6xl text-gray-300 flex items-center justify-around"
          >
            +
          </button>
        </div>
      </Layout>
    </div>
  );
}

function KanbanPlacard({ title, description, id }) {
  const router = useRouter();

  return (
    <button
      className="w-1/3 p-6 h-40 m-3 border shadow-lg"
      onClick={() => {
        router.push("/" + id);
      }}
    >
      <div className="text-2xl font-light">{title}</div>
      <div className="mt-2 text-gray-500">{description}</div>
    </button>
  );
}
