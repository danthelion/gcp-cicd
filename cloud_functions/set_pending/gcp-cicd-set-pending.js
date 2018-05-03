const GitHub = require('github-api');

exports.SetPending = (request, response) => {
  // Auth to GitHub
  var gh = new GitHub({
    token: 'your_github_access_token'
  });
  var repo = gh.getRepo('your_github_user_name', 'your_github_repo_name')
  // Set status of the commit
  repo.updateStatus(request.body.commit_sha,
                    {state: 'pending',
                     target_url: request.body.commit_sha.logUrl,
                     description: 'Magic CI/CD results',
                     context: 'gcp-ci/cd'});
  return response.send("")
};
