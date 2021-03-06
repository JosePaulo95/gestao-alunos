'use strict'
const { test, trait } = use('Test/Suite')('Aluno')
const Aluno = use('App/Models/Aluno')
const Endereco = use('App/Models/Endereco')

trait('Test/ApiClient')

/*
lista alunos com os campos endereco e curso
seleciona um aluno com endereço
cria aluno com endereço
apaga aluno
edita aluno ou seu endereço
consegue cadastrar alunos com o mesmo nome, cep ou telefone
informa erro duplicata por codigo, cpf ou email
informa erro requiredFields incluindo campos de endereço
informa erro cpf InvalidLength
informa erro email InvalidEmailAddress
informa erro telefone InvalidMinLength
*/
const dados_endereco = {
	cep: "65051190",
	numero: "19",
	logradouro: "logradouro",
	bairro: "bairro",
	cidade: "cidade"
};

const dadosAluno1 = {
	codigo: "codigoAluno 1",
	nome: "José Paulo",
	cpf: "00868110380",
	email: "meu_email@gmail.com",
	telefone: "98988231995"
};
const dadosAluno2 = {
    codigo: "codigoAluno 2",
	nome: "Andre Pereira Silva",
	cpf: "00868110381",
	email: "meu_email2@gmail.com",
	telefone: "98988231995"
};
const dadosAluno1comEndereco = {
	...dadosAluno1,
	endereco: {...dados_endereco}
};
const dadosAluno2comEndereco = {
	...dadosAluno2,
	endereco: {...dados_endereco}
};
const aluno_dados_only = {
    codigo: "codigoAluno 3",
	nome: "Andre Pereira Silva",
	cpf: "00868110382",
	email: "meu_email3@gmail.com",
	telefone: "98988231995",
};

