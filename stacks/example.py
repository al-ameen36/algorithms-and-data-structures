from main import Stack

# Reverse String
stack = Stack(10)
string = "al-ameen"

for char in string:
    print(f"Adding {char} to stack")
    stack.push(char)

reversed = ""
for index in range(len(string)):
    reversed += stack.pop()

print(f"Initial string -> {string}")
print(f"Reversed string -> {reversed}")
