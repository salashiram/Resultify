import cv2
import pytesseract
import re
import os
import sys

# Verifica que la imagen fue pasada como argumento
if len(sys.argv) != 2:
    print("Uso: python text.py <imagen>")
    sys.exit(1)

image_path = sys.argv[1]

# Leer la imagen
image = cv2.imread(image_path)
if image is None:
    print("Error: No se pudo abrir la imagen.")
    sys.exit(1)

# Convertir la imagen a escala de grises
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Aplicar umbralización
_, thresholded = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)

# Extraer texto
custom_config = r'--oem 3 --psm 6'
text = pytesseract.image_to_string(thresholded, config=custom_config)

print("\nTexto detectado:")
print(text)

# 1. Asociar preguntas con respuestas
# Expresión regular para capturar "1. true", "2. false", etc.
pattern = re.compile(r'(\d+)\.\s*(true|false)', re.IGNORECASE)
matches = pattern.findall(text)

# Lista para almacenar preguntas con respuestas
questions_with_answers = []

for match in matches:
    question_number = int(match[0])
    answer = match[1].lower()  # Normalizamos a minúsculas
    questions_with_answers.append({
        "question_number": question_number,
        "answer": answer
    })

# 2. Mostrar las preguntas asociadas con sus respuestas
print("\nPreguntas detectadas con respuestas:")
for q in questions_with_answers:
    print(f"Pregunta {q['question_number']}: {q['answer']}")

# 3. Guardar el resultado en un archivo JSON (opcional)
import json
output_file = "detected_exam.json"
with open(output_file, "w") as f:
    json.dump(questions_with_answers, f, indent=4)

print(f"\nPreguntas con respuestas guardadas en {output_file}")