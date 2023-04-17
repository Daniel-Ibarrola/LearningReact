import * as React from "react";


const list = [
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

function List() {
    return (
        <ul>
            {list.map(item =>
                <li key={item.objectId}>
                    <span>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span> {item.author}</span>
                    <span> {item.num_comments}</span>
                    <span> {item.points}</span>
                </li>
            )}
        </ul>
    )
}

function Search() {
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" />
        </div>
    )
}

function App() {

  return (
    <div>
        <h1>My Hacker Stories</h1>
        <Search />
        <hr />
        <List />
    </div>
  );
}

export default App
