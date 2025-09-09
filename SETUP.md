# 🎬 Movie Recommender System

A modern, AI-powered movie recommendation system with a beautiful Twitch-inspired purple gradient theme.

## ✨ Features

- **Smart Recommendations**: Content-based filtering using machine learning
- **Real-time Search**: Autocomplete movie search with 6000+ movies
- **Movie Details**: Complete information from TMDB API including cast, ratings, and reviews
- **Sentiment Analysis**: AI-powered review sentiment analysis
- **Modern UI**: Beautiful purple gradient theme with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Get TMDB API Key
1. Visit [The Movie Database API](https://www.themoviedb.org/settings/api)
2. Create an account and request an API key
3. Copy your API key

### 3. Configure Environment
Edit the `.env` file and add your API key:
```env
TMDB_API_KEY=your_actual_api_key_here
```

### 4. Run the Application
```bash
python main.py
```

Visit [http://localhost:5000](http://localhost:5000) to start exploring movies!

## 🛠️ Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **ML**: Scikit-learn for recommendations and sentiment analysis
- **APIs**: TMDB for movie data, IMDB for reviews
- **Styling**: Custom CSS with CSS Grid and Flexbox

## 📱 How It Works

1. **Search**: Type a movie name in the search bar
2. **Select**: Choose from autocomplete suggestions
3. **Discover**: Get 10 similar movie recommendations
4. **Explore**: View detailed information, cast, and reviews
5. **Continue**: Click any recommended movie to get more suggestions

## 🔧 Project Structure

```
movie-recommender/
├── static/
│   ├── style.css           # Modern purple theme
│   ├── recommend.js        # Frontend logic
│   └── autocomplete.js     # Search functionality
├── templates/
│   ├── home.html          # Landing page
│   └── recommend.html     # Results page
├── data/
│   └── main_data.csv      # Movie dataset
├── models/
│   ├── nlp_model.pkl      # Sentiment analysis
│   └── transform.pkl      # Text vectorizer
├── main.py                # Flask application
├── requirements.txt       # Dependencies
└── .env                   # Environment variables
```

## 🌟 Color Palette

```css
Primary Purple: #9146ff
Secondary Purple: #772ce8
Dark Purple: #5c16c5
Light Purple: #bf94ff
Accent Purple: #a970ff
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📄 License

This project is open source and available under the MIT License.