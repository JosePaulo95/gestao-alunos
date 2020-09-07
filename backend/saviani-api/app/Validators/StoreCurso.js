'use strict'

class StoreCurso {
  get rules () {
    return {
      nome: 'required',
      codigo: 'required',
      carga_horaria: 'required'
    }
  }
  get messages () {
    return {
      'nome.required': 'Nome para o curso não informado.',
      'codigo.required': 'Código para o curso não informado.',
      'carga_horaria.required': 'Carga horária do curso não informada.'
    }
  }
  async fails(errorMessages) {
    return this.ctx.response.status(400).json(
      errorMessages
    );
  }
}

module.exports = StoreCurso
