import * as React from "react";

const Item = ({item}) => (
    <li>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span> {item.author}</span>
        <span> {item.num_comments}</span>
        <span> {item.points}</span>
    </li>
);

const List = ({ list }) => (
        <ul>
            {list.map(item => <Item key={item.objectId} item={item}/>)}
        </ul>
);

const Search = ({ onSearch, searchTerm }) => (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search"
                   type="text"
                   value={searchTerm}
                   onChange={onSearch}/>
        </div>
    );

const useStorageState = (key, initialState) => {

    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

const App = ()  => {

    const stories = [
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
    ];

    const [searchTerm, setSearchTerm] = useStorageState("search", "React");

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const searchedStories = stories.filter((story) =>
       story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div>
        <h1>My Hacker Stories</h1>
        <Search onSearch={handleSearch} searchTerm={searchTerm}/>
        <hr/>
        <List list={searchedStories}/>
    </div>
    )
};

export default App;
