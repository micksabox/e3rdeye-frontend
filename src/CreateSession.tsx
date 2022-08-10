import { useState } from "react";
import { chain, useContractWrite, usePrepareContractWrite } from "wagmi";
import { eth3rdContractAddress } from "./constants";
import targets from "./targets";
import Eth3rdEyeAbi from "./abi/Eth3rdEye.json";

const CreateSession = () => {
  const [selectedTarget, setSelectedTarget] = useState<string | undefined>();

  const { config } = usePrepareContractWrite({
    addressOrName: eth3rdContractAddress,
    contractInterface: Eth3rdEyeAbi.abi,
    functionName: "startSession",
    chainId: chain.goerli.id,
    args: ["1",  selectedTarget],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
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

  return (
    <div>
      <p>Choose your target:</p>
      {targets.map((t) => (
        <button
          className="p-2 w-full bg-gray-200"
          onClick={() => setSelectedTarget(t.value)}
          key={t.value}
        >
          {t.value}
        </button>
      ))}
      <button
        disabled={!selectedTarget}
        onClick={() => {
          write?.();
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default CreateSession;
