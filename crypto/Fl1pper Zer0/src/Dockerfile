FROM python:3.11-slim

RUN pip install pycryptodome
RUN pip install fastecdsa

WORKDIR /app

COPY chall.py .
COPY secret.py .

EXPOSE 4869

CMD ["python3", "chall.py"]
# CMD ["socat", "TCP-LISTEN:4871,fork,reuseaddr", "EXEC:'python3 chall.py',pty,stderr"]