#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
void setup(){
    setbuf(stdin,0);
    setbuf(stdout,0);
}
void win(){
    system("cat flag.txt");
}
int compress(char *data , int data_len , char * dst){
    int i,j,count;
    char recent=data[0];
    i=count=1;
    j=0;
    while (i < data_len){
        while ((count<255) && (i<data_len) && (data[i] ==recent) )
        {
           count++; 
           i++;
        } 
        dst[j]=recent;
        dst[j+1]=(char) (count);
        j+=2;
        count=0;
        recent=data[i];
    }
    return j;
}
#define INPUT_MAX_SIZE 0x300 
int vuln(){
    char dst[INPUT_MAX_SIZE]={0};
    char input[INPUT_MAX_SIZE]={0};
    while (1){
        puts("data to compress : ");
        int len = read(STDIN_FILENO,input,sizeof(input));
        if (!strncmp(input,"exit",4)){
            break;
        }
        int out_len=compress(input,len,dst);
        printf("compressed data  : ");
        for (int i=0;i<out_len;i++){
            printf("%02X",(dst[i]&0xff));
        }
        puts("");
    }
    
    return 0; 
}
int main(){
    setup();
    vuln();
    puts("bye");
    return 0;
}