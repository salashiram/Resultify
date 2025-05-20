import cv2
import json
import os
import sys

def draw_debug(image_path, exam_id):
    image = cv2.imread(image_path)
    if image is None:
        print("❌ No se pudo abrir la imagen.")
        return

    script_dir = os.path.dirname(os.path.abspath(__file__))
    meta_path = os.path.join(script_dir, "..", "src", "answer_sheet_meta", f"{exam_id}_metadata.json")

    if not os.path.exists(meta_path):
        print("❌ Archivo de metadatos no encontrado.")
        return

    with open(meta_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY_INV)

    start_y = metadata["start_y"]
    spacing = metadata["row_spacing"]
    bubbles = metadata["bubble_positions"]
    num_questions = metadata["num_questions"]

    for i in range(num_questions):
        y = start_y - i * spacing
        for option, x in bubbles.items():
            roi = thresh[y-5:y+15, x-10:x+10]
            white_px = cv2.countNonZero(roi)
            total_px = roi.size
            darkness = white_px / total_px

            # Dibuja el rectángulo
            cv2.rectangle(image, (x-10, y-5), (x+10, y+15), (0, 0, 255), 1)
            cv2.putText(
                image,
                f"{option}:{darkness:.2f}",
                (x-10, y-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.3,
                (255, 0, 0),
                1
            )

    output_path = f"debug_{os.path.basename(image_path)}"
    cv2.imwrite(output_path, image)
    print(f"✅ Imagen de depuración guardada como: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python debug_bubbles.py <ruta_imagen> <exam_id>")
        sys.exit(1)

    draw_debug(sys.argv[1], sys.argv[2])
