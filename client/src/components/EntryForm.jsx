import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';

function EntryForm({ handleSetData }) {
  const [semester, setSemester] = useState(0);
  const [specialization, setSpecialization] = useState("");
  const [subject1, setSubject1] = useState("");
  const [subject2, setSubject2] = useState("");
  const [subject3, setSubject3] = useState("");
  const [subjects, setSubjects] = useState({});
  const [visible, setVisible] = useState(false);

  const data = {
    semestr: semester,
    specjalizacja: specialization,
    przedmiot1: subject1,
    przedmiot2: subject2,
    przedmiot3: subject3
  };

  useEffect(() => {
    if (specialization !== "") {
      getSubjects();
    }
    handleButtonVisibilityChange();
  }, [semester, specialization, subject1, subject2, subject3]);
  

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleSpecializationChange = (event) => {
    setSpecialization(event.target.value);
  };

  const handleSubject1Change = (event) => {
    setSubject1(event.target.value);
  };

  const handleSubject2Change = (event) => {
    setSubject2(event.target.value);
  };

  const handleSubject3Change = (event) => {
    setSubject3(event.target.value);
  };

  const getSubjects = async () => {
    try {
      const url = "http://localhost:8080/api/subjects/" + specialization;
      const response = await axios.get(url);
      setSubjects(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonVisibilityChange = () => {
    if(semester !== 0 && specialization !== '' && subject1 !== '' && subject2 !== '' && subject3 !== '') {
      setVisible(true);
    } else if(semester !== 0 && specialization === '' && subject1 === '' && subject2 === '' && subject3 === '') {
      setVisible(true);
    }else if(semester !== 0 && specialization !== ''&& subject1 === '' && subject2 === '' && subject3 === ''){
      setVisible(true);
    } else {
      setVisible(false);
    }

  }

  return (
    <div style={{ margin: "5vh", display: "flex", justifyContent: "center", alignContent: "center" }}>
      <Form>
        <h5>Semestr:</h5>
        <Form.Select size='lg' onChange={handleSemesterChange}>
          <option>Wybierz semestr</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </Form.Select>
        <br />
        <h5>Specjalność:</h5>
        <Form.Select size='lg' onChange={handleSpecializationChange}>
          <option>Wybierz specjalność</option>
          <option value="SE">Inżynieria Oprogramowania</option>
          <option value="IT">Techniki Informacyjne</option>
          <option value="CE">Inżynieria Komputerowa</option>
          <option value="IIS">Przemysłowe systemy informatyczne</option>
        </Form.Select>

        {Object.keys(subjects).length > 0 && (
          <div>
            <h5>Przedmiot obieralny 1:</h5>
            <Form.Select size='lg' onChange={handleSubject1Change}>
              <option>Wybierz przedmiot obieralny</option>
              {subjects[0].map((subject) => (
                <option key={subject.kod} value={subject.kod}>
                  {subject.nazwa}
                </option>
              ))}
            </Form.Select>
            <br />
            <h5>Przedmiot obieralny 2</h5>
            <Form.Select size='lg' onChange={handleSubject2Change}>
              <option>Wybierz przedmiot obieralny</option>
              {subjects[1].map((subject) => (
                <option key={subject.kod} value={subject.kod}>
                  {subject.nazwa}
                </option>
              ))}
            </Form.Select>
            <br />
            <h5>Przedmiot obieralny 3:</h5>
            <Form.Select size='lg' onChange={handleSubject3Change}>
              <option>Wybierz przedmiot obieralny</option>
              {subjects[2].map((subject) => (
                <option key={subject.kod} value={subject.kod}>
                  {subject.nazwa}
                </option>
              ))}
            </Form.Select> 
          </div>
        )}
        <br />
        {visible && <Button variant="dark" onClick={() => handleSetData(data)}>Wyślij</Button>}        
      </Form>
    </div>
  );
}

export default EntryForm;
