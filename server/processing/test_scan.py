import cv2
import numpy as np

# Lee una imagen de prueba
image = cv2.imread("./test.jpg")

# Convierte a escala de grises
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Muestra la imagen
cv2.imshow("Escala de grises", gray)
cv2.waitKey(0)
cv2.destroyAllWindows()
