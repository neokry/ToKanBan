import web3 from "../containers/web3";

export default function Header() {
  const { authenticate, address, isPM } = web3.useContainer();

  const onConnect = async () => {
    await authenticate();
  };

  return (
    <div className="flex bg-gray-200 w-full px-8 py-3 justify-between items-center">
      <div className="font-bold">ToKanBan</div>
      {address ? (
        <div className="flex">
          {isPM && (
            <button
              className="bg-blue-400 px-4 py-2 text-white mr-4"
              onClick={() => onConnect()}
            >
              Create Task
            </button>
          )}
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
