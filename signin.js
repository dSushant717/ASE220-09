var prompt = require('prompt');
var fs = require('fs');
var path = require('path');

var validation = {
    properties: {
        email: {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Invalid email',
            required: true
        },
        password: {
            required: true,
            hidden: true,
            replace: '*'
        }
    }
};

prompt.start();

function checkCredentials(inputEmail, inputPassword, callback) {
  var filePath = path.join(__dirname, 'credentials.csv');
  
  fs.readFile(filePath, { encoding: 'utf8' }, function(err, data) {
    if (err) {
      return callback(err);
    }
    
    var lines = data.split('\n');
    
    var isValid = lines.some(function(line) {
      var [email, password] = line.split(',');
      
      email = (email || "").trim();
      password = (password || "").trim();
      
      return email === inputEmail && password === inputPassword;
    });
    
    callback(null, isValid);
  });
}

prompt.get(validation, function(err, result) {
  if (err) {
    console.error('An error occurred:', err);
    return;
  }
  
  checkCredentials(result.email, result.password, function(error, success) {
    if (error) {
      console.error('An error occurred:', error);
      return;
    }
    
    if (success) {
      console.log('Login successful!');
    } else {
      console.log('Login failed: Invalid email or password.');
    }
  });
});
