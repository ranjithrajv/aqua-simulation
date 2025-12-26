// 3D Tank Visualization with Three.js
export class TankVisualizer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.tank = null;
        this.water = null;
        this.waterSurface = null;
        this.animationId = null;
        this.waterColor = 0x4A90E2; // Fixed Ocean Blue color
        this.time = 0; // For water animation
        this.waveSpeed = 0.02; // Wave animation speed
        this.waveHeight = 0.02; // Wave amplitude
        this.autoRotate = false; // Auto-rotate state
        this.rotateSpeed = 0.005; // Auto-rotate speed
        this.currentDistance = 0; // Track current camera distance for zoom

        console.log('TankVisualizer constructor called');
        console.log('Container:', container);
        console.log('Container exists:', !!container);

        if (!container) {
            console.error('No container provided to TankVisualizer');
            this.showFallback();
            return;
        }

        console.log('Container dimensions:', container.offsetWidth, 'x', container.offsetHeight);

        try {
            console.log('Calling init()...');
            this.init();
            console.log('init() completed successfully');
        } catch (error) {
            console.error('Failed to initialize 3D visualization:', error);
            console.error('Error stack:', error.stack);
            console.error('Error message:', error.message);
            this.showFallback();
        }
    }

    init() {
        console.log('init() method called');

        // Check if Three.js is available
        console.log('THREE defined:', typeof THREE);
        console.log('THREE.Scene:', typeof (THREE && THREE.Scene));
        console.log('THREE.WebGLRenderer:', typeof (THREE && THREE.WebGLRenderer));

        if (typeof THREE === 'undefined') {
            console.error('Three.js library not loaded');
            this.showFallback();
            return;
        }

        if (!THREE.Scene || !THREE.WebGLRenderer || !THREE.PerspectiveCamera) {
            console.error('Three.js core classes not available');
            this.showFallback();
            return;
        }

        // Container is ready for Three.js initialization
        console.log('Container ready for 3D visualization:', this.container);

        console.log('THREE.Scene available:', typeof THREE.Scene);
        console.log('Initializing Three.js scene...');

        // Ensure container has dimensions
        let width = this.container.clientWidth || this.container.offsetWidth || 400;
        let height = this.container.clientHeight || this.container.offsetHeight || 300;
        console.log('Container dimensions:', width, 'x', height);

        // If still no dimensions, try parent container
        if (width < 10 || height < 10) {
            const parent = this.container.parentElement;
            if (parent) {
                width = parent.clientWidth || parent.offsetWidth || 400;
                height = parent.clientHeight || parent.offsetHeight || 300;
                console.log('Using parent dimensions:', width, 'x', height);
            }
        }

        if (width < 10 || height < 10) {
            console.warn('Container too small, setting minimum dimensions');
            this.container.style.minWidth = '400px';
            this.container.style.minHeight = '300px';
            width = 400;
            height = 300;
        }

        // Clear container
        this.container.innerHTML = '';

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

            // Camera setup - positioned to see water clearly
            const aspect = width / height;
            this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
            this.camera.position.set(1.8, 1.5, 1.8); // Slightly lower for better water visibility
            this.camera.lookAt(0, 0.3, 0); // Look slightly up to see water surface

        // Renderer setup
        try {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            console.log('WebGLRenderer created successfully');
        } catch (rendererError) {
            console.error('Failed to create WebGL renderer:', rendererError);
            this.showFallback();
            return;
        }

        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Clear container (remove test element if present) and add renderer
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        console.log('Three.js renderer added to container, canvas size:', this.renderer.domElement.width, 'x', this.renderer.domElement.height);

        // Lighting
        this.setupLighting();

        // Create initial tank (default 4ft x 3ft x 2ft)
        this.createTank(4, 3, 2);

        // Setup controls if available
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minDistance = 1.5;
            this.controls.maxDistance = 10;
        }

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Setup event listeners for controls
        this.setupEventListeners();

        // Start animation loop
        this.animate();

        console.log('3D visualization initialized with test sphere');
    }

    createTank(width, height, depth) {
        // Dispose of old geometries
        this.disposeTank();

        // Tank geometry (box)
        const tankGeometry = new THREE.BoxGeometry(width, height, depth);
        tankGeometry.translate(0, height / 2, 0); // Center at bottom

        // Glass material with fixed transparency for water visibility
        const tankMaterial = new THREE.MeshPhongMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.2, // Fixed 20% transparency
            side: THREE.DoubleSide,
            wireframe: false
        });

        this.tank = new THREE.Mesh(tankGeometry, tankMaterial);
        this.tank.castShadow = true;
        this.tank.receiveShadow = true;
        this.scene.add(this.tank);

        // Water surface
        this.createWaterSurface(width, depth, height);

        // Adjust camera to fit tank
        this.adjustCameraToTank(width, height, depth);
    }

    createWaterSurface(width, depth, height) {
        // Dispose old water
        if (this.water) {
            this.scene.remove(this.water);
            this.water.geometry.dispose();
            this.water.material.dispose();
        }

        // Single, highly visible water volume filling 85% of tank
        const waterGeometry = new THREE.BoxGeometry(width * 0.96, height * 0.85, depth * 0.96);
        const waterMaterial = new THREE.MeshBasicMaterial({
            color: this.waterColor,
            transparent: true,
            opacity: 0.8 // High visibility
        });

        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
        this.water.position.y = height * 0.425; // Center of water volume
        this.scene.add(this.water);

        // Optional: Add a subtle surface highlight
        const surfaceGeometry = new THREE.PlaneGeometry(width * 0.97, depth * 0.97);
        const surfaceMaterial = new THREE.MeshBasicMaterial({
            color: this.waterColor,
            transparent: true,
            opacity: 0.3 // Subtle highlight
        });

        this.waterSurface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
        this.waterSurface.rotation.x = -Math.PI / 2;
        this.waterSurface.position.y = height * 0.85; // At water surface level
        this.scene.add(this.waterSurface);

        console.log('Water surface created at y:', this.water.position.y, 'with color:', this.water.material.color.getHex().toString(16));

        console.log('Water created with initial color:', this.water.material.color.getHex().toString(16));
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Point light for additional illumination
        const pointLight = new THREE.PointLight(0xffffff, 0.3);
        pointLight.position.set(-3, 3, -3);
        this.scene.add(pointLight);
    }

    adjustCameraToTank(width, height, depth) {
        const maxDimension = Math.max(width, height, depth);
        const distance = maxDimension * 2;

        if (this.controls) {
            this.controls.minDistance = maxDimension * 0.5;
            this.controls.maxDistance = maxDimension * 4;
        }

        // Reset camera position
        this.camera.position.set(distance, distance * 0.8, distance);
        if (this.controls) {
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        } else {
            this.camera.lookAt(0, 0, 0);
        }
    }

    updateDimensions(width, height, depth) {
        if (this.scene && this.renderer) {
            // Update 3D tank dimensions
            this.createTank(width, height, depth);

            // Ensure water colors are preserved after dimension update
            if (this.water && this.water.material) {
                this.water.material.color.setHex(this.waterColor);
            }
            if (this.waterSurface && this.waterSurface.material) {
                this.waterSurface.material.color.setHex(this.waterColor);
            }

            console.log('3D tank updated to dimensions:', width, height, depth);
        } else {
            console.warn('3D visualization not available for dimension updates');
        }
    }

    animate() {
        if (!this.scene || !this.renderer || !this.camera) return;

        this.animationId = requestAnimationFrame(() => this.animate());

        // Update water animation
        this.animateWater();

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    animateWater() {
        this.time += this.waveSpeed;

        // Animate water surface highlight with gentle waves
        if (this.waterSurface && this.waterSurface.geometry) {
            const positions = this.waterSurface.geometry.attributes.position;
            const vertexCount = positions.count;

            for (let i = 0; i < vertexCount; i++) {
                const x = positions.getX(i);
                const z = positions.getZ(i);

                // Create subtle wave pattern
                const wave1 = Math.sin(x * 0.2 + this.time) * this.waveHeight * 0.5;
                const wave2 = Math.sin(z * 0.3 + this.time * 0.7) * this.waveHeight * 0.3;
                const ripple = Math.sin(Math.sqrt(x * x + z * z) * 0.3 + this.time * 1.5) * this.waveHeight * 0.2;

                const y = wave1 + wave2 + ripple;

                positions.setY(i, y);
            }

            positions.needsUpdate = true;
            this.waterSurface.geometry.computeVertexNormals();
        }

        // Add very subtle bobbing motion to main water volume
        if (this.water) {
            this.water.position.y = (this.tank ? this.tank.geometry.parameters.height * 0.425 : 0.5) +
                                   Math.sin(this.time * 0.3) * 0.002; // Extremely subtle
        }
    }

    setupEventListeners() {
        // Setup external control buttons
        window.setViewPreset = (preset) => this.setViewPreset(preset);
        window.toggleAutoRotate = () => this.toggleAutoRotate();
        window.zoomIn = () => this.zoomIn();
        window.zoomOut = () => this.zoomOut();
        window.resetView = () => this.resetView();
    }

    setViewPreset(preset) {
        if (!this.camera || !this.controls) return;

        const tank = this.tank;
        if (!tank) return;

        const width = tank.geometry.parameters.width;
        const height = tank.geometry.parameters.height;
        const depth = tank.geometry.parameters.depth;
        const maxDim = Math.max(width, height, depth);
        const distance = maxDim * 2.5;

        switch(preset) {
            case 'front':
                this.camera.position.set(0, height * 0.5, distance);
                break;
            case 'side':
                this.camera.position.set(distance, height * 0.5, 0);
                break;
            case 'top':
                this.camera.position.set(0, distance, 0.1);
                break;
            case 'isometric':
                this.camera.position.set(distance * 0.7, distance * 0.7, distance * 0.7);
                break;
            default:
                return;
        }

        this.controls.target.set(0, height * 0.3, 0);
        this.controls.update();
        this.currentDistance = distance;
        console.log('View preset set to:', preset);
    }

    toggleAutoRotate() {
        if (!this.controls) return;

        this.autoRotate = !this.autoRotate;
        this.controls.autoRotate = this.autoRotate;
        this.controls.autoRotateSpeed = this.autoRotate ? 2.0 : 0;

        const toggleBtn = document.getElementById('autoRotateToggle');
        if (toggleBtn) {
            toggleBtn.classList.toggle('active', this.autoRotate);
        }

        console.log('Auto-rotate:', this.autoRotate ? 'enabled' : 'disabled');
    }

    zoomIn() {
        if (!this.camera || !this.controls) return;

        const tank = this.tank;
        if (!tank) return;

        const minDistance = this.controls.minDistance || 1.5;
        const zoomAmount = 0.2;

        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);

        const newPosition = this.camera.position.clone().add(direction.multiplyScalar(zoomAmount));

        if (newPosition.length() >= minDistance) {
            this.camera.position.copy(newPosition);
            this.currentDistance = newPosition.length();
        }

        console.log('Zoom in - Distance:', this.currentDistance);
    }

    zoomOut() {
        if (!this.camera || !this.controls) return;

        const tank = this.tank;
        if (!tank) return;

        const maxDistance = this.controls.maxDistance || 10;
        const zoomAmount = 0.2;

        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.negate();

        this.camera.position.add(direction.multiplyScalar(zoomAmount));

        const newDistance = this.camera.position.length();
        if (newDistance <= maxDistance) {
            this.currentDistance = newDistance;
        }

        console.log('Zoom out - Distance:', this.currentDistance);
    }

    resetView() {
        if (!this.camera || !this.controls) return;

        const tank = this.tank;
        if (!tank) return;

        const width = tank.geometry.parameters.width;
        const height = tank.geometry.parameters.height;
        const depth = tank.geometry.parameters.depth;
        const maxDim = Math.max(width, height, depth);
        const distance = maxDim * 2;

        this.camera.position.set(distance, distance * 0.8, distance);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.currentDistance = distance;

        // Disable auto-rotate if active
        if (this.autoRotate) {
            this.toggleAutoRotate();
        }

        console.log('View reset');
    }

    disposeTank() {
        if (this.tank) {
            this.scene.remove(this.tank);
            this.tank.geometry.dispose();
            this.tank.material.dispose();
            this.tank = null;
        }

        if (this.water) {
            this.scene.remove(this.water);
            this.water.geometry.dispose();
            this.water.material.dispose();
            this.water = null;
        }

        if (this.waterSurface) {
            this.scene.remove(this.waterSurface);
            this.waterSurface.geometry.dispose();
            this.waterSurface.material.dispose();
            this.waterSurface = null;
        }
    }

    onWindowResize() {
        if (!this.camera || !this.renderer || !this.container) return;

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    showFallback() {
        console.log('Showing fallback for visualizer');
        if (this.container) {
            this.container.innerHTML = `
                <div style="width:100%;height:100%;background:#ffebee;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;border:2px solid #f44336;border-radius:8px;">
                    <div style="font-size:48px;margin-bottom:10px;">⚠️</div>
                    <div style="color:#c62828;font-weight:bold;margin-bottom:10px;font-size:18px;">3D Visualization Unavailable</div>
                    <div style="color:#666;font-size:14px;max-width:300px;">The aquarium calculations are still working.<br><br>Possible causes:<br>• Three.js library not loaded<br>• WebGL not supported<br>• Container sizing issues<br><br>Try refreshing the page.</div>
                </div>
            `;
            console.log('Fallback HTML added to container');
        } else {
            console.error('No container available for fallback');
        }
    }


}