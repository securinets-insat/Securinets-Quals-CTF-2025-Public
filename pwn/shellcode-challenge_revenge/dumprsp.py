import gdb

res=()
class DumpRsp(gdb.Command):
    """Dump 1000 QWORD values from $rsp."""

    def __init__(self):
        super(DumpRsp, self).__init__("dump_rsp", gdb.COMMAND_USER)

    def invoke(self, arg, from_tty):
        rsp = int(gdb.parse_and_eval("$rsp"))
        inferior = gdb.inferiors()[0]

        # 1000 values, 8 bytes each
        for i in range(1000):
            addr = rsp + i * 8
            data = inferior.read_memory(addr, 8)
            value = int.from_bytes(data, byteorder="little")
            res.append((addr-rsp,value))
            print(f"{hex(addr)}: {hex(value)}")

DumpRsp()
