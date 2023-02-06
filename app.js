// Import necessary modules
const app = require('express')();
const mysql = require('mysql2');
// Create a new Express app
require('dotenv').config();
const PORT = process.env.PUBLIC_PORT || 3000;


// Create a connection pool
const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: 'url_shortener'
});
if (process.env.PRODUCTION) {
  app.get('/urls', (req, res) => {
    // Query the MySQL database for the urls table
    pool.query('SELECT * FROM urls', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error getting URL data!');
      }
      res.json(results);
    });
  });
}
// Create a route to generate a short URL
app.get('/shorten', (req, res) => {
  // Generate a short ID
  const shortUrl = Math.random().toString(36).substring(7);
  console.log(shortUrl);
  // Get the long URL from the request
  const longUrl = req.query.longUrl;
  // Insert the short and long URLs into the MySQL database
  pool.query(
    `INSERT INTO urls (short_url, long_url, created_at) VALUES (?, ?, NOW())`,
    [shortUrl, longUrl],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error generating short URL');
      } else {
        res.setHeader('Content-Type', 'text/plain');  //specify content type to prevent XSS
        res.send(`http://${req.headers.host}${PORT == 80 ? '' : `${PORT}`}/${shortUrl}`);
      }
    }
  );
});

// Create a route to redirect short URLs to their corresponding long URLs
app.get('/:shortUrl', (req, res) => {
  // Get the short URL from the request
  const shortUrl = req.params.shortUrl;
  // Query the MySQL database for the corresponding long URL
  pool.query(
    `SELECT long_url FROM urls WHERE short_url = ?`,
    [shortUrl],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error redirecting to long URL');
      } else if (results.length === 0) {
        res.status(404).send('Short URL not found');
      } else {
        // check if the long_url property exists
        if (results[0].hasOwnProperty('long_url')) {
          // Redirect the user to the long URL
          res.redirect(results[0].long_url);
        } else {
          console.error('long_url property not found in results');
          res.status(500).send('Error redirecting to long URL');
        }
      }
    }
  );
});

// Start the Express app on port 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
