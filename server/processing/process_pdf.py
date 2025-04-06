import sys
from pdf2image import convert_from_path
import os

# Recibir la ruta del PDF y un ID único como argumentos
pdf_path = sys.argv[1]
unique_id = sys.argv[2]

# Carpeta de salida
base_output_folder = os.path.join(os.path.dirname(__file__), "output_images")
output_folder = os.path.join(base_output_folder, unique_id)

# Asegúrate de que la carpeta exista
os.makedirs(output_folder, exist_ok=True)

print(f"Imágenes generadas en: {output_folder}")

# Convertir PDF a imágenes
images = convert_from_path(pdf_path)

# Guardar las imágenes como archivos PNG
for i, img in enumerate(images):
    img_path = os.path.join(output_folder, f"page_{i + 1}.png")
    img.save(img_path, "PNG")
    print(f"Página {i + 1} guardada como {img_path}")
