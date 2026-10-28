
import hashlib
import os
import time
from contextlib import asynccontextmanager
from io import BytesIO
from typing import List

import imagehash
import numpy as np
from PIL import Image, ImageFilter
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# CONFIGURATION
# ============================================================

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB
PORT = int(os.getenv("PORT", "8001"))

AI_TAG_KEYWORDS = [
    "prompt", "negative_prompt", "steps", "sampler", "cfg_scale",
    "seed", "model_hash", "midjourney", "dall-e", "stablediffusion",
    "comfyui", "novelai", "invokeai", "adobe firefly", "flux.1",
    "parameters",
]


# ============================================================
# MEMORY-SAFE STARTUP
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Do not load the memory-heavy vision model on Render.
    app.state.ai_processor = None
    app.state.ai_model = None
    app.state.ai_device = "cpu"
    app.state.ai_model_ready = False

    print(f"Starting TraceAI Backend on cpu (Port: {PORT})...")
    print("Vision model disabled to reduce memory usage.")
    print("Heuristic image analysis is enabled.")

    yield

    print("TraceAI backend shutting down.")


# ============================================================
# FASTAPI APPLICATION & CORS
# ============================================================

app = FastAPI(
    title="TraceAI Forensic Engine",
    version="2.9.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# IMAGE FORENSIC HELPERS
# ============================================================

def compute_cv_metrics(image: Image.Image):
    """Calculate basic texture, edge, and color metrics."""

    gray = image.convert("L").resize((512, 512))

    laplacian = gray.filter(
        ImageFilter.Kernel(
            (3, 3),
            [0, 1, 0, 1, -4, 1, 0, 1, 0],
            scale=1,
        )
    )

    lap_arr = np.array(laplacian, dtype=np.float32)
    laplacian_variance = float(np.var(lap_arr))

    edges = gray.filter(ImageFilter.FIND_EDGES)
    edge_arr = np.array(edges, dtype=np.uint8)

    edge_density = float(
        (np.sum(edge_arr > 40) / edge_arr.size) * 100.0
    )

    rgb_arr = np.array(
        image.convert("RGB").resize((256, 256)),
        dtype=np.float32,
    )

    r = rgb_arr[:, :, 0]
    g = rgb_arr[:, :, 1]
    b = rgb_arr[:, :, 2]

    rg_diff = np.std(r - g)
    yb_diff = np.std(0.5 * (r + g) - b)

    color_spread = float(
        np.sqrt(rg_diff**2 + yb_diff**2)
    )

    return {
        "laplacian_variance": round(laplacian_variance, 2),
        "edge_density_percent": round(edge_density, 2),
        "color_spread": round(color_spread, 2),
    }


def detect_camera_hardware(image: Image.Image) -> bool:
    """Look for camera-related EXIF metadata."""

    try:
        exif = image.getexif()

        if not exif:
            return False

        make = str(exif.get(271, "")).strip().lower()
        model = str(exif.get(272, "")).strip().lower()

        camera_brands = [
            "apple", "samsung", "canon", "nikon", "sony",
            "google", "fujifilm", "xiaomi", "huawei",
        ]

        if any(
            brand in make or brand in model
            for brand in camera_brands
        ):
            return True

        sub = exif.get_ifd(34665)

        return any(
            key in sub
            for key in [33434, 33437, 34855, 37386]
        )

    except Exception:
        return False


def detect_ai_generator_tags(info: dict, image: Image.Image) -> bool:
    """Check image metadata for common AI-generation keywords."""

    text_info = " ".join(
        f"{key} {value}" for key, value in (info or {}).items()
    ).lower()

    if any(keyword in text_info for keyword in AI_TAG_KEYWORDS):
        return True

    try:
        exif = image.getexif()

        if exif:
            description = str(exif.get(270, "")).lower()
            software = str(exif.get(305, "")).lower()

            if any(
                keyword in description or keyword in software
                for keyword in AI_TAG_KEYWORDS
            ):
                return True

    except Exception:
        pass

    return False


def compute_spectral_fft_anomaly(image: Image.Image) -> float:
    """Calculate a frequency-domain image metric."""

    try:
        gray = image.convert("L").resize((256, 256))
        arr = np.array(gray, dtype=np.float32)

        f_shift = np.fft.fftshift(np.fft.fft2(arr))
        magnitude = 20 * np.log(np.abs(f_shift) + 1e-9)

        magnitude[113:143, 113:143] = 0
        outer = magnitude[30:226, 30:226]

        ratio = float(np.max(outer)) / (
            float(np.mean(outer)) + 1e-9
        )

        if ratio > 3.7:
            return min(1.0, (ratio - 3.4) / 2.0)

        return 0.0

    except Exception:
        return 0.0


# ============================================================
# IMAGE ANALYSIS
# ============================================================

def run_decisive_forensics(image: Image.Image, info: dict):
    has_ai_metadata = detect_ai_generator_tags(info, image)
    has_camera_hardware = detect_camera_hardware(image)

    cv_metrics = compute_cv_metrics(image)
    fft_score = compute_spectral_fft_anomaly(image)

    # No trained vision model is loaded in this memory-safe version.
    model_score = None

    if has_ai_metadata:
        ai_percent = 97.0
        verdict = "Likely AI Generated or Deepfake"

    elif has_camera_hardware:
        ai_percent = 8.0
        verdict = "Likely Real Media"

    else:
        # These are heuristic signals, not proof of AI generation.
        heuristic_ai = 0.5

        if cv_metrics["laplacian_variance"] < 9.0:
            heuristic_ai += 0.20
        elif cv_metrics["laplacian_variance"] > 25.0:
            heuristic_ai -= 0.20

        if fft_score > 0.3:
            heuristic_ai += 0.15

        calibrated = float(
            np.clip(heuristic_ai, 0.08, 0.92)
        )

        ai_percent = round(calibrated * 100.0, 1)

        # Avoid claiming certainty from image heuristics alone.
        verdict = (
            "Possible AI-Generated Media"
            if ai_percent >= 65
            else "Inconclusive - Requires Verification"
        )

    score = int(round(ai_percent))

    print(
        f"[TRACEAI SCAN] Score: {score}% | "
        f"Verdict: {verdict}"
    )

    return {
        "score": score,
        "ai_generated_percent": ai_percent,
        "verdict": verdict,
        "cv_metrics": cv_metrics,
        "prediction": (
            "FAKE" if ai_percent >= 65
            else "UNCERTAIN"
        ),
        "model_confidence_percent": None,
    }


# ============================================================
# API ENDPOINTS
# ============================================================

@app.get("/")
@app.get("/api/health")
def health():
    return {
        "status": "online",
        "service": "TraceAI Forensic Backend",
        "port": PORT,
        "image_model_ready": False,
        "analysis_mode": "memory_safe_heuristics",
        "message": (
            "Backend is online. Trained AI image detection "
            "is currently disabled."
        ),
    }


@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    content = await file.read(MAX_FILE_SIZE + 1)

    if not content or len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Invalid file size or empty upload.",
        )

    try:
        uploaded_image = Image.open(BytesIO(content))
        raw_info = dict(uploaded_image.info)
        image = uploaded_image.convert("RGB")
        image.load()

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Cannot decode image. Please upload a valid image.",
        )

    result = run_decisive_forensics(image, raw_info)

    # Illustrative UI timeline only; it is not verified provenance.
    journey = [
        {
            "type": "Image Analysis",
            "date": time.strftime("%b %d, %Y • %I:%M %p"),
            "platform": "TraceAI Forensic Engine",
            "badge": "Heuristic Analysis",
            "summary": (
                "Image metadata and visual metrics were examined. "
                "No verified upload history or source chain is available."
            ),
            "mark": "ANALYSIS",
        }
    ]

    return {
        "success": True,
        "filename": file.filename or "media",
        "score": result["score"],
        "ai_generated_percent": result["ai_generated_percent"],
        "verdict": result["verdict"],
        "cv_metrics": result["cv_metrics"],
        "journey": journey,
        "ai_detection": {
            "prediction": result["prediction"],
            "model_confidence_percent": None,
            "class_scores_percent": {
                "FAKE": result["ai_generated_percent"],
                "REAL": round(
                    100.0 - result["ai_generated_percent"], 1
                ),
            },
        },
        "fingerprints": {
            "sha256": hashlib.sha256(content).hexdigest(),
            "phash": str(imagehash.phash(image, hash_size=8)),
        },
    }


# ============================================================
# TAKEDOWN BROADCAST ENDPOINT
# ============================================================

class TakedownPayload(BaseModel):
    report_id: str
    file_name: str
    image_hash: str
    platforms: List[str]
    ai_score: int
    verdict: str


@app.post("/api/takedown/broadcast")
async def takedown_broadcast(payload: TakedownPayload):
    # This creates simulated receipts; it does not contact platforms.
    receipts = [
        {
            "platform": platform,
            "receipt_id": (
                f"RPT-{platform.upper()}-"
                f"{hashlib.md5(
                    f'{platform}{time.time()}'.encode()
                ).hexdigest()[:6].upper()}"
            ),
            "timestamp": time.strftime("%I:%M %p"),
            "action_taken": (
                "Demo receipt generated. No report was submitted "
                "to the platform."
            ),
        }
        for platform in payload.platforms
    ]

    return {
        "success": True,
        "receipts": receipts,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=False,
    )
