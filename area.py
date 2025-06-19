
import sys
import os
import cv2
import numpy as np
import torch
from PIL import Image
import matplotlib.pyplot as plt
from ultralytics import YOLO

def load_image(image):
    if isinstance(image, str):
        image = Image.open(image).convert("RGB")
    return np.array(image)

def load_mask(mask):
    if isinstance(mask, list):
        mask = mask[0]
    if isinstance(mask, str):
        mask = Image.open(mask).convert("L")
        mask = np.array(mask)
    elif isinstance(mask, Image.Image):
        mask = np.array(mask)
    elif isinstance(mask, torch.Tensor):
        mask = mask.cpu().numpy()
    elif isinstance(mask, np.ndarray):
        pass
    elif hasattr(mask, "to_numpy"):
        mask = mask.to_numpy()
    else:
        raise TypeError(f"Unsupported mask type: {type(mask)}")
    return mask > 0

def extract_ruler(image, mask):
    ruler = image.copy()
    if len(mask.shape) == 2 and len(image.shape) == 3:
        ruler[~mask] = 255
    else:
        print("Warning: Mask and image shape mismatch in extract_ruler.")
    return ruler

def align_ruler(ruler):
    gray = cv2.cvtColor(ruler, cv2.COLOR_RGB2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    lines = cv2.HoughLines(edges, 1, np.pi / 180, 100)
    if lines is not None:
        angle = np.median([line[0][1] for line in lines])
        angle = np.rad2deg(angle) - 90
        (h, w) = ruler.shape[:2]
        M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1)
        ruler = cv2.warpAffine(ruler, M, (w, h))
        print(f"Aligned ruler with rotation angle: {angle:.2f} degrees")
    else:
        print("No lines detected for alignment, skipping rotation.")
    return ruler

def binarize_ruler(ruler):
    gray = cv2.cvtColor(ruler, cv2.COLOR_RGB2GRAY)
    _, binary = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY_INV)
    print("Ruler binarized.")
    return binary

def detect_lines(binary_ruler):
    edges = cv2.Canny(binary_ruler, 50, 150)
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 50, minLineLength=10, maxLineGap=5)
    if lines is not None:
        print(f"Detected {len(lines)} lines in the ruler.")
    else:
        print("No lines detected in the ruler.")
    return lines

def estimate_pixel_density(lines):
    if lines is None:
        print("No lines detected! Cannot estimate pixel density.")
        return None
    distances = []
    for i in range(len(lines) - 1):
        y1 = lines[i][0][1]
        y2 = lines[i + 1][0][1]
        distance = abs(y1 - y2)
        distances.append(distance)
    median_distance = np.median(distances) if distances else None
    print(f"Estimated pixel density (median distance between lines): {median_distance}")
    return median_distance

def calculate_wound_area(mask, pixel_density):
    wound_pixels = np.sum(mask)
    if pixel_density is None or pixel_density == 0:
        print("Error: Invalid pixel density! Cannot calculate wound area.")
        return None
    area = wound_pixels / (pixel_density ** 2)
    print(f"Calculated wound area in square inches (approx): {area}")
    return area

if __name__ == "__main__":
    print("Starting main process...")

    if len(sys.argv) < 2:
        print("Error: No image path provided. Usage: python run_model.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    print(f"Image path received: {image_path}")

    # Load model
    print("Loading YOLO model...")
    model = YOLO("yolov8s-seg.pt")
    print("Model loaded.")

    # Predict
    print("Running prediction on image...")
    results = model.predict(image_path, conf=0.1, save=True, project="segment_output", name="results", exist_ok=True)
    print("Prediction complete and results saved.")

    segmented_image_path = os.path.join(results[0].save_dir, os.path.basename(image_path))
    print(f"Segmented image saved at: {segmented_image_path}")

    # Load original image
    test_img = load_image(image_path)
    print("Original image loaded.")

    if results[0].masks is None:
        print("No masks found in prediction results!")
        sys.exit(1)

    pred_mask_tensor = results[0].masks.data[0]  # first mask tensor
    print(f"Raw mask tensor shape: {pred_mask_tensor.shape}")

    pred_masks = pred_mask_tensor.cpu().numpy()
    pred_masks = (pred_masks > 0.5).astype(np.uint8)
    print(f"Unique values in mask: {np.unique(pred_masks)}")

    mask = load_mask(pred_masks)
    print("Mask processed.")
    print(f"Mask shape: {mask.shape}")
    print(f"Wound pixels in mask: {np.sum(mask)}")

    # Run pipeline
    ruler = extract_ruler(test_img, mask)
    print("Ruler extracted.")

    aligned_ruler = align_ruler(ruler)
    binary_ruler = binarize_ruler(aligned_ruler)
    lines = detect_lines(binary_ruler)
    pixel_density = estimate_pixel_density(lines)

    wound_area = calculate_wound_area(mask, pixel_density)
    wound_area_rounded = round(wound_area, 2) if wound_area else None

    print("\n====== FINAL OUTPUT ======")
    print(f"Estimated Pixel Density (λ): {pixel_density}")
    print(f"Estimated Wound Area: {wound_area_rounded} inch²")

