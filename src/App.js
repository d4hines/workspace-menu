import React, {useState, useEffect} from 'react';
import './App.css';

const wsc = window.FSBL.Clients.WorkspaceClient;

const workspaces = ["medium", "tabbed", "simple", "grouped"];

const loading = "Loading...";

const fetchWorkspaces = () =>
  Promise.all(workspaces.map(async x => {
    const data = await fetch(`http://localhost:3000/${x}.json`).then(x => x.json());
    return data.workspaceTemplates[x];
  }));


const Workspace = ({ws, cb}) => { 
  return (
    <div key={ws.name}>
      <br />
      <button onClick={() => cb(ws)}>{ws.name}</button>
    </div>
  );
}

const App = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWS, setActiveWorkspace] = useState("?");

  useEffect(() => {
    fetchWorkspaces().then(setWorkspaces);
    window.FSBL.addEventListener("onReady",
      () => setActiveWorkspace(wsc.activeWorkspace.name))
  }, []);

  const clickCallback = async (ws) => {
    await wsc.switchTo({ name: loading });

    if (activeWS !== loading) {
      await wsc.remove({ name: activeWS });
    }

    setActiveWorkspace(loading);

    await wsc.import({
      workspaceJSONDefinition: {
          [ws.name]: ws,
      },
      force: true,
    });
    
    setActiveWorkspace(ws.name);

    await wsc.switchTo({ name: ws.name });
  }

  const workspaceList = workspaces.map((ws) => (<Workspace ws={ws} cb={clickCallback}/>));

  return (
    <div className="App">
      <span> The active workspace is {activeWS} </span>
      {workspaceList}
    </div>
  );
}

export default App;
