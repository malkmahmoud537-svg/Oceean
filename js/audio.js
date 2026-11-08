/**
 * OCEAN LIFE - AMBIENT SOUND & FX ENGINE (js/audio.js)
 * Web Audio API synthesizer for ambient underwater atmosphere & sound effects:
 * - Ambient low-frequency ocean rumble
 * - Periodic gentle bubble poofs
 * - Game drop & success audio cues
 * - Mute / Unmute state stored in localStorage
 */

(function () {
  'use strict';

  class OceanAudioEngine {
    constructor() {
      this.audioCtx = null;
      this.isMuted = true;
      this.ambientGain = null;
      this.noiseNode = null;
      this.filterNode = null;
      this.bubbleTimer = null;
    }

    initContext() {
      if (this.audioCtx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.audioCtx = new AudioContext();
    }

    startAmbient() {
      this.initContext();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Master Ambient Gain
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      this.ambientGain.connect(this.audioCtx.destination);

      // Pink Noise Generation for Ocean Rumble
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.audioCtx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Deep Water Low-pass Filter
      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(140, this.audioCtx.currentTime);

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.ambientGain);
      this.noiseNode.start();

      // Periodic subtle bubble sound
      this.bubbleTimer = setInterval(() => {
        if (!this.isMuted && Math.random() > 0.4) {
          this.playBubbleSound();
        }
      }, 3500);
    }

    stopAmbient() {
      if (this.ambientGain && this.audioCtx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
      }
      if (this.bubbleTimer) {
        clearInterval(this.bubbleTimer);
        this.bubbleTimer = null;
      }
    }

    playBubbleSound() {
      if (this.isMuted || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const baseFreq = 400 + Math.random() * 300;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, this.audioCtx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.14);
      } catch (e) {}
    }

    playSuccessSound() {
      if (this.isMuted || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, this.audioCtx.currentTime + 0.16); // G5

        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.38);
      } catch (e) {}
    }

    playErrorSound() {
      if (this.isMuted || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, this.audioCtx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.22);
      } catch (e) {}
    }

    toggle() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('ocean_audio_muted', this.isMuted);

      if (this.isMuted) {
        this.stopAmbient();
      } else {
        this.startAmbient();
      }
      this.updateUI();
      return !this.isMuted;
    }

    updateUI() {
      const btn = document.getElementById('sound-toggle-btn');
      if (!btn) return;
      if (this.isMuted) {
        btn.classList.remove('playing');
        btn.setAttribute('aria-label', 'Unmute ambient sound');
        btn.title = 'Sound: OFF';
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        `;
      } else {
        btn.classList.add('playing');
        btn.setAttribute('aria-label', 'Mute ambient sound');
        btn.title = 'Sound: ON';
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        `;
      }
    }
  }

  window.oceanAudio = new OceanAudioEngine();

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('ocean_audio_muted');
    if (saved !== null) {
      window.oceanAudio.isMuted = saved === 'true';
    }
    window.oceanAudio.updateUI();

    document.addEventListener('click', (e) => {
      const target = e.target.closest('#sound-toggle-btn');
      if (target) {
        window.oceanAudio.toggle();
      }
    });
  });
})();

