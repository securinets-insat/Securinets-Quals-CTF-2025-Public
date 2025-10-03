FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    python3 \
    socat

RUN useradd ctf
USER ctf

WORKDIR /home/ctf

COPY --chown=ctf:ctf . /home/ctf
RUN chmod +x ./entrypoint.sh

EXPOSE 1337

CMD ["/home/ctf/entrypoint.sh"]