const expect = require('expect')
const { Application } = require('probot')
const { GitHubAPI } = require('probot/lib/github')
const successPayload = require('./events/successPayload')
const failPayload = require('./events/failPayload')
const plugin = require('..')

describe('first-pr-merge', () => {
  let app
  let github

  beforeEach(() => {
    app = new Application()
    plugin(app)

    github = new GitHubAPI()
    app.auth = () => Promise.resolve(github)
  })

  function makeResponse (msg) {
    return Promise.resolve({ data: { content: Buffer.from(msg).toString('base64') } })
  }

  describe('first-pr-merge success', () => {
    it('posts a comment because it is a user\'s first pr merged', async () => {
      expect.spyOn(github.repos, 'getContents').andReturn(makeResponse(`firstPRMergeComment: >\n  Hello World!`))
      expect.spyOn(github.search, 'issues').andReturn(Promise.resolve({ data: { items: [] } }))
      expect.spyOn(github.issues, 'createComment')

      await app.receive(successPayload)

      expect(github.search.issues).toHaveBeenCalledWith({
        q: `is:pr is:merged author:hiimbex-test repo:hiimbex/testing-things`
      })

      expect(github.repos.getContents).toHaveBeenCalledWith({
        owner: 'hiimbex',
        repo: 'testing-things',
        path: '.github/config.yml'
      })

      expect(github.issues.createComment).toHaveBeenCalled()
    })
  })

  describe('first-pr-merge failure', () => {
    it('posts a comment because it is a user\'s first pr merged', async () => {
      expect.spyOn(github.repos, 'getContents').andReturn(makeResponse(`firstPRMergeComment: >\n  Hello World!`))
      expect.spyOn(github.search, 'issues').andReturn(Promise.resolve({ data: { items: ['hi', 'also hi'] } }))
      expect.spyOn(github.issues, 'createComment')

      await app.receive(failPayload)

      expect(github.search.issues).toHaveBeenCalledWith({
        q: `is:pr is:merged author:hiimbex repo:hiimbex/testing-things`
      })

      expect(github.repos.getContents).toNotHaveBeenCalled()
      expect(github.issues.createComment).toNotHaveBeenCalled()
    })
  })
})
