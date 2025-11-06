import { GAME_CONFIG } from './constants';

export var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["playing"] = 0] = "playing";
    GameStatus[GameStatus["paused"] = 1] = "paused";
    GameStatus[GameStatus["stopped"] = 2] = "stopped";
})(GameStatus || (GameStatus = {}));

export class GameController {
    constructor(gameRenderer) {
        this._timer = 0;
        this._gameStatus = GameStatus.playing;
        this._player = {
            x: GAME_CONFIG.INITIAL_PLAYER_POS_X,
            lastTouchX: 0,
            score: 0,
        };
        this._computer = {
            x: 0,
            speed: GAME_CONFIG.INITIAL_COMPUTER_SPEED,
            score: 0,
        };
        this._ball = {
            x: GAME_CONFIG.CANVAS_WIDTH / 2,
            y: GAME_CONFIG.CANVAS_HEIGHT / 2,
            vx: 0,
            vy: 0,
            speed: GAME_CONFIG.INITIAL_BALL_SPEED,
        };
        this._gameRenderer = gameRenderer;
    }

    getStatus() {
        return this._gameStatus;
    }

    static getInstance(gameRenderer) {
        if (GameController._instance == null) {
            GameController._instance = new GameController(gameRenderer);
        }
        return GameController._instance;
    }

    getPlayer() {
        return this._player;
    }

    getPlayerScore() {
        return this._player.score;
    }

    getComputer() {
        return this._computer;
    }

    getComputerScore() {
        return this._computer.score;
    }

    getBall() {
        return this._ball;
    }

    stopGame() {
        this.resetGame();
        clearInterval(this._timer);
        this._timer = 0;
        this._gameStatus = GameStatus.stopped;
    }

    pauseGame() {
        clearInterval(this._timer);
        this._timer = 0;
        this._gameStatus = GameStatus.paused;
    }

    startGame() {
        this.stopGame();
        this._timer = setInterval(() => this.update(), 16); // 16 fps
        this._gameStatus = GameStatus.playing;
    }

    resetGame() {
        this._player.score = 0;
        this._computer.score = 0;
        this._gameStatus = GameStatus.stopped;
    }

    resetPositions() {
        this._ball.x = (GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.BALL_SIZE) / 2;
        this._ball.y = (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.BALL_SIZE) / 2;
        let angle = Math.random() * Math.PI / 2 + Math.PI / 4;
        let up = Math.random() > 0.5;
        this._ball.vx = this._ball.speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
        this._ball.vy = this._ball.speed * (up ? -1 : 1);
    }

    onTouchEnd(event) {
        this._player.lastTouchX = event.globalX;
    }

    onTouchMove(event) {
        let dx = event.globalX - this._player.lastTouchX;
        this._player.x += dx;
        this._player.x =
            Math.max(2, Math.min(GAME_CONFIG.CANVAS_WIDTH - 2 - GAME_CONFIG.PADDLE_WIDTH, this._player.x));
        this._player.lastTouchX = event.globalX;
    }

    update() {
        // move the _ball
        this._ball.x += this._ball.vx;
        this._ball.y += this._ball.vy;
        // collision with left wall
        if (this._ball.x - GAME_CONFIG.BALL_SIZE < 0) {
            this._ball.vx = Math.abs(this._ball.vx);
        }
        // collision with right wall
        if (this._ball.x >= GAME_CONFIG.CANVAS_WIDTH - GAME_CONFIG.BALL_SIZE) {
            this._ball.vx = -Math.abs(this._ball.vx);
        }
        let computerCenter = this._computer.x + GAME_CONFIG.PADDLE_WIDTH / 2;
        let ballCenter = this._ball.x + GAME_CONFIG.BALL_SIZE / 2;
        // check collision with top wall (_computer side) and increase _player score
        if (this._ball.y - GAME_CONFIG.BALL_SIZE < 0) {
            // check _computer paddle collision with _ball
            if (this._computer.x <= this._ball.x &&
                this._ball.x <= this._computer.x + GAME_CONFIG.PADDLE_WIDTH &&
                this._ball.y <= GAME_CONFIG.PADDLE_HEIGHT + GAME_CONFIG.BALL_SIZE) {
                this._ball.vy = this._ball.speed;
                this._ball.vx += ballCenter >= computerCenter ? -this._ball.speed : this._ball.speed;
            } else {
                this._player.score += 1;
                this._ball.vy = Math.abs(this._ball.vy);
            }
        }
        // check collision with bottom wall (_player side) and increase _computer score
        if (this._ball.y + GAME_CONFIG.BALL_SIZE + 0.5 >= GAME_CONFIG.CANVAS_HEIGHT) {
            // check _player paddle collision with _ball
            let playerCenter = this._player.x + GAME_CONFIG.PADDLE_WIDTH / 2;
            if (this._player.x <= this._ball.x &&
                this._ball.x <= this._player.x + GAME_CONFIG.PADDLE_WIDTH &&
                this._ball.y + GAME_CONFIG.BALL_SIZE + GAME_CONFIG.PADDLE_HEIGHT >= GAME_CONFIG.CANVAS_HEIGHT) {
                this._ball.vy = -this._ball.speed;
                this._ball.vx += ballCenter >= playerCenter ? this._ball.speed : -this._ball.speed;
            } else {
                this._computer.score += 1;
                this._ball.vy = -Math.abs(this._ball.vy);
            }
        }
        // move _computer paddle towards _ball
        let diff = computerCenter - ballCenter;
        let move = (diff * this._computer.speed) / 100;
        this._computer.x += Math.max(this._computer.speed, move);
        // check if _computer paddle is closing on left wall
        if (this._computer.x < 0) {
            this._computer.speed = Math.abs(this._computer.speed);
        }
        // check if _computer paddle is closing on right wall
        let computerEndX = GAME_CONFIG.PADDLE_WIDTH + this._computer.x;
        if (computerEndX >= GAME_CONFIG.CANVAS_WIDTH) {
            this._computer.speed = -Math.abs(this._computer.speed);
        }
        this._gameRenderer.drawGame(this._player, this._computer, this._ball, this._gameStatus);

    }
}
GameController._instance = null;
