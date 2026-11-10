# Flask — serve this folder at the root, answer 404s with the app.
#   pip install flask
#   flask --app app run          # http://localhost:5000
# Returning 200 explicitly matters: Flask would otherwise serve
# index.html WITH a 404 status.
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder=".", static_url_path="")


@app.errorhandler(404)
def spa_fallback(error):
    return send_from_directory(".", "index.html"), 200
