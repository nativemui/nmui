// Rust / Axum — SPA fallback via tower-http.
// ServeDir serves real files; its .fallback() is the file answered
// when nothing matches. Put this at src/main.rs.
//   cargo run                      // http://localhost:8080
use axum::Router;
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    let app = Router::new().fallback_service(
        ServeDir::new(".").fallback(ServeFile::new("index.html")),
    );
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}
