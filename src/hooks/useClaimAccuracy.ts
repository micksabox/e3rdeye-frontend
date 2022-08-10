import { chain, useContractWrite, usePrepareContractWrite } from "wagmi";
import { eth3rdContractAddress } from "../constants";
import Eth3rdEyeAbi from "../abi/Eth3rdEye.json";

const useClaimAccuracy = (args:{index:string, prediction?:string }) => {

  return useContractWrite(
    {
      addressOrName: eth3rdContractAddress,
      contractInterface: Eth3rdEyeAbi.abi,
      functionName: "claimAccuracy",
      enabled: !!args.prediction,
      args: [args.index, args.prediction],
      mode: "recklesslyUnprepared",
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
    }
  );
}

export default useClaimAccuracy;