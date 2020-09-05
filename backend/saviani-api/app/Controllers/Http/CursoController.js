'use strict'

const Curso = use("App/Models/Curso")

class CursoController {
  
  /**
  * @swagger
  * /cursos:
  *   get:
  *     tags:
  *       - Cursos
  *     summary: Retorna todos os cursos.
  *     responses:
  *       200:
  *         description: lista todos os cursos
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
    const cursos = await Curso.all();

    return cursos;
  }

  /**
  * @swagger
  * /cursos:
  *   post:
  *     tags:
  *       - Cursos
  *     summary: Cadastra um curso
  *     parameters:
  *       - name: codigo
  *         description: Código
  *         in: query
  *         required: true
  *         type: string
  *       - name: nome
  *         description: Nome do curso
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
  *         description: Curso cadastrado
  *         example:
  *               {
  *                 "id": 1,
  *                 "codigo": "med001",
  *                 "nome": "Medicina",
  *                 "carga_horaria": 600,
  *                 "created_at": "2020-09-05 16:51:57",
  *                 "updated_at": "2020-09-05 16:51:57"
  *               }
  */
  async store ({ request, response }) {
    const input = request.only(["codigo", "nome", "carga_horaria"])
    const novo_curso = await Curso.create({...input});

    return novo_curso;
  }

  /**
  * @swagger
  * /cursos/{id}:
  *   get:
  *     tags:
  *       - Cursos
  *     summary: Recupera um curso pelo id
  *     parameters:
  *       - name: id
  *         description: id
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Curso selecionado
  *         example:
  *               {
  *                 "id": 1,
  *                 "codigo": "med001",
  *                 "nome": "Medicina",
  *                 "carga_horaria": 600,
  *                 "created_at": "2020-09-05 16:51:57",
  *                 "updated_at": "2020-09-05 16:51:57"
  *               }
  */
  async show ({ params }) {
    const curso = Curso.findOrFail(params.id);

    return curso;
  }

  /**
   * Update curso details.
   * PUT or PATCH cursos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
  * @swagger
  * /cursos/{id}:
  *   delete:
  *     tags:
  *       - Cursos
  *     summary: Remove um curso pelo id
  *     parameters:
  *       - name: id
  *         description: id
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Curso selecionado
  *         example: {}
  *
  */
  async destroy ({ params, request, response }) {
    const curso = await Curso.findOrFail(params.id)

    curso.delete();

    return {};
  }
}

module.exports = CursoController
