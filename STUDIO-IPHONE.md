# Cartoon Studio for iPhone

This branch adds the first drawing-and-animation workspace to the existing iPhone PWA.

## Open it
1. Open the installed Cartoon Short Kit app.
2. Tap **Open Cartoon Studio**.
3. Choose a drawing tool and draw directly on the canvas with your finger or Apple Pencil.
4. Use **＋ Add layer** to create layers and **＋ Frame** to add animation frames.
5. Turn on **Onion skin** to see the previous frame faintly while drawing.
6. Tap **Save** to keep the project in this browser on this iPhone.

## Included in this first studio milestone
- Portrait 9:16 drawing canvas
- Pen, eraser, line, rectangle, ellipse, and text tools
- Brush color and size controls
- Up to 8 layers per frame
- Frame-by-frame timeline (up to 60 frames)
- Onion-skin preview
- Playback preview with selectable FPS
- Local device save
- PNG frame export
- JSON project export and import
- Service-worker caching for offline reopening after the first successful online load

## Current limitations
This is the foundation of the full editor, not the final complete animation suite. Selection/moving existing artwork, character rigging, audio mixing, MP4/GIF rendering, and desktop-grade multi-track editing are not included yet. Projects are stored locally in the browser on this device; export the JSON project file to make a backup or move it to another device.

The original 3D cartoon preview player remains available at `ios.html`. No original project files or rendering scripts were replaced.
