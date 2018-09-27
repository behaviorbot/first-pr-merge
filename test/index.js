const expect = require('expect')
const { createRobot } = require('probot')
const plugin = require('..')
const successPayload = require('./events/successPayload')
const failPayload = require('./events/failPayload')

describe('first-pr-merge', () => {
  let robot
  let github

  beforeEach(() => {
    robot = createRobot()
    plugin(robot)

    github = {
      repos: {
        getContent: expect.createSpy().andReturn(Promise.resolve({
          data: {
            content: Buffer.from(`firstPRMergeComment: >\n  Hello World!`).toString('base64')
          }
        }))
      },
      issues: {
        createComment: expect.createSpy()
      },
      search: {
        issues: expect.createSpy().andReturn(Promise.resolve({
          data: {
            items: []
          }
        }))
      }
    }

    robot.auth = () => Promise.resolve(github)
  })

  describe('first-pr-merge success', () => {
    it('posts a comment because it is a user\'s first pr merged', async () => {
      await robot.receive(successPayload)

      expect(github.search.issues).toHaveBeenCalledWith({
        q: `is:pr is:merged author:hiimbex-test repo:hiimbex/testing-things`
      })

      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'hiimbex',
        repo: 'testing-things',
        path: '.github/config.yml'
      })

      expect(github.issues.createComment).toHaveBeenCalled()
    })
  })

  describe('first-pr-merge failure', () => {
    beforeEach(() => {
      github.search.issues.andReturn(Promise.resolve({
        data: {
          items: ['hi', 'also hi']
        }
      }))
    })

    it('posts a comment because it is a user\'s first pr merged', async () => {
      await robot.receive(failPayload)

      expect(github.search.issues).toHaveBeenCalledWith({
        q: `is:pr is:merged author:hiimbex repo:hiimbex/testing-things`
      })

      expect(github.repos.getContent).toNotHaveBeenCalled()
      expect(github.issues.createComment).toNotHaveBeenCalled()
    })
  })
})
