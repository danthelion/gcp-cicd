const GitHub = require('github-api');

const IncomingWebhook = require('@slack/client').IncomingWebhook;
const SLACK_WEBHOOK_URL = "your_slack_webhook_url"

const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

// subscribe is the main function called by Cloud Functions.
module.exports.subscribe = (event, callback) => {
 const build = eventToBuild(event.data.data);

// Skip if the current status is not in the status list.
// Add additional statues to list if you'd like:
// QUEUED, WORKING, SUCCESS, FAILURE,
// INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    return callback();
  }

  // Auth to GitHub
  var gh = new GitHub({
    token: 'your_github_access_token'
  });
  var repo = gh.getRepo('your_github_user_name', 'your_github_repo_name')

  // Set status of the commit
  var img = build.images.join()
  var full_sha = img.substring(img.indexOf(":") + 1);
  if (build.status == 'SUCCESS') {
    repo.updateStatus(full_sha,
                      {state: 'success',
                      target_url: build.logUrl,
                      description: 'Magic CI/CD results',
                      context: 'gcp-ci/cd'});
  } else {
    repo.updateStatus(full_sha,
                      {state: 'failure',
                      target_url: build.logUrl,
                      description: 'Magic CI/CD results',
                      context: 'gcp-ci/cd'});
  }

  // Send message to Slack.
  const message = createSlackMessage(build);
  webhook.send(message, callback);
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(new Buffer(data, 'base64').toString());
}

// createSlackMessage create a message from a build object.
const createSlackMessage = (build) => {
  let message = {
   text: build.id,
    mrkdwn: true,
    attachments: [
      {
        title: 'Build logs',
        title_link: build.logUrl,
        fields: [{
          title: 'Status',
          value: build.status
        },{
          title: 'Images built',
          value: build.images.join()
        }]
      }
    ]
  };
  return message
}