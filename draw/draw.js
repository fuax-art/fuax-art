
        class UrbanCanvas {
            constructor() {
                this.canvas = document.getElementById('drawingCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.previewCanvas = document.getElementById('previewCanvas');
                this.previewCtx = this.previewCanvas.getContext('2d');
                this.gridCanvas = document.getElementById('gridCanvas');
                this.gridCtx = this.gridCanvas.getContext('2d');
                
                this.isDrawing = false;
                this.currentBrush = 'concrete';
                this.currentColor = '#e74c3c';
                this.brushSize = 15;
                this.brushOpacity = 100;
                this.textureIntensity = 50;
                this.lastX = 0;
                this.lastY = 0;
                this.undoStack = [];
                
                this.initializeCanvas();
                this.bindEvents();
                this.drawGrid();
                this.updatePreview();
            }

            initializeCanvas() {
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.saveState();
            }

            bindEvents() {
                // Canvas events
                this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
                this.canvas.addEventListener('mousemove', this.draw.bind(this));
                this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
                this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
                this.canvas.addEventListener('mousemove', this.updateCoordinates.bind(this));

                // Brush selection
                document.querySelectorAll('.brush-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.currentBrush = btn.dataset.brush;
                        document.getElementById('currentBrush').textContent = this.currentBrush.toUpperCase();
                        this.updatePreview();
                    });
                });

                // Color picker
                document.getElementById('colorPicker').addEventListener('change', (e) => {
                    this.currentColor = e.target.value;
                    this.updatePreview();
                });

                // Color presets
                document.querySelectorAll('.color-preset').forEach(preset => {
                    preset.addEventListener('click', (e) => {
                        this.currentColor = preset.dataset.color;
                        document.getElementById('colorPicker').value = this.currentColor;
                        this.updatePreview();
                    });
                });

                // Sliders
                document.getElementById('brushSize').addEventListener('input', (e) => {
                    this.brushSize = parseInt(e.target.value);
                    document.getElementById('sizeValue').textContent = this.brushSize;
                    document.getElementById('statusSize').textContent = this.brushSize;
                    this.updatePreview();
                });

                document.getElementById('brushOpacity').addEventListener('input', (e) => {
                    this.brushOpacity = parseInt(e.target.value);
                    document.getElementById('opacityValue').textContent = this.brushOpacity;
                    this.updatePreview();
                });

                document.getElementById('brushTexture').addEventListener('input', (e) => {
                    this.textureIntensity = parseInt(e.target.value);
                    document.getElementById('textureValue').textContent = this.textureIntensity;
                    this.updatePreview();
                });

                // Actions
                document.getElementById('clearCanvas').addEventListener('click', () => {
                    this.clearCanvas();
                });

                document.getElementById('undoAction').addEventListener('click', () => {
                    this.undo();
                });
            }

            startDrawing(e) {
                this.isDrawing = true;
                const rect = this.canvas.getBoundingClientRect();
                this.lastX = e.clientX - rect.left;
                this.lastY = e.clientY - rect.top;
                this.saveState();
            }

            draw(e) {
                if (!this.isDrawing) return;

                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                this.applyBrush(currentX, currentY);

                this.lastX = currentX;
                this.lastY = currentY;
            }

            stopDrawing() {
                this.isDrawing = false;
            }

            applyBrush(x, y) {
                const opacity = this.brushOpacity / 100;
                this.ctx.globalAlpha = opacity;
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.fillStyle = this.currentColor;

                switch (this.currentBrush) {
                    case 'concrete':
                        this.drawConcrete(x, y);
                        break;
                    case 'metal':
                        this.drawMetal(x, y);
                        break;
                    case 'spray':
                        this.drawSpray(x, y);
                        break;
                    case 'rust':
                        this.drawRust(x, y);
                        break;
                    case 'neon':
                        this.drawNeon(x, y);
                        break;
                    case 'wire':
                        this.drawWire(x, y);
                        break;
                    case 'smoke':
                        this.drawSmoke(x, y);
                        break;
                    case 'glass':
                        this.drawGlass(x, y);
                        break;
                    case 'carbon':
                        this.drawCarbon(x, y);
                        break;
                }

                this.ctx.globalAlpha = 1;
            }

            drawConcrete(x, y) {
                this.ctx.lineWidth = this.brushSize;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();

                // Add texture
                for (let i = 0; i < this.textureIntensity / 10; i++) {
                    const offsetX = (Math.random() - 0.5) * this.brushSize;
                    const offsetY = (Math.random() - 0.5) * this.brushSize;
                    this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
                }
            }

            drawMetal(x, y) {
                this.ctx.lineWidth = this.brushSize;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();

                // Add metallic shine
                this.ctx.globalAlpha = 0.3;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = this.brushSize * 0.3;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }

            drawSpray(x, y) {
                const particles = this.brushSize * 2;
                for (let i = 0; i < particles; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * this.brushSize;
                    const px = x + Math.cos(angle) * distance;
                    const py = y + Math.sin(angle) * distance;
                    
                    this.ctx.globalAlpha = (this.brushOpacity / 100) * (1 - distance / this.brushSize);
                    this.ctx.fillRect(px, py, 1, 1);
                }
            }

            drawRust(x, y) {
                this.ctx.lineWidth = this.brushSize;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();

                // Add rust texture
                for (let i = 0; i < this.textureIntensity / 5; i++) {
                    const offsetX = (Math.random() - 0.5) * this.brushSize * 1.5;
                    const offsetY = (Math.random() - 0.5) * this.brushSize * 1.5;
                    this.ctx.globalAlpha = Math.random() * 0.5;
                    this.ctx.fillRect(x + offsetX, y + offsetY, 2, 2);
                }
            }

            drawNeon(x, y) {
                // Outer glow
                this.ctx.shadowColor = this.currentColor;
                this.ctx.shadowBlur = this.brushSize;
                this.ctx.lineWidth = this.brushSize * 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();

                // Inner bright line
                this.ctx.shadowBlur = 0;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = this.brushSize * 0.2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }

            drawWire(x, y) {
                this.ctx.lineWidth = Math.max(1, this.brushSize * 0.3);
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();

                // Add wire segments
                const distance = Math.sqrt((x - this.lastX) ** 2 + (y - this.lastY) ** 2);
                const steps = Math.floor(distance / 5);
                for (let i = 0; i < steps; i++) {
                    const t = i / steps;
                    const px = this.lastX + (x - this.lastX) * t;
                    const py = this.lastY + (y - this.lastY) * t;
                    this.ctx.fillRect(px - 1, py - 1, 2, 2);
                }
            }

            drawSmoke(x, y) {
                const particles = this.brushSize;
                for (let i = 0; i < particles; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * this.brushSize * 2;
                    const px = x + Math.cos(angle) * distance;
                    const py = y + Math.sin(angle) * distance;
                    
                    this.ctx.globalAlpha = (this.brushOpacity / 100) * (1 - distance / (this.brushSize * 2)) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.arc(px, py, Math.random() * 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            drawGlass(x, y) {
                this.ctx.globalAlpha = (this.brushOpacity / 100) * 0.3;
                this.ctx.lineWidth = this.brushSize;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();

                // Add glass reflection
                this.ctx.globalAlpha = 0.6;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = this.brushSize * 0.1;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }

            drawCarbon(x, y) {
                this.ctx.lineWidth = this.brushSize;
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();

                // Add carbon fiber pattern
                for (let i = 0; i < this.textureIntensity / 20; i++) {
                    const offsetX = (Math.random() - 0.5) * this.brushSize;
                    const offsetY = (Math.random() - 0.5) * this.brushSize;
                    this.ctx.strokeStyle = '#333333';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x + offsetX, y + offsetY);
                    this.ctx.lineTo(x + offsetX + 3, y + offsetY);
                    this.ctx.stroke();
                }
            }

            updatePreview() {
                this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
                this.previewCtx.fillStyle = this.currentColor;
                this.previewCtx.globalAlpha = this.brushOpacity / 100;
                
                const centerX = this.previewCanvas.width / 2;
                const centerY = this.previewCanvas.height / 2;
                const previewSize = Math.min(this.brushSize, 20);
                
                this.previewCtx.beginPath();
                this.previewCtx.arc(centerX, centerY, previewSize, 0, Math.PI * 2);
                this.previewCtx.fill();
                
                this.previewCtx.globalAlpha = 1;
            }

            updateCoordinates(e) {
                const rect = this.canvas.getBoundingClientRect();
                const x = Math.round(e.clientX - rect.left);
                const y = Math.round(e.clientY - rect.top);
                document.getElementById('coordinates').textContent = `${x}, ${y}`;
            }

            saveState() {
                this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
                if (this.undoStack.length > 20) {
                    this.undoStack.shift();
                }
            }

            undo() {
                if (this.undoStack.length > 1) {
                    this.undoStack.pop();
                    const previousState = this.undoStack[this.undoStack.length - 1];
                    this.ctx.putImageData(previousState, 0, 0);
                }
            }

            clearCanvas() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.saveState();
            }

            drawGrid() {
                const gridSize = 20;
                this.gridCtx.strokeStyle = '#34495e';
                this.gridCtx.lineWidth = 0.5;
                
                for (let x = 0; x <= this.gridCanvas.width; x += gridSize) {
                    this.gridCtx.beginPath();
                    this.gridCtx.moveTo(x, 0);
                    this.gridCtx.lineTo(x, this.gridCanvas.height);
                    this.gridCtx.stroke();
                }
                
                for (let y = 0; y <= this.gridCanvas.height; y += gridSize) {
                    this.gridCtx.beginPath();
                    this.gridCtx.moveTo(0, y);
                    this.gridCtx.lineTo(this.gridCanvas.width, y);
                    this.gridCtx.stroke();
                }
            }
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            new UrbanCanvas();
        });