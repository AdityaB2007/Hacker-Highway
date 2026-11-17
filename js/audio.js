// HACKER HIGHWAY - AUDIO MANAGER
// Centralized audio playback and settings management.
// Background music: menu, lane1, lane2, lane3, lane4, lane5, victory, defeat
// Sound effects: correct, incorrect, collision, buttonClick, lifeLost, transition

const AudioManager = (() => {
    // AUDIO FILE CONFIGURATION
    const MUSIC_TRACKS = {
        menu: "assets/audio/music/menu.mp3",
        lane1: "assets/audio/music/lane1.mp3",
        lane2: "assets/audio/music/lane2.mp3",
        lane3: "assets/audio/music/lane3.mp3",
        lane4: "assets/audio/music/lane4.mp3",
        lane5: "assets/audio/music/lane5.mp3",
        victory: "assets/audio/music/victory.mp3",
        defeat: "assets/audio/music/defeat.mp3"
    };

    const SOUND_EFFECTS = {
        correct: "assets/audio/sfx/correct.mp3",
        incorrect: "assets/audio/sfx/incorrect.mp3",
        collision: "assets/audio/sfx/collision.mp3",
        buttonClick: "assets/audio/sfx/button-click.mp3",
        lifeLost: "assets/audio/sfx/life-lost.mp3",
        transition: "assets/audio/sfx/transition.mp3"
    };

    // DEFAULT SETTINGS
    const DEFAULT_SETTINGS = {
        masterVolume: 0.7,
        musicVolume: 0.5,
        sfxVolume: 0.8,
        muted: false
    };

    const STORAGE_KEY = "hackerHighwayAudioSettings";
    let settings = loadSettings();
    let currentMusic = null;
    let currentTrack = null;
    let musicFadeFrame = null;
    let transitionId = 0;
    const activeSounds = new Set();

    // SETTINGS MANAGEMENT
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem(STORAGE_KEY);
            if (!savedSettings) {
                return { ...DEFAULT_SETTINGS };
            }
            const parsed = JSON.parse(savedSettings);
            return {
                masterVolume: validateVolume(parsed.masterVolume) ? parsed.masterVolume : DEFAULT_SETTINGS.masterVolume,
                musicVolume: validateVolume(parsed.musicVolume) ? parsed.musicVolume : DEFAULT_SETTINGS.musicVolume,
                sfxVolume: validateVolume(parsed.sfxVolume) ? parsed.sfxVolume : DEFAULT_SETTINGS.sfxVolume,
                muted: typeof parsed.muted === "boolean" ? parsed.muted : DEFAULT_SETTINGS.muted
            };
        } catch (error) {
            console.warn("Audio settings could not be loaded.", error);
            return { ...DEFAULT_SETTINGS };
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.warn("Audio settings could not be saved.", error);
        }
    }

    function validateVolume(volume) {
        return typeof volume === "number" && Number.isFinite(volume) && volume >= 0 && volume <= 1;
    }

    function getEffectiveVolume(type) {
        if (settings.muted) {
            return 0;
        }
        if (type === "music") {
            return settings.masterVolume * settings.musicVolume;
        }
        if (type === "sfx") {
            return settings.masterVolume * settings.sfxVolume;
        }
        return 0;
    }

    function setMasterVolume(volume) {
        if (!validateVolume(volume)) return;
        settings.masterVolume = volume;
        saveSettings();
        updateMusicVolume();
    }

    function setMusicVolume(volume) {
        if (!validateVolume(volume)) return;
        settings.musicVolume = volume;
        saveSettings();
        updateMusicVolume();
    }

    function setSFXVolume(volume) {
        if (!validateVolume(volume)) return;
        settings.sfxVolume = volume;
        saveSettings();
    }

    function setMuted(muted) {
        if (typeof muted !== "boolean") return;
        settings.muted = muted;
        saveSettings();
        updateMusicVolume();
    }

    function toggleMute() {
        setMuted(!settings.muted);
        return settings.muted;
    }

    function updateMusicVolume() {
        if (currentMusic) {
            currentMusic.volume = getEffectiveVolume("music");
        }
    }

    function getSettings() {
        return { ...settings };
    }

    // MUSIC FADE MANAGEMENT
    function cancelFade() {
        if (musicFadeFrame !== null) {
            cancelAnimationFrame(musicFadeFrame);
            musicFadeFrame = null;
        }
    }

    function fadeMusic(audio, startVolume, endVolume, duration, id) {
        cancelFade();
        if (duration <= 0) {
            audio.volume = endVolume;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const startTime = performance.now();

            function animate(currentTime) {
                if (id !== transitionId) {
                    resolve();
                    return;
                }
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const volume = startVolume + (endVolume - startVolume) * progress;
                audio.volume = volume;

                if (progress < 1) {
                    musicFadeFrame = requestAnimationFrame(animate);
                } else {
                    musicFadeFrame = null;
                    resolve();
                }
            }

            musicFadeFrame = requestAnimationFrame(animate);
        });
    }

    // Background music
    async function playMusic(trackName, options = {}) {
        const trackPath = MUSIC_TRACKS[trackName];
        if (!trackPath) {
            console.warn(`Unknown music track: ${trackName}`);
            return;
        }

        const fadeDuration = options.fadeDuration ?? 800;
        const loop = options.loop ?? true;

        if (currentTrack === trackName && currentMusic && !currentMusic.paused) {
            return;
        }

        const id = ++transitionId;
        cancelFade();

        if (currentMusic) {
            const previousMusic = currentMusic;
            await fadeMusic(previousMusic, previousMusic.volume, 0, fadeDuration, id);
            if (id !== transitionId) return;
            previousMusic.pause();
            previousMusic.currentTime = 0;
        }

        if (id !== transitionId) return;

        const newMusic = new Audio(trackPath);
        newMusic.loop = loop;
        newMusic.volume = 0;
        currentMusic = newMusic;
        currentTrack = trackName;

        try {
            await newMusic.play();
            if (id !== transitionId) {
                newMusic.pause();
                return;
            }
            await fadeMusic(newMusic, 0, getEffectiveVolume("music"), fadeDuration, id);
        } catch (error) {
            if (id === transitionId) {
                console.warn(`Could not play music track "${trackName}".`, error);
                currentMusic = null;
                currentTrack = null;
            }
        }
    }

    function stopMusic(fadeDuration = 800) {
        const id = ++transitionId;
        if (!currentMusic) return;
        const music = currentMusic;
        cancelFade();

        fadeMusic(music, music.volume, 0, fadeDuration, id).then(() => {
            if (id !== transitionId) return;
            music.pause();
            music.currentTime = 0;
            currentMusic = null;
            currentTrack = null;
        });
    }

    function pauseMusic() {
        if (currentMusic) {
            currentMusic.pause();
        }
    }

    async function resumeMusic() {
        if (!currentMusic || !currentMusic.paused) return;
        try {
            await currentMusic.play();
        } catch (error) {
            console.warn("Music could not resume.", error);
        }
    }

    // Sound effects
    function playSFX(soundName, options = {}) {
        const soundPath = SOUND_EFFECTS[soundName];
        if (!soundPath) {
            console.warn(`Unknown sound effect: ${soundName}`);
            return;
        }

        const sound = new Audio(soundPath);
        sound.volume = getEffectiveVolume("sfx") * (validateVolume(options.volume) ? options.volume : 1);
        sound.loop = options.loop ?? false;
        activeSounds.add(sound);

        function cleanup() {
            activeSounds.delete(sound);
            sound.removeEventListener("ended", cleanup);
        }

        sound.addEventListener("ended", cleanup);
        sound.addEventListener("error", () => {
            console.warn(`Could not load sound effect: ${soundName}`);
            cleanup();
        });

        sound.play().catch((error) => {
            console.warn(`Could not play sound effect: ${soundName}`, error);
            cleanup();
        });

        return sound;
    }

    function stopSFX(sound) {
        if (sound && activeSounds.has(sound)) {
            sound.pause();
            sound.currentTime = 0;
            activeSounds.delete(sound);
        }
    }

    function stopAllSFX() {
        activeSounds.forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
        });
        activeSounds.clear();
    }

    // Public API
    return {
        playMusic,
        stopMusic,
        pauseMusic,
        resumeMusic,
        playSFX,
        stopSFX,
        stopAllSFX,
        setMasterVolume,
        setMusicVolume,
        setSFXVolume,
        setMuted,
        toggleMute,
        getSettings,
        getCurrentTrack: () => currentTrack,
        isMuted: () => settings.muted
    };
})();

window.AudioManager = AudioManager;