# URL Shortener - Learn

This project is a simple URL shortener built using Node.js and MySQL. It allows users to shorten long URLs and redirect them to their corresponding long URLs. This project is a good starting point for learning the basics of building web applications using Node.js and MySQL.
Prerequisites

-    Basic knowledge of JavaScript
-    Basic knowledge of Node.js
-    Basic knowledge of MySQL

## Concepts Covered

-    Express.js
-    Routing in Express.js
-    MySQL and Node.js
-    Creating and querying a MySQL database
-    Shortid library
-    Handling GET and POST requests
-    Redirecting URLs

## Installation

-    Install Node.js on your machine.

-    Install MySQL on your machine.

-    Clone the repository to your local machine

```
git clone https://github.com/ayushch80/url-shortener.git
```

-    Install the necessary packages
```
npm install
```
-    Create a MySQL database and table to store the short and long URLs.
```
CREATE DATABASE url_shortener;
USE url_shortener;
CREATE TABLE urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    short_url VARCHAR(255) NOT NULL,
    long_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
-    Update the MySQL connection details in the `app.js` file.

-    Start the server
```
node app.js
```

### Step 1: Setting up Express.js

First, we need to set up a new Express app. To do this, we require the `express` module and create a new instance of the Express app.
```
const express = require('express');
const app = express();
```
### Step 2: Setting up MySQL connection

Next, we need to set up a connection to our MySQL database. We require the `mysql2` module and use it to create a new connection.
```
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'url_shortener'
});
```
We also want to test the connection to make sure it is successful. We can do this by calling the `connect` method on the connection object and logging the result.
```
connection.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
  } else {
    console.log('MySQL connection successful!');
  }
});
```
### Step 3: Generating Short URLs

Next, we will use the `shortid` library to generate unique short URLs for our long URLs. We can install the library using npm and require it in our code.
```
npm install shortid
```
```
const shortid = require('shortid');
```

We can then use the `generate()` method from the shortid library to generate a short URL in our route for shortening URLs.

```
app.get('/shorten', (req, res) => {
  const shortUrl = shortid.generate();
  // ...
});
```
### Step 4: Storing URLs in MySQL

Once we have the short and long URLs, we can store them in our MySQL database. We can use the `query` method on our connection object to insert the URLs into our `urls` table.

```
app.get('/shorten', (req, res) => {
  // Generate short URL
  const shortUrl = shortid.generate();
  // Get long URL from request
  const longUrl = req.query.longUrl;
  // Insert short and long URLs into MySQL
  connection.query(`INSERT INTO urls (short_url, long_url, created_at) VALUES ('${shortUrl}', '${longUrl}', NOW())`, (err, results) => {
    if (err) {
      res.status(500).send('Error generating short URL');
    } else {
      res.send(`Short URL: http://localhost:3000/${shortUrl}`);
    }
  });
});
```

### Step 5: Redirecting Short URLs

Next, we need to set up a route to handle redirecting short URLs to their corresponding long URLs. We can use the `params` object on the request to get the short URL, and use it to query our MySQL database for the corresponding long URL.

```
app.get('/:shortUrl', (req, res) => {
  // Get short URL from request
  const shortUrl = req.params.shortUrl;
  // Query MySQL for long URL
  connection.query(`SELECT long_url FROM urls WHERE short_url = '${shortUrl}'`, (err, results) => {
    if (err) {
      res.status(500).send('Error redirecting to long URL');
    } else if (results.length === 0) {
      res.status(404).send('Short URL not found');
    } else {
      // Redirect to long URL
      res.redirect(results[0].long_url);
    }
  });
});
```

### Step 6: Starting the Server

Finally, we can start the Express server to listen for requests on a specified port.

```
const PORT = process.env.PUBLIC_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

## Conclusion

By following these steps, you should have a working URL shortener that can shorten long URLs and redirect users to their corresponding long URLs. Feel free to experiment with different features and functionalities to enhance this project.
