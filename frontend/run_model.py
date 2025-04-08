import sys
from ultralytics import YOLO
import os
# Load the model (update this path to where your best.pt is)
model = YOLO('YoloSam/best.pt')
# Get the image path from command line
image_path = sys.argv[1]

# Predict and save
results = model.predict(image_path, save=True, project='segment_output', name='results', exist_ok=True)

# Get the path of the output image
segmented_image_path = results[0].save_dir + '/' + os.path.basename(image_path)
print(segmented_image_path)





# import sys
# import os
# import json
# import numpy as np
# import cv2
# from PIL import Image
# from ultralytics import YOLO
# from skimage.measure import label, regionprops

# # ================== SEGMENTATION ===================

# # Load YOLO model
# model = YOLO('YoloSam/best.pt')

# # Input and Output paths (from Node.js)
# image_path = sys.argv[1]
# segmented_image_path = sys.argv[2]

# # Predict with YOLO and save result
# results = model.predict(image_path, save=True, project='segment_output', name='results', exist_ok=True)
# seg_output_path = results[0].save_dir + '/' + os.path.basename(image_path)

# # ✅ Get actual mask from YOLO output
# if results[0].masks is not None and len(results[0].masks.data) > 0:
#     mask_tensor = results[0].masks.data[0]  # First object mask
#     mask = mask_tensor.cpu().numpy() > 0.5  # Convert to binary NumPy array
# else:
#     mask = np.zeros((512, 512), dtype=bool)  # Fallback empty mask
#     print("⚠️ Warning: No segmentation mask found in results!", file=sys.stderr)

# # ================== HELPERS ===================

# def load_image(image):
#     if isinstance(image, str):
#         image = Image.open(image).convert("RGB")
#     return np.array(image)

# def detect_wound_regions(mask):
#     labeled = label(mask)
#     return regionprops(labeled)

# def calculate_wound_area(region_mask, pixel_density):
#     if pixel_density is None or pixel_density == 0:
#         return None
#     wound_pixels = np.sum(region_mask)
#     area = wound_pixels / (pixel_density ** 2)
#     return area

# # ================== RULER BASED SCALE ESTIMATION ===================

# def extract_ruler(image, mask):
#     # Resize the mask to match the image size
#     mask_resized = cv2.resize(mask.astype(np.uint8), (image.shape[1], image.shape[0]), interpolation=cv2.INTER_NEAREST)
    
#     # Create the ruler by setting non-mask regions to white (255)
#     ruler = image.copy()
#     ruler[~mask_resized.astype(bool)] = 255  # Apply resized mask
#     return ruler
# def align_ruler(ruler):
#     gray = cv2.cvtColor(ruler, cv2.COLOR_RGB2GRAY)
#     edges = cv2.Canny(gray, 50, 150)
#     lines = cv2.HoughLines(edges, 1, np.pi / 180, 100)
#     if lines is not None:
#         angle = np.median([line[0][1] for line in lines])
#         angle = np.rad2deg(angle) - 90
#         (h, w) = ruler.shape[:2]
#         M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1)
#         ruler = cv2.warpAffine(ruler, M, (w, h))
#     return ruler

# def binarize_ruler(ruler):
#     gray = cv2.cvtColor(ruler, cv2.COLOR_RGB2GRAY)
#     _, binary = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY_INV)
#     return binary

# def detect_lines(binary_ruler):
#     edges = cv2.Canny(binary_ruler, 50, 150)
#     lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 50, minLineLength=10, maxLineGap=5)
#     return lines

# def estimate_pixel_density_from_lines(lines):
#     if lines is None or len(lines) < 2:
#         print("No or insufficient lines detected!", file=sys.stderr)
#         return None
#     distances = []
#     sorted_lines = sorted(lines, key=lambda l: l[0][1])
#     for i in range(len(sorted_lines) - 1):
#         y1 = sorted_lines[i][0][1]
#         y2 = sorted_lines[i + 1][0][1]
#         distances.append(abs(y1 - y2))
#     if distances:
#         return np.median(distances)
#     return None

# # ================== EXECUTION ===================

# # Load image
# image = load_image(image_path)

# # Estimate pixel density from ruler
# ruler = extract_ruler(image, mask)
# aligned_ruler = align_ruler(ruler)
# binary_ruler = binarize_ruler(aligned_ruler)
# lines = detect_lines(binary_ruler)
# pixel_density = estimate_pixel_density_from_lines(lines)

# # Fallback if detection fails
# if pixel_density is None:
#     pixel_density = 30  # default fallback
#     print("WARNING: Using fallback pixel density (30)", file=sys.stderr)

# # Detect wound regions and calculate area
# regions = detect_wound_regions(mask)
# areas = []
# for region in regions:
#     region_mask = (label(mask) == region.label)
#     area = calculate_wound_area(region_mask, pixel_density)
#     if area:
#         areas.append(round(area, 2))

# final_area = sum(areas)

# # Output results
# print("DEBUG: AREA =", final_area, file=sys.stderr)
# print(json.dumps({
#     "segmented_path": seg_output_path.replace("\\", "/"),
#     "area": final_area
# }))
