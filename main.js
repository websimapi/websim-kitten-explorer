import * as THREE from 'three';
import { PlayerController } from './PlayerController.js';
import { World } from './World.js';
import { UI } from './UI.js';
import { AudioManager } from './AudioManager.js';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game-canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.clock = new THREE.Clock();
        this.audioManager = new AudioManager(this.camera);

        this.setupEventListeners();
        
        this.ui = new UI(this);
        this.world = new World(this.scene, this.audioManager);
        this.playerController = new PlayerController(this.scene, this.camera, this.renderer.domElement, this);
        this.ui.setMobile(this.playerController.isMobile);

        this.animate();
    }

    startGame() {
        this.world.init();
        this.playerController.init();
        this.audioManager.startAmbientSounds();
        this.audioManager.loadSound('collect', 'collect_item.mp3', false, 0.6);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const deltaTime = this.clock.getDelta();

        if (this.playerController && this.playerController.isInitialized) {
            this.playerController.update(deltaTime);
            // Check collectible interactions
            const collected = this.world.checkCollectibles(this.playerController.player.position);
            if (collected > 0) {
                for (let i = 0; i < collected; i++) {
                    this.ui.addCollectedItem();
                    this.audioManager.playSound('collect');
                }
            }
        }
        if (this.world) {
            this.world.update(deltaTime);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

new Game();

