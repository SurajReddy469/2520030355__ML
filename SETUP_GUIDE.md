# RecomMind — Complete Setup & Run Guide (Windows / Linux / macOS)

Follow this step-by-step guide to run the **RecomMind** application locally.

---

## 1. Prerequisites

- **Python 3.10+** (Tested with Python 3.12.7)
- **Node.js 18+** & **npm** (Tested with Node v22 / npm)
- **Git** (optional)

Verify your installations in PowerShell or Terminal:
```powershell
python --version
node --version
npm --version
```

---

## 2. Backend Setup & Startup

1. Open a PowerShell terminal and navigate to the project root:
   ```powershell
   cd "C:\Users\Ch.Suraj Reddy\.gemini\antigravity\scratch\RecomMind"
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

3. Install required Python packages:
   ```powershell
   pip install -r requirements.txt
   ```

4. Download the MovieLens 100K dataset and preprocess it:
   ```powershell
   python src/download_data.py
   python src/preprocess.py
   ```

5. Train the hybrid recommendation and preference models:
   ```powershell
   python src/train.py
   ```
   *This outputs `models/hybrid_model.pkl` and `models/preference_model.pkl`.*

6. Start the FastAPI backend server:
   ```powershell
   uvicorn src.api:app --reload --host 127.0.0.1 --port 8000
   ```
   *The backend will be live at `http://127.0.0.1:8000`. You can test documentation at `http://127.0.0.1:8000/docs`.*

---

## 3. Frontend Setup & Startup

1. Open a second PowerShell terminal and navigate to the `frontend/` directory:
   ```powershell
   cd "C:\Users\Ch.Suraj Reddy\.gemini\antigravity\scratch\RecomMind\frontend"
   ```

2. Ensure environment configuration exists (defaults to `http://127.0.0.1:8000`):
   ```powershell
   # If .env does not exist, copy from .env.example
   Copy-Item .env.example .env
   ```

3. Install frontend dependencies:
   ```powershell
   npm install
   ```

4. Start the Vite development server:
   ```powershell
   npm run dev
   ```

5. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 4. Production Build (Frontend)

To build and preview the optimized production bundle:
```powershell
cd frontend
npm run build
npm run preview
```

---

## 5. Troubleshooting Common Issues

- **CORS Errors**: The backend has CORS enabled for `http://localhost:5173` and `http://127.0.0.1:5173`. Make sure the frontend runs on port 5173.
- **Model Not Loaded (503)**: Ensure you ran `python src/train.py` before querying the `/recommend` endpoint.
- **SSL Certificate Failure on Dataset Download**: The downloader uses the system certificate store to verify HTTPS. If your network uses a corporate proxy, configure its trusted certificate in Windows rather than disabling certificate checks.
