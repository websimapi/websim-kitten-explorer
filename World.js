import * as THREE from 'three';

export class World {
    constructor(scene, audioManager) {
        this.scene = scene;
        this.audioManager = audioManager;
        this.collectibles = [];
    }

    init() {
        this.setupLights();
        this.createGround();
        this.createWater();
        this.createTrees();
        this.createCollectibles();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xadd8e6, 1.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
        directionalLight.position.set(10, 20, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    createGround() {
        const textureLoader = new THREE.TextureLoader();
        const grassTexture = textureLoader.load('grass_texture.png');
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(20, 20);

        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    createWater() {
        const textureLoader = new THREE.TextureLoader();
        const waterTexture = textureLoader.load('water_texture.png');
        waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
        waterTexture.repeat.set(10, 10);
        
        this.waterMaterial = new THREE.MeshStandardMaterial({
            map: waterTexture,
            color: 0x6ca0dc,
            transparent: true,
            opacity: 0.8,
            roughness: 0.2,
            metalness: 0.1
        });
        
        const waterGeometry = new THREE.PlaneGeometry(30, 30);
        const water = new THREE.Mesh(waterGeometry, this.waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 0.05;
        this.scene.add(water);
    }
    
    createTrees() {
        const textureLoader = new THREE.TextureLoader();
        const barkTexture = textureLoader.load('tree_bark.png');
        const treeGeometry = new THREE.CylinderGeometry(0.5, 0.7, 15, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({ map: barkTexture });

        for (let i = 0; i < 30; i++) {
            const tree = new THREE.Mesh(treeGeometry, treeMaterial);
            const angle = Math.random() * Math.PI * 2;
            const radius = 20 + Math.random() * 20;
            tree.position.set(Math.cos(angle) * radius, 7.5, Math.sin(angle) * radius);
            tree.castShadow = true;
            this.scene.add(tree);
        }
    }
    
    createCollectibles() {
        const collectibleGeometry = new THREE.IcosahedronGeometry(0.15, 0);
        const collectibleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xccaa00,
            roughness: 0.3,
            metalness: 0.5,
        });

        for (let i = 0; i < 20; i++) {
            const collectible = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            collectible.position.set(x, 0.5, z);
            collectible.castShadow = true;
            this.scene.add(collectible);
            this.collectibles.push(collectible);
        }
    }

    checkCollectibles(playerPosition, radius = 0.6) {
        let collectedCount = 0;
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const item = this.collectibles[i];
            if (item.position.distanceTo(playerPosition) <= radius) {
                this.scene.remove(item);
                this.collectibles.splice(i, 1);
                collectedCount++;
            }
        }
        return collectedCount;
    }

    update(deltaTime) {
        if (this.waterMaterial) {
             this.waterMaterial.map.offset.x += deltaTime * 0.01;
             this.waterMaterial.map.offset.y += deltaTime * 0.005;
        }
    }
}

