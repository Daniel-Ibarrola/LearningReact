import { describe, it, expect, vi } from "vitest";
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import axios from "axios";

import App, {
    storiesReducer,
    actions,
    Item,
    List,
    SearchForm,
    InputWithLabel
} from "./App.jsx";

vi.mock("axios");

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

});

describe("App", () => {
   it("succeds fetching data", async () => {
       const promise = Promise.resolve({
           data: {
               hits: stories,
           },
       });
       axios.get.mockImplementationOnce(() => promise);

       render(<App />);

       expect(screen.queryByText(/Loading/)).toBeInTheDocument();
       await waitFor(async () => await promise);

       expect(screen.queryByText(/Loading/)).toBeNull();
       expect(screen.getByText("React")).toBeInTheDocument();
       expect(screen.getByText("Redux")).toBeInTheDocument();
       expect(screen.getAllByText("Dismiss").length).toBe(2);
   });

   it("fails fetching data", async () => {
      const promise = Promise.reject();
      axios.get.mockImplementationOnce(() => promise);

      render(<App/>);

      expect(screen.queryByText(/Loading/)).toBeInTheDocument();

      try {
          await waitFor(async () => await promise);
      } catch (error) {
          expect(screen.queryByText(/Loading/)).toBeNull();
          expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
      }
   });

   it("removes a story", async () => {
       const promise = Promise.resolve({
           data: {
               hits: stories,
           }
       });
       axios.get.mockImplementationOnce(() => promise);

       render(<App/>);

       await waitFor(async () => promise);

       expect(screen.getAllByText("Dismiss").length).toBe(2);
       expect(screen.getByText("Jordan Walke")).toBeInTheDocument();

       fireEvent.click(screen.getAllByText("Dismiss")[0]);

       expect(screen.getAllByText("Dismiss").length).toBe(1);
       expect(screen.queryByText("Jordan Walke")).toBeNull();
   });

   it("searches for specific stories", async () => {
       const reactPromise = Promise.resolve({
           data: {
               hits: stories,
           }
       });

       const anotherStory = {
           title: "JavaScript",
           url: "https://en.wikipedia.org/wiki/JavaScript",
           author: "Brendan Eich",
           num_comments: 15,
           points: 10,
           objectID: 3,
       }

       const javascriptPromise = Promise.resolve({
           data: {
               hits: [anotherStory],
           }
       });

       axios.get.mockImplementation((url) => {
           if (url.includes("React")) {
               return reactPromise;
           }
           if (url.includes("JavaScript")) {
               return javascriptPromise;
           }
           throw Error();
       });

       render(<App/>);

       // First data fetching
       await waitFor(async () => await reactPromise);

       expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
       expect(screen.queryByDisplayValue("JavaScript")).toBeNull();
       expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
       expect(screen.queryByText(
           "Dan Abramov, Andrew Clark"
       )).toBeInTheDocument();
       expect(screen.queryByText("Brendan Eich")).toBeNull();

       // User Interaction -> Search
       fireEvent.change(screen.queryByDisplayValue("React"), {
           target: {
               value: "JavaScript",
           },
       });

       expect(screen.queryByDisplayValue("React")).toBeNull();
       expect(screen.queryByDisplayValue("JavaScript")).toBeInTheDocument();

       fireEvent.submit(screen.queryByText("Submit"));

       // Second data fetching
       await waitFor(async () => javascriptPromise);

       expect(screen.queryByText("Jordan Walke")).toBeNull();
       expect(screen.queryByText(
           "Dan Abramov, Andrew Clark"
       )).toBeNull();
       expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
   });
});
