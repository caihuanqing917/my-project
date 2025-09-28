// 音频管理类
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.initAudioContext();
    }

    // 初始化音频上下文
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    // 创建简单的音调
    createTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext || !this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // 播放点击音效
    playClickSound() {
        this.createTone(800, 0.1, 'square', 0.2);
    }

    // 播放胜利音效
    playWinSound() {
        // 胜利音效 - 上升的音调
        setTimeout(() => this.createTone(523, 0.2, 'sine', 0.3), 0);    // C
        setTimeout(() => this.createTone(659, 0.2, 'sine', 0.3), 200);  // E
        setTimeout(() => this.createTone(784, 0.3, 'sine', 0.3), 400);  // G
    }

    // 播放失败音效
    playLoseSound() {
        // 失败音效 - 下降的音调
        this.createTone(400, 0.5, 'sawtooth', 0.3);
    }

    // 播放平局音效
    playTieSound() {
        this.createTone(600, 0.3, 'triangle', 0.2);
    }

    // 播放游戏结束音效
    playGameOverSound(isWin) {
        if (isWin) {
            // 胜利庆祝音效
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.createTone(523 + i * 100, 0.2, 'sine', 0.3);
                }, i * 150);
            }
        } else {
            // 失败音效
            this.createTone(200, 1, 'sawtooth', 0.3);
        }
    }

    // 简单的背景音乐（循环音调）
    startBackgroundMusic() {
        if (!this.audioContext || !this.musicEnabled || this.isMusicPlaying) return;

        this.isMusicPlaying = true;
        this.playBackgroundLoop();
    }

    playBackgroundLoop() {
        if (!this.isMusicPlaying || !this.musicEnabled) return;

        // 简单的旋律循环
        const melody = [523, 587, 659, 698, 784, 698, 659, 587]; // C大调音阶

        melody.forEach((frequency, index) => {
            setTimeout(() => {
                if (this.isMusicPlaying && this.musicEnabled) {
                    this.createTone(frequency, 0.5, 'sine', 0.1);
                }
            }, index * 600);
        });

        // 循环播放
        if (this.isMusicPlaying && this.musicEnabled) {
            setTimeout(() => {
                this.playBackgroundLoop();
            }, melody.length * 600);
        }
    }

    // 停止背景音乐
    stopBackgroundMusic() {
        this.isMusicPlaying = false;
    }

    // 切换音效
    toggleSounds() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    // 切换背景音乐
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled && !this.isMusicPlaying) {
            this.startBackgroundMusic();
        } else if (!this.musicEnabled) {
            this.stopBackgroundMusic();
        }
        return this.musicEnabled;
    }
}

// 创建全局音频管理器实例
const audioManager = new AudioManager();