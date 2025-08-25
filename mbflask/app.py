from flask import Flask
from flask import render_template

app = Flask(__name__, static_folder='static', static_url_path='')


@app.route("/")
def hello_world():
    return render_template("index.html")
