# Cartoon Studio for iPhone

## Open it
1. Open the installed Cartoon Short Kit app.
2. Tap **Open Cartoon Studio**.
3. Draw with your finger or Apple Pencil. Use **Select** to tap and drag existing artwork.
4. Use **＋ Add layer** and **＋ Frame** to build animation.
5. Add a music or voiceover file in the Audio track panel.
6. Tap **Export video** to record the animation with its audio track. The browser chooses MP4 when supported; otherwise it exports WebM.
7. Tap **Save** to keep the project in this browser on this iPhone.

## Included
- Portrait 9:16 drawing canvas
- Pen, eraser, line, rectangle, ellipse, text, and select/move tools
- Selection deletion and undo
- Up to 8 layers per frame
- Frame-by-frame timeline (up to 900 frames)
- Onion-skin preview and playback with selectable FPS
- Local device save
- PNG frame export
- JSON project export and import
- Audio track preview, volume control, and audio included in video recording where supported
- Browser-based video export (MP4 where supported; WebM fallback)
- Service-worker caching for offline reopening after the first successful online load

## Important limitations
- The audio file is selected from the device each session and is not embedded in the JSON project backup.
- Browser video recording runs in real time; long projects can take a while and may be limited by iPhone memory and browser support.
- Character rigging, reusable puppet bones, multiple independent audio tracks, scene transitions, and advanced multi-track editing remain future milestones.
- Projects are stored locally in this browser on this device; export the JSON project file to back it up or move it to another device.

The original 3D cartoon preview player and original renderer remain unchanged. All studio work is additive on the separate `full-cartoon-studio` branch.
