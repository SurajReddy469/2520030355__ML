from pathlib import Path
from zipfile import ZipFile
import requests

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)

url = "https://files.grouplens.org/datasets/movielens/ml-100k.zip"
zip_path = DATA / "ml-100k.zip"
extract_dir = DATA / "ml-100k"

if not extract_dir.exists():
    print("Downloading MovieLens 100K...")
    try:
        r = requests.get(url, timeout=60)
        r.raise_for_status()
        with open(zip_path, "wb") as f:
            f.write(r.content)
    except Exception as e:
        print(f"Direct download failed: {e}")
        raise e

    print("Extracting...")
    with ZipFile(zip_path) as z:
        z.extractall(DATA)
    print(f"Dataset ready: {extract_dir}")
else:
    print("Dataset already exists.")
