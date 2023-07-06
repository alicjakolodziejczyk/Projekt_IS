import React, { useEffect, useState, useCallback } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import Graph from '../components/Graph';
import Filters from '../components/Filters';

const Graphs = () => {
  const [nodes, setNodes] = useState(null);
  const [edges, setEdges] = useState(null);
  const [filterData, setFilterData] = useState({
    semesters: [1, 2, 3, 4, 5, 6, 7],
    mandatory: ['obieralne', 'obowiązkowe'],
    specializations: ['SE', 'IT', 'CE', 'IIS'],
    categories: ['wiedza', 'umiejętność', 'kompetencje społeczne']
  });
  const [visible, setVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const url = "http://localhost:8080/api/graph";
      const response = await axios.post(url, filterData);
      console.log(response.data);
      setEdges(response.data.edges);
      setNodes(response.data.nodes);
    } catch (error) {
      console.log(error);
    }
  }, [filterData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetData = useCallback((data) => {
    setFilterData(data.filterData);
    setVisible(data.visible);
    console.log(data.filterData);
  }, []);

  return (
    <div>
      {nodes === null || edges === null ? (
        <div
          style={{
            height: '93.3vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </div>
      ) : (
        <div>
          <Filters handleSetData={handleSetData} filter={true} />
          <Graph edges={edges} nodes={nodes} visible={visible} />
        </div>
      )}
    </div>
  );
};

export default Graphs;
