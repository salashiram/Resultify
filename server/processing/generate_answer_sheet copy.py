import cv2
import json
import os
import sys

def detect_marked_answers(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    answers = []

    # Coordenadas Y para cada fila de pregunta (ajusta si agregas más)
    y_positions = [
        492, 565, 653, 730, 806,
        898, 974, 1053, 1135, 1209,
        1289, 1368, 1452, 1533, 1609,
        1693, 1770, 1853, 1933, 2014
    ]

    # Coordenadas X para cada alveolo por opción
    alveolos = {
        "a": 201,
        "b": 398,
        "c": 598,
        "d": 799,
        "e": 999
    }

    for i, y in enumerate(y_positions):
        row_scores = []
        for option, x in alveolos.items():
            # roi = gray[y - 15:y + 15, x - 15:x + 15]  # ROI de 30x30 para mayor tolerancia
            roi = gray[y - 25:y + 25, x - 25:x + 25]  # 50x50


            laplacian = cv2.Laplacian(roi, cv2.CV_64F)
            score = laplacian.var()  # mide nivel de detalle o bordes

            row_scores.append((option, score))

        # Ordenamos por mayor score (más marcado)
        row_scores.sort(key=lambda x: x[1], reverse=True)

        best_option, best_score = row_scores[0]
        second_score = row_scores[1][1]

        # ⚠️ Umbral bajo para permitir tachas o rayones. Ajustable.
        if best_score > 15 and (best_score - second_score > 2):
            answers.append({
                "question_number": i + 1,
                "answer": best_option
            })

    return answers

def main():
    if len(sys.argv) != 2:
        print("Uso: python3 review_answer_sheet_marks.py <imagen>")
        return

    image_path = sys.argv[1]
    detected = detect_marked_answers(image_path)

    result = {
        "preguntas_detectadas": detected,
        "imagen_procesada": image_path
    }

    output_path = os.path.join("detected_exams", f"reviewed_{os.path.basename(image_path)}.json")
    os.makedirs("detected_exams", exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=4, ensure_ascii=False)

    print(json.dumps(result))

if __name__ == "__main__":
    main()
