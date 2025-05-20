import sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import os

def generar_hoja_respuestas(nombre_archivo, num_preguntas=20):
    c = canvas.Canvas(nombre_archivo, pagesize=letter)
    width, height = letter

    # Encabezado
    c.setFont("Helvetica-Bold", 14)
    c.drawString(1 * inch, height - 1 * inch, "Hoja de Respuestas")

    c.setFont("Helvetica", 12)
    c.drawString(1 * inch, height - 1.4 * inch, "Nombre del Alumno:")
    c.line(2.8 * inch, height - 1.45 * inch, 7.5 * inch, height - 1.45 * inch)

    c.drawString(1 * inch, height - 1.8 * inch, "Matrícula:")
    c.line(2.0 * inch, height - 1.85 * inch, 4.5 * inch, height - 1.85 * inch)

    c.drawString(5.0 * inch, height - 1.8 * inch, "Grupo:")
    c.line(5.8 * inch, height - 1.85 * inch, 7.5 * inch, height - 1.85 * inch)

    # Burbujas
    start_y = height - 2.5 * inch
    pregunta_altura = 0.4 * inch
    opciones = ["A", "B", "C", "D", "E"]
    radio = 5

    for i in range(1, num_preguntas + 1):
        y = start_y - (i - 1) * pregunta_altura

        c.setFont("Helvetica", 10)
        c.drawString(0.5 * inch, y, f"{i}.")

        for j, op in enumerate(opciones):
            x = 1.0 * inch + j * 1 * inch
            c.drawString(x + 12, y, op)
            c.circle(x, y + 3, radio, stroke=1, fill=0)

        if y < 1 * inch:
            c.showPage()
            start_y = height - 1.5 * inch

    c.save()
    print(f"✅ PDF generado: {nombre_archivo}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Uso: python generate_answer_sheet.py <exam_id> <num_preguntas> <exam_title>")
        sys.exit(1)

    exam_id = sys.argv[1]
    num_preguntas = int(sys.argv[2])
    exam_title = sys.argv[3].replace("_", " ")

    # exam_id = sys.argv[1]
    # num_preguntas = int(sys.argv[2])

    output_dir = os.path.join(os.path.dirname(__file__), "generated_pdfs")
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, f"respuestas_examen_{exam_id}.pdf")
    generar_hoja_respuestas(output_path, num_preguntas)
