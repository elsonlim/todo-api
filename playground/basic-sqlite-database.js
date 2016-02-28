var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/basic-sqlite-database.sqlite'
});
//sequelize convert javascript options into database stuff

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	force: true
})
.then(function () {
	//return Todo.findById(2);
	return User.create({
		email:'someeamil@ksadfh.com'
	})
}).then(function (todo) {
	return Todo.create({
		description: 'todo1'
	})
	
	//	if (todo) {
//		console.log(todo.toJSON());
//	} else {
//		console.log('no todo found');
//	}
}).then(function (todo) {
	User.findById(1).then(function (user) {
		user.addTodo(todo);
	})
}).catch(function (e) {
	console.log(e);
});