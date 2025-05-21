import cv2
import json
import os
import sys

def detect_marked_answers(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    answers = []
    y_positions = [
        492, 565, 653, 730, 806,
        898, 974, 1053, 1135, 1209,
        1289, 1368, 1452, 1533, 1609,
        1693, 1770, 1853, 1933, 2014
    ]
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
            roi = gray[y - 25:y + 25, x - 25:x + 25]
            laplacian = cv2.Laplacian(roi, cv2.CV_64F)
            score = laplacian.var()
            row_scores.append((option, score))

        row_scores.sort(key=lambda x: x[1], reverse=True)
        best_option, best_score = row_scores[0]
        second_score = row_scores[1][1]

        if best_score > 15 and (best_score - second_score > 2):
            answers.append({"question_number": i + 1, "answer": best_option})

    return answers

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Uso: python3 review_answer_sheet.py <imagen>"}))
        return

    image_path = sys.argv[1]
    try:
        detected = detect_marked_answers(image_path)
        folder_name = os.path.basename(os.path.dirname(image_path))
        file_name = os.path.basename(image_path).replace(".png", "")

        result = {
            "preguntas_detectadas": detected,
            "imagen_procesada": image_path
        }

        os.makedirs("detected_exams", exist_ok=True)
        output_path = os.path.join("detected_exams", f"reviewed_{folder_name}_{file_name}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=4, ensure_ascii=False)

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
