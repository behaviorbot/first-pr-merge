# first-pr-merge

> a GitHub App built with [probot](https://github.com/probot/probot) that welcomes new users when their first pull request is merged in. You can use this message to congratulate users or thank them for their contirbutions. It should be located in a `.github/config/yml`

<img width="807" alt="screen shot 2017-07-17 at 1 58 37 pm" src="https://user-images.githubusercontent.com/13410355/28289605-1ab81a76-6af8-11e7-8f78-6a1b3948df36.png">

## Usage

1. Install the bot on the intended repositories. The plugin requires the following **Permissions and Events**:
- Pull requests: **Read & Write**
  - [x] check the box for **Pull Request** events
2. Add a `.github/config.yml` file that contains the contents you would like to reply within a `firstPRMergeComment`
```yml
# Configuration for first-pr-merge - https://github.com/behaviorbot/first-pr-merge

# Comment to be posted to on Pr's merged by a first time user
firstPRMergeComment: >
  Congrats on merging your first pull request! We here at behaviorbot are proud of you!
```

## Setup

```
# Install dependencies
npm install

# Run the bot
npm start
```

See [the probot deployment docs](https://github.com/probot/probot/blob/master/docs/deployment.md) if you would like to run your own instance of this plugin.
