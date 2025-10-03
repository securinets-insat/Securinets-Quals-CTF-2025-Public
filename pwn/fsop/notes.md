we set hardware b* at vtable of stdout 
in puts the vtable lookouts are :
    - <puts+0x6f>   call   QWORD PTR [r14 + 0x38] <_IO_file_xsputn>
    - <_IO_file_xsputn+0x103>   call   QWORD PTR [r13 + 0x18] <_IO_file_overflow> 
    - <new_do_write+0x4f>   call   QWORD PTR [rbp + 0x78] <_IO_file_write>
    - <_IO_flush_all+0xd2>   call   QWORD PTR [r14 + 0x18] <_IO_file_overflow>  (inside exit this )
    - <new_do_write+0x4f>   call   QWORD PTR [rbp + 0x78] <_IO_file_write>
    - <_IO_cleanup+0x219>   call   QWORD PTR [r14 + 0x58] <_IO_file_setbuf>
    - <_IO_default_setbuf+0x36>   call   QWORD PTR [r13 + 0x60] <_IO_file_sync>