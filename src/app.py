from pathlib import Path
from flask import Flask, render_template, request, jsonify
import sys
sys.path.append(str(Path(__file__).resolve().parent))
from model_utils import HybridRecommender

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "models" / "hybrid_model.pkl"

app = Flask(__name__)
recommender = HybridRecommender.load(MODEL) if MODEL.exists() else None

@app.route("/")
def index():
    users = sorted(recommender.ratings.user_id.unique()) if recommender else []
    return render_template("index.html", users=users)

@app.route("/recommend", methods=["POST"])
def recommend():
    if recommender is None:
        return jsonify({"error": "Train the model first."}), 400
    data = request.get_json()
    user_id = int(data["user_id"])
    n = int(data.get("n", 10))
    recs = recommender.recommend(user_id, n)
    return jsonify(recs[["item_id", "title", "predicted_rating"]].to_dict("records"))

@app.route("/predict", methods=["POST"])
def predict():
    if recommender is None:
        return jsonify({"error": "Train the model first."}), 400
    data = request.get_json()
    score = recommender.predict(int(data["user_id"]), int(data["item_id"]))
    return jsonify({"predicted_rating": round(float(score), 3)})

@app.route("/feedback", methods=["POST"])
def feedback():
    # Demo feedback endpoint. Production systems should persist this
    # event in a database/message queue and trigger incremental retraining.
    data = request.get_json()
    return jsonify({
        "status": "accepted",
        "message": "Feedback received for future model updates.",
        "event": data
    })

if __name__ == "__main__":
    app.run(debug=True)
