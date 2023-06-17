import { useState } from "react";

const ShowAllButton = ({ items, limit, children, className }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      {(showAll ? items : items.slice(0, limit)).map(children)}

      {items.length > limit && (
        <button className={className} onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "Show All"}
        </button>
      )}
    </>
  );
};

export default ShowAllButton;