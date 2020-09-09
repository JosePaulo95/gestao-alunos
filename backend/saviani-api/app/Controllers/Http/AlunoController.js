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
  *                 "codigo": "codigoAluno 1",
  *                 "nome": "José Paulo",
  *                 "cpf": "00868110380",
  *                 "email": "meu_email@gmail.com",
  *                 "telefone": "98988231995",
  *                 "endereco_id": 1,
  *                 "created_at": "2020-09-09 12:38:16",
  *                 "updated_at": "2020-09-09 12:38:16",
  *                 "endereco": {
  *                   "id": 1,
  *                   "cep": "65051190",
  *                   "numero": "19",
  *                   "logradouro": "logradouro",
  *                   "bairro": "bairro",
  *                   "cidade": "cidade",
  *                   "created_at": "2020-09-09 12:38:16",
  *                   "updated_at": "2020-09-09 12:38:16"
  *                 }
  *               },
  *               {
  *                 "id": 2,
  *                 "codigo": "codigoAluno 2",
  *                 "nome": "Andre Pereira Silva",
  *                 "cpf": "00868110381",
  *                 "email": "meu_email2@gmail.com",
  *                 "telefone": "98988231995",
  *                 "endereco_id": 1,
  *                 "created_at": "2020-09-09 12:38:16",
  *                 "updated_at": "2020-09-09 12:38:16",
  *                 "endereco": {
  *                   "id": 1,
  *                   "cep": "65051190",
  *                   "numero": "19",
  *                   "logradouro": "logradouro",
  *                   "bairro": "bairro",
  *                   "cidade": "cidade",
  *                   "created_at": "2020-09-09 12:38:16",
  *                   "updated_at": "2020-09-09 12:38:16"
  *                 }
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
  *         -name: codigo
  *         description: Código
  *         in: query
  *         required: true
  *         type: string
  *         -name: nome
  *         description: Nome
  *         in: query
  *         required: true
  *         type: string
  *         -name: cpf
  *         description: 11 dígitos do CPF
  *         in: query
  *         required: true
  *         type: string
  *         -name: email
  *         description: um email válido
  *         in: query
  *         required: true
  *         type: string
  *         -name: telefone
  *         description: DDD+dígitos do telefone
  *         in: query
  *         required: true
  *         type: string
  *         -name: cep
  *         description: dígitos do cep
  *         in: query
  *         required: true
  *         type: string
  *         -name: numero
  *         description: campo referente a endereço, número da casa, apto
  *         in: query
  *         required: true
  *         type: string
  *         -name: logradouro
  *         description: nome da rua, Av
  *         in: query
  *         required: true
  *         type: string
  *         -name: bairro
  *         description: Bairro
  *         in: query
  *         required: true
  *         type: string
  *         -name: cidade
  *         description: nome da cidade
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Aluno cadastrado
  *         example:
  *               {
  *                 "id": 2,
  *                 "codigo": "codigoAluno 2",
  *                 "nome": "Andre Pereira Silva",
  *                 "cpf": "00868110381",
  *                 "email": "meu_email2@gmail.com",
  *                 "telefone": "98988231995",
  *                 "endereco_id": 1,
  *                 "created_at": "2020-09-09 12:38:16",
  *                 "updated_at": "2020-09-09 12:38:16"
  *               }
  */
  async store ({ request, response }) {
    const input_aluno_fields = request.only(["codigo","nome","cpf","email","telefone",])
    const input_endereco_fields = request.only(["cep","numero","logradouro","bairro","cidade",])

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
  *                 "id": 2,
  *                 "codigo": "codigoAluno 2",
  *                 "nome": "Andre Pereira Silva",
  *                 "cpf": "00868110381",
  *                 "email": "meu_email2@gmail.com",
  *                 "telefone": "98988231995",
  *                 "endereco_id": 1,
  *                 "created_at": "2020-09-09 12:38:16",
  *                 "updated_at": "2020-09-09 12:38:16",
  *                 "endereco": {
  *                   "id": 1,
  *                   "cep": "65051190",
  *                   "numero": "19",
  *                   "logradouro": "logradouro",
  *                   "bairro": "bairro",
  *                   "cidade": "cidade",
  *                   "created_at": "2020-09-09 12:38:16",
  *                   "updated_at": "2020-09-09 12:38:16"
  *                 }
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
