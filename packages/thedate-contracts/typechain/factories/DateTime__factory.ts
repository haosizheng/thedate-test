/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DateTime, DateTimeInterface } from "../DateTime";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_days",
        type: "uint256",
      },
    ],
    name: "daysToDate",
    outputs: [
      {
        internalType: "uint256",
        name: "year",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "month",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "day",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x61039c61003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100355760003560e01c8063fc43dbd01461003a575b600080fd5b61004d6100483660046101fb565b61006c565b6040805193845260208401929092529082015260600160405180910390f35b600080600061007a84610087565b9250925092509193909250565b60008080838162253d8c61009e8362010bd9610213565b6100a89190610213565b9050600062023ab16100bb83600461028e565b6100c59190610254565b905060046100d68262023ab161028e565b6100e1906003610213565b6100eb9190610254565b6100f59083610311565b9150600062164b09610108846001610213565b61011490610fa061028e565b61011e9190610254565b9050600461012e826105b561028e565b6101389190610254565b6101429084610311565b61014d90601f610213565b9250600061098f61015f85605061028e565b6101699190610254565b90506000605061017b8361098f61028e565b6101859190610254565b61018f9086610311565b905061019c600b83610254565b94506101a985600c61028e565b6101b4836002610213565b6101be9190610311565b915084836101cd603187610311565b6101d890606461028e565b6101e29190610213565b6101ec9190610213565b9a919950975095505050505050565b60006020828403121561020c578081fd5b5035919050565b600080821280156001600160ff1b038490038513161561023557610235610350565b600160ff1b839003841281161561024e5761024e610350565b50500190565b60008261026f57634e487b7160e01b81526012600452602481fd5b600160ff1b82146000198414161561028957610289610350565b500590565b60006001600160ff1b03818413828413808216868404861116156102b4576102b4610350565b600160ff1b848712828116878305891216156102d2576102d2610350565b8587129250878205871284841616156102ed576102ed610350565b8785058712818416161561030357610303610350565b505050929093029392505050565b60008083128015600160ff1b85018412161561032f5761032f610350565b6001600160ff1b038401831381161561034a5761034a610350565b50500390565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220823a3ec603960e358f2329589bc13730d5ff4129022ab1e9aa43202fcdce5cd564736f6c63430008040033";

export class DateTime__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DateTime> {
    return super.deploy(overrides || {}) as Promise<DateTime>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DateTime {
    return super.attach(address) as DateTime;
  }
  connect(signer: Signer): DateTime__factory {
    return super.connect(signer) as DateTime__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DateTimeInterface {
    return new utils.Interface(_abi) as DateTimeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DateTime {
    return new Contract(address, _abi, signerOrProvider) as DateTime;
  }
}
