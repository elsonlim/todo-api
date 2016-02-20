var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 100],
			},
			set: function (value) {
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hash);
			}
		}
	}, {
		hooks: {
			beforeValidate: function (user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authentication: function (body) {
				return new Promise(function (resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						reject();
					}

					user.findOne({
						where: {
							email: body.email.toLocaleLowerCase()
						}
					}).then(function (user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							reject();
						}
						resolve(user);
					}, function (error) {
						reject();
					});
				});
			}
		},
		instanceMethods: {
			toPublicJson: function () {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			}
		}
	});
	
	return user;
};