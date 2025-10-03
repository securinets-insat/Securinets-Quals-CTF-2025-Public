#include <stdio.h>
#include <stdlib.h>
#include <sys/syscall.h>     
#include <unistd.h>
#include <sys/mman.h>
#include <string.h>
#include <asm/prctl.h>
#include <sys/prctl.h>
#include <linux/seccomp.h>
#include <linux/audit.h>
#include <linux/filter.h>
#include <stddef.h>
#include <fcntl.h>
int arch_prctl(int code, unsigned long addr);


void setup(){
    setbuf(stdin,0);
    setbuf(stdout,0);

}

char *flag;
int main(){

    setup();
    
    char * code=mmap(0,0x1000,7,MAP_ANONYMOUS|MAP_PRIVATE,-1,0);
    
    puts("press exit to get the flag"); 
    int len=read(0,(char*)code,0x100);

    if (len<=0){
        perror("read() error");
        exit(0);
    }

    //mprotect(code,0x1000,PROT_READ|PROT_EXEC);


    ((void (*)(int)) code) (0);

    return 0;
}
