'use strict'

const Aluno = use("App/Models/Aluno")
const Endereco = use("App/Models/Endereco")
class AlunoController {
  /**
  * @swagger
  * /Alunos:
  *   get:
  *     tags:
  *       - Alunos
  *     summary: Retorna todos os alunos incluindo o campo endereco.
  *     responses:
  *       200:
  *         description: lista todos os alunos
  *         example:
  *             [
  *               {
  *                 "id": 1,
  *                 "codigo": "med001",
  *                 "nome": "Medicina",
  *                 "carga_horaria": 600,
  *                 "created_at": "2020-09-05 16:51:57",
  *                 "updated_at": "2020-09-05 16:51:57"
  *               },
  *               {
  *                 "id": 2,
  *                 "codigo": "farm001",
  *                 "nome": "Farmácia",
  *                 "carga_horaria": 1200,
  *                 "created_at": "2020-09-05 16:52:08",
  *                 "updated_at": "2020-09-05 16:52:08"
  *               },
  *               {
  *                 "id": 3,
  *                 "codigo": "comp001",
  *                 "nome": "Computação",
  *                 "carga_horaria": 1200,
  *                 "created_at": "2020-09-05 16:52:08",
  *                 "updated_at": "2020-09-05 16:52:08"
  *               }
  *             ]
  */
  async index () {
    const alunos = await Aluno.query().with("endereco").fetch();

    return alunos;
  }

  /**
  * @swagger
  * /alunos:
  *   post:
  *     tags:
  *       - Alunos
  *     summary: Cadastra um aluno
  *     parameters:
  *       - name: codigo
  *         description: Código
  *         in: query
  *         required: true
  *         type: string
  *       - name: nome
  *         description: Nome do Aluno
  *         in: query
  *         required: true
  *         type: string
  *       - name: carga_horaria
  *         description: Carga horária
  *         in: query
  *         required: true
  *         type: integer
  *     responses:
  *       200:
  *         description: Aluno cadastrado
  *         example:
  *               {
  *                 "id": 1,
  *                 "codigo": "med001",
  *                 "nome": "Medicina",
  *                 "carga_horaria": 600,
  *                 "created_at": "2020-09-05 16:51:57",
  *                 "updated_at": "2020-09-05 16:51:57"
  *               }
  *       403:
  *         description: um array com os objetos com detalhes do erro. Pode ser algum campo não informado ou carga horária não positiva.
  *         example:
  *               [
  *                 {
  *                   "message": "Nome para o Aluno não informado.",
  *                   "field": "nome",
  *                   "validation": "required"
  *                 }
  *               ]
  *       409:
  *         description: uma mensagem de erro que indica duplicata
  *         example:
  *               [
  *                 {
  *                   "message": "Já existe um Aluno com este nome.",
  *                   "field": "nome",
  *                   "validation": "unique"
  *                 }
  *               ]
  */
  async store ({ request, response }) {
    const input_aluno_fields = request.only(["codigo","nome","cpf","email","telefone"])
    const input_endereco_fields = request.only(["cep","numero","logradouro","bairro","cidade"])

    const novo_endereco = await Endereco.create({...input_endereco_fields});
    const novo_aluno = await Aluno.create({"endereco_id": novo_endereco.id, ...input_aluno_fields});

    return novo_aluno;
  }

  /**
   * Display a single aluno.
   * GET alunos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update aluno details.
   * PUT or PATCH alunos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a aluno with id.
   * DELETE alunos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AlunoController
