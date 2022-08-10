import { useState } from "react";
import useClaimAccuracy from "./hooks/useClaimAccuracy";
import useSubmitPrediction from "./hooks/useSubmitPrediction";
import targets from "./targets";

type Prop = {
  sessionIndex?: string;
};

const LocalStorageKeyPrediction = "Eth3rdEye-Session-Prediction";

function makeStorageKey( index) {
  return `${LocalStorageKeyPrediction}-${index}`;
}


const TestSession = (props: Prop) => {
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
      {targets.map((t) => (
        <button onClick={() => setPrediction(t.value)} key={t.value}>
          {t.value}
        </button>
      ))}
      <button
        disabled={!submitPrediction.write || !prediction}
        onClick={() => submitPrediction.write?.()}
        className="bg-gray-200 disabled:opacity-40 p-2 rounded"
      >
        Submit Prediction
      </button>
      <button onClick={() => claimAccuracy.write?.() } disabled={!claimAccuracy.write} className="bg-gray-200 disabled:opacity-40 p-2 rounded">Claim Accuracy</button>
    </div>
  );
};

export default TestSession;
