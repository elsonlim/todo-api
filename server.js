var app = require('express')();
var bodyParser = require('body-parser');
var _ = require('underscore');
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('TODO api root');
});

app.get('/todos', function(req, res) {
    res.json(todos);
});

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var todoObj = _.findWhere(todos, {id: todoId});
    
//    todos.forEach( function (item) {
//       if(item.id === todoId){
//           todoObj = item;
//       }     
//    });
    
    if(todoObj){
        res.json(todoObj);
    }else {
        res.status(404).send();
    }
   // res.send('Asking for todo with id of ' + req.params.id);
});

app.post('/todos', function (req,res) {
    var body = _.pick(req.body, 'description', 'completed');
    body.description = body.description.trim();
    if( !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0){
		return res.status(400).send();
    }
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

app.delete('/todos/:id', function (req,res){
	var todoId = parseInt(req.params.id);
    var todoObj = _.findWhere(todos, {id: todoId});
	
	if(!todoObj) {
		return res.status(400).json({
			"error": "no todo found with that id"
		});
	}
	
	todos = _.without(todos,todoObj);
	res.status(200).json(todoObj);
});
		   
app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});