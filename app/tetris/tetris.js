class TetrisGame {
    constructor() {
        this.renderUI();
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');

        // 缩小游戏尺寸
        this.grid = this.createMatrix(10, 20);
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;

        // 减小方块大小（从30缩小到20）
        this.blockSize = 20;
        this.dropInterval = 1000;
        this.dropStart = Date.now();

        this.pieces = [
            { shape: [[1, 1, 1, 1]], color: '#00f0f0', name: 'I' },
            { shape: [[1, 1], [1, 1]], color: '#f0f000', name: 'O' },
            { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0', name: 'T' },
            { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000', name: 'S' },
            { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000', name: 'Z' },
            { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0', name: 'J' },
            { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000', name: 'L' }
        ];

        this.currentPiece = this.randomPiece();
        this.nextPiece = this.randomPiece();

        this.initializeEventListeners();
        this.updateDisplay();
        this.drawNextPiece();
        this.gameLoop();
    }

    // 渲染UI
    renderUI() {
        const gameRoot = document.getElementById('gameRoot');
        const html = `
            <div class="container mx-auto px-4 py-4">
                <header class="text-center mb-4">
                    <h1 class="text-2xl font-bold mb-1">俄罗斯方块</h1>
                    <p class="text-blue-200 text-sm">使用方向键控制，空格键旋转</p>
                </header>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div class="lg:col-span-2">
                        <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
                            <div class="flex justify-between items-center mb-3">
                                <h2 class="text-lg font-semibold">游戏区域</h2>
                                <div class="flex gap-2">
                                    <button id="startBtn" class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors">
                                        <i class="fas fa-play mr-1"></i>开始
                                    </button>
                                    <button id="pauseBtn" class="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm transition-colors">
                                        <i class="fas fa-pause mr-1"></i>暂停
                                    </button>
                                    <button id="resetBtn" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors">
                                        <i class="fas fa-redo mr-1"></i>重置
                                    </button>
                                </div>
                            </div>

                            <div class="game-container bg-gray-900 rounded-lg p-3 border-2 border-blue-500">
                                <canvas id="gameCanvas" width="200" height="400" class="block mx-auto bg-gray-800 rounded"></canvas>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
                            <h3 class="text-base font-semibold mb-3">游戏信息</h3>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>分数:</span>
                                    <span id="score" class="text-yellow-400 font-bold">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>等级:</span>
                                    <span id="level" class="text-green-400 font-bold">1</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>消除行数:</span>
                                    <span id="lines" class="text-blue-400 font-bold">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>下一个:</span>
                                </div>
                                <div class="bg-gray-700 rounded p-2 mt-2">
                                    <canvas id="nextCanvas" width="80" height="80" class="block mx-auto"></canvas>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
                            <h3 class="text-base font-semibold mb-3">游戏控制</h3>
                            <div class="grid grid-cols-2 gap-2 text-xs">
                                <div class="bg-gray-700 rounded p-2 text-center">
                                    <i class="fas fa-arrow-left text-lg mb-1"></i>
                                    <div>左移</div>
                                </div>
                                <div class="bg-gray-700 rounded p-2 text-center">
                                    <i class="fas fa-arrow-right text-lg mb-1"></i>
                                    <div>右移</div>
                                </div>
                                <div class="bg-gray-700 rounded p-2 text-center">
                                    <i class="fas fa-arrow-down text-lg mb-1"></i>
                                    <div>加速</div>
                                </div>
                                <div class="bg-gray-700 rounded p-2 text-center">
                                    <i class="fas fa-sync-alt text-lg mb-1"></i>
                                    <div>旋转</div>
                                </div>
                                <div class="bg-gray-700 rounded p-2 text-center">
                                    <i class="fas fa-space-shuttle text-lg mb-1"></i>
                                    <div>空格</div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 rounded-xl p-4 shadow-xl">
                            <h3 class="text-base font-semibold mb-3">游戏规则</h3>
                            <ul class="space-y-1 text-xs text-gray-300">
                                <li><i class="fas fa-check text-green-400 mr-1"></i>消除完整行获得分数</li>
                                <li><i class="fas fa-check text-green-400 mr-1"></i>等级越高下落速度越快</li>
                                <li><i class="fas fa-check text-green-400 mr-1"></i>方块堆到顶部游戏结束</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="gameStatus" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 p-6 rounded-xl text-center hidden">
                <h3 class="text-xl font-bold mb-3" id="statusText"></h3>
                <button id="closeStatus" class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm transition-colors">
                    确定
                </button>
            </div>
        `;
        gameRoot.innerHTML = html;
    }

    createMatrix(width, height) {
        const matrix = [];
        for (let h = 0; h < height; h++) {
            matrix.push(new Array(width).fill(0));
        }
        return matrix;
    }

    randomPiece() {
        const piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        return {
            shape: piece.shape,
            color: piece.color,
            name: piece.name,
            x: Math.floor(10 / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }

    drawBlock(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
        
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x * this.blockSize + 1, y * this.blockSize + 1, this.blockSize - 2, this.blockSize - 2);
    }

    drawBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x]) {
                    this.drawBlock(this.ctx, x, y, this.grid[y][x]);
                }
            }
        }
        
        this.drawPiece(this.ctx, this.currentPiece);
        
        this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= 10; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, 400);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= 20; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(200, y * this.blockSize);
            this.ctx.stroke();
        }
    }

    drawPiece(ctx, piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.drawBlock(ctx, piece.x + x, piece.y + y, piece.color);
                }
            });
        });
    }

    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        const piece = this.nextPiece;
        const offsetX = (4 - piece.shape[0].length) / 2;
        const offsetY = (4 - piece.shape.length) / 2;
        
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.drawBlock(this.nextCtx, offsetX + x, offsetY + y, piece.color);
                }
            });
        });
    }

    collide(piece, grid, offset = {x: 0, y: 0}) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] && 
                    (grid[piece.y + y + offset.y] && 
                    grid[piece.y + y + offset.y][piece.x + x + offset.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    rotate(piece) {
        const rotated = [];
        for (let i = 0; i < piece.shape[0].length; i++) {
            rotated.push([]);
            for (let j = piece.shape.length - 1; j >= 0; j--) {
                rotated[i].push(piece.shape[j][i]);
            }
        }
        return rotated;
    }

    merge() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.grid[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.color;
                }
            });
        });
    }

    sweep() {
        let linesCleared = 0;
        outer: for (let y = this.grid.length - 1; y >= 0; y--) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (!this.grid[y][x]) {
                    continue outer;
                }
            }
            
            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(row);
            linesCleared++;
            y++;
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            
            this.updateDisplay();
        }
    }

    move(offsetX, offsetY) {
        if (this.isPaused || this.gameOver) return;
        
        this.currentPiece.x += offsetX;
        this.currentPiece.y += offsetY;
        
        if (this.collide(this.currentPiece, this.grid)) {
            this.currentPiece.x -= offsetX;
            this.currentPiece.y -= offsetY;
            
            if (offsetY > 0) {
                this.merge();
                this.sweep();
                this.resetPiece();
                
                if (this.collide(this.currentPiece, this.grid)) {
                    this.gameOver = true;
                    this.showStatus('游戏结束！');
                }
            }
        }
    }

    rotatePiece() {
        if (this.isPaused || this.gameOver) return;
        
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = this.rotate(this.currentPiece);
        
        if (this.collide(this.currentPiece, this.grid)) {
            this.currentPiece.shape = originalShape;
        }
    }

    resetPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.randomPiece();
        this.drawNextPiece();
    }

    drop() {
        if (this.isPaused || this.gameOver) return;
        this.move(0, 1);
    }

    hardDrop() {
        if (this.isPaused || this.gameOver) return;
        
        while (!this.collide(this.currentPiece, this.grid, {x: 0, y: 1})) {
            this.move(0, 1);
        }
        this.merge();
        this.sweep();
        this.resetPiece();
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }

    showStatus(message) {
        const statusEl = document.getElementById('gameStatus');
        const statusText = document.getElementById('statusText');
        statusText.textContent = message;
        statusEl.classList.remove('hidden');
    }

    hideStatus() {
        document.getElementById('gameStatus').classList.add('hidden');
    }

    startGame() {
        if (this.gameOver) {
            this.resetGame();
        }
        this.isPaused = false;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }

    pauseGame() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').innerHTML = this.isPaused ? 
            '<i class="fas fa-play mr-1"></i>继续' : 
            '<i class="fas fa-pause mr-1"></i>暂停';
            
        if (this.isPaused) {
            this.showStatus('游戏暂停');
        } else {
            this.hideStatus();
        }
    }

    resetGame() {
        this.grid = this.createMatrix(10, 20);
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.currentPiece = this.randomPiece();
        this.nextPiece = this.randomPiece();
        this.drawNextPiece();
        this.updateDisplay();
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        this.hideStatus();
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
            // 阻止默认滚动行为
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }
            
            if (this.isPaused && e.key !== 'Escape') return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.move(-1, 0);
                    break;
                case 'ArrowRight':
                    this.move(1, 0);
                    break;
                case 'ArrowDown':
                    this.drop();
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
                case 'Escape':
                    this.pauseGame();
                    break;
            }
        });

        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('closeStatus').addEventListener('click', () => this.hideStatus());
    }

    gameLoop() {
        this.drawBoard();

        if (!this.isPaused && !this.gameOver) {
            const now = Date.now();
            const delta = now - this.dropStart;

            if (delta > this.dropInterval) {
                this.drop();
                this.dropStart = now;
            }
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TetrisGame();
});
