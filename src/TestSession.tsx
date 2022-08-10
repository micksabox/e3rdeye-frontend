import targets from "./targets";


const TestSession = () => {
  return (
    <div>
      <p>Select your prediction:</p>
      {
        targets.map( t => <button key={t.value}>{t.value}</button> )
      }
    </div>
  );
};

export default TestSession;
