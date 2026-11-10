<?php
// routes/web.php — FRAGMENT: add LAST in the file.
// Build/copy the app into public/, then any path Laravel does not
// claim gets the app shell and the client-side router takes over.
use Illuminate\Support\Facades\Route;

Route::fallback(function () {
    return response()->file(public_path("index.html"));
});
