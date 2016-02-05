var app = require('express')();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('TODO api root');
});

app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	
	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (item) {
			return item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) >= 0
		});
	}
	
    res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
	
	db.todo.findById(todoId).then(function(todo) {
		if( !!todo ) { 
			res.json(todo.toJSON()) 
		}else {
			res.status(404).send();
		};
	}, function(e) {
		res.status(500).send();
	});
//    var todoObj = _.findWhere(todos, {id: todoId});
//    
//    if(todoObj){
//        res.json(todoObj);
//    }else {
//        res.status(404).send();
//    }
});

app.post('/todos', function (req,res) {
    var body = _.pick(req.body, 'description', 'completed');
    body.description = body.description.trim();
//    if( !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0){
//		return res.status(400).send();
//    }
    //body.id = todoNextId++;
    //todos.push(body);
    db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
//	.catch(function (e) {
//		console.log(e);
//		res.status(400).send(e);
//	});
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

app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos,{id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {}
	
	if (!matchTodo) {
		return res.status(404).send();
	}
	
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description)){
		validAttributes.description = body.description;
	}else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	
	_.extend(matchTodo, validAttributes); //by referrence will override 
	res.status(200).json(matchTodo);
	
});


db.sequelize.sync().then(
	function () {
		app.listen(PORT, function () {
			console.log('Express listening on port ' + PORT + '!');
		});
	}
);