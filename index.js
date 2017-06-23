module.exports = robot => {
  robot.on('pull_request.closed', async context => {
      if (!context.payload.repository.owner || !context.payload.pull_request.user.id || !context.payload.repository.name) {
          issue = (await context.github.pull_request.get(context.issue())).data;
      }
     // robot.log(context.payload.pull_request.merged);
      const user_login = context.payload.pull_request.user.login;
      const repo_owner_id = context.payload.repository.owner.login;
      const repo_name = context.payload.repository.name;

      const options = context.repo({path: '.github/first-pr-merge.md'});
      const res = await context.github.repos.getContent(options);
      const template = new Buffer(res.data.content, 'base64').toString();

      const github = await robot.auth(context.payload.installation.id);
      const response = await github.issues.getForRepo(context.repo({
          owner: repo_owner_id,
          repo: repo_name,
          state: "all",
          creator: user_login
      }));

      var count_pr = 0
      //check for issues that are also PRs
      for (i = 0; i < response.data.length; i++) {
          if ((response.data[i]).pull_request) {
              count_pr += 1;
          }
          //exit loop if more than one PR
          if (count_pr > 1) {
              break;
          }
      }
      robot.log(count_pr, context.payload.pull_request.merged, template);
      //check length of response to make sure its only one pr
      if (count_pr === 1 && context.payload.pull_request.merged) {
        context.github.issues.createComment(context.issue({body: template}));
      }
  });
};
