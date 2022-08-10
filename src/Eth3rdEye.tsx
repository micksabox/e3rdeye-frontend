import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, useAccount, useContractRead } from "wagmi";
import { eth3rdContractAddress } from "./constants.js";
import Eth3rdEyeAbi from "./abi/Eth3rdEye.json";
// import Dyor from "./Dyor";
import Session from "./Session";
import Predict from "./Predict";

type Mode = "session" | "predict";

const Eth3rdEye = () => {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();

  const {
    data: lastSession,
    isLoading: sessionIsLoading,
    isError,
  } = useContractRead({
    addressOrName: eth3rdContractAddress,
    contractInterface: Eth3rdEyeAbi.abi,
    functionName: "lastSessionIndex",
    chainId: chain.goerli.id,
    watch: true,
  });

  const [mode, setMode] = useState<Mode | undefined>();

  return (
    <div className="flex flex-col">
      <img className="w-1/3 block" src={"/img/symbol.png"} />
      <h1 className="text-6xl">e3rdEye</h1>
      {address ? address : <ConnectButton />}

      <p>Total Sessions: {sessionIsLoading ? "Loading..." : lastSession}</p>

      <button onClick={() => setMode("session")}>Create</button>
      <button onClick={() => setMode("predict")}>Predict</button>

      {mode && mode == "session" && (
        <Session
          sessionIndex={lastSession ? lastSession.toString() : undefined}
        />
      )}
      {mode && mode == "predict" && (
        <Predict
          sessionIndex={lastSession ? lastSession.toString() : undefined}
        />
      )}

      {/* <Dyor /> */}
    </div>
  );
};

export default Eth3rdEye;
