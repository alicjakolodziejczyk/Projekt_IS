import React from 'react'
import {useState, useEffect, useCallback} from 'react'
import axios from 'axios';
import Filters from '../components/Filters';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';

function SubjectsData() {
  const [subjects, setSubjects] = useState([]);
  const [filterData, setFilterData] = useState({
    semesters: [1, 2, 3, 4, 5, 6, 7],
    mandatory: ['obieralne', 'obowiązkowe'],
    specializations: ['SE', 'IT', 'CE', 'IIS'],
    categories: ['wiedza', 'umiejętność', 'kompetencje społeczne']
  });

  const fetchData = useCallback(async () => {
    try {
      const url = "http://localhost:8080/api/subjects-data";
      const response = await axios.post(url, filterData);
      console.log(response.data);
      setSubjects(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [filterData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetData = useCallback((data) => {
    setFilterData(data.filterData);
    console.log(data.filterData);
  }, []);

  const printSpecialization = (specjalizacja) => {
    switch (specjalizacja) {
      case 'SE':
        return 'Inżynieria Systemów';
      case 'IT':
        return 'Technologie Informacyjne';
      case 'CE':
        return 'Inżynieria Komputerowa';
      case 'IIS':
        return 'IIS'; // Add the desired value for 'IIS'
      default:
        return '-';
    }
  };
  
  return (
    <div style={{paddingBottom: '8vh', margin: '25px'}}>
    <Filters handleSetData={handleSetData} filter={false} />
    <h2 style={{padding: '25px 0'}}>Dane przedmiotów</h2>
    <Table striped bordered hover variant="light">
      <thead>
        <tr>
          <th>Kod</th>
          <th>Nazwa</th>
          <th>Rok</th>
          <th>Semestr</th>
          <th>Obieralny</th>
          <th>Specjalizacja</th>
          <th>Efekty</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((item) => (
          <tr>
          <td>{item.kod}</td>
          <td>{item.nazwa}</td>
          <td>{item.rok}</td>
          <td>{item.semestr}</td>
          <td>{item.obieralny ? ('tak') : ('nie')}</td>
          <td>{printSpecialization(item.specjalizacja)}</td>
          <td> 
            <Accordion >
              <Accordion.Item eventKey={item._id}>
                <Accordion.Header>Efekty</Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered hover variant="light">
                    <thead>
                      <tr>
                        <th>Kod</th>
                        <th>Nazwa</th>
                        <th>Kategoria</th>
                      </tr>
                    </thead>
                    <tbody>{item.efekty.map((efekt) => (
                      <tr>
                        <td>{efekt.kod}</td>
                        <td>{efekt.nazwa}</td>
                        <td>{efekt.kategoria}</td>
                      </tr>))}
                    </tbody>
                  </Table >
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          
            
      </td>
        </tr>
        ))}
      </tbody>
    </Table>
    </div>
  )
}

export default SubjectsData