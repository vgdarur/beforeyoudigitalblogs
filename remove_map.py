import re

with open("prisma/schema.prisma", "r") as f:
    content = f.read()

# Remove @@map(...) entirely
content = re.sub(r'\s*@@map\("[^"]+"\)', '', content)

with open("prisma/schema.prisma", "w") as f:
    f.write(content)
print("Removed @@map from schema")
