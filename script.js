document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.querySelector('.map-container');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');
    const layerControls = document.querySelectorAll('.layer-toggle input');

    // Sample data structure for markers
    const markers = [
        {
            id: 1,
            x: 30, // percentage from left
            y: 40, // percentage from top
            category: 'herb',
            name: 'Lavender',
            description: 'Aromatic flowering plant in the mint family',
            details: `
                <h3>Lavender</h3>
                <p class="category herb">Herb</p>
                <p>Native to the Mediterranean region, lavender is known for its calming properties and distinctive fragrance.</p>
                <div class="marker-details">
                    <h4>Common Uses:</h4>
                    <ul>
                        <li>Aromatherapy</li>
                        <li>Herbal tea</li>
                        <li>Essential oils</li>
                    </ul>
                </div>
            `
        },
        {
            id: 2,
            x: 45,
            y: 35,
            category: 'recipe',
            name: 'Lavender Honey Tea',
            description: 'Soothing herbal tea recipe',
            details: `
                <h3>Lavender Honey Tea</h3>
                <p class="category recipe">Recipe</p>
                <p>A calming tea perfect for relaxation.</p>
                <div class="marker-details">
                    <h4>Ingredients:</h4>
                    <ul>
                        <li>1 tsp dried lavender</li>
                        <li>1 tbsp honey</li>
                        <li>1 cup hot water</li>
                    </ul>
                </div>
            `
        },
        {
            id: 3,
            x: 60,
            y: 50,
            category: 'remedy',
            name: 'Herbal Compress',
            description: 'Traditional remedy for muscle pain',
            details: `
                <h3>Herbal Compress</h3>
                <p class="category remedy">Remedy</p>
                <p>Used to relieve muscle pain and inflammation using a blend of herbs.</p>
                <div class="marker-details">
                    <h4>Herbs Used:</h4>
                    <ul>
                        <li>Lemongrass</li>
                        <li>Turmeric</li>
                        <li>Ginger</li>
                    </ul>
                </div>
            `
        }
    ];

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    mapContainer.appendChild(tooltip);

    // Create markers and keep references
    const markerElements = [];
    markers.forEach(marker => {
        const markerElement = document.createElement('div');
        markerElement.className = `marker ${marker.category}`;
        markerElement.style.left = `${marker.x}%`;
        markerElement.style.top = `${marker.y}%`;
        markerElement.dataset.category = marker.category;
        markerElement.dataset.id = marker.id;
        // Add hover events
        markerElement.addEventListener('mouseenter', () => {
            showTooltip(marker.name, marker.category);
        });
        markerElement.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        // Add click event
        markerElement.addEventListener('click', () => {
            showSidebar(marker.details);
        });
        mapContainer.appendChild(markerElement);
        markerElements.push(markerElement);
    });

    // Layer control handlers
    layerControls.forEach(control => {
        control.addEventListener('change', updateMarkerVisibility);
    });

    function updateMarkerVisibility() {
        // Get checked categories
        const activeCategories = Array.from(layerControls)
            .filter(input => input.checked)
            .map(input => input.id.replace('herbs', 'herb').replace('recipes', 'recipe').replace('remedies', 'remedy'));
        markerElements.forEach(markerEl => {
            if (activeCategories.includes(markerEl.dataset.category)) {
                markerEl.style.display = 'block';
            } else {
                markerEl.style.display = 'none';
            }
        });
    }

    // Initial marker visibility
    updateMarkerVisibility();

    // Map interaction handlers
    mapContainer.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
    });

    function showTooltip(content, category) {
        tooltip.textContent = content;
        tooltip.className = `tooltip visible ${category}`;
    }

    function hideTooltip() {
        tooltip.className = 'tooltip';
    }

    function showSidebar(content) {
        const detailsContent = document.querySelector('.details-content');
        detailsContent.innerHTML = content;
        sidebar.classList.add('active');
    }

    function hideSidebar() {
        sidebar.classList.remove('active');
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !e.target.classList.contains('marker')) {
            hideSidebar();
        }
    });

    // Close sidebar when clicking the close button
    if (sidebarClose) {
        sidebarClose.addEventListener('click', hideSidebar);
    }
}); 