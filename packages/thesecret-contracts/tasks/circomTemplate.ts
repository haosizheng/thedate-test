import * as path from "path";
import * as fs from "fs/promises";
import resolve from "resolve";
import { TASK_CIRCOM_TEMPLATE } from "hardhat-circom";
import { subtask } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

subtask(TASK_CIRCOM_TEMPLATE, "generate Verifier template shipped by SnarkjS").setAction(circomTemplate);

async function circomTemplate({ zkeys }: any, hre: HardhatRuntimeEnvironment) {
  const snarkjsTemplate = resolve.sync("snarkjs/templates/verifier_groth16.sol.ejs");

  for (const zkey of zkeys) {
    const verifierSol = await hre.snarkjs.zKey.exportSolidityVerifier(zkey, snarkjsTemplate);
    const verifierPath = path.join(hre.config.paths.sources, `Verifier_${zkey.name}.sol`);
    await fs.writeFile(verifierPath, verifierSol);
  }
}
