FROM python:3.14.2

WORKDIR /tmp

COPY requirements.txt .

RUN pip install -r requirements.txt && \
    rm requirements.txt

RUN apt-get update && \
    apt-get install -y git vim

WORKDIR /workspace

CMD ["/bin/bash"]
