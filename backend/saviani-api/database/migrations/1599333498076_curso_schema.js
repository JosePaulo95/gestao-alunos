'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CursoSchema extends Schema {
  up () {
    this.create('cursos', (table) => {
    	table.increments()
		table.string("codigo", 30).notNullable()
		table.string("nome", 240).notNullable()
		table.integer("carga_horaria").notNullable()
    	table.timestamps()
    })
  }

  down () {
    this.drop('cursos')
  }
}

module.exports = CursoSchema