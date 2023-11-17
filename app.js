
const express = require('express');
const bodyParser = require('body-parser');
const final = require('./puppeteer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit-url', async (req, res) => {
  const url = req.body.url;
  try {
      const result = await final(url);
      res.render('result', { result });
  } catch (error) {
      res.render('error', { error: 'Failed to fetch data from the URL.' });
  }
});

function calculateResult(url) {
  // Your logic to calculate the result based on the URL
  return `Calculated Result for ${url}`;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
