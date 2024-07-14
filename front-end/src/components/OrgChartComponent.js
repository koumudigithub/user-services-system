import React, { useState } from 'react';
import axios from 'axios';
import Tree from 'react-d3-tree';
import './OrgChartComponent.css';

const layerColors = {
  0: 'yellow',      // Root level
  1: 'orange',      // First level
  2: 'lightpink',   // Second level
};

const renderCustomNode = ({ nodeDatum, depth }) => (
  <g>
    <rect
      width="120"
      height="60"
      x="-60"
      y="-30"
      fill={layerColors[depth] || 'lightgrey'}
      stroke="black"
      strokeWidth="1"
    />
    <text fill="black" x="0" y="-10" textAnchor="middle" alignmentBaseline="central">
      {nodeDatum.name}
    </text>
    <text fill="black" x="0" y="10" textAnchor="middle" alignmentBaseline="central">
      {nodeDatum.employeeId}
    </text>
  </g>
);

const OrgChartComponent = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [orgChart, setOrgChart] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleTeamButtonClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/orgchart/team/${employeeId}`);
      setOrgChart(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching team. Please check the Employee ID.');
      setOrgChart(null);
    }
  };

  const handleHierarchyButtonClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/orgchart/hierarchy/${employeeId}`);
      setOrgChart(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching hierarchy. Please check the Employee ID.');
      setOrgChart(null);
    }
  };

  return (
    <div className="employee-org-chart">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={handleInputChange}
        />
        <button onClick={handleTeamButtonClick}>Get Team</button>
        <button onClick={handleHierarchyButtonClick}>Get Hierarchy</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {orgChart && (
        <div className="tree-container">
          <Tree
            data={orgChart}
            translate={{ x: 200, y: 50 }}
            renderCustomNodeElement={(rd3tProps) => renderCustomNode(rd3tProps)}
            orientation="vertical"
            pathFunc="step"
            depthFactor={200}
          />
        </div>
      )}
    </div>
  );
};

export default OrgChartComponent;

















// //using svg and react-d3-tree
// import React, { useState } from 'react';
// import axios from 'axios';
// import Tree from 'react-d3-tree';
// import './OrgChartComponent.css';

// const layerColors = {
//   0: 'yellow',      // Root level
//   1: 'orange',      // First level
//   2: 'lightpink',   // Second level
// };

// const renderCustomNode = ({ nodeDatum, depth }) => (
//   <g>
//     <rect
//       width="120"
//       height="40"
//       x="-60"
//       y="-20"
//       fill={layerColors[depth] || 'lightgrey'}
//       stroke="black"
//       strokeWidth="1"
//     />
//     <text fill="black" x="0" y="5" textAnchor="middle" alignmentBaseline="central">
//       {nodeDatum.name}
//     </text>
//   </g>
// );

// const OrgChartComponent = () => {
//   const [employeeId, setEmployeeId] = useState('');
//   const [orgChart, setOrgChart] = useState(null);
//   const [error, setError] = useState(null);

//   const handleInputChange = (e) => {
//     setEmployeeId(e.target.value);
//   };

//   const handleButtonClick = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3000/orgchart/${employeeId}`);
//       setOrgChart(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Error fetching org chart. Please check the Employee ID.');
//       setOrgChart(null);
//     }
//   };

//   return (
//     <div className="employee-org-chart">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Enter Employee ID"
//           value={employeeId}
//           onChange={handleInputChange}
//         />
//         <button onClick={handleButtonClick}>Get Org Chart</button>
//       </div>
//       {error && <div className="error-message">{error}</div>}
//       {orgChart && (
//         <div className="tree-container">
//           <Tree
//             data={orgChart}
//             translate={{ x: 200, y: 50 }}
//             renderCustomNodeElement={(rd3tProps) => renderCustomNode(rd3tProps)}
//             orientation="vertical"
//             pathFunc="step"
//             depthFactor={200}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrgChartComponent;























