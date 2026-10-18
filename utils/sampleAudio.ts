/**
 * Generates an educational sample audio track using Web Audio API
 * Encoded as a pure 16-bit PCM WAV Blob completely in the browser.
 * Length: ~16 seconds with 4 distinct melodic conversation phrases,
 * ideal for testing A-B repeat right away!
 */
export function generateSampleAudio(): { blob: Blob; url: string; duration: number } {
  const sampleRate = 44100;
  const duration = 16; // 16 seconds
  const totalSamples = sampleRate * duration;
  const numChannels = 1;

  // Create an AudioBuffer-like ArrayBuffer for 16-bit PCM
  const buffer = new ArrayBuffer(44 + totalSamples * 2);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length minus RIFF identifier & length = 36 + data size
  view.setUint32(4, 36 + totalSamples * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, totalSamples * 2, true);

  // Generate 4 distinct melodic phrases (each ~4s long)
  // simulating an English dialogue practice:
  // Phrase 1 (0-4s): "Hello, how are you today?" (C4 - E4 - G4 - A4 - G4)
  // Phrase 2 (4-8s): "I am doing well, thank you." (F4 - A4 - C5 - A4 - F4)
  // Phrase 3 (8-12s): "What are your plans for this weekend?" (G4 - B4 - D5 - B4 - G4)
  // Phrase 4 (12-16s): "I plan to practice English listening!" (C5 - G4 - E4 - D4 - C4)
  const notesByTime: { start: number; end: number; freq: number }[] = [
    // Phrase 1
    { start: 0.2, end: 0.9, freq: 261.63 }, // C4
    { start: 1.0, end: 1.7, freq: 329.63 }, // E4
    { start: 1.8, end: 2.5, freq: 392.00 }, // G4
    { start: 2.6, end: 3.2, freq: 440.00 }, // A4
    { start: 3.3, end: 3.8, freq: 392.00 }, // G4

    // Phrase 2
    { start: 4.2, end: 4.9, freq: 349.23 }, // F4
    { start: 5.0, end: 5.7, freq: 440.00 }, // A4
    { start: 5.8, end: 6.5, freq: 523.25 }, // C5
    { start: 6.6, end: 7.2, freq: 440.00 }, // A4
    { start: 7.3, end: 7.8, freq: 349.23 }, // F4

    // Phrase 3
    { start: 8.2, end: 8.9, freq: 392.00 }, // G4
    { start: 9.0, end: 9.7, freq: 493.88 }, // B4
    { start: 9.8, end: 10.5, freq: 587.33 }, // D5
    { start: 10.6, end: 11.2, freq: 493.88 }, // B4
    { start: 11.3, end: 11.8, freq: 392.00 }, // G4

    // Phrase 4
    { start: 12.2, end: 12.8, freq: 523.25 }, // C5
    { start: 12.9, end: 13.5, freq: 392.00 }, // G4
    { start: 13.6, end: 14.2, freq: 329.63 }, // E4
    { start: 14.3, end: 14.9, freq: 293.66 }, // D4
    { start: 15.0, end: 15.8, freq: 261.63 }, // C4
  ];

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const time = i / sampleRate;

    // Find active note
    let sample = 0;
    for (const note of notesByTime) {
      if (time >= note.start && time <= note.end) {
        const noteDuration = note.end - note.start;
        const noteProgress = (time - note.start) / noteDuration;
        // Envelope: soft attack and decay
        const envelope = Math.sin(noteProgress * Math.PI);
        // Fundamental frequency + soft second harmonic for warm electric piano timbre
        const val1 = Math.sin(2 * Math.PI * note.freq * time);
        const val2 = 0.3 * Math.sin(2 * Math.PI * (note.freq * 2) * time);
        sample = (val1 + val2) * envelope * 0.45;
        break;
      }
    }

    // Gentle metronome / beat click every 1 second
    const beatTime = time % 1.0;
    if (beatTime < 0.05) {
      const clickEnv = 1 - beatTime / 0.05;
      sample += Math.sin(2 * Math.PI * 1200 * beatTime) * clickEnv * 0.1;
    }

    // Clamp and convert to 16-bit integer
    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);

  return { blob, url, duration };
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

