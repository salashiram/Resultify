import sys
from pdf2image import convert_from_path
import os

pdf_path = sys.argv[1]
unique_id = sys.argv[2]

output_dir = os.path.join(os.path.dirname(__file__), "output_images", unique_id)
os.makedirs(output_dir, exist_ok=True)

images = convert_from_path(pdf_path)
for i, img in enumerate(images):
    img_path = os.path.join(output_dir, f"page_{i + 1}.png")
    img.save(img_path, "PNG")
    print(f"✅ Imagen guardada: {img_path}")
