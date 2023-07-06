import React from 'react'
import EntryForm from '../components/EntryForm'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import EffectsCharts from '../components/EffectsCharts';

function Effects() {

  const [studentData, setStudentData] = useState({})
  const [show, setShow] = useState(false);
  const handleSetData = data => {
    setStudentData(data);
    setShow(false);

    console.log(data)
  }

  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div style={{display: "flex", }}>
      <Button variant='light' onClick={handleShow}>
      <i className="bi bi-chevron-right"></i>
      </Button>

      <Offcanvas show={show} onHide={handleClose} backdrop="static">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <EntryForm handleSetData={handleSetData}/>
        </Offcanvas.Body>
      </Offcanvas>

      <div style={{height: "93.3vh", width: "100%"}}>
        <div style={{height: '90%', overflow: 'auto'}}>
          {Object.keys(studentData).length > 0 ? <EffectsCharts studentData={studentData}/> : "Uzupełnij formularz, aby wyświetlić swój progres efektów"}
        </div>
        <div style={{height: '10%', width: '100%', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <div style={{height: '25px', width: '25px', backgroundColor: 'blue', display: 'inline-block', margin: '10px'}}></div>
  <span style={{marginRight: '50px'}}> - zdobyta część efektu</span>
  <div style={{height: '25px', width: '25px', backgroundColor: 'purple', display: 'inline-block', margin: '10px'}}></div>
  <span style={{marginRight: '50px'}}>- zdobywana część efektu w tym semestrze</span>
  <div style={{height: '25px', width: '25px', backgroundColor: 'pink', display: 'inline-block', margin: '10px'}}></div>
  <span style={{marginRight: '50px'}}>- część efektu, która będzie zdobywana w kolejnych semestrach</span>
</div>


        
      </div>
    </div>
  )
}

export default Effects