import * as React from "react";

const Item = (props) => (
    <li>
        <span>
            <a href={props.item.url}>{props.item.title}</a>
        </span>
        <span> {props.item.author}</span>
        <span> {props.item.num_comments}</span>
        <span> {props.item.points}</span>
    </li>
);

const List = ({ list }) => (
        <ul>
            {list.map(item => <Item key={item.objectId} item={item}/>)}
        </ul>
);

const Search = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event);
    }

    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" onChange={handleChange}/>
            <p>Searching for: <strong>{searchTerm}</strong></p>
        </div>
    )
};

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

    const handleSearch = (event) => {
        console.log(event.target.value);
    }

    return (
    <div>
        <h1>My Hacker Stories</h1>
        <Search onSearch={handleSearch}/>
        <hr/>
        <List list={stories}/>
    </div>
    )
};

export default App;
