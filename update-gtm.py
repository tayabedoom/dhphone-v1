#!/usr/bin/env python3
"""
Google Tag Manager Update Script for DH Phone
This script helps update all HTML files with your actual GTM container ID.
"""

import os
import re
import sys

def update_gtm_in_file(file_path, old_container_id, new_container_id):
    """Update GTM container ID in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Count occurrences
        old_count = content.count(old_container_id)
        if old_count == 0:
            print(f"  ⚠️  No GTM container ID found in {file_path}")
            return False
        
        # Replace all occurrences
        new_content = content.replace(old_container_id, new_container_id)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        
        print(f"  ✅ Updated {old_count} occurrences in {file_path}")
        return True
        
    except Exception as e:
        print(f"  ❌ Error updating {file_path}: {e}")
        return False

def main():
    print("🚀 Google Tag Manager Container ID Update Script")
    print("=" * 50)
    
    # Get the new container ID from user
    new_container_id = input("Enter your GTM container ID (e.g., GTM-ABC12345): ").strip()
    
    if not new_container_id or not new_container_id.startswith('GTM-'):
        print("❌ Invalid container ID. Must start with 'GTM-'")
        sys.exit(1)
    
    old_container_id = "GTM-XXXXXXX"
    
    print(f"\n🔄 Updating all HTML files from '{old_container_id}' to '{new_container_id}'...")
    print()
    
    # Find all HTML files
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    if not html_files:
        print("❌ No HTML files found in current directory")
        sys.exit(1)
    
    updated_count = 0
    total_files = len(html_files)
    
    for html_file in html_files:
        print(f"📄 Processing {html_file}...")
        if update_gtm_in_file(html_file, old_container_id, new_container_id):
            updated_count += 1
    
    print("\n" + "=" * 50)
    print(f"🎉 Update complete! Updated {updated_count} out of {total_files} files.")
    
    if updated_count < total_files:
        print("⚠️  Some files may not have contained GTM container IDs.")
    
    print(f"\n📋 Next steps:")
    print(f"1. Verify the updates in your HTML files")
    print(f"2. Test your GTM implementation")
    print(f"3. Publish your GTM container")
    print(f"\n📚 For detailed setup instructions, see: GTM-SETUP-GUIDE.md")

if __name__ == "__main__":
    main()
