import random
import string

seed = random.randint(0, 2**20)
shift_rng = random.Random(seed)

class ProtectedFlag:
    def __init__(self, value):
        self._value = value

    def __str__(self):
        return "variable protected, sryy"

    def __repr__(self):
        return "variable protected, sryy"

    def __getitem__(self, index):
        try:
            return self._value[index]
        except Exception:
            return "variable protected, sryy"

# Example flag
flag = ProtectedFlag("Securinets{H0p3_Y0u_L0ST_1t!}")

def shift_mapping(mapping):
    """Shift the VALUES of the mapping randomly by +1 or -1 in the alphabet."""
    shifted = {}
    shift = shift_rng.choice([-1, 1])

    for k, v in mapping.items():
        shifted[k] = chr(((ord(v) - 97 + shift) % 26) + 97)
    return shifted

def make_initial_mapping():
    """Create a random mapping for all lowercase letters only."""
    letters = list(string.ascii_lowercase)
    shuffled = letters[:]
    random.shuffle(shuffled)
    return dict(zip(letters, shuffled))

def main():
    valid_chars = set(string.ascii_lowercase + "[]()~><*+")
    mapping = make_initial_mapping()
    print("Welcome to the shifting jail! Enter text using only a-z, []()~><*+")

    try:
        while True:
            user_in = input("> ").strip()
            if len(user_in) > 150:
                raise ValueError(f"Input exceeds 150 characters")

            if not all(c in valid_chars for c in user_in):
                print("Invalid input. Only [a-z] and []()~><*+ are allowed.")
                continue

            # Encode input (letters mapped, symbols passthrough)
            encoded = "".join(mapping[c] if c in mapping else c for c in user_in)

            mapping = shift_mapping(mapping)
            # Try to eval at lowest builtin level
            try:
                result = eval(encoded, {"__builtins__": None}, {"flag": flag})
                print(result)
            except Exception:
                print(encoded)

    except KeyboardInterrupt:
        print("\nGoodbye!")

if __name__ == "__main__":
    main()
