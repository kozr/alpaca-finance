import { useState } from "react";
import ExpandableList from "./ExpandableList";

const TabList = ({ items, RowComponent}) => {
    const [showAll, setShowAll] = useState(false);

    // Helper function to format a date
    const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Group pending payments by date
    const itemsByDate = items.reduce((groupedItems, item) => {
        const date = formatDate(item.createdAt);
        if (!groupedItems[date]) {
            groupedItems[date] = [];
        }
        groupedItems[date].push(item);
        return groupedItems;
    }, {});
  
    return (
      <>
        {Object.entries(itemsByDate).map(([date, itemsOnDate], idx) => (
                <div key={idx}>
                    <h2>{date}</h2>
                    <hr />
                    <ExpandableList
                        items={itemsOnDate}
                        limit={5}
                        className={"w-full bg-button-grey font-semibold text-black py-2 mt-5 rounded"}
                    >
                        {(item, itemIdx) => (
                            <div key={item.id} className={itemIdx === itemsByDate.length - 1 ? "mb-4" : ""}>
                                <RowComponent details={item} />
                            </div>
                        )}
                    </ExpandableList>
                </div>
            ))}
            <div className="h-12"></div>
      </>
    );
  };
  
  export default TabList;