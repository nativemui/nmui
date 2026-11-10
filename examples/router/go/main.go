// Go — SPA fallback with the standard library only.
//   go run main.go                 // http://localhost:8080
package main

import (
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	root := "."
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		p := filepath.Join(root, r.URL.Path)
		info, err := os.Stat(p)
		if err != nil || info.IsDir() {
			// Not a file -> client-side route.
			http.ServeFile(w, r, filepath.Join(root, "index.html"))
			return
		}
		http.ServeFile(w, r, p)
	})
	http.ListenAndServe(":8080", nil)
}
