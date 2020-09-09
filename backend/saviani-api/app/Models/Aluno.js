'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Aluno extends Model {
	endereco(){
		return this.belongsTo("App/Models/Endereco")
	}
}

module.exports = Aluno
