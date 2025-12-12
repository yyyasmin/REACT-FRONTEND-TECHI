
// FILE: src_files.py
import os

# Root folder to start scanning
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
# Folder to save the collected files
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'CollectedFiles')

# Create the output folder if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

def collect_folder_files(folder_path):
    """Collect all files in a folder (not subfolders) and write to one .js file"""
    folder_name = os.path.basename(folder_path)
    output_file = os.path.join(OUTPUT_DIR, f"{folder_name}.js")

    with open(output_file, 'w', encoding='utf-8') as out_f:
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)
            # Only files, ignore subfolders
            if os.path.isfile(item_path):
                out_f.write(f"\n// FILE: {item}\n")
                with open(item_path, 'r', encoding='utf-8', errors='ignore') as f:
                    out_f.write(f.read())
                    out_f.write("\n\n")

def scan_tree(root_dir):
    """Scan the tree starting from root_dir and process each folder"""
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Only include folders inside src
        if os.path.commonpath([ROOT_DIR, dirpath]) == ROOT_DIR:
            collect_folder_files(dirpath)

if __name__ == "__main__":
    scan_tree(ROOT_DIR)
    print(f"All files collected in '{OUTPUT_DIR}'")


