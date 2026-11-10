$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$listener = [System.Net.HttpListener]::new()
$prefix = "http://127.0.0.1:4173/"
$listener.Prefixes.Add($prefix)

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".js" = "text/javascript; charset=utf-8"
  ".mjs" = "text/javascript; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg" = "image/svg+xml"
  ".wav" = "audio/wav"
  ".mp3" = "audio/mpeg"
  ".mp4" = "video/mp4"
  ".ico" = "image/x-icon"
}

try {
  $listener.Start()
  Write-Host "Cartoon Short Kit is running offline at $prefix" -ForegroundColor Green
  Write-Host "Opening your default browser. Keep this window open while using the app."
  Start-Process $prefix

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))
      if ([string]::IsNullOrWhiteSpace($relative)) { $relative = "index.html" }
      $candidate = [IO.Path]::GetFullPath((Join-Path $root $relative))
      if (-not $candidate.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        $context.Response.StatusCode = 403
        $context.Response.Close()
        continue
      }
      if (Test-Path -LiteralPath $candidate -PathType Container) {
        $candidate = Join-Path $candidate "index.html"
      }
      if (-not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
        $context.Response.StatusCode = 404
        $context.Response.Close()
        continue
      }

      $bytes = [IO.File]::ReadAllBytes($candidate)
      $extension = [IO.Path]::GetExtension($candidate).ToLowerInvariant()
      if ($mime.ContainsKey($extension)) {
        $context.Response.ContentType = $mime[$extension]
      } else {
        $context.Response.ContentType = "application/octet-stream"
      }
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.Headers["X-Content-Type-Options"] = "nosniff"
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      $context.Response.OutputStream.Close()
    } catch {
      try { $context.Response.StatusCode = 500; $context.Response.Close() } catch {}
      Write-Warning $_.Exception.Message
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
