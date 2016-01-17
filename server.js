var app = require('express')();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
}, {
    id: 2,
    description: 'go supermarket',
    completed: false
}];

app.get('/', function(req, res) {
    res.send('TODO api root');
});

app.get('/todos', function(req, res) {
    res.json(todos);
});

app.get('/todos/:id', function(req, res) {
    res.json(todos[id]);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});