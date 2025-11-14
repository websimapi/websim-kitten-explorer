import * as THREE from 'three';

export class AudioManager {
    constructor(camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.sounds = {};
    }

    loadSound(name, path, loop = false, volume = 0.5) {
        const sound = new THREE.Audio(this.listener);
        this.audioLoader.load(path, (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(loop);
            sound.setVolume(volume);
            this.sounds[name] = sound;
        });
    }

    playSound(name) {
        if (this.sounds[name]) {
            // restart if already playing for rapid pickups
            if (this.sounds[name].isPlaying) this.sounds[name].stop();
            this.sounds[name].play();
        }
    }

    startAmbientSounds() {
        this.loadSound('water', 'water_trickle.mp3', true, 0.3);
        this.loadSound('leaves', 'leaf_rustle.mp3', true, 0.4);

        setTimeout(() => {
            if (this.sounds.water) this.sounds.water.play();
            if (this.sounds.leaves) this.sounds.leaves.play();
        }, 500);
    }
}