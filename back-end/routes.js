module.exports = (app, redisClient) => {
  function buildOrgChart(employees) {
    let orgChart = {};
    let employeeMap = {};

    employees.forEach(employee => {
      employeeMap[employee.employeeId] = { ...employee, children: [] };
    });

    employees.forEach(employee => {
      if (employee.reportsTo) {
        employeeMap[employee.reportsTo].children.push(employeeMap[employee.employeeId]);
      } else {
        orgChart = employeeMap[employee.employeeId];
      }
    });

    return orgChart;
  }

  function findSubtree(node, employeeId) {
    if (node.employeeId === employeeId) {
      return node;
    }
    if (node.children) {
      for (let child of node.children) {
        const result = findSubtree(child, employeeId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  function buildHierarchy(orgChart, employeeId, employeeMap) {
    const node = employeeMap[employeeId];
    if (node.reportsTo) {
      const parent = employeeMap[node.reportsTo];
      parent.children = [node];
      return buildHierarchy(orgChart, node.reportsTo, employeeMap);
    }
    return node;
  }

  app.post('/orgchart', async (req, res) => {
    const employees = req.body;

    if (!Array.isArray(employees)) {
      console.error('Invalid data format');
      return res.status(400).send('Invalid data format');
    }

    const orgChart = buildOrgChart(employees);
    console.log('Built Org Chart:', JSON.stringify(orgChart, null, 2));

    try {
      await redisClient.set('orgChart', JSON.stringify(orgChart));
      await redisClient.set('employees', JSON.stringify(employees));
      console.log('Org chart saved successfully');
      res.send('Org chart saved successfully');
    } catch (err) {
      console.error('Error saving to Redis:', err);
      res.status(500).send('Error saving to Redis');
    }
  });

  app.get('/orgchart', async (req, res) => {
    try {
      const orgChartData = await redisClient.get('orgChart');
      if (orgChartData) {
        console.log('Org chart data retrieved successfully:', orgChartData);
        res.json(JSON.parse(orgChartData));
      } else {
        console.error('Org chart not found');
        res.status(404).send('Org chart not found');
      }
    } catch (err) {
      console.error('Error retrieving from Redis:', err);
      res.status(500).send('Error retrieving from Redis');
    }
  });

  app.get('/orgchart/team/:employeeId', async (req, res) => {
    const employeeId = parseInt(req.params.employeeId, 10);

    try {
      const orgChartData = await redisClient.get('orgChart');
      if (orgChartData) {
        const orgChart = JSON.parse(orgChartData);
        const employeeSubtree = findSubtree(orgChart, employeeId);

        if (employeeSubtree) {
          console.log('Employee team found:', JSON.stringify(employeeSubtree, null, 2));
          res.json(employeeSubtree);
        } else {
          console.error('Employee not found in org chart');
          res.status(404).send('Employee not found in org chart');
        }
      } else {
        console.error('Org chart not found');
        res.status(404).send('Org chart not found');
      }
    } catch (err) {
      console.error('Error retrieving from Redis:', err);
      res.status(500).send('Error retrieving from Redis');
    }
  });

  app.get('/orgchart/hierarchy/:employeeId', async (req, res) => {
    const employeeId = parseInt(req.params.employeeId, 10);

    try {
      const employeesData = await redisClient.get('employees');
      if (employeesData) {
        const employees = JSON.parse(employeesData);
        const employeeMap = {};
        employees.forEach(employee => {
          employeeMap[employee.employeeId] = { ...employee, children: [] };
        });

        const orgChart = await redisClient.get('orgChart');
        const orgChartData = JSON.parse(orgChart);

        const hierarchy = buildHierarchy(orgChartData, employeeId, employeeMap);

        if (hierarchy) {
          console.log('Employee hierarchy found:', JSON.stringify(hierarchy, null, 2));
          res.json(hierarchy);
        } else {
          console.error('Employee not found in org chart');
          res.status(404).send('Employee not found in org chart');
        }
      } else {
        console.error('Employees not found');
        res.status(404).send('Employees not found');
      }
    } catch (err) {
      console.error('Error retrieving from Redis:', err);
      res.status(500).send('Error retrieving from Redis');
    }
  });

  app.delete('/orgchart', async (req, res) => {
    try {
      await redisClient.flushAll();
      console.log('All data deleted from Redis');
      res.send('All data deleted from Redis');
    } catch (err) {
      console.error('Error deleting data from Redis:', err);
      res.status(500).send('Error deleting data from Redis');
    }
  });
};



















// module.exports = (app, redisClient) => {
//   function buildOrgChart(employees) {
//     let orgChart = {};
//     let employeeMap = {};

//     employees.forEach(employee => {
//       employeeMap[employee.employeeId] = { ...employee, children: [] };
//     });

//     employees.forEach(employee => {
//       if (employee.reportsTo) {
//         employeeMap[employee.reportsTo].children.push(employeeMap[employee.employeeId]);
//       } else {
//         orgChart = employeeMap[employee.employeeId];
//       }
//     });

//     return orgChart;
//   }

//   function findSubtree(node, employeeId) {
//     if (node.employeeId === employeeId) {
//       return node;
//     }
//     if (node.children) {
//       for (let child of node.children) {
//         const result = findSubtree(child, employeeId);
//         if (result) {
//           return result;
//         }
//       }
//     }
//     return null;
//   }

//   app.post('/orgchart', async (req, res) => {
//     const employees = req.body;

//     if (!Array.isArray(employees)) {
//       console.error('Invalid data format');
//       return res.status(400).send('Invalid data format');
//     }

//     const orgChart = buildOrgChart(employees);
//     console.log('Built Org Chart:', JSON.stringify(orgChart, null, 2));

//     try {
//       await redisClient.set('orgChart', JSON.stringify(orgChart));
//       await redisClient.set('employees', JSON.stringify(employees));
//       console.log('Org chart saved successfully');
//       res.send('Org chart saved successfully');
//     } catch (err) {
//       console.error('Error saving to Redis:', err);
//       res.status(500).send('Error saving to Redis');
//     }
//   });

//   app.get('/orgchart', async (req, res) => {
//     try {
//       const orgChartData = await redisClient.get('orgChart');
//       if (orgChartData) {
//         console.log('Org chart data retrieved successfully:', orgChartData);
//         res.json(JSON.parse(orgChartData));
//       } else {
//         console.error('Org chart not found');
//         res.status(404).send('Org chart not found');
//       }
//     } catch (err) {
//       console.error('Error retrieving from Redis:', err);
//       res.status(500).send('Error retrieving from Redis');
//     }
//   });

//   app.get('/orgchart/:employeeId', async (req, res) => {
//     const employeeId = parseInt(req.params.employeeId, 10);

//     try {
//       const orgChartData = await redisClient.get('orgChart');
//       if (orgChartData) {
//         const orgChart = JSON.parse(orgChartData);
//         const employeeSubtree = findSubtree(orgChart, employeeId);

//         if (employeeSubtree) {
//           console.log('Employee subtree found:', JSON.stringify(employeeSubtree, null, 2));
//           res.json(employeeSubtree);
//         } else {
//           console.error('Employee not found in org chart');
//           res.status(404).send('Employee not found in org chart');
//         }
//       } else {
//         console.error('Org chart not found');
//         res.status(404).send('Org chart not found');
//       }
//     } catch (err) {
//       console.error('Error retrieving from Redis:', err);
//       res.status(500).send('Error retrieving from Redis');
//     }
//   });

//   app.delete('/orgchart', async (req, res) => {
//     try {
//       await redisClient.flushAll();
//       console.log('All data deleted from Redis');
//       res.send('All data deleted from Redis');
//     } catch (err) {
//       console.error('Error deleting data from Redis:', err);
//       res.status(500).send('Error deleting data from Redis');
//     }
//   });
// };












  