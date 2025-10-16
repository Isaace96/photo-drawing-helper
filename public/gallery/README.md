# Gallery Images

This folder contains example artwork created using the Photo Drawing Helper tool.

## Folder Structure
```
/gallery/
  ├── gallery-data.json          # Metadata for all gallery items
  └── drawings/                  # Image files
      ├── portrait-original.jpg  # Original photo
      ├── portrait-highlights.jpg # Highlights layer
      ├── portrait-midtones.jpg  # Midtones layer  
      ├── portrait-shadows.jpg   # Shadows layer
      ├── portrait-darks.jpg     # Darks layer
      ├── portrait-final.jpg     # Final drawing
      └── ... (more examples)
```

## Adding New Gallery Items

1. Add your images to the `/drawings/` folder
2. Update `gallery-data.json` with the new entry:

```json
{
  "id": "unique-id",
  "title": "Artwork Title",
  "description": "Description of the artwork",
  "artist": "Artist Name",
  "originalImage": "/gallery/drawings/your-original.jpg",
  "highlights": "/gallery/drawings/your-highlights.jpg",
  "midtones": "/gallery/drawings/your-midtones.jpg", 
  "shadows": "/gallery/drawings/your-shadows.jpg",
  "darks": "/gallery/drawings/your-darks.jpg",
  "finalDrawing": "/gallery/drawings/your-final.jpg",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## Image Guidelines

- **Format**: JPG or PNG
- **Size**: Recommended max width 800px for faster loading
- **Quality**: Balance between file size and visual quality
- **Naming**: Use descriptive, URL-friendly filenames

## Example Tags
- "portrait", "landscape", "still life"
- "realistic", "stylized", "abstract"  
- "graphite", "charcoal", "digital", "pencil"
- "beginner", "intermediate", "advanced"