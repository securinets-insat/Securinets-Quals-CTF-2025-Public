import math

import math

def pgcd_calculator_builtin(a, b):
    return math.gcd(a, b)

byet1=5
byte2=15
bytes=[5,15]
for i in bytes:
    for j in bytes:
        for x in bytes:
            for y in bytes:
                print(" number : ",hex(i+(j<<8)+(x<<16)+(y<<24)))
                res=pgcd_calculator_builtin(i+(j<<8)+(x<<16)+(y<<24) -0x26,0x10000000)
                print(res)