import cv2

def click_event(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(f"Clicked at: ({x}, {y})")

img = cv2.imread("page_1.png")
cv2.imshow("Selecciona los alveolos", img)
cv2.setMouseCallback("Selecciona los alveolos", click_event)
cv2.waitKey(0)
cv2.destroyAllWindows()
