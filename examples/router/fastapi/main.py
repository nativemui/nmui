# FastAPI — SPA fallback.
#   pip install fastapi uvicorn
#   uvicorn main:app               # http://localhost:8000
# Declare your /api routes BEFORE the catch-all — order matters.
import os

from fastapi import FastAPI
from fastapi.responses import FileResponse

app = FastAPI()

# …your @app.get("/api/…") routes go here…


@app.get("/{full_path:path}")
async def spa(full_path: str):
    candidate = os.path.join(".", full_path)
    if os.path.isfile(candidate):
        return FileResponse(candidate)
    return FileResponse("./index.html")
