import * as React from "react";
import axios from "axios";

import { List } from "../List/index.js";
import { SearchForm } from "../SearchForm/index.js";


const useStorageState = (key, initialState) => {

    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

const actions = {
    removeStory: "REMOVE_STORY",
    initFetchStory: "STORIES_FETCH_INIT",
    successFetchStory: "STORIES_FETCH_SUCCESS",
    failFetchStory: "STORY_FETCH_FAIL",
}


const storiesReducer = (state, action) => {
    switch (action.type) {
        case actions.removeStory:
            return {
                ...state,
                data: state.data.filter(
                    (story) => action.payload.objectID !== story.objectID
                )
            }
        case actions.initFetchStory:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case actions.successFetchStory:
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                isError: false
            };
        case actions.failFetchStory:
            return {
                ...state,
                isLoading: false,
                isError: true
            };
        default:
            throw new Error();
    }
}


const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="


const App = ()  => {

    const [searchTerm, setSearchTerm] = useStorageState(
        "search",
        "React"
    );

    const [url, setUrl] = React.useState(
        `${API_ENDPOINT}${searchTerm}`
    );

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({type: actions.initFetchStory});

        try{
            const result = await axios.get(url);
            dispatchStories({
                type: actions.successFetchStory,
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({type: actions.failFetchStory});
        }

    }, [url]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleRemoveStory = (item) => {
       dispatchStories({
           type: actions.removeStory,
           payload: item,
       });
    };

    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`);
        event.preventDefault();  // prevent browser reload
    }

    return (
    <div>
        <h1>My Hacker Stories</h1>
        <SearchForm
            searchTerm={searchTerm}
            onSearchInput={handleSearchInput}
            onSearchSubmit={handleSearchSubmit}
        />
        <hr/>
        {stories.isError && <p>Something went wrong...</p>}

        {stories.isLoading ?
            <p>Loading...</p>
            :
            <List
            list={stories.data}
            onRemoveItem={handleRemoveStory}
            />
        }
    </div>
    )
};

export default App;

export {App, storiesReducer, actions};
