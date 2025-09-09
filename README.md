# 🎬 Movie Recommender System

A modern, AI-powered movie recommendation system built with Flask and machine learning. Get personalized movie recommendations and detailed insights including cast information, reviews, and ratings.

![Movie Recommender Demo](net%20screenshot.png)

## ✨ Features

- **Smart Recommendations**: Content-based filtering using movie features
- **Sentiment Analysis**: AI-powered review sentiment classification
- **Rich Movie Details**: Cast information, ratings, release dates, and more
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Secure API Integration**: Environment-based configuration for API keys

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/movie-recommender.git
   cd movie-recommender
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your TMDB API key
   TMDB_API_KEY=your_api_key_here
   ```

4. **Run the application**
   ```bash
   python main.py
   ```

5. **Open your browser** and navigate to `http://localhost:5000`

## 🎯 How to Get Your TMDB API Key

1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Go to **Settings** → **API**
4. Request an API key (it's free!)
5. Copy your API key to the `.env` file

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
TMDB_API_KEY=your_tmdb_api_key_here

# Optional
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000

# Note: SECRET_KEY is optional for this application
```

### Project Structure

```
movie-recommender/
├── main.py                 # Flask application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── Profile               # Deployment configuration
├── data/                 # Dataset files
│   └── main_data.csv     # Movie features data
├── models/               # ML models
│   ├── nlp_model.pkl     # Sentiment analysis model
│   └── transform.pkl     # Text vectorizer
├── static/               # CSS, JS, images
│   ├── style.css         # Stylesheet
│   ├── recommend.js      # Frontend logic
│   └── autocomplete.js   # Search suggestions
├── templates/            # HTML templates
│   ├── home.html         # Main page
│   └── recommend.html    # Results page
└── datasets/             # Raw data files
```

## 🤖 Machine Learning

### Recommendation Algorithm
- **Content-Based Filtering**: Uses movie features like genre, director, cast
- **Cosine Similarity**: Measures similarity between movies
- **TF-IDF Vectorization**: Converts text features to numerical vectors

### Sentiment Analysis
- **Model**: Trained on movie review data
- **Features**: Bag-of-words with TF-IDF weighting
- **Output**: Classifies reviews as positive or negative

## 🎨 UI Features

- **Modern Design**: Gradient backgrounds with neon blue theme
- **Smooth Animations**: Hover effects and transitions
- **Autocomplete Search**: Real-time movie suggestions
- **Responsive Layout**: Mobile-friendly design
- **Loading States**: Visual feedback during API calls

## 🔒 Security

- ✅ API keys stored in environment variables
- ✅ Server-side API calls (keys never exposed to client)
- ✅ Input validation and error handling
- ✅ Secure session configuration

## 🚀 Deployment

### Heroku Deployment

1. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set TMDB_API_KEY=your_api_key_here
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "main:app"]
```

## 📊 Dataset

The recommendation system uses a curated dataset containing:
- **Movie titles** and metadata
- **Director and cast** information  
- **Genre** classifications
- **Combined features** for similarity matching

## 🐛 Troubleshooting

### Common Issues

1. **"TMDB API key not configured"**
   - Make sure your `.env` file exists and contains `TMDB_API_KEY`

2. **"No module named 'sklearn'"**
   - Install dependencies: `pip install -r requirements.txt`

3. **Movies not loading**
   - Check your internet connection
   - Verify your TMDB API key is valid

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [Flask](https://flask.palletsprojects.com/) for the web framework
- [Scikit-learn](https://scikit-learn.org/) for machine learning tools
