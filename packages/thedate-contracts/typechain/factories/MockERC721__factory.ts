/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockERC721, MockERC721Interface } from "../MockERC721";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604080518082018252600a808252694d6f636b45524337323160b01b6020808401828152855180870190965292855284015281519192916200005791600091620000e6565b5080516200006d906001906020840190620000e6565b5050506200008a620000846200009060201b60201c565b62000094565b620001c9565b3390565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620000f4906200018c565b90600052602060002090601f01602090048101928262000118576000855562000163565b82601f106200013357805160ff191683800117855562000163565b8280016001018555821562000163579182015b828111156200016357825182559160200191906001019062000146565b506200017192915062000175565b5090565b5b8082111562000171576000815560010162000176565b600181811c90821680620001a157607f821691505b60208210811415620001c357634e487b7160e01b600052602260045260246000fd5b50919050565b61157380620001d96000396000f3fe608060405234801561001057600080fd5b50600436106100eb5760003560e01c806370a082311161009257806370a08231146101b9578063715018a6146101da5780638da5cb5b146101e257806395d89b41146101f3578063a22cb465146101fb578063b88d4fde1461020e578063c87b56dd14610221578063e985e9c514610234578063f2fde38b1461024757600080fd5b806301ffc9a7146100f057806306fdde0314610118578063081812fc1461012d578063095ea7b31461015857806323b872dd1461016d57806340c10f191461018057806342842e0e146101935780636352211e146101a6575b600080fd5b6101036100fe366004611239565b61025a565b60405190151581526020015b60405180910390f35b6101206102ac565b60405161010f9190611321565b61014061013b366004611271565b61033e565b6040516001600160a01b03909116815260200161010f565b61016b610166366004611210565b6103cb565b005b61016b61017b3660046110c6565b6104dc565b61016b61018e366004611210565b61050d565b61016b6101a13660046110c6565b610545565b6101406101b4366004611271565b610560565b6101cc6101c736600461107a565b6105d7565b60405190815260200161010f565b61016b61065e565b6006546001600160a01b0316610140565b610120610694565b61016b6102093660046111d6565b6106a3565b61016b61021c366004611101565b610764565b61012061022f366004611271565b61079c565b610103610242366004611094565b610874565b61016b61025536600461107a565b6108a2565b60006001600160e01b031982166380ac58cd60e01b148061028b57506001600160e01b03198216635b5e139f60e01b145b806102a657506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600080546102bb9061147b565b80601f01602080910402602001604051908101604052809291908181526020018280546102e79061147b565b80156103345780601f1061030957610100808354040283529160200191610334565b820191906000526020600020905b81548152906001019060200180831161031757829003601f168201915b5050505050905090565b60006103498261093d565b6103af5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006103d682610560565b9050806001600160a01b0316836001600160a01b031614156104445760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084016103a6565b336001600160a01b038216148061046057506104608133610874565b6104cd5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f776044820152771b995c881b9bdc88185c1c1c9bdd995908199bdc88185b1b60421b60648201526084016103a6565b6104d7838361095a565b505050565b6104e633826109c8565b6105025760405162461bcd60e51b81526004016103a6906113bb565b6104d7838383610a92565b6006546001600160a01b031633146105375760405162461bcd60e51b81526004016103a690611386565b6105418282610c32565b5050565b6104d783838360405180602001604052806000815250610764565b6000818152600260205260408120546001600160a01b0316806102a65760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b60648201526084016103a6565b60006001600160a01b0382166106425760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b60648201526084016103a6565b506001600160a01b031660009081526003602052604090205490565b6006546001600160a01b031633146106885760405162461bcd60e51b81526004016103a690611386565b6106926000610c4c565b565b6060600180546102bb9061147b565b6001600160a01b0382163314156106f85760405162461bcd60e51b815260206004820152601960248201527822a9219b99189d1030b8383937bb32903a379031b0b63632b960391b60448201526064016103a6565b3360008181526005602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b61076e33836109c8565b61078a5760405162461bcd60e51b81526004016103a6906113bb565b61079684848484610c9e565b50505050565b60606107a78261093d565b61080b5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b60648201526084016103a6565b600061082260408051602081019091526000815290565b90506000815111610842576040518060200160405280600081525061086d565b8061084c84610cd1565b60405160200161085d9291906112b5565b6040516020818303038152906040525b9392505050565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b6006546001600160a01b031633146108cc5760405162461bcd60e51b81526004016103a690611386565b6001600160a01b0381166109315760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103a6565b61093a81610c4c565b50565b6000908152600260205260409020546001600160a01b0316151590565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061098f82610560565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60006109d38261093d565b610a345760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016103a6565b6000610a3f83610560565b9050806001600160a01b0316846001600160a01b03161480610a7a5750836001600160a01b0316610a6f8461033e565b6001600160a01b0316145b80610a8a5750610a8a8185610874565b949350505050565b826001600160a01b0316610aa582610560565b6001600160a01b031614610b0d5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b60648201526084016103a6565b6001600160a01b038216610b6f5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016103a6565b610b7a60008261095a565b6001600160a01b0383166000908152600360205260408120805460019290610ba3908490611438565b90915550506001600160a01b0382166000908152600360205260408120805460019290610bd190849061140c565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b610541828260405180602001604052806000815250610deb565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b610ca9848484610a92565b610cb584848484610e1e565b6107965760405162461bcd60e51b81526004016103a690611334565b606081610cf55750506040805180820190915260018152600360fc1b602082015290565b8160005b8115610d1f5780610d09816114b6565b9150610d189050600a83611424565b9150610cf9565b60008167ffffffffffffffff811115610d4857634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015610d72576020820181803683370190505b5090505b8415610a8a57610d87600183611438565b9150610d94600a866114d1565b610d9f90603061140c565b60f81b818381518110610dc257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350610de4600a86611424565b9450610d76565b610df58383610f2b565b610e026000848484610e1e565b6104d75760405162461bcd60e51b81526004016103a690611334565b60006001600160a01b0384163b15610f2057604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610e629033908990889088906004016112e4565b602060405180830381600087803b158015610e7c57600080fd5b505af1925050508015610eac575060408051601f3d908101601f19168201909252610ea991810190611255565b60015b610f06573d808015610eda576040519150601f19603f3d011682016040523d82523d6000602084013e610edf565b606091505b508051610efe5760405162461bcd60e51b81526004016103a690611334565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610a8a565b506001949350505050565b6001600160a01b038216610f815760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016103a6565b610f8a8161093d565b15610fd75760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016103a6565b6001600160a01b038216600090815260036020526040812080546001929061100090849061140c565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b80356001600160a01b038116811461107557600080fd5b919050565b60006020828403121561108b578081fd5b61086d8261105e565b600080604083850312156110a6578081fd5b6110af8361105e565b91506110bd6020840161105e565b90509250929050565b6000806000606084860312156110da578081fd5b6110e38461105e565b92506110f16020850161105e565b9150604084013590509250925092565b60008060008060808587031215611116578081fd5b61111f8561105e565b935061112d6020860161105e565b925060408501359150606085013567ffffffffffffffff80821115611150578283fd5b818701915087601f830112611163578283fd5b81358181111561117557611175611511565b604051601f8201601f19908116603f0116810190838211818310171561119d5761119d611511565b816040528281528a60208487010111156111b5578586fd5b82602086016020830137918201602001949094529598949750929550505050565b600080604083850312156111e8578182fd5b6111f18361105e565b915060208301358015158114611205578182fd5b809150509250929050565b60008060408385031215611222578182fd5b61122b8361105e565b946020939093013593505050565b60006020828403121561124a578081fd5b813561086d81611527565b600060208284031215611266578081fd5b815161086d81611527565b600060208284031215611282578081fd5b5035919050565b600081518084526112a181602086016020860161144f565b601f01601f19169290920160200192915050565b600083516112c781846020880161144f565b8351908301906112db81836020880161144f565b01949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061131790830184611289565b9695505050505050565b60208152600061086d6020830184611289565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6000821982111561141f5761141f6114e5565b500190565b600082611433576114336114fb565b500490565b60008282101561144a5761144a6114e5565b500390565b60005b8381101561146a578181015183820152602001611452565b838111156107965750506000910152565b600181811c9082168061148f57607f821691505b602082108114156114b057634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156114ca576114ca6114e5565b5060010190565b6000826114e0576114e06114fb565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461093a57600080fdfea264697066735822122037fd2aa8dd9acb596e4c20f752e7ece1e2987aa9aa77b21b75d8576c9396fbe464736f6c63430008040033";

export class MockERC721__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockERC721> {
    return super.deploy(overrides || {}) as Promise<MockERC721>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockERC721 {
    return super.attach(address) as MockERC721;
  }
  connect(signer: Signer): MockERC721__factory {
    return super.connect(signer) as MockERC721__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC721Interface {
    return new utils.Interface(_abi) as MockERC721Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC721 {
    return new Contract(address, _abi, signerOrProvider) as MockERC721;
  }
}