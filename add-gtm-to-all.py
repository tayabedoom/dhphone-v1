#!/usr/bin/env python3
"""
Add Google Tag Manager to All HTML Files
This script adds GTM container snippet and noscript fallback to all HTML files.
"""

import os
import re

# GTM container ID
GTM_CONTAINER_ID = 'GTM-P2PWNTT3'

# GTM head snippet
GTM_HEAD_SNIPPET = f'''    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
    new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    }})(window,document,'script','dataLayer','{GTM_CONTAINER_ID}');</script>
    <!-- End Google Tag Manager -->

'''

# GTM noscript fallback
GTM_NOSCRIPT = f'''    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={GTM_CONTAINER_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    
'''

# GTM config script
GTM_CONFIG_SCRIPT = '''    <!-- Google Tag Manager Configuration -->
    <script src="gtm-config.js"></script>
    
'''

def add_gtm_to_file(file_path):
    """Add GTM to a single HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Check if GTM is already present
        if 'Google Tag Manager' in content:
            print(f"  ⚠️  GTM already present in {file_path}")
            return False
        
        # Add GTM head snippet after the first script tag or link tag
        head_pattern = r'(<script[^>]*src[^>]*>|</script>|</head>)'
        if re.search(head_pattern, content):
            # Find a good insertion point in head
            insertion_point = None
            
            # Try to find after the last link tag
            link_match = re.search(r'(<link[^>]*>)(?!.*<link)', content)
            if link_match:
                insertion_point = link_match.end()
            
            # If no link tag, try after the last script tag in head
            if not insertion_point:
                script_match = re.search(r'(<script[^>]*>)(?!.*<script.*</head>)', content)
                if script_match:
                    insertion_point = script_match.end()
            
            # If still no insertion point, add before </head>
            if not insertion_point:
                head_end = content.find('</head>')
                if head_end != -1:
                    insertion_point = head_end
            
            if insertion_point:
                content = content[:insertion_point] + '\n' + GTM_HEAD_SNIPPET + content[insertion_point:]
            else:
                print(f"  ❌ Could not find insertion point in head for {file_path}")
                return False
        
        # Add GTM noscript fallback after <body> tag
        body_pattern = r'(<body[^>]*>)'
        body_match = re.search(body_pattern, content)
        if body_match:
            body_end = body_match.end()
            content = content[:body_end] + '\n' + GTM_NOSCRIPT + content[body_end:]
        else:
            print(f"  ❌ Could not find body tag in {file_path}")
            return False
        
        # Add GTM config script before closing body tag
        body_close = content.rfind('</body>')
        if body_close != -1:
            # Try to find a good insertion point before </body>
            insertion_point = body_close
            
            # Look for existing scripts before </body>
            script_pattern = r'(<script[^>]*>.*?</script>)(?!.*<script)'
            script_match = re.search(script_pattern, content, re.DOTALL)
            if script_match:
                insertion_point = script_match.end()
            
            content = content[:insertion_point] + '\n' + GTM_CONFIG_SCRIPT + content[insertion_point:]
        else:
            print(f"  ❌ Could not find closing body tag in {file_path}")
            return False
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        
        print(f"  ✅ Added GTM to {file_path}")
        return True
        
    except Exception as e:
        print(f"  ❌ Error updating {file_path}: {e}")
        return False

def main():
    print("🚀 Adding Google Tag Manager to All HTML Files")
    print("=" * 55)
    print(f"GTM Container ID: {GTM_CONTAINER_ID}")
    print()
    
    # Find all HTML files
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    if not html_files:
        print("❌ No HTML files found in current directory")
        return
    
    # Files that already have GTM
    gtm_files = ['index.html', 'porduct.html', 'Contact.html', 'product-in.html']
    
    # Files that need GTM
    files_to_update = [f for f in html_files if f not in gtm_files]
    
    if not files_to_update:
        print("✅ All HTML files already have GTM implemented!")
        return
    
    print(f"📄 Found {len(html_files)} HTML files")
    print(f"✅ {len(gtm_files)} files already have GTM")
    print(f"🔄 {len(files_to_update)} files need GTM added")
    print()
    
    updated_count = 0
    
    for html_file in files_to_update:
        print(f"📄 Processing {html_file}...")
        if add_gtm_to_file(html_file):
            updated_count += 1
    
    print("\n" + "=" * 55)
    print(f"🎉 GTM implementation complete!")
    print(f"✅ Successfully added GTM to {updated_count} out of {len(files_to_update)} files")
    
    if updated_count < len(files_to_update):
        print("⚠️  Some files may have encountered issues during update")
    
    print(f"\n📋 Next steps:")
    print(f"1. Verify GTM is working in all files")
    print(f"2. Test your GTM implementation")
    print(f"3. Publish your GTM container")
    print(f"\n📚 For detailed setup instructions, see: GTM-SETUP-GUIDE.md")

if __name__ == "__main__":
    main()
