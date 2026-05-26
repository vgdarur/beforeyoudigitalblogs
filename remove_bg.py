from PIL import Image, ImageDraw

def remove_black_bg(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    
    visited = set()
    queue = [(0,0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    # Use BFS
    while queue:
        x, y = queue.pop(0)
        if (x, y) in visited:
            continue
        visited.add((x, y))
        
        r, g, b, a = pixels[x, y]
        if r < tolerance and g < tolerance and b < tolerance:
            pixels[x, y] = (r, g, b, 0)
            if x > 0: queue.append((x-1, y))
            if x < width-1: queue.append((x+1, y))
            if y > 0: queue.append((x, y-1))
            if y < height-1: queue.append((x, y+1))

    img.save(output_path, "PNG")
    print("Saved to", output_path)

remove_black_bg("public/logo-v6.jpg", "public/logo-v7.png")
