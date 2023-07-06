import React from 'react';
import Progress from './Progress';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState } from 'react';
import axios from 'axios';

function EffectsCharts(studentData) {
  console.log(studentData['studentData']);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'http://localhost:8080/api/progress';
        const response = await axios.post(url, studentData['studentData']);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{padding: ' 5vh 10vh'}}>
      {data ? (
        <Accordion>
          {data.map((effect, index) => (
            <div key={index} style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '30% 70%' }}>
              <div style={{ padding: '10px' }}>
                <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header>{effect.kod}</Accordion.Header>
                  <Accordion.Body>{effect.nazwa}</Accordion.Body> 
                </Accordion.Item>
              </div>
              <div style={{ padding: '10px', alignSelf: 'center' }}>
                <Progress past={(effect.przed/effect.wszystkie)*100+'%'} present={(effect.teraz/effect.wszystkie)*100+'%'} future={(effect.po/effect.wszystkie)*100+'%'} />
              </div>
            </div>
          ))}
        </Accordion> 
      ) : (
        <div>
          <Spinner animation="border" />
        </div>
      )}
    </div>
  );
}

export default EffectsCharts;
