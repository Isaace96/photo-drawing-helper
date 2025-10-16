#!/usr/bin/env python3
"""
Script to strip EXIF data from gallery images while preserving image quality.
This removes metadata like GPS coordinates, camera info, timestamps, etc.
"""

import os
from PIL import Image
import sys

def strip_exif_from_image(input_path, output_path=None):
    """
    Strip EXIF data from an image file.
    
    Args:
        input_path (str): Path to the input image
        output_path (str): Path for the output image (optional, overwrites input if None)
    """
    if output_path is None:
        output_path = input_path
    
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Convert to RGB if necessary (handles RGBA, etc.)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Convert to RGB for JPEG compatibility
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGB')
                elif img.mode in ('RGBA', 'LA'):
                    rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = rgb_img
            
            # Create a new image without EXIF data
            data = img.getdata()
            clean_img = Image.new(img.mode, img.size)
            clean_img.putdata(data)
            
            # Save without EXIF data, preserving quality
            clean_img.save(output_path, 'JPEG', quality=95, optimize=True)
            
        file_size_before = os.path.getsize(input_path) if input_path != output_path else "N/A"
        file_size_after = os.path.getsize(output_path)
        
        print(f"✓ Processed: {os.path.basename(input_path)}")
        print(f"  Size after: {file_size_after:,} bytes")
        
        return True
        
    except Exception as e:
        print(f"✗ Error processing {input_path}: {e}")
        return False

def main():
    """Main function to strip EXIF from all gallery images."""
    
    # Path to the gallery drawings directory
    gallery_dir = r"c:\dev\photo-drawing-helper\public\gallery\drawings"
    
    if not os.path.exists(gallery_dir):
        print(f"Error: Gallery directory not found: {gallery_dir}")
        sys.exit(1)
    
    # List of image files to process
    image_files = [
        "PXL_20240316_145824055.jpg",
        "PXL_20240316_145824055_darks.jpg", 
        "PXL_20240316_145824055_final.jpg",
        "PXL_20240316_145824055_highlights.jpg",
        "PXL_20240316_145824055_midtones.jpg",
        "PXL_20240316_145824055_shadows.jpg"
    ]
    
    print("Stripping EXIF data from gallery images...")
    print("=" * 50)
    
    processed_count = 0
    total_files = len(image_files)
    
    for filename in image_files:
        file_path = os.path.join(gallery_dir, filename)
        
        if os.path.exists(file_path):
            if strip_exif_from_image(file_path):
                processed_count += 1
        else:
            print(f"✗ File not found: {filename}")
    
    print("=" * 50)
    print(f"Processed {processed_count}/{total_files} images successfully")
    
    if processed_count == total_files:
        print("🎉 All gallery images have been cleaned of EXIF data!")
    else:
        print(f"⚠️  {total_files - processed_count} files had issues")

if __name__ == "__main__":
    main()