'use strict'
const { test, trait } = use('Test/Suite')('Curso')
const Curso = use('App/Models/Curso')

trait('Test/ApiClient')

/*
lista cursos
apaga curso
edita curso
informa erro RequiredField
informa erro carga horária OutOfRange
informa erro duplicata
informa erro Maxlength
*/

const curso1 = {
    nome: 'Curso 1',
    codigo: "1",
    carga_horaria: 2400
};
const curso2 = {
    nome: 'Curso 2',
    codigo: "2",
    carga_horaria: 2400
};
test('lista cursos', async ({ client }) => {
	await Curso.create(curso1)
	await Curso.create(curso2)

	const response = await client.get('/cursos').end()

	response.assertStatus(200)
	response.assertJSONSubset([curso1, curso2])
})

test('apaga curso', async ({ client }) => {
	let c1 = await Curso.create(curso1)
	let c2 = await Curso.create(curso2)

	const response1 = await client.delete('/cursos/'+c1.id).end()	
	response1.assertStatus(204)

	const response2 = await client.get('/cursos/'+c1.id).end()
	response2.assertStatus(404)

	//não apaga o outro curso
	const response3 = await client.get('/cursos').end()
	response3.assertStatus(200)
	response3.assertJSONSubset([curso2])
})

test('edita curso', async ({ client }) => {
	let c = await Curso.create(curso1)

	const response1 = await client.patch('/cursos/'+c.id).send({
	    carga_horaria: 3300
	}).end();

	const response2 = await client.get('/cursos/'+c.id).end()
	response2.assertStatus(200)
	response2.assertJSONSubset({
		nome: 'Curso 1',
		codigo: "1",
		carga_horaria: 3300
	})
})

test('informa erro RequiredField', async ({ client, assert }) => {
	const responseSemNome = await client.post('/cursos').send({
	  	//nome: 'Curso 1',
	    carga_horaria: 3200,
	    codigo: "120"
	}).end();
	const responseSemCargaHr = await client.post('/cursos').send({
	  	nome: 'Curso 4',
	    //carga_horaria: 3200,
	    codigo: "120"
	}).end();
	const responseSemCodigo = await client.post('/cursos').send({
	  	nome: 'Curso 5',
	    carga_horaria: 3200
	    //codigo: "120"
	}).end();
	const responseNomeVazio = await client.post('/cursos').send({
	  	nome: '',
	    carga_horaria: 3200,
	    codigo: "120"
	}).end();
	const responseCodigoEspacosBrancos = await client.post('/cursos').send({
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
	const curso_valido = await Curso.create(curso1)

	const responseValorNegativo = await client.post('/cursos').send({
	  	nome: 'Curso neg',
	    carga_horaria: -200,
	    codigo: "120"
	}).end();
	const responseValorFronteira = await client.post('/cursos').send({
	  	nome: 'Curso quase',
	    carga_horaria: 2399,
	    codigo: "120"
	}).end();
	const responseEditaParaZero = await client.patch('/cursos/'+curso_valido.id).send({
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
	const c1 = await Curso.create(curso1)
	const c2 = await Curso.create(curso2)

	const responseCriarDuplicataNome = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	  	codigo: "3",
	  	carga_horaria: 3200
	}).end();
	const responseCriarDuplicataCodigo = await client.post('/cursos').send({
	  	nome: 'Curso 99',
	  	codigo: "1",
	  	carga_horaria: 3200
	}).end();
	const responseEditaNomeDuplicando = await client.patch('/cursos/'+c1.id).send({
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
	const responseNomeCodTamMaxFronteira = await client.post('/cursos').send({
	  	nome: 'b'.repeat(240),
	  	codigo: "2".repeat(30),
	  	carga_horaria: 3000
	}).end();
	const responseNomeMtLongo = await client.post('/cursos').send({
	  	nome: 'c'.repeat(241),
	  	codigo: "34",
	  	carga_horaria: 3000
	}).end();
	const responseCodMtLongo = await client.post('/cursos').send({
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