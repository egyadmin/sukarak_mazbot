$files = Get-ChildItem -Path "src\pages\*.jsx" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Replace open quote
    $newContent = $content -replace "'\$\{API_BASE\}", '`${API_BASE}'
    # Replace close quote if it follows API_BASE and some path (non-quote chars)
    $newContent = $newContent -replace "(\$\{API_BASE\}[^'\n]+)'", '$1`"'
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
}