test('lista alunos com os campos endereco e curso', async ({ client }) => {
	const endereco1 = await Endereco.create(dados_endereco)
	await Aluno.create({endereco_id: endereco1.id, ...dadosAluno1})
	await Aluno.create({endereco_id: endereco1.id, ...dadosAluno2})

	const response = await client.get('/alunos').end()

	response.assertStatus(200)
	response.assertJSONSubset([dadosAluno1comEndereco, dadosAluno2comEndereco])
})
test('seleciona aluno com endereço', async ({ client, assert }) => {
	const endereco = await Endereco.create(dados_endereco)
	const aluno = await Aluno.create({endereco_id: endereco.id, ...dadosAluno1})

	const response = await client.get('/alunos/'+aluno.id).end()

	//response.assertStatus(200)
	response.assertJSONSubset({
		...dadosAluno1,
		endereco: {...dados_endereco}
	})
})
test('cria aluno com endereço', async ({ client, assert }) => {
	const response = await client.post('/alunos').send({...dadosAluno1, ...dados_endereco}).end();
	response.assertStatus(200)
	response.assertJSONSubset({...dadosAluno1})

	//preciso recuperar o endereço retornado e checar se é está correto, TODO deve haver um jeito de consultar direto pelo objeto response mas não encontrei como
	const aluno_criado = await Aluno.findBy("cpf", dadosAluno1.cpf)
	const endereco_criado = await Endereco.find(aluno_criado.endereco_id)
	assert.deepEqual(dados_endereco.cep, endereco_criado.cep)
})
test('apaga aluno', async ({ client, assert }) => {
	const endereco = await Endereco.create(dados_endereco)
	const aluno = await Aluno.create({endereco_id: endereco.id, ...dadosAluno1})

	const response_delete = await client.delete('/alunos/'+aluno.id).end()	
	response_delete.assertStatus(204)

	const response_encontrar_deletado = await client.get('/alunos/'+aluno.id).end()
	response_encontrar_deletado.assertStatus(404)

	//TODO dando erro ao usar Endereco.find pra verificar exclusão em cascata, pendente
})
test('edita aluno', async ({ client }) => {
	const endereco = await Endereco.create(dados_endereco)
	const aluno = await Aluno.create({endereco_id: endereco.id, ...dadosAluno1})

	const response_update = await client.patch('/alunos/'+aluno.id).send({
	    telefone: "2222222222",
	    bairro: "novo bairro"
	}).end();
	response_update.assertStatus(200)

	const response_check = await client.get('/alunos/'+aluno.id).end()
	response_check.assertStatus(200)
	response_check.assertJSONSubset({
		id: aluno.id,
		telefone: "2222222222",
		endereco: {
			bairro: "novo bairro"
		}
	})
})
/*
test('informa erro RequiredField', async ({ client, assert }) => {
	const responseSemNome = await client.post('/alunos').send({
	  	//nome: 'Curso 1',
	    carga_horaria: 3200,
	    codigo: "120"
	}).end();
	const responseSemCargaHr = await client.post('/alunos').send({
	  	nome: 'Curso 4',
	    //carga_horaria: 3200,
	    codigo: "120"
	}).end();
	const responseSemCodigo = await client.post('/alunos').send({
	  	nome: 'Curso 5',
	    carga_horaria: 3200
	    //codigo: "120"
	}).end();
	const responseNomeVazio = await client.post('/alunos').send({
	  	nome: '',
	    carga_horaria: 3200,
	    codigo: "120"
	}).end();
	const responseCodigoEspacosBrancos = await client.post('/alunos').send({
	  	nome: 'Curso 6',
	    carga_horaria: 3200,
	    codigo: "        "
	}).end();

	responseSemNome.assertStatus(403);
	responseSemCargaHr.assertStatus(403);
	responseSemCodigo.assertStatus(403);
	responseNomeVazio.assertStatus(403);
	responseCodigoEspacosBrancos.assertStatus(403);

	responseSemNome.assertError([{
		message: 'Nome para o curso não informado.',
		field: 'nome',
		validation: 'required'
	}])
	responseSemCargaHr.assertError([{
		message: 'Carga horária do curso não informada.',
		field: 'carga_horaria',
		validation: 'required'
	}])	
	responseSemCodigo.assertError([{
		message: 'Código para o curso não informado.',
		field: 'codigo',
		validation: 'required'
	}])
	responseNomeVazio.assertError([{
		message: 'Nome para o curso não informado.',
		field: 'nome',
		validation: 'required'
	}])
	responseCodigoEspacosBrancos.assertError([{
		message: 'Código para o curso não informado.',
		field: 'codigo',
		validation: 'required'
	}])
})
test('informa erro carga horária OutOfRange', async ({ client }) => {
	const curso_valido = await Aluno.create(aluno1)

	const responseValorNegativo = await client.post('/alunos').send({
	  	nome: 'Curso neg',
	    carga_horaria: -200,
	    codigo: "120"
	}).end();
	const responseValorFronteira = await client.post('/alunos').send({
	  	nome: 'Curso quase',
	    carga_horaria: 2399,
	    codigo: "120"
	}).end();
	const responseEditaParaZero = await client.patch('/alunos/'+curso_valido.id).send({
	    carga_horaria: 0
	}).end();

	responseValorNegativo.assertStatus(403);
	responseValorFronteira.assertStatus(403);
	responseEditaParaZero.assertStatus(403);	

	responseValorFronteira.assertError([{
	    message: 'Um curso deve conter uma carga horária mínima de 2.400 horas.',
	    field: 'carga_horaria',
	    validation: 'above'
	}])
})
test('informa erro duplicata', async ({ client }) => {
	const c1 = await Aluno.create(aluno1)
	const c2 = await Aluno.create(curso2)

	const responseCriarDuplicataNome = await client.post('/alunos').send({
	  	nome: 'Curso 1',
	  	codigo: "3",
	  	carga_horaria: 3200
	}).end();
	const responseCriarDuplicataCodigo = await client.post('/alunos').send({
	  	nome: 'Curso 99',
	  	codigo: "1",
	  	carga_horaria: 3200
	}).end();
	const responseEditaNomeDuplicando = await client.patch('/alunos/'+c1.id).send({
	  	nome: 'Curso 2'
	}).end();

	responseCriarDuplicataNome.assertStatus(409);
	responseCriarDuplicataCodigo.assertStatus(409);
	responseEditaNomeDuplicando.assertStatus(409);

	responseCriarDuplicataNome.assertError([{
	    message: 'Já existe um curso com este nome.',
	    field: 'nome',
	    validation: 'unique'
	}])
	responseCriarDuplicataCodigo.assertError([{
	    message: 'Já existe um curso com este código.',
	    field: 'codigo',
	    validation: 'unique'
	}])
	responseEditaNomeDuplicando.assertError([{
	    message: 'Já existe um curso com este nome.',
	    field: 'nome',
	    validation: 'unique'
	}])
})
test('informa erro Maxlength', async ({ client }) => {
	const responseNomeCodTamMaxFronteira = await client.post('/alunos').send({
	  	nome: 'b'.repeat(240),
	  	codigo: "2".repeat(30),
	  	carga_horaria: 3000
	}).end();
	const responseNomeMtLongo = await client.post('/alunos').send({
	  	nome: 'c'.repeat(241),
	  	codigo: "34",
	  	carga_horaria: 3000
	}).end();
	const responseCodMtLongo = await client.post('/alunos').send({
	  	nome: 'a',
	  	codigo: "3".repeat(31),
	  	carga_horaria: 3000
	}).end();

	responseNomeCodTamMaxFronteira.assertStatus(200);
	responseNomeMtLongo.assertStatus(403);
	responseCodMtLongo.assertStatus(403);

	responseNomeMtLongo.assertError([{
	    message: 'O nome informado é longo demais (max: 240 caracteres).',
	    field: 'nome',
	    validation: 'max'
	}])
	responseCodMtLongo.assertError([{
	    message: 'O código informado é longo demais (max: 30 caracteres).',
	    field: 'codigo',
	    validation: 'max'
	}])
})
*/