# -*- coding: utf-8 -*-
"""生成口播资讯风轻 BGM：温暖 pad 铺底 + 低音 + 琶音 + 轻 hi-hat"""
import json, pathlib, wave
import numpy as np

BASE = pathlib.Path(__file__).resolve().parent
SR = 44100
meta = json.loads((BASE / "durations.json").read_text(encoding="utf-8"))
total = meta["total"]
DUR = total + 2.0

BPM = 92
beat = 60.0 / BPM
bar = 4 * beat
eighth = beat / 2

# Am - F - C - G 循环（正向、信息感）
CHORDS = [
    [110.00, 146.83, 164.81, 220.00, 261.63],  # Am: A2 E3 E3 A3 C4
    [87.31, 130.81, 174.61, 220.00, 261.63],   # F:  F2 C3 F3 A3 C4
    [130.81, 196.00, 261.63, 329.63, 392.00],  # C:  C3 G3 C4 E4 G4
    [98.00, 146.83, 196.00, 246.94, 293.66],   # G:  G2 D3 G3 B3 D4
]

track = np.zeros(int(DUR * SR), dtype=np.float64)
rng = np.random.default_rng(42)


def add(start, seg, gain):
    i = int(start * SR)
    if i < 0 or i + len(seg) > len(track):
        return
    track[i:i + len(seg)] += gain * seg


def env(n, a, r):
    e = np.ones(n)
    na = min(int(a * SR), n)
    nr = min(int(r * SR), n)
    if na > 0:
        e[:na] = np.linspace(0, 1, na)
    if nr > 0:
        e[-nr:] = np.linspace(1, 0, nr)
    return e


nbar = int(DUR / bar) + 1
for b in range(nbar):
    t0 = b * bar
    root = CHORDS[b % 4][0]
    fifth = CHORDS[b % 4][2]

    # pad：根音+五音+高八度根音，慢起慢收铺满整小节
    n = int(bar * SR)
    t = np.arange(n) / SR
    pad = (np.sin(2 * np.pi * root * t) * 0.6
           + np.sin(2 * np.pi * fifth * t) * 0.35
           + np.sin(2 * np.pi * root * 2 * t) * 0.25)
    add(t0, pad * env(n, 0.35, 0.6), 0.10)

    # bass：每拍根音（低八度包裹）
    for p in range(4):
        st = t0 + p * beat
        n = int(beat * 0.9 * SR)
        seg = np.sin(2 * np.pi * root * np.arange(n) / SR) * env(n, 0.01, 0.28)
        add(st, seg, 0.16)

    # arp：八分音符上行和弦音
    arpn = int(eighth * 0.8 * SR)
    for p in range(8):
        f = CHORDS[b % 4][(p % 4) + 1] * 2
        st = t0 + p * eighth
        seg = np.sin(2 * np.pi * f * np.arange(arpn) / SR) * env(arpn, 0.008, 0.35)
        add(st, seg, 0.055)

    # hat：八分音符轻噪声（高通感）
    for p in range(8):
        st = t0 + p * eighth
        hn = int(0.04 * SR)
        noise = rng.normal(0, 1, hn + 1)
        hp = np.diff(noise)
        seg = hp * env(hn, 0.001, 0.06)
        add(st, seg, 0.05)

# 整体归一化并压低（BGM 作为底噪，峰值约 0.75）
track = track / (np.max(np.abs(track)) + 1e-9) * 0.75
stereo = np.stack([track, track], axis=1)

wav_path = BASE / "bgm.wav"
with wave.open(str(wav_path), "w") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype(np.int16).tobytes())

print(f"BGM -> {wav_path}  ({DUR:.1f}s)")
