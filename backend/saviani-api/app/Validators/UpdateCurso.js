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
    // TODO achar o jeito certo de devolver o status
	const uniqueError = (erro) => erro.validation == "unique";
	const code = errorMessages.some(uniqueError)?409:403;

    return this.ctx.response.status(code).json(
      errorMessages
    );
  }
}

module.exports = UpdateCurso
