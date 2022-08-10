import { useEffect, useState } from "react";
import { keccak256 } from "@ethersproject/keccak256";
import { defaultAbiCoder } from "ethers/lib/utils";

import targets from "./targets";
import useStartSession from "./hooks/useStartSession";
import useRevealTarget from "./hooks/useRevealTarget";

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
        className="disabled:opacity-40 bg-red-800"
        disabled={!selectedTarget || !startSession.write}
        onClick={() => {
          startSession.write?.();
        }}
      >
        Submit
      </button>
      <button
        className="disabled:opacity-40 bg-red-800"
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
