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
  * @swagger
  * /alunos/{id}:
  *   get:
  *     tags:
  *       - Alunos
  *     summary: Recupera um aluno pelo id
  *     parameters:
  *       - name: id
  *         description: id
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: aluno selecionado
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
  async show ({ params, response }) {
    const aluno = await Aluno.query().where('id', params.id).first().with("endereco").fetch();
    return aluno;
    
  }

  /**
  * @swagger
  * /alunos/{id}:
  *   patch:
  *     tags:
  *       - Alunos
  *     summary: Atualiza um aluno
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
    const aluno = await Aluno.findOrFail(params.id);
    const endereco = await Endereco.findOrFail(aluno.endereco_id);

    const input_aluno_fields = request.only(["codigo","nome","cpf","email","telefone"])
    const input_endereco_fields = request.only(["cep","numero","logradouro","bairro","cidade"])

    await aluno.merge({...input_aluno_fields})
    await endereco.merge({...input_endereco_fields})

    await aluno.save();
    await endereco.save();

    return aluno;
  }

  /**
  * @swagger
  * /alunos/{id}:
  *   delete:
  *     tags:
  *       - Alunos
  *     summary: Remove um aluno pelo id
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
    const aluno = await Aluno.findOrFail(params.id)
    //trigger ondelete definido na migration n funcionando
    const endereco = await Endereco.findOrFail(aluno.endereco_id)

    aluno.delete();
    endereco.delete();
  }
}

module.exports = AlunoController
