from main import Queue

myQueue = Queue(10)
print(f"Create a queue of size {myQueue.size}")
print(f"FRONT: {myQueue.FRONT}\nREAR: {myQueue.REAR}")
print(myQueue.queue)

print("-----------------")
item = 20
myQueue.enqueue(item)
print(f"Added {item} to the queue.\nFRONT: {myQueue.FRONT}\nREAR: {myQueue.REAR}")
print(myQueue.queue)

print("-----------------")
item = 22
myQueue.enqueue(item)
print(f"Added {item} to the queue.\nFRONT: {myQueue.FRONT}\nREAR: {myQueue.REAR}")
print(myQueue.queue)

print("-----------------")
item = 24
myQueue.enqueue(item)
print(f"Added {item} to the queue.\nFRONT: {myQueue.FRONT}\nREAR: {myQueue.REAR}")
print(myQueue.queue)

print("-----------------")
removed_item = myQueue.dequeue()
print(
    f"Removed {removed_item} from the queue.\nFRONT: {myQueue.FRONT}\nREAR: {myQueue.REAR}"
)
print(myQueue.queue)

print("-----------------")
removed_item = myQueue.dequeue()
print(
    f"Removed {removed_item} from the queue.\nFRONT: {myQueue.FRONT}\nREAR: {myQueue.REAR}"
)
print(myQueue.queue)
