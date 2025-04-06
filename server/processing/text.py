import cv2
import pytesseract
import re
import os
import sys
import json
import time

def main():
    # Verifica que la imagen fue pasada como argumento
    if len(sys.argv) != 2:
        error_response("Uso: python text.py <imagen>")
    
    image_path = sys.argv[1]

    # Leer la imagen
    image = cv2.imread(image_path)
    if image is None:
        error_response("Error: No se pudo abrir la imagen.")

    # Convertir a escala de grises
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Aplicar umbralización
    _, thresholded = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)

    # Extraer texto
    custom_config = r'--oem 3 --psm 6'
    texto_detectado = pytesseract.image_to_string(thresholded, config=custom_config).strip()

    # Expresión regular para capturar "1. true", "2. false", etc.
    pattern = re.compile(r'(\d+)\.\s*(true|false)', re.IGNORECASE)
    matches = pattern.findall(texto_detectado)

    questions_with_answers = []
    for match in matches:
        question_number = int(match[0])
        answer = match[1].lower()
        questions_with_answers.append({
            "question_number": question_number,
            "answer": answer
        })

    # Armar la respuesta final
    output = {
        "texto_detectado": texto_detectado,
        "nombre_imagen": image_path,
        "preguntas_detectadas": questions_with_answers
    }

    # Crear carpeta de salida si no existe
    output_dir = "./detected_exams"
    os.makedirs(output_dir, exist_ok=True)

    # Generar nombre de archivo único
    timestamp = int(time.time() * 1000)
    base_filename = os.path.splitext(os.path.basename(image_path))[0]
    json_filename = f"{base_filename}_{timestamp}.json"
    json_path = os.path.join(output_dir, json_filename)

    # Guardar el archivo JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4, ensure_ascii=False)

    print(f"✅ JSON guardado exitosamente en: {json_path}")

def error_response(message):
    error = {
        "error": True,
        "message": message
    }
    print(json.dumps(error))
    sys.exit(1)

if __name__ == "__main__":
    main()
