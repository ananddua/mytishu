$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:4173/')
$listener.Start()

$root = Split-Path -Parent $PSCommandPath
while ($listener.IsListening) {
  $context = $listener.GetContext()
  $requestPath = $context.Request.Url.AbsolutePath.TrimStart('/')
  if ([string]::IsNullOrWhiteSpace($requestPath)) { $requestPath = 'index.html' }

  $file = Join-Path $root $requestPath
  if (Test-Path -LiteralPath $file -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $context.Response.StatusCode = 200
    switch ([System.IO.Path]::GetExtension($file)) {
      '.html' { $context.Response.ContentType = 'text/html; charset=utf-8' }
      '.css' { $context.Response.ContentType = 'text/css; charset=utf-8' }
      '.js' { $context.Response.ContentType = 'application/javascript; charset=utf-8' }
      '.mp3' { $context.Response.ContentType = 'audio/mpeg' }
      '.png' { $context.Response.ContentType = 'image/png' }
    }
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $context.Response.StatusCode = 404
  }
  $context.Response.Close()
}
