'use strict'

class UpdateCurso {
  get rules () {
    return {
      carga_horaria: 'above:2400'
    }
  }
  get messages () {
    return {
      'carga_horaria.above': 'Um curso deve conter uma carga horária mínima de 2.400 horas.'
    }
  }
  async fails(errorMessages) {
    return this.ctx.response.status(400).json(
      errorMessages
    );
  }
}

module.exports = UpdateCurso
