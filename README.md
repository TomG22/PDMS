# PDMS

## Getting Started

This repository comes with a configuration for a "dev container" (https://containers.dev/). The idea behind dev containers is to make sure everyone works with the exact same environment and you don't have to spend a bunch of time setting up a development environment. By leveraging containerization, we can all work in sync and ensure that no outside projects pollute our development environments for this project.

To best work with this repository, you will need:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [VS Code](https://code.visualstudio.com/) (optional)

### VS Code Setup

Open VS Code and install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. Then, hit F1 -> "Reopen in Container".

That's it! VS Code will spin for a while downloading the container image and installing the requirements. When it's done, you should have a fully-functional development environment. It'll even install certain extensions for you (you can check the list under `.devcontainer/devcontainer.json`).

### Raw Text Editor Setup

If you don't want to use VS Code, you can still use dev containers! Install the [containerization engine of your choice](https://code.visualstudio.com/remote/advancedcontainers/docker-options) into your environment, then run the following:

```bash
# Example commands given for Docker.
# You can also use Podman, but beware of file permission issues.
docker build -f .devcontainer/Dockerfile -t dev-container .
docker run -it --rm -v $(pwd):/workspace dev-container
```

This should give you a command-line environment with the necessary packages installed. Keep in mind that you'll need to either mount in a method of authenticating with GitHub (i.e. an SSH key) to commit inside the container, or you'll need to exit the container to perform Git actions.

## Running the Application

Run the following to spin up a development server of the application:

```bash
cd src
python manage.py runserver
```

In a web browser, navigate to http://localhost:8080. You should see a rocket ship if you are successful.
