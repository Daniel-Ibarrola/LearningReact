import { Item, List } from "./index.js";
import {describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";

const storyOne = {
    title: "React",
    url: "https://reactjs.org",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
};

const storyTwo = {
    title: "Redux",
    url: "https://redux.js.org",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
};

describe("List", () => {
    const props = {
        list: [storyOne, storyTwo],
        onRemoveItem: vi.fn(),
    }

    it("renders all items", () => {
        render(<List {...props}/>);
        const items = screen.getAllByRole("listitem");
        expect(items.length).toBe(2);
    });

});

describe("Item", () => {
    it("renders all properties", () => {
        render(<Item item={storyOne} />);

        expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
        expect(screen.getByText("React")).toHaveAttribute(
            "href",
            "https://reactjs.org"
        );
    })

    it ("renders a clickable dismiss button", () => {
        render(<Item item={storyOne}/>);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("clicking the dismiss button calls the callback handler", () => {
        const handleRemoveItem = vi.fn();
        render(<Item item={storyOne} onRemoveItem={handleRemoveItem}/>);

        fireEvent.click(screen.getByRole("button"));
        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    });
});
