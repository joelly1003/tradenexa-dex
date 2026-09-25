from PIL import Image

def super_clean_logo():
    input_path = "C:/Users/DLLL/.gemini/antigravity/brain/ccd4f9da-2c6c-4697-a11d-bc0ab3b66e7b/.user_uploaded/media_1790369642171.png"
    output_path = "public/logo.png"
    
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    
    # We crop tightly to the text region first: X: 53 to 554, Y: 129 to 230
    crop_box = (50, 125, 558, 232)
    img = img.crop(crop_box)
    w, h = img.size
    
    new_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = img.getpixel((x, y))
            luminance = 0.299 * r + 0.587 * g + 0.114 * b
            
            # Pure black/dark background -> completely 0 alpha
            if luminance < 40:
                new_img.putpixel((x, y), (0, 0, 0, 0))
            else:
                # If it's part of the text or green accents:
                # Clean up dirty semi-transparent halo pixels
                # Green accent test: g > r and g > b
                is_green = (g > r + 15) and (g > b + 15)
                is_white = (r > 130 and g > 130 and b > 130)
                
                if is_white:
                    # Clean white text pixel
                    new_img.putpixel((x, y), (255, 255, 255, 255))
                elif is_green:
                    # Clean neon green accent pixel (#B1FA41 / 177, 250, 65)
                    new_img.putpixel((x, y), (177, 250, 65, 255))
                elif luminance > 100:
                    # Soft anti-aliased edge pixel: adjust alpha smoothly without dirty color
                    alpha = int(((luminance - 40) / 160.0) * 255)
                    alpha = min(255, max(0, alpha))
                    # Check if it leans green or white
                    if g > r + 10:
                        new_img.putpixel((x, y), (177, 250, 65, alpha))
                    else:
                        new_img.putpixel((x, y), (255, 255, 255, alpha))
                else:
                    new_img.putpixel((x, y), (0, 0, 0, 0))
                    
    # Crop empty borders if any
    bbox = new_img.getbbox()
    if bbox:
        new_img = new_img.crop(bbox)
        
    new_img.save(output_path, "PNG")
    print(f"Super clean logo saved to {output_path} with size {new_img.size}")

super_clean_logo()
