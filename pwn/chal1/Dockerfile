
from ubuntu@sha256:1041699615b625b6bb6fbcdb7876bb1379f52b954374ab457360d9444a05cd7d AS app

FROM pwn.red/jail

COPY --from=app / /srv

COPY main /srv/app/run
COPY flag.txt libc.so.6* ld-linux-x86-64.so.2* /srv/app/

RUN chmod +x /srv/app/run

