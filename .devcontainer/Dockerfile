FROM python:3.14.2

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

WORKDIR /tmp

COPY requirements.txt .

RUN pip install -r requirements.txt && \
    rm requirements.txt

RUN apt-get update && \
    apt-get install -y git vim

WORKDIR /workspace

USER $USERNAME

CMD ["/bin/bash"]
