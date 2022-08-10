import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, useAccount, useContractRead } from "wagmi";
import { eth3rdContractAddress, buttonClassName } from "./constants";
import Eth3rdEyeAbi from "./abi/Eth3rdEye.json";
// import Dyor from "./Dyor";
import Session from "./Session";
import Predict from "./Predict";
import clsx from "clsx";

type Mode = "session" | "predict";

const Eth3rdEye = () => {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();

  const { data: lastSession, isLoading: sessionIsLoading } = useContractRead({
    addressOrName: eth3rdContractAddress,
    contractInterface: Eth3rdEyeAbi.abi,
    functionName: "lastSessionIndex",
    chainId: chain.goerli.id,
    watch: true,
  });

  const { data: accountAccuracy, isFetched: accuracyFetched } = useContractRead(
    {
      addressOrName: eth3rdContractAddress,
      contractInterface: Eth3rdEyeAbi.abi,
      functionName: "accuracy",
      enabled: !!address,
      args: [address],
      chainId: chain.goerli.id,
    }
  );

  const { data: accountAttempts, isFetched: attemptsFetched } = useContractRead(
    {
      addressOrName: eth3rdContractAddress,
      contractInterface: Eth3rdEyeAbi.abi,
      functionName: "attempts",
      enabled: !!address,
      args: [address],
      chainId: chain.goerli.id,
    }
  );

  const [mode, setMode] = useState<Mode | undefined>();
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (accuracyFetched && attemptsFetched) {
      setScore(
        parseInt(accountAccuracy.toString()) /
          parseInt(accountAttempts.toString())
      );
    }
  }, [accountAccuracy, accountAttempts]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col items-center ">
        <img className="w-1/2 -mt-8" src={"/img/Symbol.png"} />
        <h1 className="text-6xl mb-2 -mt-16">E3rdEye</h1>
        <h3 className="text-2xl">Credibility protocol for psychic abilities</h3>
        <p>Total Sessions: {sessionIsLoading ? "Loading..." : lastSession}</p>
      </div>
      <div className="mt-4 p-2">
        <h3 className="text-2xl mb-2 font-semibold">My E3rdEye</h3>
        {address ? address : <ConnectButton />}
        <p className="mb-2">
          Account Prediction Score: {score !== undefined ? score * 100 : "-"}%
        </p>

        <button
          className={clsx(
            buttonClassName,
            "rounded-r-none w-1/2",
            mode == "session" && "bg-beige"
          )}
          onClick={() => setMode("session")}
        >
          Create Game
        </button>
        <button
          className={clsx(
            buttonClassName,
            "rounded-l-none w-1/2",
            mode == "predict" && "bg-beige"
          )}
          onClick={() => setMode("predict")}
        >
          Predict
        </button>
        <div className="p-2">
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
        </div>
      </div>

      {/* <Dyor /> */}
    </div>
  );
};

export default Eth3rdEye;
