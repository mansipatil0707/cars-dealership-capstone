"""Flask microservice that returns the sentiment of a piece of text using NLTK VADER."""
import os

import nltk
from flask import Flask, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download("vader_lexicon", quiet=True)

app = Flask("Sentiment Analyzer")
sia = SentimentIntensityAnalyzer()


@app.route("/")
def home():
    return "Welcome to the Sentiment Analyzer. Use /analyze/text to get the sentiment"


@app.route("/analyze/<input_txt>")
def analyze_sentiment(input_txt):
    scores = sia.polarity_scores(input_txt)
    compound = scores["compound"]
    if compound >= 0.05:
        sentiment = "positive"
    elif compound <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return jsonify({"sentiment": sentiment})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5050)))
