class Stack:
    TOP = -1
    items = []

    def __init__(self, size):
        self.size = size

    def isEmpty(self) -> bool:
        return self.TOP == -1

    def isFull(self) -> bool:
        return self.TOP == self.size

    def peek(self):
        return self.items[self.TOP]

    def push(self, item) -> int:
        if self.isFull():
            self.size = self.size * 2
            print("Size changed to " + self.size)

        self.items.append(item)
        self.TOP += 1
        return self.TOP

    def pop(self):
        if self.isEmpty():
            print("Stack is Empty")
            return -1

        self.TOP -= 1
        return self.items.pop()


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
