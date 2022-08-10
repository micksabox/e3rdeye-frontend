import { useEffect, useState } from "react";
import clsx from "clsx";
import { keccak256 } from "@ethersproject/keccak256";
import { defaultAbiCoder } from "ethers/lib/utils";

import targets from "./targets";
import useStartSession from "./hooks/useStartSession";
import useRevealTarget from "./hooks/useRevealTarget";
import { buttonClassName } from "./constants";
import TargetList from "./TargetList";

const LocalStorageKeySalt = "Eth3rdEye-Session-Salt";
const LocalStorageKeyTarget = "Eth3rdEye-Session-Target";

function makeSalt(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeStorageKey(prefix, index) {
  return `${prefix}-${index}`;
}

type Prop = {
  sessionIndex?: string;
};

const Session = (props: Prop) => {
  const [selectedTarget, setSelectedTarget] = useState<string | undefined>();
  const [index, setIndex] = useState(props.sessionIndex)
  const [salt, setSalt] = useState<string>()

  useEffect(()=>{
    const nextIndex = (parseInt(props.sessionIndex) + 1).toString();
    setIndex(nextIndex);
  }, [props.sessionIndex])

  const [targetCommitment, setTargetCommitment] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (selectedTarget) {
      // Create a random secret
      const _salt = makeSalt(10);

      setSalt(_salt);

      // Build commitment hash
      const encodedTarget = defaultAbiCoder.encode(
        ["string", "string"],
        [_salt, selectedTarget]
      );
      const commitment = keccak256(encodedTarget);
      setTargetCommitment(commitment);
    }
  }, [selectedTarget]);

  const startSession = useStartSession({
    // Always increment when creating session
    index,
    commitment: targetCommitment,
    onSuccess: () => {
      // Save the salt and targets in local storage
      localStorage.setItem(
        makeStorageKey(LocalStorageKeySalt, index),
        salt
      );
      localStorage.setItem(
        makeStorageKey(LocalStorageKeyTarget, index),
        selectedTarget
      );
    }
  });

  const revealTarget = useRevealTarget({
    index: props.sessionIndex,
    salt: localStorage.getItem(makeStorageKey(LocalStorageKeySalt, props.sessionIndex)),
    target: localStorage.getItem(
      makeStorageKey(LocalStorageKeyTarget, props.sessionIndex)
    ),
    enabled: true,
  });

  return (
    <div>
      <p className="font-bold text-xl">Choose your target:</p>
      <p>You will be committed to your choice for the game.</p>
      <TargetList selected={selectedTarget} onSelect={(val) => setSelectedTarget(val)} />
      <button
        className={clsx( buttonClassName, "w-full bg-turquoise text-white")}
        disabled={!selectedTarget || !startSession.write}
        onClick={() => {
          startSession.write?.();
        }}
      >
        Save Commitment
      </button>
      <button
        className={clsx(buttonClassName, "w-full mt-2")}
        disabled={!revealTarget.write}
        onClick={() => {
          revealTarget.writeAsync?.().then((res) => console.log(res));
        }}
      >
        Reveal Target
      </button>
    </div>
  );
};

export default Session;
