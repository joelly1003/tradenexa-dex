from PIL import Image

def remove_dark_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    
    # We want to remove dark pixels and also remove the 'green halo' which is likely dark-ish green.
    for item in datas:
        r, g, b, a = item
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        
        # If it's very dark, it's transparent
        if luminance < 45: 
            new_data.append((0, 0, 0, 0))
        elif luminance < 100:
            # We have a transition zone.
            # If the pixel is heavily green, we'll aggressively reduce its alpha
            # to remove the green trace/glow.
            greenness = g - max(r, b)
            alpha = int(((luminance - 45) / 55.0) * 255)
            
            # If it's distinctly green and in the dark transition zone, kill it.
            if greenness > 20:
                alpha = int(alpha * 0.2) # reduce alpha heavily for green halos
            
            new_data.append((r, g, b, alpha))
        else:
            # For bright pixels, if it's the green text or logo, keep it. 
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Crop empty space
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

remove_dark_bg("C:/Users/DLLL/.gemini/antigravity/brain/ccd4f9da-2c6c-4697-a11d-bc0ab3b66e7b/.user_uploaded/media_1790369642171.png", "public/logo.png")
