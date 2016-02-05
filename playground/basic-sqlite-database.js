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
//{force: true} in sync() will remove table and recreate
//sequelize.sync({force:true})
//	.then(function () {
//	console.log('everything is sync');
//
//	Todo.create({
//		description: 'walking my dog',
//		completed: false
//	}).then(function (todo) {
//		return Todo.create({
//			description: 'feed the cats'
//		});
//	}).then(function () {
//		//return Todo.findById(1);
//		return Todo.findAll ({
//			where: {
//				//completed: false
//				description: {
//					$like: '%dogs%'
//				}
//			}
//		});
//	}).then(function (todos) {
//		if (todos) {
//			todos.forEach(function(todo) {
//				console.log(todo.toJSON());
//			});
//		} else {
//			console.log('no todo found');
//		}
//	}).catch(function (e) {
//		console.log(e);
//	});//});
sequelize.sync()
	.then(function () {
		return Todo.findById(2);
	}).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('no todo found');
		}
	}).catch(function (e) {
		console.log(e);
	});