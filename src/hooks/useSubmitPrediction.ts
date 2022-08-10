import { chain, useContractWrite, usePrepareContractWrite } from "wagmi";
import { eth3rdContractAddress } from "../constants";
import Eth3rdEyeAbi from "../abi/Eth3rdEye.json";

const useSubmitPrediction = (args:{index:string, prediction?:string, onSuccess: () => void }) => {
  const { config } = usePrepareContractWrite({
    addressOrName: eth3rdContractAddress,
    contractInterface: Eth3rdEyeAbi.abi,
    functionName: "submitPrediction",
    enabled: !!args.prediction,
    args: [args.index, args.prediction],
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
        args.onSuccess()
      },
    }
  );
}

export default useSubmitPrediction;