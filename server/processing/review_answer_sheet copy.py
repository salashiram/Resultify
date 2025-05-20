import cv2
import json
import os
import sys

# Coordenadas hardcodeadas para cada burbuja (15 preguntas, opciones A-E)
bubble_positions = {
    1: {"a": (201, 492), "b": (398, 487), "c": (598, 489), "d": (799, 488), "e": (999, 487)},
    2: {"a": (198, 565), "b": (403, 574), "c": (598, 570), "d": (799, 569), "e": (1000, 569)},
    3: {"a": (201, 653), "b": (398, 647), "c": (590, 654), "d": (797, 656), "e": (992, 655)},
    4: {"a": (202, 730), "b": (397, 727), "c": (598, 730), "d": (799, 725), "e": (996, 728)},
    5: {"a": (203, 806), "b": (407, 808), "c": (602, 812), "d": (799, 811), "e": (999, 812)},
    6: {"a": (194, 898), "b": (396, 888), "c": (596, 888), "d": (799, 891), "e": (1002, 890)},
    7: {"a": (199, 974), "b": (407, 974), "c": (592, 970), "d": (804, 967), "e": (995, 966)},
    8: {"a": (203, 1053), "b": (406, 1051), "c": (600, 1053), "d": (796, 1056), "e": (1001, 1052)},
    9: {"a": (202, 1135), "b": (398, 1130), "c": (594, 1128), "d": (809, 1122), "e": (1005, 1126)},
    10: {"a": (200, 1209), "b": (402, 1215), "c": (599, 1220), "d": (792, 1208), "e": (1001, 1216)},
    11: {"a": (201, 1289), "b": (408, 1292), "c": (598, 1290), "d": (799, 1298), "e": (999, 1290)},
    12: {"a": (200, 1368), "b": (404, 1366), "c": (585, 1372), "d": (802, 1369), "e": (997, 1366)},
    13: {"a": (200, 1452), "b": (393, 1449), "c": (603, 1445), "d": (797, 1448), "e": (1005, 1448)},
    14: {"a": (203, 1533), "b": (403, 1528), "c": (601, 1534), "d": (796, 1530), "e": (995, 1535)},
    15: {"a": (197, 1609), "b": (402, 1607), "c": (602, 1609), "d": (797, 1612), "e": (1003, 1616)}
}

def detect_marked_bubbles(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)

    results = []

    for question_number, options in bubble_positions.items():
        darkest_option = None
        lowest_intensity = float("inf")

        for option_letter, (x, y) in options.items():
            roi = thresh[y - 10:y + 10, x - 10:x + 10]  # Área pequeña alrededor de la burbuja
            mean_intensity = cv2.mean(roi)[0]  # Valor promedio de pixel en escala de grises

            if mean_intensity < lowest_intensity:
                lowest_intensity = mean_intensity
                darkest_option = option_letter

        if lowest_intensity < 50:  # Umbral de oscuridad para considerar que está marcada
            results.append({
                "question_number": question_number,
                "answer": darkest_option
            })

    return results

def main():
    if len(sys.argv) != 2:
        print("Uso: python3 review_answer_sheet_hardcoded.py <ruta_imagen>")
        return

    image_path = sys.argv[1]
    image = cv2.imread(image_path)

    if image is None:
        print("❌ No se pudo abrir la imagen.")
        return

    detected = detect_marked_bubbles(image)

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
