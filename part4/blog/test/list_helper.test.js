import { test, describe } from 'node:test'
import assert from 'node:assert'
import listHelper from '../utils/list_helper.js'

describe('total likes', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Go To Statement Considered Harmful 2',
      author: 'Edsger W. Dijkstra 2',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf2',
      likes: 4,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f10',
      title: 'Go To Statement Considered Harmful 3',
      author: 'Edsger W. Dijkstra 3',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf3',
      likes: 3,
      __v: 0
    }
  ]

  test('when list has multiple blogs', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 12)
  })
})