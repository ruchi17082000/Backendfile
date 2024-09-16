const http = require('http');
const fs = require("fs");
const path = require('path');

const hostname = '127.0.0.1';
const port = 9000;

const server = http.createServer((req, res) => {
    if (req.method == "GET" && req.url.endsWith("index.html")) {
        fs.readFile(path.join(__dirname, "index.html"), (err, content) => {
            res.writeHead(200, "ok", {
                "content-type": "text/html",
            });
            res.write(content);
            res.end();
        });
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<!DOCTYPE html> 
<html> 
<head> 
    <title>Employee Management System</title> 
    <style> 
     body{
            background-image: url("https://cdn.pixabay.com/photo/2017/08/04/10/32/background-2579710_640.jpg")
         
            font-family: 'Arial', sans-serif;  
            margin: 0; 
            padding: 0; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
        } 
 
        .container { 
            background-color: #fff; 
            border-radius: 10px; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
            padding: 40px; 
            max-width: 500px; 
            width: 100%; 
            text-align: center; 
        } 
 
        h1 { 
            color: #333; 
            margin-bottom: 20px; 
            font-size: 24px; 
        } 
 
 
 
        button { 
            background-color: #007bff; 
            color: #fff; 
            border: none; 
            border-radius: 5px; 
            padding: 15px 30px; 
            font-size: 16px; 
            cursor: pointer; 
            transition: background-color 0.3s ease; 
        } 
 
        button:hover { 
            background-color: #0056b3; 
        } 
 
        p { 
            color: #666; 
            font-size: 14px; 
            margin-top: 20px; 
        } 
 
        footer { 
            background-color: #333; 
            color: #fff; 
            padding: 10px 0; 
            text-align: center; 
            width: 100%; 
            position: absolute; 
            bottom: 0; 
        } 
 
        @media (max-width: 600px) { 
            .container { 
                padding: 20px; 
            } 
 
            h1 { 
                font-size: 20px; 
            } 
 
            button { 
                padding: 10px 20px; 
                font-size: 14px; 
            } 
 
 
 
            p { 
                font-size: 12px; 
            } 
        } 
    </style> 
</head> 
<body> 
    <div class="container"> 
        <h1>Employee Management System</h1> 
        <button onclick="location.href='http://127.0.0.1:9000/index.html'">Click here 
to check</button> 
        <p>Welcome to the admin dashboard of the Employee Management System. Here you 
can manage all employee-related tasks efficiently.</p> 
    </div> 
    <footer> 
        &copy; 2024 Employee Management System. Ruchi Singh. 
    </footer> 
</body> 
</html>`);
    }
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});