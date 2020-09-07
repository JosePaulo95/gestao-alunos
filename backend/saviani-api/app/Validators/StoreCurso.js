'use strict'

class StoreCurso {
  get rules () {
    return {
		nome: 'required|unique:cursos|max:240',
		codigo: 'required|unique:cursos|max:30',
		carga_horaria: 'required|above:2400'
    }
  }
  get messages () {
    return {
      'nome.required': 'Nome para o curso não informado.',
      'codigo.required': 'Código para o curso não informado.',
      'carga_horaria.required': 'Carga horária do curso não informada.',
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

module.exports = StoreCurso
