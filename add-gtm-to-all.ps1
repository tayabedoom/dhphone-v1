# Google Tag Manager Implementation Script for DH Phone
# This script adds GTM to all HTML files that don't have it yet

Write-Host "🚀 Adding Google Tag Manager to All HTML Files" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "GTM Container ID: GTM-P2PWNTT3" -ForegroundColor Yellow
Write-Host ""

# GTM container ID
$GTM_CONTAINER_ID = "GTM-P2PWNTT3"

# GTM head snippet
$GTM_HEAD_SNIPPET = @"
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','$GTM_CONTAINER_ID');</script>
    <!-- End Google Tag Manager -->

"@

# GTM noscript fallback
$GTM_NOSCRIPT = @"
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=$GTM_CONTAINER_ID"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    
"@

# GTM config script
$GTM_CONFIG_SCRIPT = @"
    <!-- Google Tag Manager Configuration -->
    <script src="gtm-config.js"></script>
    
"@

# Find all HTML files
$htmlFiles = Get-ChildItem -Filter "*.html" | Select-Object -ExpandProperty Name

if ($htmlFiles.Count -eq 0) {
    Write-Host "❌ No HTML files found in current directory" -ForegroundColor Red
    exit
}

# Files that already have GTM
$gtmFiles = @("index.html", "porduct.html", "Contact.html", "product-in.html")

# Files that need GTM
$filesToUpdate = $htmlFiles | Where-Object { $_ -notin $gtmFiles }

if ($filesToUpdate.Count -eq 0) {
    Write-Host "✅ All HTML files already have GTM implemented!" -ForegroundColor Green
    exit
}

Write-Host "📄 Found $($htmlFiles.Count) HTML files" -ForegroundColor Cyan
Write-Host "✅ $($gtmFiles.Count) files already have GTM" -ForegroundColor Green
Write-Host "🔄 $($filesToUpdate.Count) files need GTM added" -ForegroundColor Yellow
Write-Host ""

$updatedCount = 0

foreach ($htmlFile in $filesToUpdate) {
    Write-Host "📄 Processing $htmlFile..." -ForegroundColor Cyan
    
    try {
        # Read file content
        $content = Get-Content $htmlFile -Raw -Encoding UTF8
        
        # Check if GTM is already present
        if ($content -match "Google Tag Manager") {
            Write-Host "  ⚠️  GTM already present in $htmlFile" -ForegroundColor Yellow
            continue
        }
        
        # Add GTM head snippet before </head>
        $headEnd = $content.IndexOf("</head>")
        if ($headEnd -ne -1) {
            $content = $content.Substring(0, $headEnd) + $GTM_HEAD_SNIPPET + $content.Substring($headEnd)
        }
        
        # Add GTM noscript fallback after <body> tag
        $bodyMatch = [regex]::Match($content, '<body[^>]*>')
        if ($bodyMatch.Success) {
            $bodyEnd = $bodyMatch.Index + $bodyMatch.Length
            $content = $content.Substring(0, $bodyEnd) + "`n" + $GTM_NOSCRIPT + $content.Substring($bodyEnd)
        }
        
        # Add GTM config script before </body>
        $bodyClose = $content.LastIndexOf("</body>")
        if ($bodyClose -ne -1) {
            $content = $content.Substring(0, $bodyClose) + $GTM_CONFIG_SCRIPT + $content.Substring($bodyClose)
        }
        
        # Write back to file
        Set-Content $htmlFile -Value $content -Encoding UTF8
        
        Write-Host "  ✅ Added GTM to $htmlFile" -ForegroundColor Green
        $updatedCount++
        
    } catch {
        Write-Host "  ❌ Error updating $htmlFile : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "🎉 GTM implementation complete!" -ForegroundColor Green
Write-Host "✅ Successfully added GTM to $updatedCount out of $($filesToUpdate.Count) files" -ForegroundColor Green

if ($updatedCount -lt $filesToUpdate.Count) {
    Write-Host "⚠️  Some files may have encountered issues during update" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify GTM is working in all files" -ForegroundColor White
Write-Host "2. Test your GTM implementation" -ForegroundColor White
Write-Host "3. Publish your GTM container" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed setup instructions, see: GTM-SETUP-GUIDE.md" -ForegroundColor Cyan

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
