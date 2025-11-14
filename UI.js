export class UI {
    constructor(game) {
        this.game = game;
        this.titleScreen = document.getElementById('title-screen');
        this.startButton = document.getElementById('start-button');
        this.gameUI = document.getElementById('game-ui');
        this.inventoryContainer = document.getElementById('inventory');

        this.inventorySlots = 5;
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
        for (let i = 0; i < this.inventorySlots; i++) {
            const slot = document.createElement('div');
            slot.classList.add('inventory-slot');
            const img = document.createElement('img');
            img.src = 'paw_icon.png';
            slot.appendChild(img);
            this.inventoryContainer.appendChild(slot);
        }
    }
}

