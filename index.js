const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Build filepath
  let filepath = path.join(
    __dirname,
    'public',
    req.url === '/' ? 'index.html' : req.url
  );
  // Extension of the file
  let extname = path.extname(filepath);

  // Initial content type
  let contentType = 'text/html';

  // Check ext and set content type
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Read file
  fs.readFile(filepath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // Page not found
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        );
      } else {
        res.writeHead(500)
        res.end(`Server Error ${err.code}`)
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content, 'utf-8')
    }
  });
});

const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Server running on ${PORT}`))
