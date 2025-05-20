import cv2
import json
import os
import sys

# Coordenadas hardcodeadas para cada burbuja (15 preguntas, opciones A-E) - ahora en MAYÚSCULAS
bubble_positions = {
    1: {"A": (201, 492), "B": (398, 487), "C": (598, 489), "D": (799, 488), "E": (999, 487)},
    2: {"A": (198, 565), "B": (403, 574), "C": (598, 570), "D": (799, 569), "E": (1000, 569)},
    3: {"A": (201, 653), "B": (398, 647), "C": (590, 654), "D": (797, 656), "E": (992, 655)},
    4: {"A": (202, 730), "B": (397, 727), "C": (598, 730), "D": (799, 725), "E": (996, 728)},
    5: {"A": (203, 806), "B": (407, 808), "C": (602, 812), "D": (799, 811), "E": (999, 812)},
    6: {"A": (194, 898), "B": (396, 888), "C": (596, 888), "D": (799, 891), "E": (1002, 890)},
    7: {"A": (199, 974), "B": (407, 974), "C": (592, 970), "D": (804, 967), "E": (995, 966)},
    8: {"A": (203, 1053), "B": (406, 1051), "C": (600, 1053), "D": (796, 1056), "E": (1001, 1052)},
    9: {"A": (202, 1135), "B": (398, 1130), "C": (594, 1128), "D": (809, 1122), "E": (1005, 1126)},
    10: {"A": (200, 1209), "B": (402, 1215), "C": (599, 1220), "D": (792, 1208), "E": (1001, 1216)},
    11: {"A": (201, 1289), "B": (408, 1292), "C": (598, 1290), "D": (799, 1298), "E": (999, 1290)},
    12: {"A": (200, 1368), "B": (404, 1366), "C": (585, 1372), "D": (802, 1369), "E": (997, 1366)},
    13: {"A": (200, 1452), "B": (393, 1449), "C": (603, 1445), "D": (797, 1448), "E": (1005, 1448)},
    14: {"A": (203, 1533), "B": (403, 1528), "C": (601, 1534), "D": (796, 1530), "E": (995, 1535)},
    15: {"A": (197, 1609), "B": (402, 1607), "C": (602, 1609), "D": (797, 1612), "E": (1003, 1616)}
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
                darkest_option = option_letter  # Ahora en mayúscula

        if lowest_intensity < 50:  # Umbral de oscuridad para considerar que está marcada
            results.append({
                "question_number": question_number,
                "answer": darkest_option  # Se mantiene en mayúscula
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