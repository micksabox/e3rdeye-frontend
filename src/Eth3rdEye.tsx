import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, useAccount, useContractRead } from "wagmi";
import { eth3rdContractAddress, buttonClassName } from "./constants";
import Eth3rdEyeAbi from "./abi/Eth3rdEye.json";
import Dyor from "./Dyor";
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
      <div className="flex flex-col p-2 items-center ">
        <img className="w-1/2 -mt-4" src={"/img/Symbol.png"} />
        <h1 className="text-6xl mb-2 -mt-8">E3rdEye</h1>
        <h3 className="text-2xl text-center">Credibility protocol for psychic abilities</h3>
        <p>Total Sessions: {sessionIsLoading ? "Loading..." : lastSession}</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between">
        <h3 className="text-2xl mb-2 font-semibold">My E3rdEye</h3>
        {address ? address.substring(0,8) : <ConnectButton />}
        </div>
        <p className="my-2 text-lg">
          Verified Prediction Score: {score !== undefined ? <span className="text-xl font-semibold">{(score * 100).toFixed(1)}</span> : "-"}%
        </p>

        <button
          className={clsx(
            buttonClassName,
            "rounded-r-none w-1/2 border-beige",
            mode == "session" && "bg-beige"
          )}
          onClick={() => setMode("session")}
        >
          Start Session
        </button>
        <button
          className={clsx(
            buttonClassName,
            "rounded-l-none w-1/2 border-beige",
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
          {mode == undefined && <p>If you're seeking validation of psychic practitioner(s), start a Session. If you're a Psychic practioner, predict the Target of a Session using your natural abilities.</p>}
        </div>
      </div>

      <Dyor />
    </div>
  );
};

export default Eth3rdEye;
