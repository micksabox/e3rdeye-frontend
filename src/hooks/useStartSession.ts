import { chain, useContractWrite, usePrepareContractWrite } from "wagmi";
import { eth3rdContractAddress } from "../constants";
import Eth3rdEyeAbi from "../abi/Eth3rdEye.json";

const useStartSession = (args:{index:string, commitment?:string}) => {
  const { config } = usePrepareContractWrite({
    addressOrName: eth3rdContractAddress,
    contractInterface: Eth3rdEyeAbi.abi,
    functionName: "startSession",
    enabled: !!args.commitment,
    args: [args.index, args.commitment],
  });

  return useContractWrite(
    {
      ...config,
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

export default useStartSession;