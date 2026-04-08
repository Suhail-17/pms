$html = [System.IO.File]::ReadAllText("d:\METHUSELAH\PMS\Campus.html")

# Extract all encoded upload filenames
$m1 = [regex]::Matches($html, 'api\.mdx\.ac\.ae%2Fuploads%2F([^&]+)')
$files1 = $m1 | ForEach-Object { [System.Uri]::UnescapeDataString($_.Groups[1].Value) }

# Extract plain upload paths
$m2 = [regex]::Matches($html, 'api\.mdx\.ac\.ae/uploads/([^"<\s]+)')
$files2 = $m2 | ForEach-Object { $_.Groups[1].Value }

$all = ($files1 + $files2) | Sort-Object -Unique
Write-Host "Unique images found: $($all.Count)"

# Create images folder
$imgDir = "d:\METHUSELAH\PMS\images"
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

foreach ($file in $all) {
    $url = "https://api.mdx.ac.ae/uploads/$file"
    $dest = Join-Path $imgDir $file
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing -TimeoutSec 30
        Write-Host "OK: $file"
    } catch {
        Write-Host "FAIL: $file - $_"
    }
}

Write-Host "Done."
