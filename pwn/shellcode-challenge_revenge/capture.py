import gdb
import re

class CaptureRWSearch(gdb.Command):
    """Run search-pattern and capture only results in [rw-] regions."""

    def __init__(self):
        super(CaptureRWSearch, self).__init__("capture_rw_search", gdb.COMMAND_USER)

    def invoke(self, arg, from_tty):
        output = gdb.execute(f"search-pattern {arg}", to_string=True)

        addrs = []
        in_rw = False

        for line in output.splitlines():
            # Detect new memory region header
            m_region = re.search(r"\[(r[-w][^]]*)\]", line)
            if m_region:
                perms = m_region.group(1)
                in_rw = perms.startswith("rw")
                continue

            if in_rw:
                # Match lines that start with an address
                m_addr = re.match(r"\s*(0x[0-9a-fA-F]+):", line)
                if m_addr:
                    addr = int(m_addr.group(1), 16)
                    addrs.append(addr)

        # Print the filtered addresses
        if addrs:
            #print("[*] RW matches:")
            for a in addrs:
                pass
                #print(hex(a))
        else:
            print("No RW matches found.")
        ### now we look for matches 


        rsp = int(gdb.parse_and_eval("$rsp"))
        inferior = gdb.inferiors()[0]

        # 1000 values, 8 bytes each
        rsp_vals=[]
        for i in range(0x1800//8):
            addr = rsp + i * 8
            data = inferior.read_memory(addr, 8)
            value = int.from_bytes(data, byteorder="little")
            rsp_vals.append((addr-rsp,value))
            #print(f"{hex(addr)}: {hex(value)}")

        #print(addrs)
        #print(rsp_vals)
        

        #### now we look for matches 
        for index,rsp in rsp_vals:
            for addr in addrs:
                if 0<(addr-rsp)<0x10000:
                    print(f"[+] found {hex(rsp)} at offset {hex(index)} which leads to {hex(addr)} with differnce  {hex(addr-rsp)}")
        return addrs

CaptureRWSearch()