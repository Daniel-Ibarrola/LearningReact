import { describe, it, expect } from "vitest";
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
