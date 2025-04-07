import cv2
import pytesseract
import re
import os
import sys
import json
import time

def main():
    if len(sys.argv) != 2:
        error_response("Uso: python text.py <imagen>")
    
    image_path = sys.argv[1]

    image = cv2.imread(image_path)
    if image is None:
        error_response("Error: No se pudo abrir la imagen.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresholded = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)

    custom_config = r'--oem 3 --psm 6'
    texto_detectado = pytesseract.image_to_string(thresholded, config=custom_config).strip()

    # Buscar preguntas tipo "1. true", "2. false", etc.
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

 
    # Buscar matrícula y nombre
    matricula_match = re.search(r'Matricula:\s*(\d+)', texto_detectado, re.IGNORECASE)
    nombre_match = re.search(r'Nombre completo:\s*(.+?)(?:\n|$)', texto_detectado, re.IGNORECASE)

    matricula = matricula_match.group(1) if matricula_match else None
    nombre_completo = nombre_match.group(1).strip() if nombre_match else None


 

    # Armar la respuesta final
    output = {
        "texto_detectado": texto_detectado,
        "nombre_imagen": image_path,
        "matricula": matricula,
        "nombre_completo": nombre_completo,
        "preguntas_detectadas": questions_with_answers
    }

    output_dir = "./detected_exams"
    os.makedirs(output_dir, exist_ok=True)

    timestamp = int(time.time() * 1000)
    base_filename = os.path.splitext(os.path.basename(image_path))[0]
    json_filename = f"{base_filename}_{timestamp}.json"
    json_path = os.path.join(output_dir, json_filename)

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
