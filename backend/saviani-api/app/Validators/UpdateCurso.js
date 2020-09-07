'use strict'

class UpdateCurso {
  get rules () {
    return {
    	nome: 'unique:cursos|max:240',
      	codigo: 'unique:cursos|max:30',
		carga_horaria: 'above:2400'
    }
  }
  get messages () {
    return {
      'carga_horaria.above': 'Um curso deve conter uma carga horária mínima de 2.400 horas.',
      'nome.unique': 'Já existe um curso com este nome.',
      'codigo.unique': 'Já existe um curso com este código.',
      'nome.max': 'O nome informado é longo demais (max: 240 caracteres).',
      'codigo.max': 'O código informado é longo demais (max: 30 caracteres).'
    }
  }
  async fails(errorMessages) {
    return this.ctx.response.status(400).json(
      errorMessages
    );
  }
}

module.exports = UpdateCurso
