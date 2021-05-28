import { useEffect, useState } from "react";
import Web3Modal from "web3modal"; // Web3Modal
import { ethers, providers } from "ethers"; // Ethers
import { createContainer } from "unstated-next"; // Unstated-next containerization
import {
  Kanban__factory as KanbanContact,
  KanbanFactory__factory as KanbanFactoryContract,
  Kanban,
  KanbanFactory,
} from "../typechain";
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnectProvider (Web3Modal)

// Web3Modal provider options
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Inject Infura
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
};

function useWeb3() {
  const [modal, setModal] = useState(null);
  const [kanban, setKanban] = useState<Kanban | null>(null);
  const [kanbanFactory, setKanbanFactory] =
    useState<KanbanFactory | null>(null);
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);

  const setupWeb3Modal = () => {
    // Creaste new web3Modal
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
      providerOptions: providerOptions,
    });

    // Set web3Modal
    setModal(web3Modal);
  };

  /**
   * Authenticate and store necessary items in global state
   */
  const authenticate = async () => {
    // Initiate web3Modal
    const web3Provider = await modal.connect();
    await web3Provider.enable();

    // Generate ethers provider
    const provider = new providers.Web3Provider(web3Provider);

    // Collect signer
    const signer = provider.getSigner();
    setSigner(signer);

    // Collect address
    const address = await signer.getAddress();
    setAddress(address);

    const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;
    const kbFactory = KanbanFactoryContract.connect(factoryAddress, signer);
    setKanbanFactory(kbFactory);
  };

  const selectKanban = async (instance) => {
    const kb = KanbanContact.connect(instance, signer);
    setKanban(kb);
  };

  useEffect(setupWeb3Modal, []);

  return { authenticate, address, kanban, kanbanFactory, selectKanban };
}

// Create unstate-next container
const web3 = createContainer(useWeb3);
export default web3;
