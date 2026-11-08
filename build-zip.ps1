param(
    [string]$OutputDir = "C:\Users\pro\OneDrive\Desktop"
)

$source = $PSScriptRoot
$desktop = $OutputDir

Write-Host "Packaging project from: $source"

$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("ocean-pkg-" + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$excludeNames = @('node_modules', '.vscode', '.git', '*.zip', 'build-zip.ps1')

Get-ChildItem -Path $source -Recurse | Where-Object {
    $fullName = $_.FullName
    $skip = $false
    foreach ($ex in $excludeNames) {
        if ($fullName -like "*$ex*") {
            $skip = $true
            break
        }
    }
    return -not $skip
} | ForEach-Object {
    $rel = $_.FullName.Substring($source.Length).TrimStart('\', '/')
    if ($rel) {
        $dest = Join-Path $tempDir $rel
        if ($_.PSIsContainer) {
            New-Item -ItemType Directory -Path $dest -Force | Out-Null
        } else {
            $parent = Split-Path $dest
            if (-not (Test-Path $parent)) {
                New-Item -ItemType Directory -Path $parent -Force | Out-Null
            }
            Copy-Item -Path $_.FullName -Destination $dest -Force
        }
    }
}

$zipLocal = Join-Path $source "ocean-ready-to-upload.zip"
$zipDesktop = Join-Path $desktop "ocean-ready-to-upload.zip"

if (Test-Path $zipLocal) { Remove-Item $zipLocal -Force }
if (Test-Path $zipDesktop) { Remove-Item $zipDesktop -Force }

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipLocal -Force
Copy-Item -Path $zipLocal -Destination $zipDesktop -Force

Remove-Item -Recurse -Force $tempDir

$sizeKb = [Math]::Round(((Get-Item $zipLocal).Length / 1KB), 1)
Write-Host "SUCCESS! Archive created successfully:"
Write-Host "1) Inside project: $zipLocal ($sizeKb KB)"
Write-Host "2) On Desktop:     $zipDesktop ($sizeKb KB)"

