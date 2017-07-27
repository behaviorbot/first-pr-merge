const expect = require('expect');
const {createRobot} = require('probot');
const plugin = require('..');
const successPayload = require('./events/successPayload');
const successIssueRes = require('./events/successIssueRes');
const failPayload = require('./events/failPayload');
const failIssueRes = require('./events/failIssueRes');

describe('first-pr-merge', () => {
    let robot;
    let github;

    beforeEach(() => {
        robot = createRobot();
        plugin(robot);

        github = {
            repos: {
                getContent: expect.createSpy().andReturn(Promise.resolve({
                    data: {
                        content: Buffer.from(`firstPRMergeComment: >\n  Hello World!`).toString('base64')
                    }
                }))
            },
            issues: {
                getForRepo: expect.createSpy().andReturn(Promise.resolve(
                    successIssueRes
                )),
                createComment: expect.createSpy()
            }
        };

        robot.auth = () => Promise.resolve(github);
    });

    describe('first-pr-merge success', () => {
        it('posts a comment because it is a user\'s first pr merged', async () => {
            await robot.receive(successPayload);

            expect(github.issues.getForRepo).toHaveBeenCalledWith({
                owner: 'hiimbex',
                repo: 'testing-things',
                state: 'all',
                creator: 'hiimbex-test'
            });

            expect(github.repos.getContent).toHaveBeenCalledWith({
                owner: 'hiimbex',
                repo: 'testing-things',
                path: '.github/config.yml'
            });

            expect(github.issues.createComment).toHaveBeenCalled();
        });
    });

    describe('first-pr-merge failure', () => {
        beforeEach(() => {
            github.issues.getForRepo = expect.createSpy().andReturn(Promise.resolve(failIssueRes));
        });

        it('posts a comment because it is a user\'s first pr merged', async () => {
            await robot.receive(failPayload);

            expect(github.issues.getForRepo).toHaveBeenCalledWith({
                owner: 'hiimbex',
                repo: 'testing-things',
                state: 'all',
                creator: 'hiimbex'
            });

            expect(github.repos.getContent).toNotHaveBeenCalled();
            expect(github.issues.createComment).toNotHaveBeenCalled();
        });
    });
});
