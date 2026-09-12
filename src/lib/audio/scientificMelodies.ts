/**
 * EchoSoul Scientific Meditation Melodies & Breathing Sanctuary Audio Engine
 *
 * Provides authentic Solfeggio frequencies, binaural brainwave rhythms,
 * and synchronized text-to-speech guidance for the Visuals tab.
 */

export interface BreathingProfile {
  techniqueName: string;
  inhaleSec: number;
  holdSec: number;
  exhaleSec: number;
  restSec: number;
  totalCycleSec: number;
  clinicalBenefit: string;
}

export interface ScientificMelody {
  id: string;
  name: string;
  frequency: number; // in Hz
  harmonicFrequency: number; // in Hz (e.g. perfect fifth or octave overtone)
  binauralBeat: number; // in Hz (Theta: 4-7 Hz, Alpha: 8-12 Hz)
  chakraOrBenefit: string;
  matchedWorldKey: string;
  description: string;
  breathingProfile: BreathingProfile;
}

export const SCIENTIFIC_MEDITATION_MELODIES: ScientificMelody[] = [
  {
    id: "med_432",
    name: "432 Hz Sacred Calm",
    frequency: 432,
    harmonicFrequency: 648, // Perfect fifth
    binauralBeat: 5.5, // Deep Theta (meditation & inner peace)
    chakraOrBenefit: "Cosmic Natural Resonance & Emotional Balance",
    matchedWorldKey: "mountain_calm",
    description: "Verdi's 'A' tuning. Aligns with the natural frequencies of nature and reduces heart rate.",
    breathingProfile: {
      techniqueName: "Box Breathing (Sama Vritti 4-4-4-4)",
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 4,
      restSec: 4,
      totalCycleSec: 16,
      clinicalBenefit: "Equilibrates autonomic nervous system, lowers cortisol, clears mental fog.",
    },
  },
  {
    id: "med_528",
    name: "528 Hz Transformation & Renewal",
    frequency: 528,
    harmonicFrequency: 792,
    binauralBeat: 6.0, // Theta
    chakraOrBenefit: "Cellular Healing & Deep Heart Opening",
    matchedWorldKey: "forest_retreat",
    description: "The 'Miracle Tone' of the ancient Solfeggio scale. Promotes deep inner peace and clarity.",
    breathingProfile: {
      techniqueName: "Dr. Andrew Weil's 4-7-8 Relaxing Breath",
      inhaleSec: 4,
      holdSec: 7,
      exhaleSec: 8,
      restSec: 1,
      totalCycleSec: 20,
      clinicalBenefit: "Natural tranquilizer for the nervous system, activates parasympathetic brake.",
    },
  },
  {
    id: "med_396",
    name: "396 Hz Release & Grounding",
    frequency: 396,
    harmonicFrequency: 594,
    binauralBeat: 4.5, // Theta
    chakraOrBenefit: "Liberating Guilt, Tension & Fear",
    matchedWorldKey: "ocean_breeze",
    description: "Dissolves subconscious negative beliefs, tension, and grounding emotional burdens.",
    breathingProfile: {
      techniqueName: "Deep Somatic Release (5-2-7)",
      inhaleSec: 5,
      holdSec: 2,
      exhaleSec: 7,
      restSec: 2,
      totalCycleSec: 16,
      clinicalBenefit: "Vagal nerve stimulation through prolonged exhalation, dissipates anxiety.",
    },
  },
  {
    id: "med_174",
    name: "174 Hz Anesthetic Foundation",
    frequency: 174,
    harmonicFrequency: 261,
    binauralBeat: 4.0, // Deep Delta/Theta boundary
    chakraOrBenefit: "Natural Physical Grounding & Stillness",
    matchedWorldKey: "cozy_room",
    description: "The lowest Solfeggio tone. Creates a warm foundation of safety, security, and tranquility.",
    breathingProfile: {
      techniqueName: "Grounding 4-4-6 Cadence",
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 6,
      restSec: 2,
      totalCycleSec: 16,
      clinicalBenefit: "Stabilizes racing thoughts, anchors bodily awareness in safety.",
    },
  },
  {
    id: "med_852",
    name: "852 Hz Cosmic Intuition",
    frequency: 852,
    harmonicFrequency: 1278,
    binauralBeat: 7.0, // High Theta / Alpha
    chakraOrBenefit: "Spiritual Awakening & Intuitive Clarity",
    matchedWorldKey: "starry_skies",
    description: "Restores mental order, elevates perception, and opens space for cosmic wonder.",
    breathingProfile: {
      techniqueName: "Heart Coherence Breathing (5.5-0-5.5)",
      inhaleSec: 5.5,
      holdSec: 0,
      exhaleSec: 5.5,
      restSec: 0,
      totalCycleSec: 11,
      clinicalBenefit: "Synchronizes heart rate variability (HRV) with respiration at 0.1 Hz resonance.",
    },
  },
  {
    id: "med_639",
    name: "639 Hz Connection & Harmony",
    frequency: 639,
    harmonicFrequency: 958.5,
    binauralBeat: 6.5, // Theta
    chakraOrBenefit: "Harmonious Relationships & Compassion",
    matchedWorldKey: "city_lights",
    description: "Enhances empathy, interpersonal understanding, and heart-centered perspective.",
    breathingProfile: {
      techniqueName: "Heart Harmony Rhythm (4-2-4-2)",
      inhaleSec: 4,
      holdSec: 2,
      exhaleSec: 4,
      restSec: 2,
      totalCycleSec: 12,
      clinicalBenefit: "Promotes emotional centering, decreases social anxiety and reactivity.",
    },
  },
];

