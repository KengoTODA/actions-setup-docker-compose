# GitHub action to setup `docker-compose` command

<a href="https://github.com/KengoTODA/actions-setup-docker-compose/actions"><img alt="actions-setup-docker-compose status" src="https://github.com/KengoTODA/actions-setup-docker-compose/workflows/build-test/badge.svg"></a>

This action downloads the `docker-compose` command and add it to the `PATH` for following executions. It supports the Linux environment only.

## How to use

Add a step to your workflow like below:

```yml
  steps:
  - uses: KengoTODA/actions-setup-docker-compose@main
    with:
      version: '1.29.2'
```

Specify the full version of `docker-compose` command to the `version` parameter.
Or you can omit it then set a `GITHUB_TOKEN` environment variable, to use the latest released version:

```yml
  steps:
  - uses: KengoTODA/actions-setup-docker-compose@main
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
