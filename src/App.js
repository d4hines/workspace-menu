import React, {useState, useEffect} from 'react';
import './App.css';

const workspaces = ["medium", "tabbed", "simple", "grouped"];
const fetchWorkspaces = () =>
  Promise.all(workspaces.map(async x => {
    const data = await fetch(`http://localhost:3000/${x}.json`).then(x => x.json());
    return data.workspaceTemplates[x];
  }));

const App = () => {
  const [workspaces, setWorkspaces] = useState([{ name: "foo" }, { name: "bar" }]);
  useEffect(() => {
    fetchWorkspaces().then(setWorkspaces);
  }, []);
  const workspacesDom = workspaces.map(({name}) => {
    return (
      <div key={name}>
        <br/>
        <button>{name}</button>
      </div>
    )
  });
  return (
    <div className="App">
      {workspacesDom}
    </div>
  );
}

export default App;
