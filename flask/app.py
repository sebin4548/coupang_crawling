# from flask import Flask, request, render_template
# import import_ipynb
# import subprocess
# import json

# app = Flask(__name__)

# @app.route('/', methods=['GET', 'POST'])
# def index():
#     if request.method == 'POST':
#         url = request.form['url']
#         # Perform your calculation or processing here
#         result = calculate_result(url)
#         return render_template('result.html', result=result)
#     return render_template('index.html')

# def Anal_Alba(url):
#     # Crawl Alba Data
#     # result
#     pass


# def calculate_result(url):
#     # Your logic to calculate the result based on the URL
#     Anal_Alba(url)
#     return "Calculated Result"

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, request, render_template
import subprocess
import json
import asyncio
import os

# ...

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
crawl_script_path = os.path.join(BASE_DIR, 'crawl.js')

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form['url']
        result = calculate_result(url)
        return render_template('result.html', result=result)
    return render_template('index.html')

async def async_calculate_result(url):
    # Async function to call Node.js script
    process = await asyncio.create_subprocess_exec(
    'node', crawl_script_path, url, 
    stdout=asyncio.subprocess.PIPE, 
    stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await process.communicate()

    if stderr:
        return f"Error: {stderr.decode()}"

    data = json.loads(stdout.decode())
    return data

def calculate_result(url):
    # Run the async function in the event loop
    return asyncio.run(async_calculate_result(url))
if __name__ == '__main__':
    app.run(debug=True)
