'use strict'

const { test } = use('Test/Suite')('Example')

test('make sure 2 + 2 is 4', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})

test('make sure 3 + 2 is 5', async ({ assert }) => {
  assert.equal(3 + 2, 4)
})