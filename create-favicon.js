// Favicon creation script - to be run in browser console
// This creates the tonal separation favicon design

function createFavicon() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, 32, 32);
    
    // Tonal squares
    const squareSize = 12;
    const gap = 2;
    const startX = 3;
    const startY = 3;
    
    // Highlights (top-left) - white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(startX, startY, squareSize, squareSize);
    
    // Midtones (top-right) - gray
    ctx.fillStyle = '#999999';
    ctx.fillRect(startX + squareSize + gap, startY, squareSize, squareSize);
    
    // Shadows (bottom-left) - dark gray
    ctx.fillStyle = '#444444';
    ctx.fillRect(startX, startY + squareSize + gap, squareSize, squareSize);
    
    // Darks (bottom-right) - black
    ctx.fillStyle = '#111111';
    ctx.fillRect(startX + squareSize + gap, startY + squareSize + gap, squareSize, squareSize);
    
    // Small center circle (camera icon)
    ctx.fillStyle = '#667eea';
    ctx.beginPath();
    ctx.arc(16, 16, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(16, 16, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    
    return canvas.toDataURL('image/png');
}

// Usage:
// 1. Open browser console
// 2. Paste this code
// 3. Run: const faviconData = createFavicon(); console.log(faviconData);
// 4. Copy the base64 string and convert to favicon.ico