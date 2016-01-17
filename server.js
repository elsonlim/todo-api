var app = require('express')();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.send('TODO api root');
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});