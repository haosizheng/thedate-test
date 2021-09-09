/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockERC165, MockERC165Interface } from "../MockERC165";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060c58061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806301ffc9a714602d575b600080fd5b604e60383660046062565b6001600160e01b0319166301ffc9a760e01b1490565b604051901515815260200160405180910390f35b6000602082840312156072578081fd5b81356001600160e01b0319811681146088578182fd5b939250505056fea26469706673582212204f2014546af293ece786b121c0022402448365183d62a44b4d5ba0d29b9942ed64736f6c63430008040033";

export class MockERC165__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockERC165> {
    return super.deploy(overrides || {}) as Promise<MockERC165>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockERC165 {
    return super.attach(address) as MockERC165;
  }
  connect(signer: Signer): MockERC165__factory {
    return super.connect(signer) as MockERC165__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC165Interface {
    return new utils.Interface(_abi) as MockERC165Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC165 {
    return new Contract(address, _abi, signerOrProvider) as MockERC165;
  }
}