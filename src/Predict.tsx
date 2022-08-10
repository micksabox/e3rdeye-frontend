import { useState } from "react";
import clsx from "clsx";

import { buttonClassName } from "./constants";
import useClaimAccuracy from "./hooks/useClaimAccuracy";
import useSubmitPrediction from "./hooks/useSubmitPrediction";
import TargetList from "./TargetList";

type Prop = {
  sessionIndex?: string;
};

const LocalStorageKeyPrediction = "Eth3rdEye-Session-Prediction";

function makeStorageKey( index) {
  return `${LocalStorageKeyPrediction}-${index}`;
}


const Predict = (props: Prop) => {
  const [prediction, setPrediction] = useState<string>();

  const submitPrediction = useSubmitPrediction({
    index: props.sessionIndex,
    prediction,
    onSuccess: () => {
      localStorage.setItem(makeStorageKey(props.sessionIndex), prediction)
    }
  });

  const claimAccuracy = useClaimAccuracy({
    index: props.sessionIndex,
    prediction: localStorage.getItem(makeStorageKey(props.sessionIndex))
  })

  return (
    <div>
      <p>Select your prediction:</p>
      <TargetList selected={prediction} onSelect={(val) => setPrediction(val)} />
      <button
        className={clsx(buttonClassName, "bg-turquoise text-white w-full")}
        disabled={!submitPrediction.write || !prediction}
        onClick={() => submitPrediction.write?.()}
      >
        Submit Prediction
      </button>
      <hr className="my-2" />
      <p>If you submitted a prediction for this Session before the target was revealed, you can claim Accuracy.</p>

      <button className={clsx(buttonClassName, "w-full mt-2")} onClick={() => claimAccuracy.write?.() } disabled={!claimAccuracy.write} >Claim Accuracy</button>
    </div>
  );
};

export default Predict;
