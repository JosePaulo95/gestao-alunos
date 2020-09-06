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


test('lista cursos', async ({ client }) => {
	await Curso.create({
	    nome: 'Curso 1',
	    codigo: "1",
	    carga_horaria: 200
	})
	await Curso.create({
	    nome: 'Curso 2',
	    codigo: "2",
	    carga_horaria: 200
  	})
	const response = await client.get('/cursos').end()

	response.assertStatus(200)
	response.assertJSONSubset([{
		nome: 'Curso 1',
		codigo: "1",
		carga_horaria: 200
	},{
	    nome: 'Curso 2',
	    codigo: "2",
	    carga_horaria: 200
	}])
})

test('apaga curso', async ({ client }) => {
	await Curso.create({
	    nome: 'Curso 1',
	    codigo: "1",
	    carga_horaria: 200
	})
	let c = await Curso.create({
	    nome: 'Curso 2',
	    codigo: "2",
	    carga_horaria: 200
  	})

	const response1 = await client.delete('/cursos/'+c.id).end()	
	response1.assertStatus(200)

	const response2 = await client.get('/cursos/'+c.id).end()
	response2.assertStatus(404)

	//não apaga o outro curso
	const response3 = await client.get('/cursos').end()
	response3.assertStatus(200)
	response3.assertJSONSubset([{
		nome: 'Curso 1',
		codigo: "1",
		carga_horaria: 200
	}])
})

test('edita curso', async ({ client }) => {
	let c = await Curso.create({
	    nome: 'Curso 1',
	    codigo: "1",
	    carga_horaria: 200
	})

	const response1 = await client.patch('/cursos/'+c.id).send({
	    carga_horaria: 300
	}).end();

	const response2 = await client.get('/cursos/'+c.id).end()
	response2.assertStatus(200)
	response2.assertJSONSubset({
		nome: 'Curso 1',
		codigo: "1",
		carga_horaria: 300
	})
})

test('informa erro RequiredField', async ({ client, assert }) => {
	const responseSemNome = await client.post('/cursos').send({
	  	//nome: 'Curso 1',
	    carga_horaria: 200,
	    codigo: "120"
	}).end();
	const responseSemCargaHr = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    //carga_horaria: 200,
	    codigo: "120"
	}).end();
	const responseSemCodigo = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    carga_horaria: 200
	    //codigo: "120"
	}).end();

	responseSemNome.assertStatus(403);
	responseSemCargaHr.assertStatus(403);
	responseSemCodigo.assertStatus(403);

	responseSemNome.assertError([{
		message: 'Nome para o curso não informado.',
		field: 'nome',
		validation: 'RequiredField'
	}])
	responseSemCargaHr.assertError([{
		message: 'Carga horária do curso não informada.',
		field: 'carga_horaria',
		validation: 'RequiredField'
	}
	)	
	responseSemCodigo.assertError([{
		message: 'Código para o curso não informado.',
		field: 'codigo',
		validation: 'RequiredField'
	}
	)	
})

test('informa erro carga horária OutOfRange', async ({ client }) => {
	const responseValorNegativo = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    carga_horaria: -200,
	    codigo: "120"
	}).end();
	const responseValorZero = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    carga_horaria: 0,
	    codigo: "120"
	}).end();

	const curso_valido = await Curso.create({nome: 'Curso 1', codigo: "1", carga_horaria: 200})
	const responseEditaParaNegativo = await client.patch('/cursos/'+curso_valido.id).send({
	    carga_horaria: -200
	}).end();

	responseValorNegativo.assertStatus(403);
	responseValorZero.assertStatus(403);
	responseEditaParaNegativo.assertStatus(403);	

	responseValorNegativo.assertError([{
	    message: 'Um curso não pode conter uma carga horária negativa.',
	    field: 'carga_horaria',
	    validation: 'OutOfRange'
	}])
	responseValorZero.assertError([{
	    message: 'Um curso não pode conter 0 horas.',
	    field: 'carga_horaria',
	    validation: 'OutOfRange'
	}])
	responseEditaParaNegativo.assertError([{
	    message: 'Um curso não pode conter uma carga horária negativa.',
	    field: 'carga_horaria',
	    validation: 'OutOfRange'
	}])
})

test('informa erro duplicata', async ({ client }) => {
	const c1 = await Curso.create({nome: 'Curso 1',codigo: "1",carga_horaria: 200})
	const c2 = await Curso.create({nome: 'Curso 2',codigo: "2",carga_horaria: 200})

	const responseCriarDuplicataNome = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	  	codigo: "3",
	  	carga_horaria: 200
	}).end();
	const responseCriarDuplicataCodigo = await client.post('/cursos').send({
	  	nome: 'Curso 3',
	  	codigo: "1",
	  	carga_horaria: 200
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
	    validation: 'AlreadyExists'
	}])
	responseCriarDuplicataCodigo.assertError([{
	    message: 'O nome informado é longo demais.',
	    field: 'codigo',
	    validation: 'AlreadyExists'
	}])
	responseEditaNomeDuplicando.assertError([{
	    message: 'Já existe um curso com este nome.',
	    field: 'nome',
	    validation: 'AlreadyExists'
	}])
})
test('informa erro Maxlength', async ({ client }) => {
	const responseNomeCodTamMax = await client.post('/cursos').send({
	  	nome: 'a'.repeat(240),
	  	codigo: "1".repeat(30),
	  	carga_horaria: 200
	}).end();
	const responseNomeMtLongo = await client.post('/cursos').send({
	  	nome: 'a'.repeat(241),
	  	codigo: "1",
	  	carga_horaria: 200
	}).end();
	const responseCodMtLongo = await client.post('/cursos').send({
	  	nome: 'a',
	  	codigo: "1".repeat(31),
	  	carga_horaria: 200
	}).end();

	responseNomeCodTamMax.assertStatus(200);
	responseNomeMtLongo.assertStatus(403);
	responseCodMtLongo.assertStatus(403);

	responseNomeMtLongo.assertError([{
	    message: 'O nome informado é longo demais.',
	    field: 'nome',
	    validation: 'InvalidMaxLength'
	}])
	responseCodMtLongo.assertError([{
	    message: 'O código informado é longo demais.',
	    field: 'codigo',
	    validation: 'InvalidMaxLength'
	}])
})