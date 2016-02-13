var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('user', {
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
				len: [7,100],
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
				if( typeof user.email === 'string' ) {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJson: function () {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			} 
		}
	});
}