FROM python:3.11-slim

RUN pip install pycryptodome
RUN pip install fastecdsa

# Install socat
RUN apt-get update && \
    apt-get install -y socat && \
    rm -rf /var/lib/apt/lists/*

# Unbuffered Python
ENV PYTHONUNBUFFERED=1 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

WORKDIR /app

COPY chall.py .
COPY secret.py .

EXPOSE 4869

#CMD ["python3", "chall.py"]
CMD ["socat", "TCP-LISTEN:4869,fork,reuseaddr", "EXEC:'python3 chall.py',pty,stderr"]
