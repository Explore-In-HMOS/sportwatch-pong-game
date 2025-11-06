import { GAME_CONFIG } from './constants';
import { GameStatus } from './game_controller';

export class GameRenderer {
    constructor(context) {
        this.context = context;
    }

    drawGame(player, computer, ball, status) {
        // background
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        this.context.strokeStyle = '#888';
        this.context.lineWidth = 2;
        this.context.strokeRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        //  Center Line
        this.context.strokeStyle = '#888';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo(0, GAME_CONFIG.CANVAS_HEIGHT / 2);
        this.context.lineTo(299, GAME_CONFIG.CANVAS_HEIGHT / 2);
        this.context.stroke();
        // Player paddle
        this.context.strokeStyle = '#FFF';
        this.context.lineWidth = GAME_CONFIG.PADDLE_HEIGHT;
        this.context.beginPath();
        this.context.moveTo(player.x, GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PADDLE_HEIGHT);
        this.context.lineTo(player.x + GAME_CONFIG.PADDLE_WIDTH, GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.PADDLE_HEIGHT);
        this.context.stroke();
        // Computer paddle
        this.context.strokeStyle = '#FFF';
        this.context.lineWidth = GAME_CONFIG.PADDLE_HEIGHT;
        this.context.beginPath();
        this.context.moveTo(computer.x, GAME_CONFIG.PADDLE_HEIGHT);
        this.context.lineTo(GAME_CONFIG.PADDLE_WIDTH + computer.x, GAME_CONFIG.PADDLE_HEIGHT);
        this.context.stroke();
        // ball circle
        this.context.beginPath();
        this.context.lineWidth = 7;
        this.context.strokeStyle = '#FFF';
        this.context.arc(ball.x, ball.y, GAME_CONFIG.BALL_SIZE / 2, 0, 2 * Math.PI);
        this.context.stroke();

        // scores
        this.context.fillStyle = '#FFF';
        this.context.font = 'bold 32px sans-serif';
        this.context.fillText(`${computer.score}`, 260, 120)
        this.context.fillText(`${player.score}`, 260, 160)

        this.context.closePath();
    }
}