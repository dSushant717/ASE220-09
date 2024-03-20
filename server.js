const http = require('http');
const fs = require('fs');
const path = require('path');
const { StringDecoder } = require('string_decoder');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.method === 'POST') {
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => {
      buffer += decoder.write(data);
    });

    req.on('end', () => {
      buffer += decoder.end();
      const parsedData = JSON.parse(buffer);

      if (req.url === '/api/signup') {
        const newAccount = {
          email: parsedData.email,
          password: parsedData.password
        };

        fs.appendFile('credentials.csv', `${newAccount.email},${newAccount.password}\n`, 'utf8', (err) => {
          if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ status: -1, error: 'Server Error' }));
          } else {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 0, message: 'Account created' }));
          }
        });
      } else if (req.url === '/api/signin') {
        fs.readFile('credentials.csv', 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ status: -1, error: 'Server Error' }));
          } else {
            const lines = data.split('\n');
            const isValid = lines.some(line => {
              const [email, password] = line.split(',');
              return email === parsedData.email && password === parsedData.password.trim();
            });

            if (isValid) {
              res.writeHead(200);
              res.end(JSON.stringify({ status: 0, message: 'Login successful' }));
            } else {
              res.writeHead(401);
              res.end(JSON.stringify({ status: -1, error: 'Invalid credentials' }));
            }
          }
        });
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ status: -1, error: 'unauthorized request' }));
      }
    });
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ status: -1, error: 'Method not allowed' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
