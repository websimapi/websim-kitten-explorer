export class UI {
    constructor(game) {
        this.game = game;
        this.titleScreen = document.getElementById('title-screen');
        this.startButton = document.getElementById('start-button');
        this.gameUI = document.getElementById('game-ui');
        this.inventoryContainer = document.getElementById('inventory');
        this.joystickContainer = document.getElementById('joystick-container');

        this.inventorySlots = 5;
        this.collectedCount = 0;
        this.createInventoryUI();

        this.startButton.addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.titleScreen.style.opacity = 0;
        this.titleScreen.addEventListener('transitionend', () => {
            this.titleScreen.classList.add('hidden');
        }, { once: true });
        
        this.gameUI.classList.remove('hidden');
        this.game.startGame();
    }

    createInventoryUI() {
        this.slots = [];
        for (let i = 0; i < this.inventorySlots; i++) {
            const slot = document.createElement('div');
            slot.classList.add('inventory-slot');
            const img = document.createElement('img');
            img.src = 'paw_icon.png';
            img.style.opacity = '0.3';
            slot.appendChild(img);
            this.inventoryContainer.appendChild(slot);
            this.slots.push(img);
        }
    }

    addCollectedItem() {
        if (this.collectedCount >= this.inventorySlots) return;
        const img = this.slots[this.collectedCount];
        img.style.opacity = '1';
        img.style.transform = 'scale(1.1)';
        img.style.transition = 'transform 120ms ease';
        setTimeout(() => {
            img.style.transform = 'scale(1)';
        }, 120);
        this.collectedCount++;
    }

    setMobile(isMobile) {
        if (!isMobile) {
            this.joystickContainer.style.display = 'none';
        }
    }
}

