import sys
from pdf2image import convert_from_path
import os

# Recibir la ruta del PDF como argumento
pdf_path = sys.argv[1]

# Carpeta temporal para las imágenes
output_folder = "output_images"
os.makedirs(output_folder, exist_ok=True)

# Convertir PDF a imágenes
images = convert_from_path(pdf_path)

# Guardar las imágenes como archivos PNG
for i, img in enumerate(images):
    img_path = f"{output_folder}/page_{i + 1}.png"
    img.save(img_path, "PNG")
    print(f"Página {i + 1} guardada como {img_path}")
