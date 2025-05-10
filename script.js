document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.querySelector('.map-container');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');
    const layerControls = document.querySelectorAll('.layer-toggle input');

    // Create zoom controls
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.innerHTML = `
        <button class="zoom-btn zoom-in">+</button>
        <button class="zoom-btn zoom-out">−</button>
    `;
    mapContainer.appendChild(zoomControls);

    // Initialize zoom level
    let currentZoom = 1;
    const zoomStep = 0.2;
    const minZoom = 0.5;
    const maxZoom = 2;

    // Create a container for both map and markers
    const contentContainer = document.createElement('div');
    contentContainer.className = 'map-content-container';
    
    // Move the existing base-map into the content container
    const baseMap = mapContainer.querySelector('.base-map');
    if (baseMap) {
        contentContainer.appendChild(baseMap);
    }

    // Create marker container
    const markerContainer = document.createElement('div');
    markerContainer.className = 'marker-container';
    contentContainer.appendChild(markerContainer);
    
    // Add the content container to the map container
    mapContainer.appendChild(contentContainer);

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    mapContainer.appendChild(tooltip);

    // Create markers and keep references
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
        },
        {
            id: 4,
            x: 30,
            y: 40,
            category: 'herb',
            name: 'Neneki Soppu',
            description: 'A medicinal plant known for its healing properties',
            details: `
                <img src="assets/neneki.jpeg" alt="Herb Photo" class="herb-photo">
                <div class="herb-title">Neneki Soppu</div>
                <div class="herb-scientific">Euphorbia hirta</div>
                <div class="herb-description">A medicinal plant known for its healing properties, commonly found by the roadside.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/neneki.jpeg" alt="Herb Photo" class="detailed-photo">
                        <h1>Neneki Soppu / Nene Akki Soppu</h1>
                        <div class="scientific-name">Euphorbia hirta</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Where It Grows</h2>
                        <p>Grows by the roadside, especially in sandy soil near</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Plant Description</h2>
                        <p>This plant is erect, with dark green or purplish-green leaves that have a pale underside. The leaves grow opposite each other and are small with finely serrated edges. The flowers grow in dense, rounded clusters and are green to reddish in color.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Benefits</h2>
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <h3>Skin Healing</h3>
                                <p>The milky latex from its stem can be applied on blisters, boils, and rashes, helping to reduce redness and promote faster healing.</p>
                            </div>
                            <div class="benefit-item">
                                <h3>Cough Relief</h3>
                                <p>Helps provide relief from cough.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            id: 5,
            x: 55,
            y: 45,
            category: 'herb',
            name: 'Honagonne Soppu',
            description: 'A creeping plant with medicinal properties',
            details: `
                <img src="assets/honagonne.jpeg" alt="Herb Photo" class="herb-photo">
                <div class="herb-title">Honagonne Soppu</div>
                <div class="herb-scientific">Alternanthera sessilis</div>
                <div class="herb-description">A creeping or spreading plant found in marshy areas and fields after rain.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/honagonne.jpeg" alt="Herb Photo" class="detailed-photo">
                        <h1>Honagonne Soppu</h1>
                        <div class="scientific-name">Alternanthera sessilis</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Where It Grows</h2>
                        <p>This plant is usually found in marshy areas and in fields a few days after it rains. It is also commonly found near lakes.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Plant Description</h2>
                        <p>It is a creeping or spreading plant. The leaves are green, sometimes reddish-purple. The leaf arrangement is opposite and the leaves have smooth edges. The flowers appear in small, white, round clusters.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Benefits</h2>
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <h3>Eye Health</h3>
                                <p>This soppu is good for the eyes and helps improve vision.</p>
                            </div>
                            <div class="benefit-item">
                                <h3>Women's Reproductive Health</h3>
                                <p>There are two types of Honagonne – one with white flowers and one with blackish ones. The white-flowered Honagonne is used to treat white discharge in women.</p>
                            </div>
                            <div class="benefit-item">
                                <h3>Energy & Vitality</h3>
                                <p>It helps with tiredness. When I was pregnant and used to go to Kodamballi Kere to collect firewood for cooking, I would get tired, but I would collect Honagonne Soppu and eat it to feel better.</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <p>I recommend eating Honagonne Soppu regularly as part of meals. It can be used to make soppu palya, morsoppu, upsaaru, or bassaru.</p>
                    </div>
                </div>
            `
        },
        {
            id: 6,
            x: 65,
            y: 40,
            category: 'herb',
            name: 'Ganike Soppu',
            description: 'A medicinal plant with heart benefits',
            details: `
                <img src="assets/ganike.jpg" alt="Herb Photo" class="herb-photo">
                <div class="herb-title">Ganike Soppu</div>
                <div class="herb-scientific">Solanum nigrum</div>
                <div class="herb-description">An erect plant with light green leaves and star-shaped flowers, commonly found in agricultural fields.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/ganike.jpg" alt="Herb Photo" class="detailed-photo">
                        <h1>Ganike Soppu</h1>
                        <div class="scientific-name">Solanum nigrum</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Where It Grows</h2>
                        <p>This plant is commonly found in agricultural fields.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Plant Description</h2>
                        <p>It is an erect plant with light green leaves that have alternate arrangement. The leaves have wavy edges. The flowers are small, white, and star-shaped with yellow centers.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Benefits</h2>
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <h3>Heart Health</h3>
                                <p>Ganike Soppu is good for the heart.</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Varieties</h2>
                        <img src="assets/fruit.jpeg" alt="Black fruits of Ganike Soppu" class="detailed-section-image small-image">
                        <p class="image-caption">Black-fruited variety of Ganike Soppu</p>
                        <p>There are two types of Ganike – one with black fruits and one with red fruits. The black fruits are sweet and slightly sour, and we enjoy eating them. The red-fruited variety is used to prepare medicine for cattle.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <p>We use Ganike Soppu to make dishes like Soppu Palya and Upsaaru, and eat the fruits as a snack.</p>
                    </div>
                </div>
            `
        },
        {
            id: 7,
            x: 75,
            y: 45,
            category: 'herb',
            name: 'Thonde Soppu',
            description: 'A climbing plant used to treat wet cough',
            details: `
                <img src="assets/thonde.jpeg" alt="Herb Photo" class="herb-photo">
                <div class="herb-title">Thonde Soppu</div>
                <div class="herb-scientific">Coccinia grandis</div>
                <div class="herb-description">A climbing plant with star-shaped white flowers, commonly found along roadsides and compound walls.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/thonde.jpeg" alt="Herb Photo" class="detailed-photo">
                        <h1>Thonde Soppu</h1>
                        <div class="scientific-name">Coccinia grandis</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Where It Grows</h2>
                        <p>This plant usually grows along roadsides, compound walls, and near drains.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Plant Description</h2>
                        <p>It is a climbing plant with green leaves that have an alternate arrangement. The leaves have slightly toothed edges. The flowers are white, star-shaped, and have five petals.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Benefits</h2>
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <h3>Respiratory Health</h3>
                                <p>It is given to adults to treat wet cough.</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>How To Use</h2>
                        <p>We cook Thonde Soppu to make palya and also use it in Massoppu. It is used to make Thonde Soppu Motte Palya, and the vegetable is also added to sambar.</p>
                    </div>
                </div>
            `
        },
        {
            id: 8,
            x: 25,
            y: 50,
            category: 'herb',
            name: 'Kaikarge Soppu',
            description: 'A spreading plant commonly found in sandy soil',
            details: `
                <img src="assets/kaikarge.jpeg" alt="Herb Photo" class="herb-photo">
                <div class="herb-title">Kaikarge Soppu</div>
                <div class="herb-scientific"></div>
                <div class="herb-description">A spreading or prostrate plant with light green leaves arranged in whorls, commonly found in sandy soil.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/kaikarge.jpeg" alt="Herb Photo" class="detailed-photo">
                        <h1>Kaikarge Soppu</h1>
                        <div class="scientific-name"></div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Where It Grows</h2>
                        <p>This plant is commonly found in sandy soil, near compound walls, and in areas with heaps of cement.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Plant Description</h2>
                        <p>It is a spreading or prostrate plant with light green leaves. The leaves grow in whorls and are narrow and elliptical in shape with smooth edges. The plant produces small green buds and white flowers.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <p>We can use Kaikarge Soppu in to cook Morsoppu, Upsaaru and Bassaru.</p>
                    </div>
                </div>
            `
        },
        {
            id: 9,
            x: 35,
            y: 55,
            category: 'herb',
            name: 'Amrutha Balli',
            description: 'A climbing plant known for regulating blood sugar',
            details: `
                <img src="assets/amruthaballi.jpeg" alt="Herb Photo" class="herb-photo">
                <div class="herb-title">Amrutha Balli</div>
                <div class="herb-scientific">Tinospora cordifolia</div>
                <div class="herb-description">A climbing plant with heart-shaped leaves, known for its medicinal properties in treating diabetes and liver health.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/amruthaballi.jpeg" alt="Herb Photo" class="detailed-photo">
                        <h1>Amrutha Balli</h1>
                        <div class="scientific-name">Tinospora cordifolia</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Where It Grows</h2>
                        <p>Amrutha Balli is commonly found in warm, humid areas. It grows on trees and compound walls.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Plant Description</h2>
                        <p>Amrutha Balli is a climbing plant with heart-shaped, green leaves. The plant has slender, long stems that can twine around trees or other structures. It produces small, yellow or greenish flowers that grow in clusters. The plant is known for its bitter taste.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Benefits</h2>
                        <div class="benefits-list">
                            <div class="benefit-item">
                                <h3>Blood Sugar Control</h3>
                                <p>It helps regulate blood sugar levels and is used to treat diabetes. I recommend that people I visit who have high blood sugar levels eat this regularly.</p>
                            </div>
                            <div class="benefit-item">
                                <h3>Liver Health</h3>
                                <p>It is also good for liver health.</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <p>Amrutha Balli can be consumed in various forms, such as juice (rasa), or used in meals. Since it is bitter in taste, it's better to consume it as rasa.</p>
                    </div>
                </div>
            `
        },
        {
            id: 10,
            x: 60,
            y: 60,
            category: 'remedy',
            name: 'Muscle Spasm Remedy',
            description: 'A warm compress remedy for muscle spasms and stiffness',
            details: `
                <div class="herb-title">Muscle Spasm Remedy</div>
                <div class="herb-scientific">Herbal Warm Compress</div>
                <div class="herb-description">A natural remedy that uses local herbs in a warm compress to relieve muscle spasms, catches, and localized stiffness.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <h1>Muscle Spasm Remedy</h1>
                        <div class="scientific-name">Herbal Warm Compress</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Purpose</h2>
                        <p>This remedy helps relieve muscle spasms, catches, and localized stiffness through warmth and the natural properties of the herbs.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <h3>Primary Herbs</h3>
                        <ul>
                            <li>Ankole Soppu</li>
                            <li>Honamaave Soppu</li>
                            <li>Gandeluri Soppu</li>
                        </ul>
                        
                        <h3>Alternative Options</h3>
                        <ul>
                            <li>Heated bricks</li>
                            <li>Salt</li>
                        </ul>
                    </div>

                    <div class="detailed-section">
                        <h2>How To Use</h2>
                        <ol>
                            <li>Take the selected soppus (or the alternative – bricks or salt).</li>
                            <li>Tie them in a clean cloth dipped in cold water to form a pouch or sack.</li>
                            <li>Warm the sack lightly on a pan.</li>
                            <li>Gently apply the warm sack to the affected area where there are muscle spasms or stiffness.</li>
                        </ol>
                    </div>
                </div>
            `
        },
        {
            id: 11,
            x: 70,
            y: 60,
            category: 'remedy',
            name: 'Postpartum Care',
            description: 'Traditional remedy for postpartum mothers using Kaikarge Soppu',
            details: `
                <div class="herb-title">Postpartum Care</div>
                <div class="herb-scientific">Traditional Maternal Care</div>
                <div class="herb-description">A traditional remedy using Kaikarge Soppu to help maintain body temperature in postpartum mothers during the first 6-7 months after childbirth.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <h1>Postpartum Care</h1>
                        <div class="scientific-name">Traditional Maternal Care</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Purpose</h2>
                        <p>Kaikarge Soppu is traditionally given to postpartum mothers during the first 6–7 months after childbirth to help maintain body temperature. Its bitterness is considered beneficial during this time. I always encourage postpartum mothers to eat Kaikarge Soppu when I visit them.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <div class="herbs-gallery">
                            <div class="herb-image-container">
                                <img src="assets/kaikarge.jpeg" alt="Kaikarge Soppu" class="detailed-section-image small-image">
                                <p class="image-caption">Kaikarge Soppu</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <ul>
                            <li>Due to its bitter taste, Kaikarge Soppu is not used in mixed or cooked dishes like <em>morsoppu</em>.</li>
                            <li>It can be prepared as <em>soppu palya</em> or eaten simply boiled.</li>
                            <li>Sugary foods are avoided during this period, and bitter soppus like Kaikarge are preferred for their believed healing properties.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 12,
            x: 80,
            y: 60,
            category: 'remedy',
            name: 'Lactation Support',
            description: 'Natural remedy to support milk production in lactating mothers',
            details: `
                <div class="herb-title">Support Milk Production</div>
                <div class="herb-scientific">Lactation Support Remedy</div>
                <div class="herb-description">A traditional remedy using Neneki Soppu and Nugge Soppu to naturally enhance breast milk production in lactating mothers.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <h1>Support Milk Production</h1>
                        <div class="scientific-name">Lactation Support Remedy</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Purpose</h2>
                        <p>Neneki Soppu and Nugge Soppu are recommended for lactating mothers to help increase breast milk production. These soppus are included regularly in the diet during the postpartum period to naturally support lactation.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <div class="herbs-gallery">
                            <div class="herb-image-container">
                                <img src="assets/neneki.jpeg" alt="Neneki Soppu" class="detailed-section-image small-image">
                                <p class="image-caption">Neneki Soppu</p>
                            </div>
                            <div class="herb-image-container">
                                <img src="assets/nugge.jpg" alt="Nugge Soppu" class="detailed-section-image small-image">
                                <p class="image-caption">Nugge Soppu</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>How To Use</h2>
                        <ul>
                            <li>These soppus can be cooked as part of daily meals, made into <em>soppu palya</em>, or added to sambar.</li>
                            <li>Lactating mothers are encouraged to eat more of these soppus consistently to help with milk production.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 13,
            x: 90,
            y: 60,
            category: 'remedy',
            name: 'Healing Piles',
            description: 'Traditional remedy using Motodre Moni for treating piles',
            details: `
                <div class="herb-title">Healing Piles</div>
                <div class="herb-scientific">Piles Treatment Remedy</div>
                <div class="herb-description">A traditional remedy using Motodre Moni (Touch-Me-Not) leaves to treat piles and relieve associated discomfort.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <h1>Healing Piles</h1>
                        <div class="scientific-name">Piles Treatment Remedy</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Purpose</h2>
                        <p>Motodre Moni, also known as the <em>touch-me-not</em> plant, is traditionally used to treat piles. When its paste is applied, it helps relieve pain, irritation, and can reduce the size of the piles mass.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <ul>
                            <li>Motodre Moni (Touch-Me-Not) leaves</li>
                            <li>Water (optional, for consistency)</li>
                        </ul>
                        <div class="herbs-gallery">
                            <div class="herb-image-container">
                                <img src="assets/tmn.jpg" alt="Motodre Moni" class="detailed-section-image small-image">
                                <p class="image-caption">Motodre Moni (Touch-Me-Not)</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>How To Use</h2>
                        <ol>
                            <li>Crush the fresh leaves into a paste (<em>rasa</em>).</li>
                            <li>You can add a little water to make it smoother if needed.</li>
                            <li>Apply this paste directly to the affected area where the piles mass is present.</li>
                            <li>Use regularly for relief from discomfort and swelling.</li>
                        </ol>
                    </div>
                </div>
            `
        },
        {
            id: 14,
            x: 85,
            y: 70,
            category: 'remedy',
            name: 'Postpartum Belly Care',
            description: 'Traditional remedy using Motodre Moni for postpartum belly care',
            details: `
                <div class="herb-title">Postpartum Belly Care</div>
                <div class="herb-scientific">Postpartum Recovery Remedy</div>
                <div class="herb-description">A traditional remedy using Motodre Moni (Touch-Me-Not) leaves to help prevent belly sagging after childbirth.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <h1>Postpartum Belly Care</h1>
                        <div class="scientific-name">Postpartum Recovery Remedy</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Purpose</h2>
                        <p>Motodre Moni (touch-me-not plant) is used after a normal delivery to help prevent belly sagging. I recommend that postpartum women apply the <em>rasa</em> (juice) in the weeks following childbirth to help tighten the abdominal area during recovery.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <div class="herbs-gallery">
                            <div class="herb-image-container">
                                <img src="assets/tmn.jpg" alt="Motodre Moni" class="detailed-section-image small-image">
                                <p class="image-caption">Motodre Moni (Touch-Me-Not)</p>
                            </div>
                        </div>
                        <ul class="additional-ingredients">
                            <li>Water</li>
                            <li>Clean cloth for tying around the stomach</li>
                        </ul>
                    </div>

                    <div class="detailed-section">
                        <h2>How To Use</h2>
                        <ul>
                            <li>Rub the Motodre Moni leaves in a circular motion between your palms to release the juice (<em>rasa</em>).</li>
                            <li>Mix a little water with the juice if needed.</li>
                            <li>Gently apply the <em>rasa</em> over the stomach area.</li>
                            <li>Tie a cloth firmly around the stomach to hold the juice in place and support the belly.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 15,
            x: 40,
            y: 65,
            category: 'remedy',
            name: 'Gantu Roga Treatment',
            description: 'Traditional remedy using Amrutha Balli for treating lumps and swellings',
            details: `
                <div class="herb-title">Gantu Roga Treatment</div>
                <div class="herb-scientific">Lumpy Skin Disease Treatment for Cattle and Humans</div>
                <div class="herb-description">A traditional remedy using Amrutha Balli (Tinospora cordifolia) to help reduce lumps and swellings in both humans and animals.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <h1>Gantu Roga Treatment</h1>
                        <div class="scientific-name">Lumpy Skin Disease Treatment for Cattle and Humans</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Purpose</h2>
                        <p>Gantu Roga, which occurs in both humans and animals, can be treated with Amrutha Balli (Tinospora cordifolia) to help reduce lumps and swellings.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <div class="herbs-gallery">
                            <div class="herb-image-container">
                                <img src="assets/amruthaballi.jpeg" alt="Amrutha Balli" class="detailed-section-image small-image">
                                <p class="image-caption">Amrutha Balli (Tinospora cordifolia)</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <ul>
                            <li>For humans, make a <em>rasa</em> (juice) from Amrutha Balli and drink it to help treat Gantu Roga.</li>
                            <li>For cattle, you can either feed Amrutha Balli directly or prepare the <em>rasa</em> and feed it to them.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 16,
            x: 45,
            y: 55,
            category: 'remedy',
            name: 'Treating Blisters',
            description: 'Traditional remedy using Neneki Soppu for treating blisters',
            details: `
                <div class="herb-title">Treating Blisters</div>
                <div class="herb-scientific">Reduce Redness and Prominence of Blisters</div>
                <div class="herb-description">A traditional remedy using Neneki Soppu (Euphorbia hirta) to treat blisters, especially those caused by lizard urine.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <h1>Treating Blisters</h1>
                        <div class="scientific-name">Reduce Redness and Prominence of Blisters</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detailed-section">
                        <h2>Purpose</h2>
                        <p>Neneki Soppu (Euphorbia hirta), also known as the asthma plant, is used to treat blisters, especially those caused when lizard urine falls on the skin. It helps reduce redness and provides relief.</p>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <div class="herbs-gallery">
                            <div class="herb-image-container">
                                <img src="assets/neneki.jpeg" alt="Neneki Soppu" class="detailed-section-image small-image">
                                <p class="image-caption">Neneki Soppu (Euphorbia hirta)</p>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <ul>
                            <li>When you pluck the plant, a white milk comes out.</li>
                            <li>Apply this milk directly onto the blister using the stem itself.</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 17,
            x: 50,
            y: 45,
            category: 'recipe',
            name: 'Nugge Soppu Motte Palya',
            description: 'Traditional recipe combining drumstick leaves with eggs',
            details: `
                <img src="assets/palyarecipe.jpg" alt="Nugge Soppu Motte Palya" class="herb-photo">
                <div class="herb-title">Nugge Soppu Motte Palya</div>
                <div class="herb-scientific">Drumstick Leaves with Eggs</div>
                <div class="herb-description">A nutritious and flavorful dish combining drumstick leaves with scrambled eggs.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/palyarecipe.jpg" alt="Nugge Soppu Motte Palya" class="detailed-photo">
                        <h1>Nugge Soppu Motte Palya</h1>
                        <div class="scientific-name">Drumstick Leaves with Eggs</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <div class="herbs-gallery">
                            <div class="herb-image-container">
                                <img src="assets/nugge.jpg" alt="Nugge Soppu" class="detailed-section-image small-image">
                                <p class="image-caption">Nugge Soppu (Drumstick Leaves)</p>
                            </div>
                        </div>
                        <ul>
                            <li>Nugge Soppu (Drumstick Leaves)</li>
                            <li>Motte (Eggs)</li>
                            <li>Bellullina (Garlic)</li>
                            <li>Irulli (Onion)</li>
                            <li>Tenginturi (Grated Coconut)</li>
                            <li>Turmeric Powder</li>
                            <li>Salt</li>
                            <li>Dried Red Chillies</li>
                            <li>Mustard Seeds</li>
                            <li>Cumin Seeds</li>
                            <li>Oil</li>
                        </ul>
                    </div>

                    <div class="detailed-section">
                        <h2>Method</h2>
                        <ol>
                            <li>Finely chop the onions and garlic.</li>
                            <li>Heat oil in a pan and add the chopped onions and garlic.</li>
                            <li>Add dried red chillies and mix well.</li>
                            <li>Add the drumstick leaves. Cover and cook until they wilt.</li>
                            <li>Crack the eggs directly into the pan and mix thoroughly with the leaves.</li>
                            <li>Add turmeric powder and salt to taste.</li>
                            <li>Once cooked, add grated coconut and mix.</li>
                            <li>Temper mustard seeds and cumin seeds in hot oil, and pour it over the palya before serving.</li>
                        </ol>
                    </div>
                </div>
            `
        },
        {
            id: 18,
            x: 55,
            y: 40,
            category: 'recipe',
            name: 'Upsaaru',
            description: 'Traditional spiced broth made with greens and lentils',
            details: `
                <img src="assets/recipe.jpg" alt="Upsaaru" class="herb-photo">
                <div class="herb-title">Upsaaru</div>
                <div class="herb-scientific">Saaru made with soppu, lentils(togarebele), and ground spices.</div>
                <div class="herb-description">A nourishing broth made with fresh greens, lentils, and ground spices.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/recipe.jpg" alt="Upsaaru" class="detailed-photo">
                        <h1>Upsaaru</h1>
                        <div class="scientific-name">Saaru made with soppu, lentils(togarebele), and ground spices.</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <ul>
                            <li>Dried red chillies</li>
                            <li>Bellullina (Garlic)</li>
                            <li>Menasu (Peppercorns)</li>
                            <li>Jeerige (Cumin)</li>
                            <li>Salt</li>
                            <li>Soppu (greens)</li>
                            <li>Tomato</li>
                            <li>Togari Bele (Toor dal)</li>
                        </ul>
                    </div>

                    <div class="detailed-section">
                        <h2>Method</h2>
                        <ol>
                            <li>Grind dried red chillies, garlic, peppercorns, cumin, and salt on a grinding stone (<em>amikallu</em>) to make a fine paste.</li>
                            <li>Scrape the paste off the stone and transfer it to a bowl.</li>
                            <li>Add some water to the grinding stone, scrape the leftover <em>khara chutney</em>, and pour this water into a separate bowl.</li>
                            <li>Boil soppu, tomato, and toor dal together for two whistles.</li>
                            <li>Drain the water from the boiled mixture into the bowl containing the <em>khara chutney</em> water.</li>
                            <li>Mix well. Upsaaru is ready.</li>
                        </ol>
                    </div>

                    <div class="detailed-section">
                        <h2>Usage Notes</h2>
                        <p>Upsaaru is a versatile broth that can be made with various types of greens (<em>soppus</em>). It's a nourishing dish that combines the goodness of greens with protein-rich lentils and warming spices.</p>
                    </div>
                </div>
            `
        },
        {
            id: 19,
            x: 60,
            y: 45,
            category: 'recipe',
            name: 'Bassaru',
            description: 'A hearty dish combining spiced broth with mashed greens and lentils',
            details: `
                <img src="assets/recipe.jpg" alt="Bassaru" class="herb-photo">
                <div class="herb-title">Bassaru</div>
                <div class="herb-scientific">Spicy and tangy saaru made with soppu, lentils and spices</div>
                <div class="herb-description">A nourishing stew that combines spiced broth with mashed greens, lentils, and coconut.</div>
                <div class="herb-metadata">
                    <div class="metadata-tag">
                        <span class="tag-label">Added by</span>
                        <span class="tag-value">Mangalamma</span>
                    </div>
                    <div class="metadata-tag">
                        <span class="tag-label">Place</span>
                        <span class="tag-value">Hunasanahalli</span>
                    </div>
                </div>
                <button class="view-more-btn">View Details</button>
            `,
            fullDetails: `
                <div class="detailed-view">
                    <div class="detailed-header">
                        <img src="assets/recipe.jpg" alt="Bassaru" class="detailed-photo">
                        <h1>Bassaru</h1>
                        <div class="scientific-name">Spicy and tangy saaru made with soppu, lentils and spices</div>
                        <div class="herb-metadata">
                            <div class="metadata-tag">
                                <span class="tag-label">Added by</span>
                                <span class="tag-value">Mangalamma</span>
                            </div>
                            <div class="metadata-tag">
                                <span class="tag-label">Place</span>
                                <span class="tag-value">Hunasanahalli</span>
                            </div>
                        </div>
                    </div>

                    <div class="detailed-section">
                        <h2>Ingredients</h2>
                        <h3>For Spice Paste</h3>
                        <ul>
                            <li>Dried red chillies</li>
                            <li>Bellullina (Garlic)</li>
                            <li>Menasu (Peppercorns)</li>
                            <li>Jeerige (Cumin)</li>
                            <li>Salt</li>
                        </ul>

                        <h3>Main Ingredients</h3>
                        <ul>
                            <li>Soppu (greens)</li>
                            <li>Tomato</li>
                            <li>Togari Bele (Toor dal)</li>
                            <li>Irulli (Onion)</li>
                            <li>Tenginturi (Grated coconut)</li>
                            <li>Sasive (Mustard seeds)</li>
                            <li>Karibevu (Curry leaves)</li>
                            <li>Oil</li>
                        </ul>
                    </div>

                    <div class="detailed-section">
                        <h2>Method</h2>
                        <ol>
                            <li>Grind dried red chillies, garlic, peppercorns, cumin, and salt on a grinding stone (<em>amikallu</em>) to make a fine paste.</li>
                            <li>Scrape the paste off the stone and transfer it to a bowl.</li>
                            <li>Add a little water to the grinding stone, scrape the leftover chutney, and pour this into a separate bowl.</li>
                            <li>Boil soppu, tomato, and toor dal together for two whistles.</li>
                            <li>Drain the water from the boiled mixture into the bowl with the <em>khara chutney</em> water. This is the <em>saaru</em> (rasam).</li>
                            <li>Take a portion of the cooked dal, soppu, and tomato mixture and mash or lightly grind it. Leave the rest as it is.</li>
                            <li>In a pan, heat oil. Add mustard seeds and curry leaves.</li>
                            <li>Add chopped onions and fry till golden.</li>
                            <li>Add the mashed mixture and stir well.</li>
                            <li>Add grated coconut and mix everything together.</li>
                        </ol>
                    </div>

                    <div class="detailed-section">
                        <h2>Serving</h2>
                        <p>Bassaru is traditionally enjoyed with <em>ragi mudde</em> or rice. The combination of mashed vegetables, lentils, and spiced broth makes it a complete and nourishing meal.</p>
                    </div>
                </div>
            `
        }
    ];

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
        
        markerContainer.appendChild(markerElement);
        markerElements.push(markerElement);
    });

    // Add zoom functionality
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');

    function updateZoom() {
        contentContainer.style.transform = `scale(${currentZoom})`;
        // Update button states
        zoomIn.disabled = currentZoom >= maxZoom;
        zoomOut.disabled = currentZoom <= minZoom;
    }

    zoomIn.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
            updateZoom();
        }
    });

    zoomOut.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom = Math.max(currentZoom - zoomStep, minZoom);
            updateZoom();
        }
    });

    // Layer control handlers
    layerControls.forEach(control => {
        control.addEventListener('change', updateMarkerVisibility);
    });

    function updateMarkerVisibility() {
        const activeCategories = Array.from(layerControls)
            .filter(input => input.checked)
            .map(input => input.id.replace('herbs', 'herb').replace('recipes', 'recipe').replace('remedies', 'remedy'));
        
        const markers = markerContainer.querySelectorAll('.marker');
        markers.forEach(markerEl => {
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
        const sidebarContent = document.querySelector('.sidebar-content');
        sidebarContent.innerHTML = content;
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

    // Add click event for view more button
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-more-btn')) {
            const currentMarker = markers.find(marker => 
                marker.details.includes(e.target.parentElement.innerHTML)
            );
            if (currentMarker) {
                showFullScreenDetails(currentMarker.fullDetails);
            }
        }
    });

    function showFullScreenDetails(content) {
        // Create full screen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'fullscreen-content';
        contentContainer.innerHTML = content;
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'fullscreen-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        // Assemble and show
        contentContainer.appendChild(closeButton);
        overlay.appendChild(contentContainer);
        document.body.appendChild(overlay);
    }
}); 