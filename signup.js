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

prompt.get(validation, function (err, result) {

    console.log('Command-line input received:');
    // console.log('email: ' + result.email);
    // console.log('password: ' + result.password);

    var filePath = path.join(__dirname, './credentials.csv');
    var dataToAppend = `${result.email}, ${result.password}\n`;

    fs.appendFileSync(filePath, dataToAppend, 'utf8', function() {
        console.log('Data was appended to the filie')
    })
});