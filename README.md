# NorthStar Daily QC Logger PWA

NorthStar Daily QC Logger is a browser-based iPhone/laptop app for concrete QA/QC field documentation.

It lets a QC technician:

- Start a Daily QC Concrete Report.
- Take or upload NorthStar Concrete ticket photos.
- Extract visible ticket values with free OCR where possible.
- Verify and edit every field before saving.
- Enter actual QC test values: slump, air, concrete temperature, ambient temperature, cylinders, and remarks.
- Save each truck/load to a daily log.
- Capture signatures.
- Export a professional PDF and Excel-compatible CSV report.

Most important rule:

```text
Wrong autofill is worse than VERIFY.
```

If OCR or AI is unsure, the app marks fields as `VERIFY`. Manual entry always works.

## Current Features

- Next.js 14 PWA with React, TypeScript, and Tailwind CSS
- iPhone Safari camera/photo upload
- IndexedDB local persistence so reports survive refresh
- Ticket photo compression before storage
- Local browser OCR with Tesseract.js
- FastAPI backend Template OCR using OpenCV + PaddleOCR when available
- Tesseract/pytesseract backend fallback
- Strict NorthStar ticket parser and validation rules
- OCR review panel with confidence, source, candidates, and VERIFY state
- Diagnostics panel for backend/OCR/AI status
- Pass / Fail / VERIFY calculations
- Cylinder sample IDs and lid-writing suggestions
- QC and site representative signatures
- PDF export
- CSV export for Excel
- Optional paid AI Vision backup only

## Recommended Workflow

Use this order in the field:

1. **Template OCR Extract** - best free path for NorthStar tickets when the FastAPI backend is running.
2. **Guided Zone Extract** - browser fallback using cropped zones.
3. **Local OCR Extract** - browser Tesseract.js fallback.
4. **Manual Entry Mode** - always available.
5. **AI Extract Ticket** - optional backup only if you configure a paid API key.

The app is designed so paid OpenAI Vision is not required.

## Install Frontend

Open PowerShell in this folder:

```powershell
cd C:\Users\PC\Documents\Codex\2026-07-04\you-are-an-elite-ios-engineer\outputs\NorthStarDailyQCPWA
npm install
```

Run the frontend:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

If port 3000 is busy, Next.js may offer another port such as 3001.

## Install Backend

The backend powers **Template OCR Extract**.

Open a second PowerShell terminal:

```powershell
cd C:\Users\PC\Documents\Codex\2026-07-04\you-are-an-elite-ios-engineer\outputs\NorthStarDailyQCPWA\backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If `python` is not recognized, try:

```powershell
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend health check:

```text
http://localhost:8000/api/health
```

## Create `.env.local`

`.env.local` is a plain text file.

Create it beside `package.json`:

```text
NorthStarDailyQCPWA/.env.local
```

It is not JSON. Use simple `KEY=value` lines.

Recommended free OCR setup:

```bash
NEXT_PUBLIC_BACKEND_API_BASE=http://localhost:8000
OCR_PROVIDER=paddleocr
ENABLE_AI_VISION=false
```

Optional AI backup:

```bash
OPENAI_API_KEY=sk-...
VISION_MODEL=gpt-4o-mini
VISION_TIMEOUT_MS=45000
ENABLE_AI_VISION=true
```

Do not commit `.env.local`. API keys must stay server-side.

## Free OCR Mode

Free OCR mode uses:

- FastAPI
- OpenCV preprocessing
- NorthStar fixed template zones
- PaddleOCR as the preferred OCR engine
- Tesseract/pytesseract fallback
- Strict deterministic validation
- VERIFY review screen

Backend provider setting:

```bash
OCR_PROVIDER=paddleocr
```

Other supported values:

```bash
OCR_PROVIDER=tesseract
OCR_PROVIDER=mock
```

If PaddleOCR fails to install or run, the backend falls back to Tesseract when available. If no backend OCR works, the app still supports Guided Zone OCR, Local OCR, and Manual Entry.

## Template OCR

Template OCR uses this configurable file:

```text
backend/app/templates/northstar_concrete_ticket_v1.json
```

A root copy is also available:

```text
templates/northstar_concrete_ticket_v1.json
```

The template defines normalized image size and editable crop zones for:

- date
- order number
- ticket number
- customer name
- delivery address
- delivery instructions
- customer job
- PO number
- truck number
- driver name
- plant
- mix number
- strength
- aggregate size
- cement type
- slump
- air
- load size
- cumulative
- ordered
- product code
- product description
- water added section

Template OCR response includes field value, confidence, status, source region, source OCR text, bounding box, rejected candidates, and rejection reason.

## Optional AI Mode

