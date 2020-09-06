'use strict'
const { test, trait } = use('Test/Suite')('Curso')
const Curso = use('App/Models/Curso')

const assert = require('assert')

trait('Test/ApiClient')

/*
lista cursos
apaga curso
edita curso
não é possível criar um curso faltando algum parâmetro
não aceita carga horaria não positiva
não aceita duplicatas
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

test('não é possível criar um curso faltando algum parâmetro', async ({ client }) => {
	const response1 = await client.post('/cursos').send({
	  	//nome: 'Curso 1',
	    carga_horaria: 200,
	    codigo: "120"
	}).end();

	assert.notStrictEqual(response1.status, 200);
	assert.notStrictEqual(response1.status, 201);

	const response2 = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    //carga_horaria: 200,
	    codigo: "120"
	}).end();

	assert.notStrictEqual(response2.status, 200);
	assert.notStrictEqual(response2.status, 201);

	const response3 = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    carga_horaria: 200
	    //codigo: "120"
	}).end();

	assert.notStrictEqual(response3.status, 200);
	assert.notStrictEqual(response3.status, 201);
})

test('não aceita carga horaria não positiva', async ({ client }) => {
	const responseValorNegativo = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    carga_horaria: -200,
	    codigo: "120"
	}).end();

	responseValorNegativo.assertStatus(403);

	const responseValorZero = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	    carga_horaria: 0,
	    codigo: "120"
	}).end();

	responseValorZero.assertStatus(403);

	const valid = await Curso.create({
	    nome: 'Curso 1',
	    codigo: "1",
	    carga_horaria: 200
	})	
	const responseEditaParaNegativo = await client.patch('/cursos').send({
	    carga_horaria: -200
	}).end();

	responseValorZero.assertStatus(403);
})

test('não aceita duplicatas', async ({ client }) => {
	const c = await Curso.create({
	    nome: 'Curso 1',
	    codigo: "1",
	    carga_horaria: 200
	})
	const responseCriaDuplicata = await client.post('/cursos').send({
	  	nome: 'Curso 1',
	  	codigo: "1"
	}).end();
	const responseEditaDuplicando = await client.patch('/cursos').send({
	  	nome: 'Curso 1',
	  	codigo: "1"
	}).end();

	responseCriaDuplicata.assertStatus(409);
	responseEditaDuplicando.assertStatus(409);
})