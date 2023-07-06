import './App.css';
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Effects from './pages/Effects';
import CorrelationMatrix from './pages/CorrelationMatrix';
import Graphs from './pages/Graphs';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import SubjectsData from './pages/SubjectsData';


function App() {
  return (
    <div className="App">
      <Navbar sticky="top" bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link className='light-text' href="/">Effects</Nav.Link>
            <Nav.Link className='light-text' href="/graphs">Graphs</Nav.Link>
            <Nav.Link className='light-text' href="/corr-matrix">Correlation Matrix</Nav.Link>
            <Nav.Link className='light-text' href='/subjects-data'>Data</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Effects/>}/>
        <Route path="/graphs" element={<Graphs/>}/>
        <Route path="/corr-matrix" element={<CorrelationMatrix/>}/>
        <Route path="/subjects-data" element={<SubjectsData/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
