/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { KanbanFactory, KanbanFactoryInterface } from "../KanbanFactory";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_baseKanbanAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "instance",
        type: "address",
      },
    ],
    name: "kanbanCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "createKanban",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "kanbanInstances",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516103da3803806103da8339818101604052602081101561003357600080fd5b810190808051906020019092919050505080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610345806100956000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063140fb2e61461003b578063e740ae2014610045575b600080fd5b61004361009d565b005b6100716004803603602081101561005b57600080fd5b81019080803590602001909291905050506101b0565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100a760006101e3565b60006100d4600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166101f9565b905080600160006100e56000610301565b815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507fe12d08446b8b4120cd0b4b22fee8a7b22842defcd4d6b3de0e18edc92229273561015c6000610301565b3383604051808481526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a150565b60016020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001816000016000828254019250508190555050565b60006040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528260601b60148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f0915050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156102fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f455243313136373a20637265617465206661696c65640000000000000000000081525060200191505060405180910390fd5b919050565b60008160000154905091905056fea26469706673582212203c0250fb2422cc06cfd26a39595bef920fbf4f1d67e1c49d20ce5885f3a61f7564736f6c63430007030033";

export class KanbanFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _baseKanbanAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<KanbanFactory> {
    return super.deploy(
      _baseKanbanAddress,
      overrides || {}
    ) as Promise<KanbanFactory>;
  }
  getDeployTransaction(
    _baseKanbanAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_baseKanbanAddress, overrides || {});
  }
  attach(address: string): KanbanFactory {
    return super.attach(address) as KanbanFactory;
  }
  connect(signer: Signer): KanbanFactory__factory {
    return super.connect(signer) as KanbanFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KanbanFactoryInterface {
    return new utils.Interface(_abi) as KanbanFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KanbanFactory {
    return new Contract(address, _abi, signerOrProvider) as KanbanFactory;
  }
}