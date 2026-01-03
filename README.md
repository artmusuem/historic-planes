# Historic Military Aircraft Gallery

An interactive gallery showcasing historic military aircraft with filtering, search, and detailed information pages.

**Live Demo:** [artmusuem.github.io/historic-planes](https://artmusuem.github.io/historic-planes/)

---

## Features

- **Dynamic Filtering** — Filter by aircraft type (fighters, bombers, jets, naval)
- **Multi-Category Search** — Filter by era, region, material, and style
- **Responsive Design** — Works on desktop and mobile
- **Individual Aircraft Pages** — Detailed specs and history for each aircraft
- **JSON Data Architecture** — Easy to extend with new aircraft

## Tech Stack

- Vanilla JavaScript (ES6+)
- CSS3 with responsive grid layout
- JSON-based data store
- GitHub Pages hosting

## Project Structure

```
historic-planes/
├── index.html              # Main gallery page
├── search-results.html     # Filtered results view
├── css/
│   └── styles.css          # All styling
├── js/
│   └── bundle.js           # Core application logic
├── data/
│   └── aircraft.json       # Aircraft database
├── images/                 # Aircraft photography
└── page-templates/         # Individual aircraft pages
```

## How It Works

The gallery uses a fetch-based architecture to load aircraft data from JSON:

```javascript
// Fetch and filter data
function fetchFilteredData(url) {
  return fetch(url)
    .then(res => res.json())
    .then(data => data.filter(item => item.status !== "hide"));
}

// Extract categorical data for filtering
function extractCategories(item) {
  return {
    category: item.category,    // fighters, bombers, jet-fighters
    style: item.style,          // heavy bomber, single-engine fighter
    region: item.region,        // USA, UK, Germany, Japan
    era: item.era,              // WWII, Korean War, Cold War
    material: item.material     // Aluminum, Wood
  };
}
```

## Data Format

Aircraft are stored in JSON with the following structure:

```json
{
  "sku": "P51-MUSTANG",
  "title": "P-51 Mustang",
  "category": "fighters",
  "style": "single-engine fighter",
  "region": "USA",
  "era": "WWII",
  "material": "Aluminum",
  "description": "Long-range escort fighter...",
  "image": "images/p51-mustang.jpg",
  "status": "active"
}
```

## Local Development

```bash
# Clone the repository
git clone https://github.com/artmusuem/historic-planes.git
cd historic-planes

# Serve locally (any static server works)
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000
```

## Adding New Aircraft

1. Add aircraft data to `data/aircraft.json`
2. Add aircraft image to `images/`
3. Optionally create a detailed page in `page-templates/`

## License

MIT

---

Built with vanilla JavaScript and hosted on GitHub Pages.
