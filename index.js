module.exports = robot => {
    robot.on('pull_request.closed', async context => {
        if (context.payload.pull_request.merged) {
            const creator = context.payload.pull_request.user.login;
            const {owner, repo} = context.repo();
            const res = await context.github.search.issues({q: `is:pr is:merged author:${creator} repo:${owner}/${repo}`});

            const mergedPRs = res.data.items.filter(pr => pr.number != context.payload.pull_request.number);

            if (mergedPRs.length === 0) {
                try {
                    const config = await context.config('config.yml');
                    context.github.issues.createComment(context.issue({body: config.firstPRMergeComment}));
                } catch (err) {
                    if (err.code !== 404) {
                        throw err;
                    }
                }
            }
        }
    });
};
