import React from 'react'
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

function Filters({ handleSetData }, props) {
  const [semesters, setSemesters] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [mandatory, setMandatory] = useState(['obieralne', 'obowiązkowe'])
  const [specializations, setSpecializations] = useState(['SE', 'IT', 'CE', 'IIS']);
  const [categories, setCategories] = useState(['wiedza', 'umiejętność', 'kompetencje społeczne']);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const data = {
      filterData: {
        semesters: semesters,
        mandatory: mandatory,
        specializations: specializations,
        categories: categories
      },
      visible: visible
    }
    handleSetData(data);
  }, [semesters, mandatory, specializations, categories, visible, handleSetData])

  const handleSemesterChange = (event) => {
    const semester = Number(event.target.id.split('-')[1]); 
    console.log(typeof semester)
    if (event.target.checked) {
      setSemesters((prevSemesters) => [...prevSemesters, semester]);
    } else {
      setSemesters((prevSemesters) =>
        prevSemesters.filter((s) => s !== semester)
      );
    }
    console.log(semesters);
  };
  
  const handleMandatoryChange = (event) => {
    const mandatory = event.target.id;
    if (event.target.checked) {
      setMandatory((prevMandatory) => [...prevMandatory, mandatory]);
    } else {
      setMandatory((prevMandatory) =>
        prevMandatory.filter((m) => m !== mandatory)
      );
    }
  }

  const handleSpecializationChange = (event) => {
    const specialization = event.target.id;
    if (event.target.checked) {
      setSpecializations((prevSpecializations) => [
        ...prevSpecializations,
        specialization,
      ]);
    } else {
      setSpecializations((prevSpecializations) =>
        prevSpecializations.filter((s) => s !== specialization)
      );
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.id;
    if (event.target.checked) {
      setCategories((prevCategories) => [...prevCategories, category]);
    } else {
      setCategories((prevCategories) =>
        prevCategories.filter((c) => c !== category)
      );
    }
  };

  return (
    <div>
      <Navbar fixed="bottom" bg="dark" data-bs-theme="dark">
            <Container>
              <Nav className="me-auto">
              <Nav.Item>
                <Dropdown drop='up'>
                  <Dropdown.Toggle variant="dark" id="dropdown-semestry">
                    Semestry
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {[1, 2, 3, 4, 5, 6, 7].map((semester) => (
                      <div key={`sem-${semester}`} style={{ padding: '0 10px' }}>
                        <Form.Check
                          type="checkbox"
                          id={`semester-${semester}`} // Unique ID for each checkbox
                          label={semester}
                          onChange={handleSemesterChange}
                          checked={semesters.includes(semester)}
                        />
                      </div>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>


                <Nav.Item>
                  <Dropdown drop='up'>
                    <Dropdown.Toggle variant="dark" id="dropdown-semestry">
                      Obieralność
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {['obieralne', 'obowiązkowe'].map((item) => (
                        <div
                          key={`mandatory-${item}`}
                          style={{ padding: '0 10px' }}
                        >
                          <Form.Check
                            type="checkbox"
                            id={item}
                            label={item}
                            onChange={handleMandatoryChange}
                            checked={mandatory.includes(item)}
                          />
                        </div>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>

                <Nav.Item>
                  <Dropdown drop='up'>
                    <Dropdown.Toggle variant="dark" id="dropdown-semestry">
                      Specjalizacje
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {['SE', 'IT', 'CE', 'IIS'].map((specialization) => (
                        <div
                          key={`specialization-${specialization}`}
                          style={{ padding: '0 10px' }}
                        >
                          <Form.Check
                            type="checkbox"
                            id={specialization}
                            label={specialization}
                            onChange={handleSpecializationChange}
                            checked={specializations.includes(specialization)}
                          />
                        </div>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>

                <Nav.Item>
                  <Dropdown drop='up'>
                    <Dropdown.Toggle variant="dark" id="dropdown-semestry">
                      Kategorie
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {['wiedza', 'umiejętność', 'kompetencje społeczne'].map((category) => (
                        <div key={`category-${category}`} style={{ padding: '0 10px' }}>
                          <Form.Check
                            type="checkbox"
                            id={category}
                            label={category}
                            onChange={handleCategoryChange}
                            checked={categories.includes(category)}
                          />
                        </div>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>
                {props.filter && 
                <Nav.Item>
                  <Form.Check
                            type="checkbox"
                            id="visible"
                            label="pokaż liczbę wspólnych efektów"
                            onChange={()=> setVisible(!visible)}
                            checked={visible}
                            style = {{paddingTop: '0.4em', marginLeft: '0.4em'}}
                          />
                </Nav.Item>}
                
              </Nav>
            </Container>
          </Navbar>
    </div>
  )
}

export default Filters