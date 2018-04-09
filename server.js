import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
);

app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`) // eslint-disable-line no-console
);
