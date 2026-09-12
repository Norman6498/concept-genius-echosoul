/**
 * EchoSoul Harmonic Music Synthesizer, Real Audio Player & Vocal Engine
 *
 * Provides real vocal audio playback, authentic Ghazal & classical lyrics,
 * multi-track acoustic synthesizer, and scientific Solfeggio frequencies.
 */

export interface TrackAudioProfile {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  solfeggioFreq: number; // in Hz
  solfeggioName: string;
  scaleName: string;
  timbre: "sufi_tanpura" | "acoustic_guitar" | "folk_bright" | "sufi_rock" | "rabindra_sangeet" | "carnatic_acoustic" | "binaural_pure" | "grand_piano";
  rootFreq: number;
  chordProgression: number[][]; // Array of chord frequencies in Hz
  melodyNotes: number[]; // Sequence of notes (Hz)
  tempoBpm: number;
  lyrics: string[]; // Authentic poetic lines for vocals & real-time display
}

export const TRACK_AUDIO_PROFILES: Record<string, TrackAudioProfile> = {
  // 1. Woh Kagaz Ki Kashti (Jagjit Singh & Chitra Singh)
  track_hi_01: {
    id: "track_hi_01",
    title: "Woh Kagaz Ki Kashti",
    artist: "Jagjit Singh & Chitra Singh",
    audioUrl: "/audio/track_hi_01.mp3",
    solfeggioFreq: 528,
    solfeggioName: "528 Hz • Sacred Devotion & Renewal",
    scaleName: "Ghazal Acoustic (D Major)",
    timbre: "sufi_tanpura",
    rootFreq: 146.83, // D3
    chordProgression: [
      [146.83, 220.0, 293.66], // D - A - D4
      [146.83, 185.0, 293.66], // D - F# - D4
      [164.81, 246.94, 329.63], // E - B - E4
      [146.83, 220.0, 369.99], // D - A - F#4
    ],
    melodyNotes: [293.66, 329.63, 369.99, 440.0, 493.88, 440.0, 369.99, 293.66, 329.63],
    tempoBpm: 64,
    lyrics: [
      "Yeh daulat bhi le lo, yeh shohrat bhi le lo...",
      "Bhale chheen lo mujhse meri javaani...",
      "Magar mujhko lauta do bachpan ka saavan...",
      "Woh kaagaz ki kashti, woh baarish ka paani...",
      "Mohalle ki sabse puraani nishaani...",
      "Woh peepal ke patte, woh aam ki daali...",
    ],
  },

  // 2. Jhuki Jhuki Si Nazar (Jagjit Singh)
  track_hi_02: {
    id: "track_hi_02",
    title: "Jhuki Jhuki Si Nazar",
    artist: "Jagjit Singh",
    audioUrl: "/audio/track_hi_02.mp3",
    solfeggioFreq: 417,
    solfeggioName: "417 Hz • Releasing Sorrow & Heart Solace",
    scaleName: "Kaifi Azmi Ghazal Acoustic (E Minor)",
    timbre: "acoustic_guitar",
    rootFreq: 164.81, // E3
    chordProgression: [
      [164.81, 196.0, 246.94], // Em
      [130.81, 164.81, 196.0, 246.94], // Cmaj7
      [196.0, 246.94, 293.66], // G
      [146.83, 220.0, 293.66], // D
    ],
    melodyNotes: [329.63, 293.66, 246.94, 220.0, 196.0, 220.0, 246.94, 329.63],
    tempoBpm: 60,
    lyrics: [
      "Jhuki jhuki si nazar beqaraar hai ke nahin...",
      "Daba daba sa sahi dil mein pyaar hai ke nahin...",
      "Tu apne dil ki javaan dhadkanon ko ginn ke bata...",
      "Meri tarah tera dil beqaraar hai ke nahin...",
      "Woh pal ke jis mein mohabbat javaan hoti hai...",
      "Uss ek pal ka tujhe intezaar hai ke nahin...",
    ],
  },

  // 3. Chithi Na Koi Sandesh (Jagjit Singh)
  track_hi_03: {
    id: "track_hi_03",
    title: "Chithi Na Koi Sandesh",
    artist: "Jagjit Singh",
    audioUrl: "/audio/track_hi_03.mp3",
    solfeggioFreq: 639,
    solfeggioName: "639 Hz • Heart Solace & Emotional Catharsis",
    scaleName: "Anand Bakshi Ghazal (C Minor)",
    timbre: "sufi_tanpura",
    rootFreq: 130.81, // C3
    chordProgression: [
      [130.81, 155.56, 196.0], // Cm
      [116.54, 155.56, 174.61], // Bb
      [103.83, 138.59, 174.61], // Ab
      [196.0, 246.94, 293.66], // G
    ],
    melodyNotes: [261.63, 311.13, 392.0, 415.3, 392.0, 311.13, 261.63],
    tempoBpm: 56,
    lyrics: [
      "Chithi na koi sandesh, jaane woh kaun sa desh...",
      "Jahaan tum chale gaye...",
      "Chithi na koi sandesh, jaane woh kaun sa desh...",
      "Jahaan tum chale gaye...",
      "Ek aah bhari hogi, humne na suni hogi...",
      "Jaate jaate tumne aawaz to di hogi...",
      "Har vaqt yahi hai gham, uss vaqt kahan the hum...",
      "Kahan tum chale gaye...",
    ],
  },

  // 4. Sajjan Raazi (Satinder Sartaaj)
  track_pa_01: {
    id: "track_pa_01",
    title: "Sajjan Raazi",
    artist: "Satinder Sartaaj",
    audioUrl: "/audio/track_pa_01.mp3",
    solfeggioFreq: 741,
    solfeggioName: "741 Hz • Spiritual Clarity & Joy",
    scaleName: "Raag Bilawal (G Major Folk)",
    timbre: "sufi_tanpura",
    rootFreq: 196.0, // G3
    chordProgression: [
      [196.0, 246.94, 293.66], // G
      [146.83, 220.0, 293.66], // D
      [164.81, 196.0, 246.94], // Em
      [130.81, 164.81, 196.0], // C
    ],
    melodyNotes: [196.0, 246.94, 293.66, 329.63, 392.0, 329.63, 293.66, 246.94],
    tempoBpm: 92,
    lyrics: [
      "Sajjan raazi ho jaave...",
      "Kujh hor nahi mangna rabb kolon...",
      "Bas peer manauna aave...",
      "Dil saaf te rooh noorani hove...",
    ],
  },

  // 5. Bulla Ki Jaana Main Kaun (Rabbi Shergill)
  track_pa_02: {
    id: "track_pa_02",
    title: "Bulla Ki Jaana Main Kaun",
    artist: "Rabbi Shergill",
    audioUrl: "/audio/track_pa_02.mp3",
    solfeggioFreq: 396,
    solfeggioName: "396 Hz • Fearless Self-Discovery",
    scaleName: "A Minor Sufi Rock",
    timbre: "sufi_rock",
    rootFreq: 110.0, // A2
    chordProgression: [
      [110.0, 164.81, 220.0], // Am
      [98.0, 146.83, 196.0], // G
      [87.31, 130.81, 174.61], // F
      [82.41, 123.47, 164.81], // E
    ],
    melodyNotes: [220.0, 261.63, 293.66, 329.63, 293.66, 261.63, 220.0, 196.0, 220.0],
    tempoBpm: 96,
    lyrics: [
      "Bulla ki jaana main kaun...",
      "Na main momin vich maseetan...",
      "Na main vich kufr diyan reetan...",
      "Avval aakhir aap nu jaana...",
    ],
  },

  // 6. Majhe Majhe Tobo Dekha Pai (Rabindranath Tagore)
  track_bn_01: {
    id: "track_bn_01",
    title: "Majhe Majhe Tobo Dekha Pai",
    artist: "Sahana Bajpaie (Tagore)",
    audioUrl: "/audio/track_bn_01.mp3",
    solfeggioFreq: 285,
    solfeggioName: "285 Hz • Timeless Nostalgia & Restoration",
    scaleName: "Rabindra Kafi Scale",
    timbre: "rabindra_sangeet",
    rootFreq: 146.83, // D3
    chordProgression: [
      [146.83, 174.61, 220.0], // Dm
      [130.81, 196.0, 261.63], // C
      [116.54, 174.61, 233.08], // Bb
      [110.0, 164.81, 220.0], // A
    ],
    melodyNotes: [220.0, 261.63, 293.66, 349.23, 329.63, 293.66, 261.63, 220.0],
    tempoBpm: 60,
    lyrics: [
      "Majhe majhe tobo dekha pai...",
      "Chirodin keno pai na...",
      "Keno megh ashe hridoyo-maajhe...",
      "Tomare dekhite dey na...",
    ],
  },

  // 7. Thendral Vandhu Theendum Pothu (Ilaiyaraaja)
  track_ta_01: {
    id: "track_ta_01",
    title: "Thendral Vandhu Theendum Pothu",
    artist: "Ilaiyaraaja",
    audioUrl: "/audio/track_ta_01.mp3",
    solfeggioFreq: 432,
    solfeggioName: "432 Hz • Gentle Breeze & Healing",
    scaleName: "Raag Kalyani (G Lydian Acoustic)",
    timbre: "acoustic_guitar",
    rootFreq: 196.0, // G3
    chordProgression: [
      [196.0, 246.94, 293.66, 369.99], // Gmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
      [130.81, 196.0, 246.94, 329.63], // Cmaj7
      [146.83, 220.0, 293.66, 369.99], // D9
    ],
    melodyNotes: [293.66, 369.99, 392.0, 440.0, 493.88, 440.0, 369.99, 293.66],
    tempoBpm: 70,
    lyrics: [
      "Thendral vandhu theendum pothu...",
      "Enna vannamo manasula...",
      "Thottu pogum thendral kaatru...",
      "Mounamaga pesidumae...",
    ],
  },

  // 8. Samajavaragamana (Sid Sriram & Thaman S)
  track_te_01: {
    id: "track_te_01",
    title: "Samajavaragamana (Unplugged)",
    artist: "Sid Sriram & Thaman S",
    audioUrl: "/audio/track_te_01.mp3",
    solfeggioFreq: 852,
    solfeggioName: "852 Hz • Intuition & Soul Balance",
    scaleName: "Raag Mohanam Pentatonic",
    timbre: "carnatic_acoustic",
    rootFreq: 130.81, // C3
    chordProgression: [
      [130.81, 196.0, 261.63], // C
      [146.83, 220.0, 293.66], // Dsus
      [164.81, 246.94, 329.63], // Em
      [130.81, 196.0, 329.63], // C
    ],
    melodyNotes: [261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 261.63],
    tempoBpm: 76,
    lyrics: [
      "Samajavaragamana...",
      "Ninu choosi aaga galana...",
      "Mano haraana leela...",
      "Chitramaina prema veduka...",
    ],
  },

  // 9. Mountain Focus & Solfeggio 174 Hz
  track_en_01: {
    id: "track_en_01",
    title: "Mountain Focus & Solfeggio 174 Hz",
    artist: "EchoSoul Audio Labs",
    audioUrl: "/audio/track_en_01.mp3",
    solfeggioFreq: 174,
    solfeggioName: "174 Hz • Deep Cognitive Focus & Stability",
    scaleName: "174 Hz Pure Solfeggio + 7 Hz Theta",
    timbre: "binaural_pure",
    rootFreq: 174.0,
    chordProgression: [
      [174.0, 261.0, 348.0],
      [174.0, 217.5, 348.0],
      [174.0, 261.0, 435.0],
    ],
    melodyNotes: [174.0, 261.0, 348.0, 261.0, 174.0],
    tempoBpm: 45,
    lyrics: [
      "Deep cognitive focus...",
      "Grounding your attention in the present moment...",
      "Clear minds build beautiful tomorrows...",
    ],
  },

  // 10. Night Piano for Quiet Minds
  track_en_02: {
    id: "track_en_02",
    title: "Night Piano for Quiet Minds",
    artist: "EchoSoul Classical Ensemble",
    audioUrl: "/audio/track_en_02.mp3",
    solfeggioFreq: 432,
    solfeggioName: "432 Hz • Midnight Solitude & Serenity",
    scaleName: "Db Major Felt Piano",
    timbre: "grand_piano",
    rootFreq: 138.59, // Db3
    chordProgression: [
      [138.59, 174.61, 207.65, 261.63], // Dbmaj7
      [174.61, 207.65, 261.63, 329.63], // Fm7
      [116.54, 138.59, 174.61, 207.65], // Bbm7
      [92.5, 138.59, 185.0, 220.0], // Gbmaj7
    ],
    melodyNotes: [261.63, 207.65, 174.61, 138.59, 174.61, 207.65, 277.18, 261.63],
    tempoBpm: 52,
    lyrics: [
      "Midnight stillness...",
      "Let the quiet piano soften the edges of the day...",
      "Peace within, peace all around...",
    ],
  },
};

