FROM python:3.11-slim

WORKDIR /app

# Copy your Python script
COPY src/jail.py /app/challenge.py

# Install socat
RUN apt-get update && \
    apt-get install -y socat && \
    rm -rf /var/lib/apt/lists/*

# Unbuffered Python
ENV PYTHONUNBUFFERED=1 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

EXPOSE 1337

# Use correct python path
CMD ["socat", "TCP-LISTEN:1337,reuseaddr,fork", "EXEC:/usr/local/bin/python3 /app/challenge.py,pty,setsid,ctty,stderr"]
