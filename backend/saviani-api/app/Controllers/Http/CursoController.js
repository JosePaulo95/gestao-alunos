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
  *       403:
  *         description: um array com os objetos com detalhes do erro. Pode ser algum campo não informado ou carga horária não positiva.
  *         example:
  *               [
  *                 {
  *                   "message": "Nome para o curso não informado.",
  *                   "field": "nome",
  *                   "validation": "required"
  *                 }
  *               ]
  *       409:
  *         description: uma mensagem de erro que indica duplicata
  *         example:
  *               [
  *                 {
  *                   "message": "Já existe um curso com este nome.",
  *                   "field": "nome",
  *                   "validation": "unique"
  *                 }
  *               ]
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
  * @swagger
  * /cursos/{id}:
  *   patch:
  *     tags:
  *       - Cursos
  *     summary: Atualiza um curso
  *     parameters:
  *       - name: id
  *         description: id na url
  *         in: path
  *         required: true
  *         type: integer
  *       - name: codigo
  *         description: Código
  *         in: query
  *         required: false
  *         type: string
  *       - name: nome
  *         description: Nome do curso
  *         in: query
  *         required: false
  *         type: string
  *       - name: carga_horaria
  *         description: Carga horária
  *         in: query
  *         required: false
  *         type: integer
  *     responses:
  *       204:
  *         description: sucesso, mas nada é retornado
  *       403:
  *         description: um array com os objetos com detalhes do erro. Por exemplo, a atualização pode estar tentando setar uma carga horária baixa demais.
  *         example:
  *               [
  *                 {
  *                   "message": "Um curso deve conter uma carga horária mínima de 2.400 horas.",
  *                   "field": "carga_horaria",
  *                   "validation": "above"
  *                 }
  *               ]
  *       409:
  *         description: uma mensagem de erro que indica duplicata
  *         example:
  *               [
  *                 {
  *                   "message": "Já existe um curso com este nome.",
  *                   "field": "nome",
  *                   "validation": "unique"
  *                 }
  *               ]
  */
  async update ({ params, request, response }) {
    const curso = await Curso.findOrFail(params.id);
    const input = request.only(["codigo", "nome", "carga_horaria"])
    await curso.merge({codigo: input.codigo, nome: input.nome, carga_horaria: input.carga_horaria})

    await curso.save();
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
  *       204:
  *         description: Nada é retornado
  *         example: 
  *
  */
  async destroy ({ params, request, response }) {
    const curso = await Curso.findOrFail(params.id)
    curso.delete();

    
  }
}

module.exports = CursoController
