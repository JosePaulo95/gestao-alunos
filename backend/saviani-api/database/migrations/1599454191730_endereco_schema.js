'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnderecoSchema extends Schema {
  up () {
    this.create('enderecos', (table) => {
      table.increments()
		table.string("cep", 16).notNullable();
		table.string("numero", 8).notNullable();
		table.string("logradouro", 120).notNullable();
		table.string("bairro", 120).notNullable();
		table.string("cidade", 240).notNullable();
		table.timestamps();
    })
  }

  down () {
    this.drop('enderecos')
  }
}

module.exports = EnderecoSchema
