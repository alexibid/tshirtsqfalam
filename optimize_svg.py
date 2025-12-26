import sys
import re
import xml.etree.ElementTree as ET

def get_path_bbox(d):
    # Basic parser for absolute M and L commands which seem to populate these specific files
    # This is not a full SVG path parser, but sufficient for the specific "M x,y L x,y ..." format seen in the user's file.
    # The user's file has "M x,y x,y x,y ..." which is actually implicit Ls? 
    # Let's look at the file content again: "M 715.0,895.5 714.0,895.5 ..."
    # Yes, SVG allows multiple coordinate pairs after M, where subsequent ones are treated as L.
    
    # Regex to find all numbers
    numbers = re.findall(r"[-+]?\d*\.?\d+", d)
    coords = [float(n) for n in numbers]
    
    if not coords:
        return None

    xs = coords[0::2]
    ys = coords[1::2]
    
    min_x = min(xs)
    max_x = max(xs)
    min_y = min(ys)
    max_y = max(ys)
    
    return (min_x, min_y, max_x - min_x, max_y - min_y)

def optimize_svg(file_path):
    print(f"Processing {file_path}...")
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        # Combine all paths to find the total bounding box
        all_xs = []
        all_ys = []
        
        # Determine namespace
        ns = {'svg': 'http://www.w3.org/2000/svg'}
        
        paths = root.findall(".//svg:path", ns)
        if not paths:
            # Try without namespace if it fails
            paths = root.findall(".//path")
            
        for path in paths:
            d = path.get('d')
            if d:
                # Simplified parsing logic for the specific Polyline-like paths
                # The files shown generally use "M x,y x,y ..." structure
                floats = [float(n) for n in re.findall(r"[-+]?\d*\.?\d+", d)]
                if floats:
                    all_xs.extend(floats[0::2])
                    all_ys.extend(floats[1::2])
        
        if not all_xs:
            print("No path data found.")
            return

        min_x = min(all_xs)
        max_x = max(all_xs)
        min_y = min(all_ys)
        max_y = max(all_ys)
        
        width = max_x - min_x
        height = max_y - min_y
        
        # Update ViewBox. We use a small padding (e.g. 0.5% or 0) ? User said "integralmente" (fully).
        # Let's use 0 padding for "limits" but strict float precision might need slight rounding.
        # Let's round to 2 decimal places.
        
        # Adjust ViewBox
        new_viewbox = f"{min_x:.2f} {min_y:.2f} {width:.2f} {height:.2f}"
        print(f"New ViewBox: {new_viewbox}")
        
        root.set('viewBox', new_viewbox)
        root.set('width', '100%')
        root.set('height', '100%')
        
        # Save
        tree.write(file_path, encoding='UTF-8', xml_declaration=True)
        print("Saved.")
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python optimize_svg.py <file1> <file2> ...")
        sys.exit(1)
        
    for f in sys.argv[1:]:
        optimize_svg(f)
