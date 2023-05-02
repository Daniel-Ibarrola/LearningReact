import { describe, it, expect, vi } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";

import App, {
    storiesReducer,
    actions,
    Item,
    List,
    SearchForm,
    InputWithLabel
} from "./App.jsx";

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
    author: "Dan Abramon, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
    it("removes a story from all stories", () => {
        const action = {type: actions.removeStory, payload: storyOne};
        const state = {data: stories, isLoading: false, isError: false};

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: [storyTwo],
            isLoading: false,
            isError: false,
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it("initiating fetching stories sets loading state", () => {
        const action = {type: actions.initFetchStory};
        const state = {data: [], isLoading: false, isError: false};

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: [],
            isLoading: true,
            isError: false,
        }
        expect(newState).toStrictEqual(expectedState);
    });

    it("successful fetching of stories updates data", () => {
        const action = {type: actions.successFetchStory, payload: stories};
        const state = {data: [], isLoading: false, isError: false};

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: stories,
            isLoading: false,
            isError: false,
        }
        expect(newState).toStrictEqual(expectedState);
    });

    it("failing to fetch stories sets error state", () => {
        const action = {type: actions.failFetchStory};
        const state = {data: [], isLoading: false, isError: false};

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: [],
            isLoading: false,
            isError: true,
        }
        expect(newState).toStrictEqual(expectedState);
    })
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

describe("SearchForm", () => {
    const searchFormProps = {
      searchTerm: "React",
      onSearchInput: vi.fn(),
      onSearchSubmit: vi.fn(),
    };

   it("renders the input field with its value", () => {
       render(<SearchForm {...searchFormProps} />);
       expect(screen.getByDisplayValue("React")).toBeInTheDocument();
   });

   it("renders the correct label", () => {
       render(<SearchForm {...searchFormProps}/>);
       expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
   });

   it("calls onSearchInput on input field change", () => {
       render(<SearchForm {...searchFormProps} />);
       fireEvent.change(screen.getByDisplayValue("React"), {
           target: { value: "Redux" },
       });
       expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
   })

    it("calls onSearchSubmit on button submit click", () => {
       render(<SearchForm {...searchFormProps} />);
       fireEvent.submit(screen.getByRole("button"));
       expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });

});

describe("InputWithLabel", () => {
    const props = {
        id: "search",
        value: "React",
        type: "text",
        onInputChange: vi.fn(),
        isFocused: false,
        children: <strong>Search</strong>,
    }

   it("renders children", () => {
       render(<InputWithLabel {...props}/>);
       expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
   });

    it("input has the correct properties", () => {
        render(<InputWithLabel {...props}/>);
        const textbox = screen.getByRole("textbox");
        expect(textbox).toHaveAttribute("id", "search");
        expect(textbox).toHaveAttribute("type", "text");
        expect(textbox).toHaveAttribute("value", "React");
    });

    it("calls onInputChange on input field change", () => {
        render(<InputWithLabel {...props}/>);
        fireEvent.change(screen.getByDisplayValue("React"), {
            target: { value: "Redux" },
        });
        expect(props.onInputChange).toHaveBeenCalledTimes(1);
    });
});

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

})