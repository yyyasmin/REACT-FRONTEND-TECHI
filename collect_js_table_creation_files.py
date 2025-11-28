import os

# Paths you provided
BASE = r"C:\Users\Yair Amran\Documents\שיבולים\react-frontend-techi\src"
OUTPUT_FILE = "table_components_dump.js"

# Files/folders we want to include
TARGETS = [
    "components/TableSection.js",
    "components/tables/AddRowBtn.js",
    "components/tables/HorizontalTable.js",
    "components/tables/VerticalTable.js",
    "components/tables/cells",
    "components/tables/cells/CheckboxCell.js",
    "components/tables/cells/DateCell.js",
    "components/tables/cells/DropdownCell.js",
    "components/tables/cells/HandleCell.js",
    "components/tables/cells/LongTextCell.js",
    "components/tables/cells/TextCell.js"
]

def collect_files():
    collected_paths = []

    for target in TARGETS:
        full_path = os.path.join(BASE, target)

        if os.path.isdir(full_path):
            # collect all JS files in this folder
            for filename in os.listdir(full_path):
                if filename.endswith(".js"):
                    collected_paths.append(os.path.join(full_path, filename))
        else:
            if os.path.exists(full_path):
                collected_paths.append(full_path)

    return collected_paths


def write_output(collected_paths):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for path in collected_paths:
            out.write("\n" + "="*80 + "\n")
            out.write(f"// FILE: {path}\n")
            out.write("="*80 + "\n\n")

            try:
                with open(path, "r", encoding="utf-8") as f:
                    out.write(f.read())
            except Exception as e:
                out.write(f"// ERROR reading file: {e}\n")

    print(f"\nDone! File created:\n{os.path.abspath(OUTPUT_FILE)}")


if __name__ == "__main__":
    paths = collect_files()
    write_output(paths)