export type MusicPlaybackMode = "both" | "vocal" | "solfeggio";

/**
 * EchoSoul Polyphonic & Real Audio Player Engine
 */
export class EchoSoulMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private sequenceTimer: any = null;
  private vocalTimer: any = null;
  private audioEl: HTMLAudioElement | null = null;
  private currentTrackId: string | null = null;
  private currentMode: MusicPlaybackMode = "both";
  private isPlaying: boolean = false;
  private currentLyricsIndex: number = 0;
  private onLyricsUpdate?: (line: string, index: number) => void;
  private onTimeUpdate?: (seconds: number) => void;

  public setLyricsListener(cb: (line: string, index: number) => void) {
    this.onLyricsUpdate = cb;
  }

  public setTimeListener(cb: (seconds: number) => void) {
    this.onTimeUpdate = cb;
  }

  public startTrack(
    trackId: string,
    mode: MusicPlaybackMode = "both",
    volume: number = 0.2,
    vocalVoiceEnabled: boolean = true
  ) {
    if (typeof window === "undefined") return;

    try {
      this.stop();

      const profile = TRACK_AUDIO_PROFILES[trackId] || TRACK_AUDIO_PROFILES["track_hi_01"];
      this.currentTrackId = trackId;
      this.currentMode = mode;
      this.currentLyricsIndex = 0;

      // 1. If mode includes Vocal/Studio ("both" or "vocal") -> Launch Real Audio element
      if (mode === "both" || mode === "vocal") {
        try {
          this.audioEl = new Audio(profile.audioUrl || `/audio/${trackId}.mp3`);
          this.audioEl.volume = Math.min(1.0, Math.max(0.01, volume * 3.5)); // Boost to clear audible level
          this.audioEl.loop = true;

          this.audioEl.ontimeupdate = () => {
            if (this.audioEl && this.onTimeUpdate) {
              this.onTimeUpdate(Math.floor(this.audioEl.currentTime));
            }
          };

          this.audioEl.play().catch(() => {
            // If browser autoplay blocks HTML5 Audio, Web Audio synthesizer continues seamless playback
          });
        } catch {}

        // Start synchronized expressive vocal recitation of the authentic poetic lyrics
        if (vocalVoiceEnabled && profile.lyrics.length > 0) {
          this.startVocalRecitation(profile);
        }
      }

      // 2. Initialize Web Audio API for harmonic resonance and live spectrum analyzer
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        if (this.ctx.state === "suspended") {
          this.ctx.resume();
        }

        const now = this.ctx.currentTime;
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, now);
        this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), now + 1.0);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        // Setup Solfeggio healing resonance (528 Hz / 432 Hz)
        if (mode === "both" || mode === "solfeggio") {
          this.setupSolfeggioDrone(profile);
        }

        // If in "both" or "solfeggio" mode without HTML5 audio playing, play synthesized chord pads
        if (mode === "solfeggio" || !this.audioEl) {
          this.setupHarmonicPads(profile);
        }
      }

      this.isPlaying = true;
    } catch {}
  }

  private startVocalRecitation(profile: TrackAudioProfile) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
      let lineIdx = 0;

      const speakLine = () => {
        if (!this.isPlaying) return;
        const line = profile.lyrics[lineIdx];
        if (this.onLyricsUpdate) {
          this.onLyricsUpdate(line, lineIdx);
        }

        const utterance = new SpeechSynthesisUtterance(line);
        utterance.rate = 0.82; // Warm, poetic cadence
        utterance.pitch = 0.95;
        utterance.volume = 0.85;

        // Pick soothing voice
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find((v) => v.lang.startsWith("hi"));
        const gentleVoice =
          hindiVoice ||
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Female"))
          );

        if (gentleVoice) utterance.voice = gentleVoice;
        window.speechSynthesis.speak(utterance);

        lineIdx = (lineIdx + 1) % profile.lyrics.length;
      };

      // Speak opening verse after 1s
      setTimeout(speakLine, 800);

      // Cycle verses every 7 seconds
      this.vocalTimer = setInterval(speakLine, 7500);
    } catch {}
  }

  private setupSolfeggioDrone(profile: TrackAudioProfile) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const solfGain = this.ctx.createGain();
    solfGain.gain.setValueAtTime(this.currentMode === "solfeggio" ? 0.3 : 0.08, now);
    solfGain.connect(this.masterGain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(profile.solfeggioFreq * 2.2, now);
    filter.connect(solfGain);

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(profile.solfeggioFreq, now);
    osc.connect(filter);
    osc.start();
    this.activeOscillators.push(osc);

    const oscTheta = this.ctx.createOscillator();
    oscTheta.type = "sine";
    oscTheta.frequency.setValueAtTime(profile.solfeggioFreq + 5.5, now);
    oscTheta.connect(filter);
    oscTheta.start();
    this.activeOscillators.push(oscTheta);
  }

  private setupHarmonicPads(profile: TrackAudioProfile) {
    if (!this.ctx || !this.masterGain) return;
    let chordIdx = 0;

    const playChord = () => {
      if (!this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime;
      const chord = profile.chordProgression[chordIdx];
      const chordGain = this.ctx.createGain();
      const dur = 4.0;

      chordGain.gain.setValueAtTime(0.001, now);
      chordGain.gain.exponentialRampToValueAtTime(0.06, now + 0.8);
      chordGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      chordGain.connect(this.masterGain!);

      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(chordGain);
        osc.start();
        osc.stop(now + dur + 0.1);
      });

      chordIdx = (chordIdx + 1) % profile.chordProgression.length;
    };

    playChord();
    this.sequenceTimer = setInterval(playChord, 4000);
  }

  public setVolume(vol: number) {
    if (this.audioEl) {
      this.audioEl.volume = Math.min(1.0, Math.max(0.01, vol * 3.5));
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, vol), this.ctx.currentTime + 0.2);
    }
  }

  public seek(seconds: number) {
    if (this.audioEl) {
      try {
        const safeSec = Math.max(0, seconds);
        if (Number.isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
          this.audioEl.currentTime = Math.min(safeSec, this.audioEl.duration);
        } else {
          this.audioEl.currentTime = safeSec;
        }
        if (this.onTimeUpdate) {
          this.onTimeUpdate(Math.floor(this.audioEl.currentTime));
        }
      } catch (err) {
        console.warn("Audio seek exception:", err);
      }
    }
  }

  public getVisualizerData(): number[] {
    if (!this.analyser || !this.isPlaying) {
      return [4, 6, 4, 8, 5, 7, 4, 6, 8, 5, 4];
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    const bars: number[] = [];
    const step = Math.floor(dataArray.length / 11);
    for (let i = 0; i < 11; i++) {
      const val = dataArray[i * step] || 0;
      bars.push(Math.max(4, Math.round((val / 255) * 26)));
    }
    return bars;
  }

  public stop() {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.audioEl = null;
      } catch {}
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    if (this.sequenceTimer) {
      clearInterval(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    if (this.vocalTimer) {
      clearInterval(this.vocalTimer);
      this.vocalTimer = null;
    }

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.activeOscillators = [];

    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      } catch {}
    }

    setTimeout(() => {
      if (this.ctx) {
        try {
          this.ctx.close();
        } catch {}
        this.ctx = null;
      }
      this.isPlaying = false;
    }, 450);
  }
}
