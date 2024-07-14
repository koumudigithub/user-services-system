import React from 'react';
import OrgChartComponent from './components/OrgChartComponent';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Employee Organization Chart</h1>
      <OrgChartComponent />
    </div>
  );
}

export default App;










// //full org chart
// import React, { useEffect, useState } from 'react';
// import { getOrgChart } from './services/api';
// import OrgChartComponent from './components/OrgChartComponent';
// import './App.css';

// function App() {
//   const [orgChart, setOrgChart] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrgChart = async () => {
//       try {
//         const data = await getOrgChart();
//         setOrgChart(data);
//       } catch (err) {
//         setError(err);
//       }
//     };

//     fetchOrgChart();
//   }, []);

//   if (error) {
//     return <div>Error loading org chart: {error.message}</div>;
//   }

//   return (
//     <div className="App">
//       <h1>Organization Chart</h1>
//       {orgChart && <OrgChartComponent data={orgChart} />}
//     </div>
//   );
// }

// export default App;