AI Vision is backup only.

If OpenAI returns `401 incorrect API key`, `429 quota exceeded`, timeout, or a network error, the app shows:

```text
AI extraction unavailable. Use Template OCR, Guided Zone OCR, Local OCR, or Manual Entry.
```

The page does not crash, and manual entry is never blocked.

Set this to disable AI entirely:

```bash
ENABLE_AI_VISION=false
```

## How To Use On Site

1. Start the frontend and backend.
2. Open the app URL.
3. Tap **Start Daily QC Report**.
4. Fill project/pour information and acceptance criteria.
5. Tap **Add Truck / Scan Ticket**.
6. Upload or take a ticket photo.
7. Use **Template OCR Extract** when backend diagnostics show connected.
8. Review every extracted field.
9. Correct anything marked `VERIFY`.
10. Enter actual QC test values: slump, air, concrete temp, ambient temp, cylinders, and remarks.
11. Save the truck.
12. Repeat for each load.
13. Capture signature.
14. Close/export the report.

## Diagnostics Panel

The Add Truck screen includes **Settings / Diagnostics**.

It shows:

- Frontend running
- Backend connected or disconnected
- Active OCR provider
- PaddleOCR available or unavailable
- Tesseract available or unavailable
- AI enabled or disabled
- API key configured yes/no, without showing the key
- Last extraction method
- Last extraction error

If Template OCR says disconnected, start the backend on port 8000 and tap **Refresh Backend Status**.

## Deploy For iPhone Mobile Data

To use the app from an iPhone without staying on laptop Wi-Fi, deploy both frontend and backend to public URLs.

Frontend options:

- Vercel
- Netlify
- Replit

Backend options:

- Render
- Railway
- Fly.io
- Replit

Important:

- In production, `NEXT_PUBLIC_BACKEND_API_BASE` must point to the public backend URL, not `localhost`.
- Example:

```bash
NEXT_PUBLIC_BACKEND_API_BASE=https://northstar-qc-backend.onrender.com
```

iPhone install:

1. Open the deployed frontend URL in Safari.
2. Tap Share.
3. Tap **Add to Home Screen**.

## Troubleshooting

### AI button disabled

This is okay. AI is optional. Use Template OCR, Guided Zone OCR, Local OCR, or Manual Entry.

### 401 incorrect API key

Your OpenAI key is invalid or rejected. Leave AI disabled and use free OCR.

### 429 quota exceeded

Your OpenAI billing/quota limit was reached. Leave AI disabled and use free OCR.

### Template OCR disabled

Check `.env.local`:

```bash
NEXT_PUBLIC_BACKEND_API_BASE=http://localhost:8000
```

Restart `npm run dev` after changing `.env.local`.

### Backend not connected

Start Terminal 2:

```powershell
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then check:

```text
http://localhost:8000/api/health
```

### Python not recognized

Install Python 3.10 or 3.11 and check “Add Python to PATH,” or use:

```powershell
py -m venv .venv
```

### PaddleOCR install problem

PaddleOCR is heavy. If install fails, use:

```bash
OCR_PROVIDER=tesseract
```

or keep using browser **Local OCR Extract** and Manual Entry.

### Local OCR inaccurate

Retake the photo:

- Fill the frame with the whole ticket.
- Avoid glare and shadows.
- Keep the camera parallel.
- Make ticket number, truck number, mix, and load table readable.

### Photo blurry or angled

The app will warn you. Retake if possible, or continue with manual verification.

## Accuracy Improvement Process

For better NorthStar ticket accuracy:

1. Collect 20 to 50 real ticket photos.
2. Save expected JSON next to each photo:

```text
sample_data/northstar_real_tickets/ticket_001.jpg
sample_data/northstar_real_tickets/ticket_001.expected.json
```

Example expected JSON:

```json
{
  "date": "2026-07-02",
  "order_number": "461152",
  "ticket_number": "68553523",
  "truck_number": "59038",
  "driver_name": "KELLY BECKER",
  "mix_number": "NS32A542",
  "load_size_m3": "4.00",
  "cumulative_m3": "13.50",
  "ordered_m3": "24.00"
}
```

3. Tune template zones in `northstar_concrete_ticket_v1.json`.
4. Run tests:

```bash
npm test
```

5. Keep VERIFY behavior conservative.

## Development Commands

Frontend:

```powershell
npm run dev
npm test
npm run typecheck
npm run build
```

Backend:

```powershell
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pytest
```

## Final Field Principle

Target workflow:

```text
95% automatic, 100% verifiable.
```

Template OCR is the best free path for NorthStar tickets. AI is optional backup. Manual verification is mandatory for QC reliability.
