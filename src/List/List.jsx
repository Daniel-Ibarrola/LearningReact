import * as React from "react";
import "./style.css"

const Item = ({item, onRemoveItem}) => {

    return (
        <li className="item">
            <span style={{ width: "40%" }}>
                <a href={item.url}>{item.title}</a>
            </span>
                <span style={{ width: "30%"}}>{item.author}</span>
                <span style={{ width: "10%"}}>{item.num_comments}</span>
                <span style={{ width: "10%"}}>{item.points}</span>
                <button
                    type="button"
                    onClick={() => onRemoveItem(item)}
                    className="button button_small"
                >
                    Dismiss
                </button>
        </li>
    )};

const List = ({ list, onRemoveItem }) => (
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
            />
        ))}
    </ul>
);

export { Item, List };