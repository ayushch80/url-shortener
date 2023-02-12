# URL Shortener - Learn

This project is a simple URL shortener built using Node.js and MySQL. It allows users to shorten long URLs and redirect them to their corresponding long URLs. This project is a good starting point for learning the basics of building web applications using Node.js and MySQL.

## Table of Contents
- [URL Shortener - Learn](#url-shortener---learn)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Concepts Covered](#concepts-covered)
  - [Installation](#installation)
    - [Step 1: Setting up Express.js](#step-1-setting-up-expressjs)
    - [Step 2: Setting up MySQL connection](#step-2-setting-up-mysql-connection)
    - [Step 3: Generating Short URLs](#step-3-generating-short-urls)
    - [Step 4: Storing URLs in MySQL](#step-4-storing-urls-in-mysql)
    - [Step 5: Redirecting Short URLs](#step-5-redirecting-short-urls)
    - [Step 6: Starting the Server](#step-6-starting-the-server)
  - [Conclusion](#conclusion)

## Prerequisites
-    Basic knowledge of JavaScript
-    Basic knowledge of Node.js
-    Basic knowledge of MySQL

## Concepts Covered

-    Express.js
-    Routing in Express.js
-    MySQL and Node.js
-    Loading data from `.env` files
-    Base-36 
-    Creating and querying a MySQL database
-    Handling GET and POST requests
-    Redirecting URLs


## Installation

-    Install Node.js on your machine.

-    Install MySQL on your machine.

-    Clone the repository to your local machine

```sh
git clone https://github.com/ayushch80/url-shortener.git
```

-    Install the necessary packages

```sh
npm install
```

-    Create a MySQL database and table to store the short and long URLs.
```sql
CREATE DATABASE url_shortener;
USE url_shortener;
CREATE TABLE urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    short_url VARCHAR(255) NOT NULL,
    long_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

-    Update the MySQL connection details in the .env as follows file.
```
PRODUCTION=[Whether it should run in production mode (true or omit the line)]
PUBLIC_PORT=[The port on which the server should run]
SQL_HOST=<MySQL host>
SQL_USER=<MySQL user>
SQL_PASSWORD=<MySQL password>
```

-    Start the server
```sh
node app.js
```

### Step 1: Setting up Express.js

First, we need to set up a new Express app. To do this, we require the `express` module and create a new instance of the Express app.
```js
const express = require('express');
const app = express();
```
### Step 2: Setting up MySQL connection

Next, we need to set up a connection to our MySQL database. We require the `mysql2` module and use it to create a new connection. To store the credentials and web server port, we use the `.env` format loaded by the `dotenv` module. We also store the webserver port for later use.
```js
const mysql = require('mysql2');
const PORT = process.env.PUBLIC_PORT || 3000;
require('dotenv').config()
const connection = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: 'url_shortener'
});
```
We also want to test the connection to make sure it is successful. We can do this by calling the `connect` method on the connection object and logging the result.
```js
connection.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
  } else {
    console.log('MySQL connection successful!');
  }
});
```
### Step 3: Generating Short URLs

Generating the ID is a bit complicated, but is a quick one-liner
```js
const shortUrl = Math.random().toString(36).substring(2,7)
```
Let's break it down!
- `Math.random()` returns a random number between 1 and 2
- `.toString(36)` converts this number from something like `1.4786228121622849` to `1.h8amj74dh2`. 
How it works is complicated, but in summary, instead of using our decimal system with numbers from 0-9, it uses 0-9 as well as a-z. A decimal number like 120 = `10^2 * 1 + 10^1 * 2 + 10^0 * 0` or `100 + 20 + 0`. Essentially, each digit can be from 0 - 9 and is multiplied by `(number of possible values (0-9))` raised to `(digit number from right)`. In hexadecimal, the digits are from `0-9` and `a-f` (16 digits hence hexadecimal or base-16). Thus `120` in hexadecimal is `16^2 * 1 + 16^1 * 2 + 16^0 * 0` = `256 + 32 + 0` = `288` in decimal. Same way for base-36 (`0-9a-z`). Here we are converting from decimal to base-36.
- `.substring(2,7)` this is to take the data from indices 2-6, for a 5 digit code (Math.random() in base-36 has 10 decimal places)

To add it to a GET route,
```js
app.get('/shorten', (req, res) => {
  const shortUrl = Math.random().toString(36).substring(7);
  // ...
});
```
### Step 4: Storing URLs in MySQL

Once we have the short and long URLs, we can store them in our MySQL database. We can use the `query` method on our connection object to insert the URLs into our `urls` table.

```js
app.get('/shorten', (req, res) => {
  // Generate short URL
  const shortUrl = Math.random().toString(36).substring(7);
  // Get long URL from request
  const longUrl = req.query.longUrl;
  // Insert short and long URLs into MySQL
  connection.query(`INSERT INTO urls (short_url, long_url, created_at) VALUES ('${shortUrl}', '${longUrl}', NOW())`, (err, results) => {
    if (err) {
      res.status(500).send('Error generating short URL');
    } else {
      res.send(`Short URL: http://localhost:${PORT}/${shortUrl}`);
    }
  });
});
```

### Step 5: Redirecting Short URLs

Next, we need to set up a route to handle redirecting short URLs to their corresponding long URLs. We can use the `params` object on the request to get the short URL, and use it to query our MySQL database for the corresponding long URL.

```js
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

```js
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

## Conclusion

By following these steps, you should have a working URL shortener that can shorten long URLs and redirect users to their corresponding long URLs. Feel free to experiment with different features and functionalities to enhance this project.
