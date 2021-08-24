import localhost_deployment from "./localhost/index.json";

export type Deployments = { [chainId: number]: any };

export const deployments: Deployments = {  
  [localhost_deployment.chainId]: localhost_deployment 
};
