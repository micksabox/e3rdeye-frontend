import clsx from "clsx";
import targets from "./targets";

const TargetList = ({ selected, onSelect }) => {
  return (
    <div className="my-2">
      {targets.map((t) => (
        <button
          className={clsx("w-full py-1 group", selected == t.value && "bg-gray-200 rounded-md")}
          onClick={() => onSelect(t.value)}
          key={t.value}
        >
          {t.value}
        </button>
      ))}
    </div>
  );
};

export default TargetList;
