import * as React from "react";

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
                    key={item.objectId}
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

const useStorageState = (key, initialState) => {

    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

const initialStories = [
        {
            title: "React",
            url: "https://reactjs.org",
            author: "Jordan Walke",
            num_comments: 3,
            points: 4,
            objectId: 0
        },
        {
          title: "Redux",
          url: "https://redux.js.org",
          author: "Dan Abramov, Andrew Clark",
          num_comments: 5,
          points: 5,
          objectId: 1,
        }
    ]

const getAsyncStories = () =>
    new Promise((resolve) =>
        setTimeout(
            () => resolve({data: {stories: initialStories}}),
            2000)
    );


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
                    (story) => action.payload.objectId !== story.objectId
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


const App = ()  => {

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );

    React.useEffect(() => {
        dispatchStories({type: initFetchStory})
        getAsyncStories()
            .then(result => {
               dispatchStories({
                   type: successFetchStory,
                   payload: result.data.stories,
               });
            }).catch(
            () => dispatchStories({type: failFetchStory})
        )
    }, []);  // Run the effect on mount and unmount of the component

    const [searchTerm, setSearchTerm] = useStorageState("search", "");

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const searchedStories = stories.data.filter((story) =>
       story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRemoveStory = (item) => {
       dispatchStories({
           type: removeStory,
           payload: item,
       });
    };

    return (
    <div>
        <h1>My Hacker Stories</h1>
        <InputWithLabel
            id="search"
            value={searchTerm}
            isFocused
            onInputChange={handleSearch}
        >
            <strong>Search: </strong>
        </InputWithLabel>
        <hr/>
        {stories.isError && <p>Something went wrong...</p>}

        {stories.isLoading ?
            <p>Loading...</p>
            :
            <List
            list={searchedStories}
            onRemoveItem={handleRemoveStory}
            />
        }
    </div>
    )
};

export default App;
