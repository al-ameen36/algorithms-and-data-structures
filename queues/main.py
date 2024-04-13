class Queue:
    FRONT = -1
    REAR = -1

    def __init__(self, size) -> None:
        self.size = size
        self.queue = [None] * size

    def isEmpty(self):
        return self.FRONT == -1

    def isFull(self):
        return self.REAR == self.size

    def peek(self):
        if not self.isEmpty():
            return self.queue[self.FRONT]
        else:
            return self.FRONT

    def enqueue(self, item):
        if self.isFull():
            self.queue = [*self.queue, *[None] * self.size]
            self.size = self.size * 2
        elif self.isEmpty():
            self.FRONT = 0

        self.REAR += 1
        self.queue[self.REAR] = item

    def dequeue(self):
        if self.isEmpty():
            self.FRONT = -1
            self.REAR = -1
            return self.FRONT

        if self.FRONT != self.REAR:
            self.FRONT += 1
        else:
            self.FRONT = -1
            self.REAR = -1

        removed_item = self.queue[self.FRONT - 1]
        self.queue[self.FRONT - 1] = None

        return removed_item
