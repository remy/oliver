# Probot: Oliver

> A GitHub App built with [Probot](https://github.com/probot/probot) that replies to closed bugs with "Please…can I have more…?" - ala Oliver Twist

[![](https://oliver.isthe.link/example.png)](https://github.com/remy/github-integration-testing/issues/7)

## Usage

1. **[Configure the GitHub App](https://github.com/apps/oliverbot)**
2. Create `.github/oliver.yml` based on the following template
3. It will start replying to newly closed bugs.

A `.github/oliver.yml` file is required to enable the plugin. The file can be empty, or it can override any of these default settings:

```yml
# Configuration for oliver - https://github.com/remy/oliver

# Number of calender days the issue was closed in before the bot should reply.
# If the issue was closed in more days than this, the bot won't reply.
# Use `daysClosedIn: false` to *always* reply.
daysClosedIn: 5

# Labels to look for on issues the bot can reply to
labels:
  - bug

# Comment to post when replying
comment: >
  Thanks for raising this issue. If you're happy with how it was handled,
  maybe you could star this repo by way of thanks 👍
```

## Deployment

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this plugin.
