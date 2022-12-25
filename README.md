# GitHub action to setup `docker-compose` command

<a href="https://github.com/KengoTODA/actions-setup-docker-compose/actions"><img alt="actions-setup-docker-compose status" src="https://github.com/KengoTODA/actions-setup-docker-compose/workflows/build-test/badge.svg"></a>

This action downloads the `docker-compose` command and add it to the `PATH` for following executions. It supports the Linux environment only.

## How to use

Add a step to your workflow like below:

```yml
  steps:
  - uses: KengoTODA/actions-setup-docker-compose@main
    with:
      version: '2.14.2' # the full version of `docker-compose` command
```

Or you can omit it then set a `GITHUB_TOKEN` environment variable, to use the latest released version:

```yml
  steps:
  - uses: KengoTODA/actions-setup-docker-compose@main
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The 'latest release' here means [the most recent non-prerelease, non-draft release, sorted by the created_at attribute](https://octokit.github.io/rest.js/v19#repos-get-latest-release).

Note that the `GITHUB_TOKEN` should have [`contents: read` permission](https://docs.github.com/en/rest/overview/permissions-required-for-github-apps?apiVersion=2022-11-28#contents) to fetch data from the GitHub.com.
