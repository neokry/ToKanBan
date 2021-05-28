import { useRouter } from "next/router";
import web3 from "../containers/web3";

export default function Header() {
  const { authenticate, address } = web3.useContainer();
  const router = useRouter();

  const onConnect = async () => {
    await authenticate();
  };

  const onHome = () => {
    router.push("/");
  };

  return (
    <div className="flex bg-gray-200 w-full px-8 py-3 justify-between items-center">
      <button className="font-bold" onClick={() => onHome()}>
        ToKanBan
      </button>
      {address ? (
        <div className="flex">
          <div
            className="bg-black px-4 py-2 text-white"
            onClick={() => onConnect()}
          >
            {address.slice(0, 5) + "..." + address.slice(address.length - 5)}
          </div>
        </div>
      ) : (
        <button
          className="bg-black px-4 py-2 text-white"
          onClick={() => onConnect()}
        >
          Connect
        </button>
      )}
    </div>
  );
}
