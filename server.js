const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());
const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/')));
app.use(express.urlencoded());

// Connect to MongoDB
mongoose.connect('mongodb+srv://rahulkrarav:7Nov%402000@atlascluster.pdsd6zf.mongodb.net/rahuldb?retryWrites=true&w=majority&appName=AtlasCluster', {
   
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/signup', async (req, res) => {
    const data = req.body;
    const newUser = new User({ username : data.txt, email : data.email, password : data.pswd});
    try {
        await newUser.save();
        res.writeHead(201,"created");
        res.write("user created successfully");
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400);
        res.end();
    }
});

app.post('/login', async (req, res) => {
    const body = req.body;
    try {
        const user = await User.findOne({ email : body.email, password : body.pswd });
        if (user) {
            const emp_datas = await (mongoose.model("User")).find();
            var table = "<h1 style='text-align:center;text-decoration:underline;'>All Employees Data  </h1><table style='width:100%;color:white;background:black;border:2px solid black;padding:10px;margin:0 auto;'><tr><th style='text-align:left;border-bottom:2px solid black;padding:5px;margin:5px;'>username</th><th style='text-align:left;border-bottom:2px solid black;padding:5px;margin:5px;'>email</th><th style='text-align:left;border-bottom:2px solid black;padding:5px;margin:5px;'>password</th></tr>";
            console.log(emp_datas);
            for(let data of emp_datas){
                table = table +`<tr><td style='border-bottom:1px solid white;padding:5px;margin:5px;'>${data.username}</td><td style='border-bottom:1px solid white;padding:5px;margin:5px;'>${data.email}</td><td style='border-bottom:1px solid white;padding:5px;margin:5px;'>${data.password}</td></tr>`;
            }
            table = table + "</table>";
            res.writeHead(200,"ok",{
                "content-type" : "text/html",
            });
            res.write(table);
            res.end();
        } else {
            res.status(400).send('Invalid email or password');
        }
    } catch (error) {
        res.status(400).send('Error logging in');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});