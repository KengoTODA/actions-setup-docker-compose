# GitHub action to setup `docker-compose` command

<a href="https://github.com/KengoTODA/actions-setup-docker-compose/actions"><img alt="actions-setup-docker-compose status" src="https://github.com/KengoTODA/actions-setup-docker-compose/workflows/build-test/badge.svg"></a>
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)

This action downloads the `docker-compose` command and add it to the `PATH` for following executions. It supports the Linux environment only.

> [!IMPORTANT]
> The `docker-compose` command is now deprecated, consider to use the `docker compose` sub command instead. Refer to [Docker official blog](https://www.docker.com/blog/announcing-compose-v2-general-availability/) for detail.

## How to use

Add a step to your workflow like below:

```yml
  steps:
  - uses: KengoTODA/actions-setup-docker-compose@v1
    with:
      version: '2.14.2' # the full version of `docker-compose` command
```

Or set a `GITHUB_TOKEN` environment variable, to use the latest released version:

```yml
  steps:
  - uses: KengoTODA/actions-setup-docker-compose@main
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The 'latest release' here means [the most recent non-prerelease, non-draft release, sorted by the created_at attribute](https://docs.github.com/en/rest/releases/releases#get-the-latest-release).

Note that the `GITHUB_TOKEN` should have [`contents: read` permission](https://docs.github.com/en/rest/overview/permissions-required-for-github-apps?apiVersion=2022-11-28#contents) to fetch data from the GitHub.com.
