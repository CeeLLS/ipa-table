import logo from './logo.svg';
import './App.css';
import React from 'react';
import MainTable from './Table';
import { Table } from '@mui/material';


function App() {
  // const columns = [
  //   { Header: 'Bilabial', accessor: 'name' },
  //   { Header: 'Age', accessor: 'age' },
  //   { Header: 'City', accessor: 'city'}
  // ];
  const data = [
    { "char": "p", "place": ["Bilabial"], "subplace": [], "manner": ["Plosive"], "submanner": ["Voiceless"] },
    { "char": "b", "place": ["Bilabial"], "subplace": [], "manner": ["Plosive"], "submanner": ["Voiced"] },
    { "char": "t", "place": ["Dental", "Alveolar", "Postalveolar"], "subplace": [], "manner": ["Plosive"], "submanner": ["Voiceless"] },
    { "char": "k", "place": ["Velar"], "subplace": [], "manner": ["Plosive"], "submanner": ["Voiceless"] },
    { "char": "g", "place": ["Velar"], "subplace": [], "manner": ["Plosive"], "submanner": ["Voiced"] },
    { "char": "m", "place": ["Bilabial"], "subplace": [], "manner": ["Nasal"], "submanner": ["Voiced"] },
    { "char": "n", "place": ["Dental", "Alveolar", "Postalveolar"], "subplace": [], "manner": ["Nasal"], "submanner": ["Voiced"] }
  ];
  
  return (
    <div>
      <h1>Tabela</h1>
      <MainTable data={data} />
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     {/* <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a> */}
    //   </header>
    // </div>
  );
};

export default App;
