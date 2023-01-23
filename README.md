![LICENSE - MIT](https://img.shields.io/github/license/ayushch80/url-shortner?color=red&style=for-the-badge)
![FORKS](https://img.shields.io/github/forks/ayushch80/url-shortner?color=red&style=for-the-badge)
![CONTRIBUTORS](https://img.shields.io/github/contributors/ayushch80/url-shortner?color=red&style=for-the-badge)
![STARS](https://img.shields.io/github/stars/ayushch80/url-shortner?color=red&style=for-the-badge)

![NODE JS](https://img.shields.io/badge/Node%20JS-555555?style=for-the-badge&logo=node.js)
![MY SQL](https://img.shields.io/badge/MY%20SQL-555555?style=for-the-badge&logo=mysql)
![EXPRESS](https://img.shields.io/badge/EXPRESS-555555?style=for-the-badge&logo=express)

# URL Shortener

This project is a simple URL shortener built using Node.js and MySQL. It allows users to shorten long URLs and redirect them to their corresponding long URLs.
Features

-    Shorten long URLs
-    Redirect short URLs to their corresponding long URLs
-    MySQL database to store short and long URLs
-    Generates unique short URLs using the shortid library

## Prerequisites

-    Node.js
-    MySQL

## Installation

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

-    Update the MySQL connection details in the app.js file.

-    Start the server
```
node app.js
```

## Usage

-    To shorten a long URL, visit http://localhost:3000/shorten?longUrl=<long-url> in your browser.
-    To redirect a short URL to its corresponding long URL, visit http://localhost:3000/<short-url> in your browser.
-    To view the contents of the urls table, visit http://localhost:3000/urls in your browser.

## Note

 -   The server is running on port 3000, you can change it as per your requirement.
 -   The database credentials should be updated as per your setup.
 -   Make sure to validate the input and sanitize the output when displaying data from a database to prevent SQL injection and other security risks.
 -   The /urls route should only be accessible to authorized personnel and should be removed or secured in a production environment.
 -   Displaying raw data from the database on a web page can also be a security concern. It would be a good idea to only show the necessary information and not the entire database.
