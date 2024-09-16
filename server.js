const http = require('http');
const url = require('url');
const { parse } = require('querystring');
const fs = require('fs');

// CSS content
const cssContent = `
  <style>
     body {
    font-family: Arial, sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 20px;
}

.table-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.employee-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.employee-table th, .employee-table td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

.employee-table th {
    background-color: #007bff;
    color: white;
}

.employee-table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.employee-table tr:hover {
    background-color: #ddd;
}

    </style>
`;

const dataFilePath = './employees.json';

// Load employee data from file
let employees = [];
if (fs.existsSync(dataFilePath)) {
  const data = fs.readFileSync(dataFilePath);
  employees = JSON.parse(data);
}

// Save employee data to file
const saveDataToFile = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify(employees, null, 2));
};

// HTML content for the welcome page
const welcomePage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Table</title>
</head>
<body>
    <h1>Welcome To Employee Table</h1>
    <button onclick="showTable()">Show Table</button>

    <script>
        function showTable() {
            window.location.href = '/table';
        }
    </script>
</body>
</html>
`;

// Generate HTML content for the table page
const generateTablePage = () => {
  let rows = employees.map(employee => `
    <tr>
      <td>${employee.id}</td>
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.salary}</td>
      <td><a href="/update?id=${employee.id}">Update</a></td>
      <td><a href="/delete?id=${employee.id}">Delete</a></td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Employee Salary Table</title>
      ${cssContent}
    </head>
    <body>
      <h1>Employee Salary Table</h1>
      <table class="employee-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Employee Name</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div style='text-align:centre'>
      <a href="/">Go to Welcome Page</a>
      <h2 >Add New Employee</h2>
      <form action="/create" method="POST">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>
        <label for="Position">Position:</label><br>
        <input type="text" id="Position" name="Position"><br><br>
        <label for="salary">Salary:</label><br>
        <input type="text" id="salary" name="salary"><br><br>
        <input type="submit" value="Submit">
      </form>
      </div>
    </body>
    </html>
  `;
};

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(`Received request for ${req.method} ${req.url}`);

  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(welcomePage); // Serve welcome page
    } else if (req.url === '/table') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(generateTablePage()); // Serve table page
    } else if (parsedUrl.pathname === '/update') {
      const employee = employees.find(emp => emp.id == parsedUrl.query.id);
      if (employee) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Update Employee</title>
            ${cssContent}
          </head>
          <body>
            <h1>Update Employee</h1>
            <form action="/update?id=${employee.id}" method="POST">
              <label for="name">Name:</label><br>
              <input type="text" id="name" name="name" value="${employee.name}"><br>
              <label for="Position">Position:</label><br>
              <input type="text" id="Position" name="Position" value="${employee.position}"><br><br>
              <label for="salary">Salary:</label><br>
              <input type="text" id="salary" name="salary" value="${employee.salary}"><br><br>
              <input type="submit" value="Update">
            </form>
            <a href="/table">Back to Table</a>
          </body>
          </html>
        `);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Employee not found');
      }
    } else if (parsedUrl.pathname === '/delete') {
      employees = employees.filter(emp => emp.id != parsedUrl.query.id);
      saveDataToFile();
      res.writeHead(302, { 'Location': '/table' });
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Page Not Found');
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedBody = parse(body);
      console.log('Received POST data:', parsedBody);
      if (req.url === '/create') {
        const newId = employees.length ? employees[employees.length - 1].id + 1 : 1;
        const newEmployee = {
          id: newId,
          name: parsedBody.name,
          position: parsedBody.Position,
          salary: parseInt(parsedBody.salary)
        };
        employees.push(newEmployee);
        saveDataToFile();
        res.writeHead(302, { 'Location': '/table' });
        res.end();
      } else if (parsedUrl.pathname === '/update') {
        const employee = employees.find(emp => emp.id == parsedUrl.query.id);
        if (employee) {
          employee.name = parsedBody.name;
          employee.position = parsedBody.Position;
          employee.salary = parseInt(parsedBody.salary);
          saveDataToFile();
          res.writeHead(302, { 'Location': '/table' });
          res.end();
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Employee not found');
        }
      }
    });
  }
});

const port = 7000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
