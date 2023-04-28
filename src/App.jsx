import * as React from "react";
import axios from "axios";


const Item = ({item, onRemoveItem}) => {

    return (
    <li>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span> {item.author}</span>
        <span> {item.num_comments}</span>
        <span> {item.points}</span>
        <button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button>
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

const InputWithLabel = ({
        id,
        value,
        type = "text",
        onInputChange,
        isFocused,
        children}) => (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input id={id}
                   type={type}
                   value={value}
                   autoFocus={isFocused}
                   onChange={onInputChange}/>
        </>
    );


const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => (
     <form onSubmit={onSearchSubmit}>
             <InputWithLabel
                id="search"
                value={searchTerm}
                isFocused
                onInputChange={onSearchInput}
             >
                <strong>Search: </strong>
            </InputWithLabel>
            <button type="submit" disabled={!searchTerm}>
                Submit
            </button>
    </form>
);


const useStorageState = (key, initialState) => {

    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

const removeStory = "REMOVE_STORY";
const initFetchStory = "STORIES_FETCH_INIT";
const successFetchStory = "STORIES_FETCH_SUCCESS";
const failFetchStory = "STORY_FETCH_FAIL";

const storiesReducer = (state, action) => {
    switch (action.type) {
        case removeStory:
            return {
                ...state,
                data: state.data.filter(
                    (story) => action.payload.objectID !== story.objectID
                )
            }
        case initFetchStory:
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case successFetchStory:
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                isError: false
            };
        case failFetchStory:
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
        "react"
    );

    const [url, setUrl] = React.useState(
        `${API_ENDPOINT}${searchTerm}`
    );

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );

    const handleFetchStories = React.useCallback(async () => {
        dispatchStories({type: initFetchStory});

        try{
            const result = await axios.get(url);
            dispatchStories({
                type: successFetchStory,
                payload: result.data.hits,
            });
        } catch {
            dispatchStories({type: failFetchStory});
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
           type: removeStory,
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
