import {} from 'dotenv/config';

import express, { urlencoded } from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";

const API = process.env.API_KEY;
const LIST_ID = process.env.LIST_ID;


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));

// Parse data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Main page
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, "main.html"));
})

app.post('/', function(req, res) {
	res.redirect("/signup");
})


// Sign In Page
app.get('/signup', function(req, res) {
 res.sendFile(path.join(__dirname, "signup.html"));
})

// Posting data to Mailchimp server
app.post('/signup', function(req, res) {
	const name = req.body.name;
	const email = req.body.email;

	const data = {
		members: [
		{
			email_address: email,
			status: "subscribed",
			merge_fields: {
				FNAME: name
			}
		}
		]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us18.api.mailchimp.com/3.0/lists/" + LIST_ID;

	const options = {
		method: "POST",
		auth: API,
	}

	const request = https.request(url, options, function(response) {
		if(response.statusCode === 200) {
			res.sendFile(path.join(__dirname, "success.html"))
		} else res.sendFile(path.join(__dirname, "failure.html"));
	})

	request.write(jsonData);
	request.end();
})

// Button redirects to signup form on failure page
app.post("/failure", function(req, res) {
	res.redirect("/signup");
})

// Button redirects to sign up form on success page
app.post("/success", function(req, res) {
	res.redirect("/");
})

// Main page nav link About
app.get("/about", function(req, res) {
	res.sendFile(path.join(__dirname, "about.html"));
})

app.post("/about", function(req, res) {
	res.redirect("/about");
})

// Arrow back to Main oage from About Page
app.post("/about",  function(req, res) {
	res.redirect("/");
})

app.listen(3000, console.log("Listening on port 3000!"))