from PIL import Image

def remove_dark_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # Get luminance
        r, g, b, a = item
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        if luminance < 30: # Dark pixels
            new_data.append((r, g, b, 0))
        elif luminance < 80:
            # Alpha blend for smooth edges
            alpha = int(((luminance - 30) / 50.0) * 255)
            new_data.append((r, g, b, alpha))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Crop empty space
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

remove_dark_bg("C:/Users/DLLL/.gemini/antigravity/brain/ccd4f9da-2c6c-4697-a11d-bc0ab3b66e7b/.user_uploaded/media_1790369642171.png", "public/logo.png")
