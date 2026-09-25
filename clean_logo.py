from PIL import Image

def clean_and_crop_logo():
    input_path = "C:/Users/DLLL/.gemini/antigravity/brain/ccd4f9da-2c6c-4697-a11d-bc0ab3b66e7b/.user_uploaded/media_1790369642171.png"
    output_path = "public/logo.png"
    
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    
    # Crop to ONLY the text region (ignoring the card container borders)
    # Based on pixel inspection: text is inside (50, 120, 560, 240)
    # Let's inspect the original image coords:
    # First, mask out dark background
    datas = img.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        if luminance < 50:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Now find bounding box ONLY of pixels that have bright white or bright green content
    # (ignoring faint border lines)
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = img.getpixel((x, y))
            if a > 100 and (r > 120 or g > 120 or b > 120):
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    print(f"Crop box: ({min_x}, {min_y}, {max_x}, {max_y})")
    
    # Add a small 4px padding
    cropped = img.crop((max(0, min_x - 4), max(0, min_y - 4), min(w, max_x + 4), min(h, max_y + 4)))
    cropped.save(output_path, "PNG")
    print(f"Saved clean cropped logo to {output_path} with size {cropped.size}")

clean_and_crop_logo()
