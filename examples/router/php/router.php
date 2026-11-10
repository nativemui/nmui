<?php
// router.php — router script for PHP's built-in server.
//   php -S localhost:8080 router.php
// Returning false means "serve the file yourself"; anything else
// is a client-side route, so the script answers with the app.
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$file = __DIR__ . $path;

if ($path !== "/" && is_file($file)) {
    return false;                    // real file — server serves it
}

readfile(__DIR__ . "/index.html");   // route — hand over the app