export function getMelodyForWorld(worldKey: string): ScientificMelody {
  return (
    SCIENTIFIC_MEDITATION_MELODIES.find((m) => m.matchedWorldKey === worldKey) ||
    SCIENTIFIC_MEDITATION_MELODIES[0]
  );
}

/**
 * Play a soothing singing bowl / crystal bell chime at each breath transition
 */
export function playTransitionChime(ctx: AudioContext | null, freq: number = 880): void {
  if (!ctx || typeof window === "undefined") return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.99, now + 1.2);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  } catch {}
}

/**
 * Spoken Voice Guidance for Breathing Cycles
 */
export function speakBreathingInstruction(phase: string, enabled: boolean = true) {
  if (!enabled) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  try {
    // Avoid jarring interruptions if previous utterance finished
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    let spokenText = "Inhale gently";
    if (phase.toLowerCase().includes("hold")) {
      spokenText = "Hold gently";
    } else if (phase.toLowerCase().includes("exhale")) {
      spokenText = "Slowly exhale";
    } else if (phase.toLowerCase().includes("rest")) {
      spokenText = "Rest in stillness";
    } else if (phase.toLowerCase().includes("inhale")) {
      spokenText = "Inhale deeply";
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 0.82; // Calming, slow cadence
    utterance.pitch = 0.95; // Warm, soothing pitch
    utterance.volume = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const calmingVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("Female") ||
          v.name.includes("Serena"))
    );
    if (calmingVoice) {
      utterance.voice = calmingVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {}
}

/**
 * Web Audio Synthesizer for Solfeggio Meditation Drones
 */
export class SanctuaryAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscBase: OscillatorNode | null = null;
  private oscHarmonic: OscillatorNode | null = null;
  private oscBinaural: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isRunning: boolean = false;

  public start(melody: ScientificMelody, volume: number = 0.12) {
    if (typeof window === "undefined") return;

    try {
      this.stop();

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Master gain with smooth fade in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), now + 2.0);
      this.masterGain.connect(this.ctx.destination);

      // Warm lowpass filter to remove harshness
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(melody.frequency * 2.2, now);
      this.filterNode.connect(this.masterGain);

      // Fundamental Solfeggio Sine
      this.oscBase = this.ctx.createOscillator();
      this.oscBase.type = "sine";
      this.oscBase.frequency.setValueAtTime(melody.frequency, now);

      const baseGain = this.ctx.createGain();
      baseGain.gain.setValueAtTime(0.65, now);
      this.oscBase.connect(baseGain);
      baseGain.connect(this.filterNode);

      // Harmonic overtone (triangle wave for pleasant richness)
      this.oscHarmonic = this.ctx.createOscillator();
      this.oscHarmonic.type = "triangle";
      this.oscHarmonic.frequency.setValueAtTime(melody.harmonicFrequency, now);

      const harmonicGain = this.ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.2, now);
      this.oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(this.filterNode);

      // Binaural Theta Beat detune (freq + binaural beat)
      this.oscBinaural = this.ctx.createOscillator();
      this.oscBinaural.type = "sine";
      this.oscBinaural.frequency.setValueAtTime(melody.frequency + melody.binauralBeat, now);

      const binauralGain = this.ctx.createGain();
      binauralGain.gain.setValueAtTime(0.4, now);
      this.oscBinaural.connect(binauralGain);
      binauralGain.connect(this.filterNode);

      this.oscBase.start();
      this.oscHarmonic.start();
      this.oscBinaural.start();
      this.isRunning = true;
    } catch {}
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0.0001, vol),
        this.ctx.currentTime + 0.3
      );
    }
  }

  public stop() {
    if (!this.isRunning && !this.ctx) return;
    try {
      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      }
      setTimeout(() => {
        try {
          if (this.oscBase) {
            this.oscBase.stop();
            this.oscBase.disconnect();
            this.oscBase = null;
          }
          if (this.oscHarmonic) {
            this.oscHarmonic.stop();
            this.oscHarmonic.disconnect();
            this.oscHarmonic = null;
          }
          if (this.oscBinaural) {
            this.oscBinaural.stop();
            this.oscBinaural.disconnect();
            this.oscBinaural = null;
          }
          if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
          }
          this.isRunning = false;
        } catch {}
      }, 850);
    } catch {}
  }
}
