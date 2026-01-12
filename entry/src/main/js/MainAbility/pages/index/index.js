import { GameController } from '../../lib/game_controller';
import { GameRenderer } from '../../lib/game_renderer';
import { GAME_CONFIG } from '../../lib/constants'

export default {
    data: {
        canvasHeight: GAME_CONFIG.CANVAS_HEIGHT,
        canvasWidth: GAME_CONFIG.CANVAS_WIDTH,
        gameController: null,
        gameRenderer: null
    },
    onShow() {
        const el = this.$refs.gameCanvas;
        const context = el.getContext('2d');
        this.gameRenderer = new GameRenderer(context);
        this.gameController = GameController.getInstance(this.gameRenderer)
        this.drawGame();
        this.gameController.resetPositions();
        this.gameController.startGame();
    },
    onTouchMove(e) {
        this.gameController.onTouchMove(e);
    },
    onTouchEnd(e) {
        this.gameController.onTouchEnd(e);
    },
    onDestroy() {
        this.gameController.stopGame();
    },
    onStop() {
        this.gameController.stopGame();
    },
    onPlay() {
        this.gameController.startGame();
    },
    drawGame() {
        this.gameRenderer.drawGame(
            this.gameController.getPlayer(),
            this.gameController.getComputer(),
            this.gameController.getBall(),
        )
    },
    onInit() {

    }
};
