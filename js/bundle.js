// File: /historic-planes/js/bundle.js (Historic Planes - Clean Version)

document.addEventListener("DOMContentLoaded", () => {
  console.log("bundle.js loaded on:", window.location.href);

  // === Grab common DOM elements across all pages ===
  const urlParams = new URLSearchParams(window.location.search);
  const sku = urlParams.get("sku")?.toUpperCase();
  const gallery = document.getElementById("gallery");
  const menu = document.getElementById("dynamic-menu");
  const title = document.getElementById("gallery-title");
  const clearBtnContainer = document.getElementById("clear-filters");

  // === Utility Functions ===
  
  // Fetch data and filter out hidden items
  function fetchFilteredData(url) {
    return fetch(url)
      .then(res => res.json())
      .then(data => data.filter(item => item.status !== "hide"));
  }

  // Check if a field value is valid (not "hide" or undefined/null)
  function shouldShowField(value) {
    return value && value !== "hide" && value.trim() !== "";
  }

  // Extract categorical data from historic planes format
  function extractCategories(item) {
    const categories = {
      category: [],    // Main aircraft type (fighters, bombers, jet-fighters, naval-fighters)
      style: [],       // Detailed aircraft type (heavy bomber, single-engine fighter, etc.)
      region: [],      // Country/origin (USA, UK, Germany, Japan, France, Soviet Union)
      era: [],         // Historical era (WWII, Korean War, Cold War, Vietnam War)
      material: []     // Construction material (Aluminum, Wood)
    };

    // Extract main aircraft category from the category field
    if (item.category && shouldShowField(item.category)) {
      categories.category.push(item.category.toLowerCase());
    }

    // Extract detailed aircraft style from the style field
    if (item.style && shouldShowField(item.style)) {
      categories.style.push(item.style.toLowerCase());
    }

    // Extract country/region from the region field
    if (item.region && shouldShowField(item.region)) {
      categories.region.push(item.region);
    }

    // Extract historical era from the era field
    if (item.era && shouldShowField(item.era)) {
      categories.era.push(item.era);
    }

    // Extract material from the material field
    if (item.material && shouldShowField(item.material)) {
      categories.material.push(item.material.toLowerCase());
    }

    return categories;
  }

  // Add read more functionality to long text elements
  function applyReadMore(element) {
    if (!element) return;
    
    const text = element.textContent;
    const wordLimit = 50;
    const words = text.split(' ');
    
    if (words.length > wordLimit) {
      const shortText = words.slice(0, wordLimit).join(' ');
      const fullText = text;
      
      element.innerHTML = `
        <span class="short-text">${shortText}...</span>
        <span class="full-text" style="display: none;">${fullText}</span>
        <button class="read-more-btn" style="color: #2c3e50; background: none; border: none; cursor: pointer; text-decoration: underline;">Read More</button>
      `;
      
      const btn = element.querySelector('.read-more-btn');
      const shortTextEl = element.querySelector('.short-text');
      const fullTextEl = element.querySelector('.full-text');
      
      btn.addEventListener('click', () => {
        if (fullTextEl.style.display === 'none') {
          shortTextEl.style.display = 'none';
          fullTextEl.style.display = 'inline';
          btn.textContent = 'Read Less';
        } else {
          shortTextEl.style.display = 'inline';
          fullTextEl.style.display = 'none';
          btn.textContent = 'Read More';
        }
      });
    }
  }

  // === Label Map for Historic Planes Categories ===
  const labelMap = {
    // Main Aircraft Categories
    "fighters": "Fighter Aircraft",
    "bombers": "Bomber Aircraft", 
    "jet-fighters": "Jet Fighters",
    "naval-fighters": "Naval Fighters",
    
    // Countries/Regions
    "USA": "United States",
    "UK": "United Kingdom",
    "Germany": "Germany",
    "Japan": "Japan",
    "France": "France",
    "Soviet Union": "Soviet Union",
    
    // Historical Eras
    "WWII": "World War II",
    "Korean War": "Korean War",
    "Cold War": "Cold War Era",
    "Vietnam War": "Vietnam War",
    
    // Detailed Aircraft Types/Styles
    "heavy bomber": "Heavy Bomber",
    "twin-engine fighter": "Twin-Engine Fighter",
    "single-engine fighter": "Single-Engine Fighter",
    "long-range fighter": "Long-Range Fighter",
    "ground attack fighter": "Ground Attack Fighter",
    "carrier-based fighter": "Carrier-Based Fighter",
    "naval fighter": "Naval Fighter",
    "dive bomber": "Dive Bomber",
    "torpedo bomber": "Torpedo Bomber",
    "jet fighter": "Jet Fighter",
    "jet bomber": "Jet Bomber",
    "supersonic fighter": "Supersonic Fighter",
    "strategic bomber": "Strategic Bomber",
    "reconnaissance aircraft": "Reconnaissance Aircraft",
    "multi-role bomber": "Multi-Role Bomber",
    "multi-role aircraft": "Multi-Role Aircraft",
    "transport aircraft": "Transport Aircraft",
    "medium bomber": "Medium Bomber",
    "fighter-bomber": "Fighter-Bomber",
    "attack aircraft": "Attack Aircraft",
    "supercharged fighter": "Supercharged Fighter",
    "liaison aircraft": "Liaison Aircraft",
    "twin-engine bomber": "Twin-Engine Bomber",
    
    // Materials
    "aluminum": "Aluminum",
    "wood": "Wood"
  };

  window.labelMap = labelMap;

  // === Gallery Functions ===
  
  // Render gallery tiles dynamically from provided items
  function loadGallery(items) {
    if (!gallery) return;
    gallery.innerHTML = '';

    if (!items.length) {
      gallery.innerHTML = "<p>No results found.</p>";
      // Update stats for no results
      if (window.updateGalleryStats) {
        window.updateGalleryStats(window.fullData ? window.fullData.length : 0, 0);
      }
      return;
    }

    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "gallery-item";
      const templatePage = item["template-page"] || "dt-1.html";
      const link = `/historic-planes/page-templates/${templatePage}?sku=${item.sku}`;
      const titleHTML = item.title ? `<h3>${item.title}</h3>` : '';
      const subtitleHTML = item.subtitle ? `<p class="subtitle">${item.subtitle}</p>` : '';
      
      div.innerHTML = `
        <a href="${link}">
          <img src="${item.image}" alt="${item.title || ''}" class="lightbox-trigger" />
          ${titleHTML}
          ${subtitleHTML}
        </a>
      `;
      gallery.appendChild(div);
    });

    // Update gallery stats
    if (window.updateGalleryStats && window.fullData) {
      window.updateGalleryStats(window.fullData.length, items.length);
    }
  }

  // Allow menu filters to trigger gallery filtering
  window.filterGallery = function (category) {
    if (!category) {
      if (title) title.textContent = "Historic Military Aircraft";
      if (clearBtnContainer) clearBtnContainer.style.display = "none";
      loadGallery(window.fullData);
      return;
    }
    
    const displayLabel = labelMap[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (title) title.textContent = displayLabel;
    if (clearBtnContainer) clearBtnContainer.style.display = "block";
    
    const filtered = window.fullData.filter(item => {
      const categories = extractCategories(item);
      
      // Check if the category matches any extracted categories
      return Object.values(categories).some(catArray => 
        catArray.includes(category.toLowerCase()) || catArray.includes(category)
      );
    });
    
    loadGallery(filtered);
  };

  // === Detail Pages (dt-1.html / dt-2.html) Rendering ===
  if (window.location.pathname.includes("dt-1.html") || window.location.pathname.includes("dt-2.html")) {
    fetchFilteredData("/historic-planes/data/historic-planes-collection.json")
      .then(data => {
        const item = data.find(i => i.sku === sku);
        if (!item) return;
        
        // Update text function to handle multiple elements
        const updateText = (selector, value) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (shouldShowField(value)) {
              el.textContent = value;
              el.style.display = "";
            } else {
              el.style.display = "none";
            }
          });
        };

        // Create filter links for extracted categories
        const updateFilterLink = (selector, categoryType) => {
          const el = document.querySelector(selector);
          if (el) {
            const categories = extractCategories(item);
            const values = categories[categoryType];
            
            if (values && values.length > 0) {
              const value = values[0]; // Use first matching category
              const displayLabel = labelMap[value] || value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              el.innerHTML = `<a href="/historic-planes/" onclick="sessionStorage.setItem('autoFilter', '${value}'); return true;" class="filter-link">${displayLabel}</a>`;
              el.style.display = "";
            } else {
              el.style.display = "none";
            }
          }
        };

        // Populate historic planes data fields
        updateText(".plane-title", item.title);        // Aircraft Name/Model
        updateText(".subtitle", item.subtitle);        // Era and Date
        updateText(".sku", item.sku);                  // Aircraft SKU/Model Number
        updateText(".squadron", item.squadron);        // Military Squadron
        updateText(".location", item.location);        // Theater of Operations/Location
        updateText(".height", item.height);            // Aircraft Length
        updateText(".wingspan", item.wingspan);        // Aircraft Wingspan
        updateText(".engine", item.engine);            // Engine Type and Specifications
        updateText(".armament", item.armament);        // Weapons and Armament
        updateText(".speed", item.speed);              // Maximum Speed
        updateText(".material", item.material);        // Construction Material
        updateText(".summary", item.summary);          // Aircraft Description/Summary
        updateText(".notable-fact", item.notableFact); // Notable Historical Facts

        // Apply read more functionality to longer text fields
        applyReadMore(document.querySelector('.summary'));
        applyReadMore(document.querySelector('.notable-fact'));

        // Create filter links based on extracted aircraft categories
        updateFilterLink(".category-filter", "category");   // Main aircraft type
        updateFilterLink(".style-filter", "style");         // Detailed aircraft type
        updateFilterLink(".region-filter", "region");       // Country/Origin
        updateFilterLink(".era-filter", "era");             // Historical era
        updateFilterLink(".material-filter", "material");   // Construction material

        // Add filter button function for detail page navigation
        window.goToFilteredGallery = function(filter) {
          if (filter) {
            sessionStorage.setItem('autoFilter', filter);
          } else {
            sessionStorage.removeItem('autoFilter');
          }
          window.location.href = '/historic-planes/';
        };

        // Set main aircraft image
        const image = document.querySelector(".plane-image");
        if (image && item.image) {
          image.src = item.image;
          image.alt = item.title || 'Historic Military Aircraft';
        }

        // Handle previous/next navigation using prev-sku/next-sku
        const prevLink = document.querySelector(".prev-plane");
        if (prevLink && item["prev-sku"]) {
          prevLink.href = `/historic-planes/page-templates/dt-1.html?sku=${item["prev-sku"]}`;
          prevLink.style.display = "";
        } else if (prevLink) {
          prevLink.style.display = "none";
        }

        const nextLink = document.querySelector(".next-plane");
        if (nextLink && item["next-sku"]) {
          nextLink.href = `/historic-planes/page-templates/dt-1.html?sku=${item["next-sku"]}`;
          nextLink.style.display = "";
        } else if (nextLink) {
          nextLink.style.display = "none";
        }

        // Update page title
        if (item.title) {
          document.title = `${item.title} - Historic Military Aircraft`;
        }
      })
      .catch(error => {
        console.error("❌ Error loading aircraft data:", error);
      });
  }

  // === Index Gallery Page ===
  if (window.location.pathname.includes("/historic-planes/") && !window.location.pathname.includes("dt-")) {
    console.log("✅ Historic Planes gallery page detected, starting menu creation...");
    
    fetchFilteredData("/historic-planes/data/historic-planes-collection.json")
      .then(data => {
        console.log("✅ Data loaded:", data.length, "aircraft");
        
        const categories = { 
          category: new Set(), 
          style: new Set(), 
          region: new Set(), 
          era: new Set(),
          material: new Set()
        };
        
        // Extract categories from all items
        data.forEach(item => {
          const itemCategories = extractCategories(item);
          
          itemCategories.category.forEach(cat => categories.category.add(cat));
          itemCategories.style.forEach(cat => categories.style.add(cat));
          itemCategories.region.forEach(cat => categories.region.add(cat));
          itemCategories.era.forEach(cat => categories.era.add(cat));
          itemCategories.material.forEach(cat => categories.material.add(cat));
        });
        
        console.log("✅ Categories collected:", categories);
        
        if (menu) {
          // Clear any existing content
          menu.innerHTML = '';
          
          // Create menu sections
          for (const [type, values] of Object.entries(categories)) {
            if (values.size === 0) continue;
            const group = document.createElement("li");
            
            const menuLabels = {
              'category': 'Aircraft Type',
              'style': 'Detailed Classification',
              'region': 'Country/Origin', 
              'era': 'Historical Era',
              'material': 'Construction Material'
            };
            
            const label = menuLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
            
            group.innerHTML = `
              <details>
                <summary>${label}</summary>
                <ul>
                  ${[...values].sort().map(v => {
                    const displayLabel = labelMap[v] || v.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return `<li><a href="#" onclick="filterGallery('${v}'); return false;">${displayLabel}</a></li>`;
                  }).join('')}
                </ul>
              </details>
            `;
            menu.appendChild(group);
          }
          
          console.log("✅ Menu creation completed!");
        }
        
        // Add sidebar toggle functionality
        const sidebar = document.getElementById("sidebar");
        const toggleButton = document.getElementById("menu-toggle");
        const closeBtn = document.getElementById("close-sidebar");
        
        if (toggleButton && sidebar) {
          toggleButton.addEventListener("click", () => {
            sidebar.classList.toggle("open");
          });
        }
        
        if (closeBtn && sidebar) {
          closeBtn.addEventListener("click", () => {
            sidebar.classList.remove("open");
          });
        }
        
        // Close sidebar when clicking outside
        document.addEventListener("click", (e) => {
          if (sidebar && !sidebar.contains(e.target) && !toggleButton.contains(e.target)) {
            sidebar.classList.remove("open");
          }
        });
        
        window.fullData = data;
        
        // Check for pending auto-filter
        const pendingFilter = window.pendingAutoFilter;
        if (pendingFilter) {
          console.log("✅ Applying pending auto-filter:", pendingFilter);
          window.pendingAutoFilter = null;
          window.filterGallery(pendingFilter);
          
          // Show gallery after filter is applied
          setTimeout(() => {
            const gallery = document.getElementById("gallery");
            if (gallery) gallery.style.visibility = "visible";
          }, 100);
        } else {
          loadGallery(data);
        }
      })
      .catch(error => {
        console.error("❌ Error loading aircraft data:", error);
      });
  }

  // === Search Results Page ===
  const searchInput = document.getElementById("searchBox");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("resultsContainer");

  const performSearch = (query) => {
    query = query?.trim();
    if (!query) return;
    window.location.href = `/historic-planes/search-results.html?q=${encodeURIComponent(query)}`;
  };

  if (searchInput && searchButton) {
    searchInput.addEventListener("keypress", e => {
      if (e.key === "Enter") performSearch(searchInput.value);
    });
    searchButton.addEventListener("click", () => {
      performSearch(searchInput.value);
    });
  }

  if (resultsContainer) {
    const q = urlParams.get("q")?.toLowerCase()?.trim();
    if (q) {
      fetchFilteredData("/historic-planes/data/historic-planes-collection.json")
        .then(data => {
          const matches = data.filter(item => {
            const qlc = q.toLowerCase();
            const fields = [
              item.title,
              item.subtitle,
              item.sku,
              item.squadron,
              item.location,
              item.height,
              item.wingspan,
              item.engine,
              item.armament,
              item.speed,
              item.material,
              item.summary,
              item.notableFact
            ];
            return fields.some(field =>
              typeof field === "string" && field.toLowerCase().includes(qlc)
            );
          });
          
          resultsContainer.innerHTML = matches.length
            ? matches.map(item => {
                const template = item["template-page"] || "dt-1.html";
                return `
                  <div class="search-result">
                    <a href="/historic-planes/page-templates/${template}?sku=${item.sku}">
                      <img src="${item.image}" alt="${item.title} – ${item.sku}" class="lightbox-trigger" />
                      <div>
                        <h3>${item.title}</h3>
                        <p>${item.subtitle || ''}</p>
                        <p>${item.summary?.substring(0, 150) || ''}...</p>
                      </div>
                    </a>
                  </div>
                `;
              }).join("")
            : "<p>No results found for your query.</p>";
        })
        .catch(error => {
          console.error("Failed to load search data:", error);
          resultsContainer.innerHTML = "<p>Error loading search results. Please try again.</p>";
        });
    } else {
      resultsContainer.innerHTML = "<p>Please enter a search query.</p>";
    }
  }

  // === Lightbox Setup ===
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImage && lightboxClose) {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("lightbox-trigger")) {
        e.preventDefault();
        lightboxImage.src = e.target.src;
        lightbox.classList.add("active");
      }
    });

    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
      }
    });
  }

});