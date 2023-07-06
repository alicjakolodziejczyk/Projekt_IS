import React, { useEffect, useState, useCallback } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Table from 'react-bootstrap/Table';
import Filters from "../components/Filters";
import axios from "axios";

function CorrelationMatrix() {
  const [correlationMatrix, setCorrelationMatrix] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [correlationsList, setCorrelationsList] = useState([])
  const [filterData, setFilterData] = useState({
    semesters: [1, 2, 3, 4, 5, 6, 7],
    mandatory: ['obieralne', 'obowiązkowe'],
    specializations: ['SE', 'IT', 'CE', 'IIS'],
    categories: ['wiedza', 'umiejętność', 'kompetencje społeczne']
  });

  const fetchData = useCallback(async () => {
    try {
      const url = "http://localhost:8080/api/correlation";
      const response = await axios.post(url, filterData);
      console.log(response.data);
      setCorrelationMatrix(response.data.correlationMatrix);
      setSubjects(response.data.przedmioty);
      setCorrelationsList(response.data.correlationsList);
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


  const CorrHeader = ({ children, nazwa }) => (
    <OverlayTrigger overlay={<Tooltip id={children}>{nazwa}</Tooltip>}>
      <div>{children}</div>
    </OverlayTrigger>
  );

  return (
  <div style={{paddingBottom: '10vh'}}>
    <Filters handleSetData={handleSetData} filter={false} />
    

      <h2 style={{ padding: "25px 0" }}>Correlation Matrix</h2>
      <div style={{overflow: 'auto', width: '94vw', height: '70vh', margin: 'auto'}}>
        <table style={{ display: 'initial'}}>
        <thead>
          <tr>
            <th></th>
            {subjects.map((subject, index) => (
              <th key={index}>
                <CorrHeader nazwa={subject['nazwa']}>{subject['kod']}</CorrHeader>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {correlationMatrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th><CorrHeader nazwa={subjects[rowIndex]['nazwa']}>{subjects[rowIndex]['kod']}</CorrHeader></th>
              {row.map((value, colIndex) => (
                <td style={{ backgroundColor: `rgba(255,105,180,${value})` }} key={colIndex}>
                  {value.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      <h2 style={{ padding: "25px 0" }}>List of correlations</h2>
      <div style={{ padding: "3vw" }}>
        <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Przedmiot 1</th>
          <th>Przedmiot 2</th>
          <th>Wartość korelacji</th>
        </tr>
      </thead>
      <tbody>
        {correlationsList.map((item) => (
          <tr>
          <td>{item.subject1} {item.subject1_name}</td>
          <td>{item.subject2} {item.subject2_name}</td>
          <td>{item.similarityScore.toFixed(4)}</td>
        </tr>
        ))}
      </tbody>
    </Table>
      </div>
      
    </div>

    
  );
}

export default CorrelationMatrix;
