import { chain, useContractWrite, usePrepareContractWrite } from "wagmi";
import { eth3rdContractAddress } from "../constants";
import Eth3rdEyeAbi from "../abi/Eth3rdEye.json";

const useRevealTarget = (args: {
  index: string;
  enabled: boolean;
  salt: string;
  target: string;
}) => {

  return useContractWrite({
    addressOrName: eth3rdContractAddress,
    contractInterface: Eth3rdEyeAbi.abi,
    functionName: "revealTarget",
    mode: "recklesslyUnprepared",
    args: [args.index, args.salt, args.target],
    chainId: chain.goerli.id,
    onError: (e) => {
      console.log("onError", e);
    },
    onSettled: (data, error) => {
      console.log("onSettled", data, error);
    },
    onSuccess: (data) => {
      console.log("onSuccess", data);
    },
  });
};

export default useRevealTarget;
