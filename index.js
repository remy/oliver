const diff = require('date-fns/difference_in_calendar_days');

module.exports = robot => {
  const app = robot.route('/');

  // Use any middleware
  app.use(require('express').static('docs'));

  robot.on('issues.closed', async context => {
    if (context.isBot) {
      return;
    }
    let config = await context.config('oliver.yml');

    if (!config) {
      robot.log('skipping - no config found');
      return;
    }

    config = { ...require('./defaults'), ...config };

    // Some payloads don't include labels
    // sometimes labels are missing https://git.io/vNGnz
    let issue = context.payload.issue;
    if (!issue.labels) {
      robot.log('getting issue');
      issue = (await context.github.issues.get(context.issue())).data;
    }

    let exemptLabels = config.exemptLabels || false;
    if (typeof exemptLabels === 'string') exemptLabels = [exemptLabels];

    if (exemptLabels) {
      // 2. does the issue have the labels we're looking for?
      const exempt = issue.labels.some(label =>
        exemptLabels.includes(label.name)
      );

      if (exempt) return;
    }

    let labels = config.labels || false;
    if (typeof labels === 'string') labels = [labels];

    const reply =
      labels === false ||
      issue.labels.some(label => labels.includes(label.name));

    if (!reply) {
      robot.log('no relevant label found');
      return;
    }

    const delta = diff(issue.closed_at, issue.created_at);

    if (delta > config.daysClosedIn) {
      if (config.daysClosedIn !== false) {
        robot.log(`too long (${config.daysClosedIn} > ${delta}), not replying`);
        return;
      }
    }

    const params = context.issue({ body: config.comment });
    robot.log(`✔️ ${params.owner}/${params.repo}`);

    // 3. how long until it was closed, is that inside the time frame?
    context.github.issues.createComment(params);
  });
};
