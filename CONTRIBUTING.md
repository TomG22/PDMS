# Contributing to This Repository

## Confirm Git Access
See [Sharing Git credentials with your container](https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials#_using-ssh-keys). To confirm that you have GitHub access, run the following from inside your container:

```bash
ssh -T git@github.com
```

You should see something like the following if you are successful:

> Hi dentonmwood! You've successfully authenticated, but GitHub does not provide shell access.

## Getting Started - VSC Setup
This project has been configured to run the docker compose file automatically when ran in VSC

## Getting Started - CLI Setup
1. Install Docker
2. Launch the docker compose file
```bash
docker compose up -d --build
```

## Regular Development
This project's Docker configuration allows for hot reloading, which means that changes to the backend or frontend should update automatically.

If for some reason there's any issue with hot reloading, you can always manually rebuild the containers.
Either restart the run configuration in VSC
Or rebuild with docker compose in the command line:
```bash
docker compose up -d --build
```
