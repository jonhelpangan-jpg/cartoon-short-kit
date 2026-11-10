# Cartoon Short Kit for iPhone

This branch adds an iPhone-friendly installable web-app entry point without changing the original project files.

## Publish it with GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch **ios-pwa** and folder **/ (root)**, then Save.
5. Wait for GitHub Pages to publish the site.

The app URL will be:

`https://jonhelpangan-jpg.github.io/cartoon-short-kit/ios.html`

## Install on iPhone

1. Open the URL above in **Safari** (not an in-app browser).
2. Tap **Share**.
3. Choose **Add to Home Screen**.
4. Keep **Open as Web App** enabled if shown, then tap **Add**.
5. Launch **Cartoon Short Kit** from the new Home Screen icon.

Open the app online once before relying on offline use so its core scripts can be cached. Voiceover files selected from the iPhone are local to that session and are not uploaded.

## Current scope and limitations

This iPhone build is a mobile-friendly wrapper for the repository's existing vertical cartoon preview player. It supports playback, scrubbing, and loading a local voiceover. It does **not** turn the existing preview into a full scene editor, and it does not run the Python/FFmpeg video-rendering pipeline on iPhone. WebGL performance depends on the iPhone model and available memory.

The original root `index.html`, JavaScript engine files, Windows packaging branch, and `main` branch are not modified by this iOS addition.
