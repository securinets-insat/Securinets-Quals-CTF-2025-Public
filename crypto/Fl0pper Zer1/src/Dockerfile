FROM sagemath/sagemath:latest

RUN sage -pip install pycryptodome
RUN sage -pip install fastecdsa

# Install socat
RUN apt-get update && \
    apt-get install -y socat && \
    rm -rf /var/lib/apt/lists/*

# Unbuffered Python
ENV PYTHONUNBUFFERED=1 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

WORKDIR /app

COPY chall.sage .
COPY secret.sage .

EXPOSE 4871

#CMD ["sage", "chall.sage"]
CMD ["socat", "TCP-LISTEN:4871,fork,reuseaddr", "EXEC:'sage chall.sage',pty,stderr"]