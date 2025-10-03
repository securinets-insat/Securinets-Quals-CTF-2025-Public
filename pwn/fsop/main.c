#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
void setup(){
    setbuf(stdin,0);
    setbuf(stdout,0);
}

int vuln(){
    printf("stdout : %p\n",stdout);
    read(0,stdout,sizeof(FILE));
    return 0; 
}
int main(){
    setup();
    vuln();
    return 0;
}