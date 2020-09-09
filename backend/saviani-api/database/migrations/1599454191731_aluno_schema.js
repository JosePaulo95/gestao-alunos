'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlunoSchema extends Schema {
  up () {
    this.create('alunos', (table) => {
		table.increments()
		table.string("codigo", 30).notNullable();
		table.string("nome", 240).notNullable();
		table.string("cpf", 11).notNullable();
		table.string("email", 240).notNullable();
		table.string("telefone", 16).notNullable();
		table
			.integer("endereco_id")
			.notNullable()
			.unsigned()
			.references("id")
			.inTable("enderecos")
			.onDelete("CASCADE");
		table
			.integer("curso_id")
			.unsigned()
			.references("id")
			.inTable("cursos")
		table.timestamps();
    })
  }

  down () {
    this.drop('alunos')
  }
}

module.exports = AlunoSchema