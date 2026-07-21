Add-Type -AssemblyName System.Drawing

$assetsDir = "c:\Users\varad_0kfzvy3\OneDrive\Desktop\Mobility\Mobility-Platform\roadmate\apps\customer-app\assets"

# icon.png (1024x1024)
$bmp = New-Object System.Drawing.Bitmap(1024,1024)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(59,130,246))
$g.Dispose()
$bmp.Save("$assetsDir\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

# splash.png (1284x2778)
$bmp = New-Object System.Drawing.Bitmap(1284,2778)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.Dispose()
$bmp.Save("$assetsDir\splash.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

# adaptive-icon.png (1024x1024)
$bmp = New-Object System.Drawing.Bitmap(1024,1024)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(59,130,246))
$g.Dispose()
$bmp.Save("$assetsDir\adaptive-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

# favicon.png (48x48)
$bmp = New-Object System.Drawing.Bitmap(48,48)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(59,130,246))
$g.Dispose()
$bmp.Save("$assetsDir\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "All asset images created successfully."
