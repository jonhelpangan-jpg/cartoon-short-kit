# Cartoon Short Kit — Windows offline launch

This adds a Windows launcher around the existing preview. It does not replace or edit the original cartoon engine files.

## Offline browser version

1. Download this branch as a ZIP and extract it.
2. Double-click `start-offline.bat`.
3. Keep the PowerShell window open while using the preview in your browser.
4. Close the PowerShell window when finished.

The launcher uses Windows PowerShell and a local-only server at `127.0.0.1`. It does not need an internet connection after the files have been downloaded.

## Windows desktop app (.exe)

A Windows installer is produced by the GitHub Actions workflow named **Build Windows app**:

1. Open the repository's **Actions** tab.
2. Select **Build Windows app**.
3. Choose **Run workflow** and select the `desktop-offline-packaging` branch.
4. After the run succeeds, download the `cartoon-short-kit-windows` artifact.
5. The artifact contains the Windows installer and the offline-browser ZIP.

The installer is built on a Windows GitHub Actions runner. The installed desktop app serves the existing files locally and opens the existing `index.html` preview.

## Important scope

The original project is an animated-short preview/engine, not a full timeline editor. This packaging adds launchers only. The existing preview, story, renderer, and assets are included as-is.

The separate command-line video-render workflow still has its own prerequisites (Node.js, Playwright Chromium, Python packages, and FFmpeg) as described in the original project documentation. This launcher does not silently install or replace those tools.

## Original files

All packaging files are additive. The original files at the repository root and in `lib/`, `tools/`, `example/`, and `vendor/` are not modified by this branch.
