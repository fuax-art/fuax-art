// Portfolio data structure - Replace with your actual image data
        const portfolioData = {
            'digital-art': [
                { title: 'Coming Soon', thumbnail: 'assets/images/digital-art/thumbs/placeholder.jpg', fullsize: 'assets/images/digital-art/full/placeholder.jpg' }
            ],
            'canvas': [
                { title: 'DMT spirit walker', thumbnail: 'assets/images/canvas/thumbs/canvasthumb1.jpg', fullsize: 'assets/images/canvas/full/canvas1.jpg' },
                { title: 'Duality', thumbnail: 'assets/images/canvas/thumbs/canvasthumb2.jpg', fullsize: 'assets/images/canvas/full/canvas2.png' },
                { title: 'Shadow Friends', thumbnail: 'assets/images/canvas/thumbs/canvasthumb3.jpeg', fullsize: 'assets/images/canvas/full/canvas3.jpeg' },
                { title: 'Cognitive Disarray', thumbnail: 'assets/images/canvas/thumbs/canvasthumb4.jpeg', fullsize: 'assets/images/canvas/full/canvas4.jpeg' },
                { title: 'Fuck', thumbnail: 'assets/images/canvas/thumbs/canvasthumb5.jpg', fullsize: 'assets/images/canvas/full/canvas5.jpg' },
                { title: 'Support', thumbnail: 'assets/images/canvas/thumbs/canvasthumb6.jpg', fullsize: 'assets/images/canvas/full/canvas6.jpg' },
                { title: 'Internal Warfare', thumbnail: 'assets/images/canvas/thumbs/canvasthumb7.jpeg', fullsize: 'assets/images/canvas/full/canvas7.jpeg' },
                { title: 'Smile', thumbnail: 'assets/images/canvas/thumbs/canvasthumb8.jpg', fullsize: 'assets/images/canvas/full/canvas8.jpg' },
                { title: 'Row Your boat, I got my own', thumbnail: 'assets/images/canvas/thumbs/canvasthumb9.jpg', fullsize: 'assets/images/canvas/full/canvas9.jpg' }
            ],
            'ontheWall': [
                { title: 'Coming Soon', thumbnail: 'assets/images/out-in-the-Street/thumbs/placeholder.jpg', fullsize: 'assets/images/out-in-the-Street/full/placeholder.jpg' }
            ],
            'aIrt': [
                { title: 'Coming Soon', thumbnail: 'assets/images/aIrt/thumbs/placeholder.jpg', fullsize: 'assets/images/aIrt/full/placeholder.jpg' }
            ]
        };

        let currentFilter = 'all';
        let currentPage = 0;
        const itemsPerPage = 12;
        let allItems = [];

        // --- Vortex sound for loader ---
        let vortexAudioCtx;
        let vortexOsc;
        let vortexGain;

        function playVortexSound() {
            if (vortexAudioCtx) return; // Prevent multiple
            vortexAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            vortexOsc = vortexAudioCtx.createOscillator();
            vortexGain = vortexAudioCtx.createGain();

            vortexOsc.type = 'sawtooth';
            vortexOsc.frequency.setValueAtTime(10, vortexAudioCtx.currentTime); // Deeper start
            vortexOsc.frequency.linearRampToValueAtTime(144, vortexAudioCtx.currentTime + 1.7); // Lower sweep
            vortexGain.gain.setValueAtTime(0.18, vortexAudioCtx.currentTime);
            vortexGain.gain.linearRampToValueAtTime(0.01, vortexAudioCtx.currentTime + 1.7);

            vortexOsc.connect(vortexGain);
            vortexGain.connect(vortexAudioCtx.destination);

            vortexOsc.start();
            vortexOsc.stop(vortexAudioCtx.currentTime + 1.7);

            vortexOsc.onended = () => {
                vortexAudioCtx.close();
                vortexAudioCtx = null;
            };
        }

        function stopVortexSound() {
            if (vortexOsc) vortexOsc.stop();
            if (vortexAudioCtx) vortexAudioCtx.close();
            vortexAudioCtx = null;
        }

        // Initialize the gallery
        function init() {
            // Flatten all portfolio items for 'all' filter
            allItems = [];
            Object.keys(portfolioData).forEach(category => {
                portfolioData[category].forEach(item => {
                    allItems.push({...item, category});
                });
            });

            loadItems();
            setupEventListeners();
        }

        // Load items based on current filter and page
        function loadItems() {
            const loading = document.getElementById('loading');
            loading.style.display = 'block';
            playVortexSound(); // Play vortex sound

            // Simulate loading delay (remove this in production)
            setTimeout(() => {
                const gallery = document.getElementById('gallery');
                const items = getFilteredItems();
                const startIndex = currentPage * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageItems = items.slice(startIndex, endIndex);

                if (currentPage === 0) {
                    gallery.innerHTML = '';
                }

                pageItems.forEach(item => {
                    const galleryItem = createGalleryItem(item);
                    gallery.appendChild(galleryItem);
                });

                // Update load more button
                const loadMoreBtn = document.getElementById('loadMore');
                if (endIndex >= items.length) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'block';
                }

                loading.style.display = 'none';
                stopVortexSound(); // Stop vortex sound
            }, 500);
        }

        // Get filtered items based on current filter
        function getFilteredItems() {
            if (currentFilter === 'all') {
                return allItems;
            } else {
                return portfolioData[currentFilter] || [];
            }
        }

        // Create gallery item element
        function createGalleryItem(item) {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                <div class="item-info">
                    <div class="item-title">${item.title}</div>
                    <div class="item-category">${item.category.replace('-', ' ')}</div>
                </div>
            `;

            // Add click event for modal
            div.addEventListener('click', () => {
                openModal(item.fullsize, item.title);
            });

            return div;
        }

        // Setup event listeners
        function setupEventListeners() {
            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Update active filter
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    currentFilter = e.target.dataset.filter;
                    currentPage = 0;
                    playVortexSound(); // <-- Play sound on user interaction
                    loadItems();
                });
            });

            // Load more button
            document.getElementById('loadMore').addEventListener('click', () => {
                currentPage++;
                playVortexSound(); // <-- Play sound on user interaction
                loadItems();
            });

            // Modal events
            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('modal').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    closeModal();
                }
            });

            // Keyboard events
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        }

        // Modal functions
        function openModal(imageSrc, title) {
            const modal = document.getElementById('modal');
            const modalImg = document.getElementById('modalImg');
            modal.style.display = 'block';
            modalImg.src = imageSrc;
            modalImg.alt = title;
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
