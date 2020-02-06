# HousingDB Documentation

We have a built in interface to explore and make requests against the api using a browser. The `/documentation` uri has a swagger interface for our api.

## Authorized Requests (Logged in API calls)

Normally a user would login via the front end which would redirect them to our auth server, which would send them back to the front end with a code which would get exchanged with the auth server for an access token which would seamlessly be passed along with requests to the api.

We have created some helper routes on the api to do this process without the front end. If you want to use authorized requests you can do this using the swagger interface.

1. Go to /documentation and scroll to the 'Auth' section
2. Expand `/auth/login` and follow the implementation notes. (Open the response text url in a new tab and log in).
3. After you login you will be redirected to a page with an access token. Paste the access token on screen in the `api_key` box on the `/documentation` page.

## CI/CD with GitLab

Import the repository from GitHub into GitLab

### Set up GitLab's Github Integration

This integration makes it so Github can see Gitlab's status checks

Go to gitlab > [repo] > settings > integrations > github

Create a personal access token from github, or copy it from another gitlab repo
that is already configured with a github integration.

### Set up GitLab's repository mirroring

This mirroring makes sure Gitlab gets updates that are made on Github

Go to gitlab > [repo] > Settings > Repository > Mirroring repositories

set the direction to 'Pull'

enter the *git* url of the repo you want to pull, ex: https://github.com/GazeDev/groups_api.git

select the user you want to pull as, and enter the remote system password for that user (in this case, github password).

Check 'Trigger pipelines for mirror updates' so that CI is run.

At the very least some environment variables will probably need to be added.

Go to gitlab > [repo] > Settings > CI/CD > Variables

Separate testing api keys and accounts should be set up for testing, and api keys
and account passwords should be set to 'Masked' in the gitlab variables UI
