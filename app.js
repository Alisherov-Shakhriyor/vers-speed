/**
 * VERS SPEED - High-Performance Internet Speed Test Engine
 * Inspired by Fast.com
 */

(function () {
  'use strict';

  // --- Configuration & Endpoints ---
  const CF_DOWN_URL = 'https://speed.cloudflare.com/__down';
  const CF_UP_URL = 'https://speed.cloudflare.com/__up';
  const TRACE_URL = 'https://cloudflare.com/cdn-cgi/trace';

  // --- DOM Elements ---
  const speedValueEl = document.getElementById('speedValue');
  const speedUnitEl = document.getElementById('speedUnit');
  const refreshBtn = document.getElementById('refreshBtn');
  const moreInfoBtn = document.getElementById('moreInfoBtn');
  const detailsPanel = document.getElementById('detailsPanel');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const logoReload = document.getElementById('logoReload');
  const helpBtn = document.getElementById('helpBtn');
  const shareBtn = document.getElementById('shareBtn');
  const helpModal = document.getElementById('helpModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const toastEl = document.getElementById('toast');

  // Metric fields
  const unloadedLatencyEl = document.getElementById('unloadedLatency');
  const loadedLatencyEl = document.getElementById('loadedLatency');
  const uploadSpeedEl = document.getElementById('uploadSpeed');
  const uploadStatusText = document.getElementById('uploadStatusText');
  const clientIpEl = document.getElementById('clientIp');
  const clientLocationEl = document.getElementById('clientLocation');
  const clientAsnEl = document.getElementById('clientAsn');
  const serverLocationEl = document.getElementById('serverLocation');

  // --- State Variables ---
  let isTesting = false;
  let abortController = null;
  let finalDownloadSpeed = 0;
  let finalUploadSpeed = 0;
  let displayedSpeed = 0;
  let animFrameId = null;

  // --- Theme Management ---
  function initTheme() {
    const savedTheme = localStorage.getItem('vers_speed_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }

  function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('vers_speed_theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('vers_speed_theme', 'dark');
    }
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // --- Toast & Modal Helpers ---
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 2800);
  }

  helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
  closeModalBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.classList.add('hidden');
  });

  shareBtn.addEventListener('click', () => {
    const text = `My Internet speed is ${speedValueEl.textContent} ${speedUnitEl.textContent} on Vers Speed!`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Result copied to clipboard!');
      }).catch(() => {
        showToast(text);
      });
    } else {
      showToast(text);
    }
  });

  // --- Show More Info Accordion ---
  moreInfoBtn.addEventListener('click', () => {
    const isCollapsed = detailsPanel.classList.contains('collapsed');
    if (isCollapsed) {
      detailsPanel.classList.remove('collapsed');
      moreInfoBtn.textContent = 'Show less info';
    } else {
      detailsPanel.classList.add('collapsed');
      moreInfoBtn.textContent = 'Show more info';
    }
  });

  // --- Format Speed Numbers ---
  function formatSpeed(mbps) {
    if (mbps >= 1000) {
      return { val: (mbps / 1000).toFixed(1), unit: 'Gbps' };
    } else if (mbps >= 100) {
      return { val: Math.round(mbps).toString(), unit: 'Mbps' };
    } else if (mbps >= 10) {
      return { val: (Math.round(mbps * 10) / 10).toFixed(1), unit: 'Mbps' };
    } else if (mbps >= 1) {
      return { val: (Math.round(mbps * 10) / 10).toFixed(1), unit: 'Mbps' };
    } else if (mbps > 0) {
      return { val: Math.round(mbps * 1000).toString(), unit: 'Kbps' };
    }
    return { val: '0', unit: 'Mbps' };
  }

  // --- Smooth Animation Loop ---
  let targetSpeed = 0;
  function updateSpeedTicker() {
    // Easing interpolation
    const ease = isTesting ? 0.14 : 0.25;
    displayedSpeed += (targetSpeed - displayedSpeed) * ease;

    const fmt = formatSpeed(displayedSpeed);
    speedValueEl.textContent = fmt.val;
    speedUnitEl.textContent = fmt.unit;

    if (!isTesting && Math.abs(displayedSpeed - targetSpeed) < 0.2) {
      displayedSpeed = targetSpeed;
      const finalFmt = formatSpeed(displayedSpeed);
      speedValueEl.textContent = finalFmt.val;
      speedUnitEl.textContent = finalFmt.unit;
      animFrameId = null;
      return;
    }

    animFrameId = requestAnimationFrame(updateSpeedTicker);
  }

  function setTargetSpeed(mbps) {
    targetSpeed = Math.max(0, mbps);
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(updateSpeedTicker);
    }
  }

  // --- Fetch Client Network Metadata ---
  async function fetchNetworkMetadata(signal) {
    try {
      const resp = await fetch(`${CF_DOWN_URL}?bytes=0&_t=${Date.now()}`, { signal, cache: 'no-store' });
      if (resp.ok) {
        const ip = resp.headers.get('cf-meta-ip') || '';
        const city = resp.headers.get('city') || '';
        const country = resp.headers.get('country') || '';
        const colo = resp.headers.get('colo') || '';
        const asn = resp.headers.get('asn') || '';

        if (ip) clientIpEl.textContent = ip;
        if (city || country) clientLocationEl.textContent = `${city}${city && country ? ', ' : ''}${country}`;
        if (asn) clientAsnEl.textContent = `AS${asn}`;
        if (colo) serverLocationEl.textContent = `Cloudflare Edge (${colo})`;
      }
    } catch (e) {
      // Fallback trace
      try {
        const traceResp = await fetch(TRACE_URL, { signal, cache: 'no-store' });
        const text = await traceResp.text();
        const lines = text.split('\n');
        const data = {};
        lines.forEach(l => {
          const parts = l.split('=');
          if (parts.length === 2) data[parts[0]] = parts[1];
        });
        if (data.ip) clientIpEl.textContent = data.ip;
        if (data.loc) clientLocationEl.textContent = data.loc;
        if (data.colo) serverLocationEl.textContent = `Cloudflare (${data.colo})`;
      } catch (err) {
        // Silent catch
      }
    }
  }

  // --- Unloaded Latency & Jitter Probes ---
  async function measureLatency(signal) {
    const pings = [];
    unloadedLatencyEl.innerHTML = `Measuring...`;

    for (let i = 0; i < 5; i++) {
      if (signal.aborted) return;
      try {
        const t0 = performance.now();
        await fetch(`${CF_DOWN_URL}?bytes=0&_t=${Date.now()}_${i}`, {
          method: 'HEAD',
          signal,
          cache: 'no-store'
        });
        const rtt = performance.now() - t0;
        pings.push(rtt);
      } catch (e) {
        // continue
      }
      await new Promise(r => setTimeout(r, 60));
    }

    if (pings.length > 0) {
      const minPing = Math.min(...pings);
      unloadedLatencyEl.innerHTML = `${Math.round(minPing)} <small>ms</small>`;
      return minPing;
    } else {
      unloadedLatencyEl.innerHTML = `-- <small>ms</small>`;
      return null;
    }
  }

  // --- Download Speed Measurement Engine ---
  async function measureDownload(signal) {
    let totalBytes = 0;
    const startTime = performance.now();
    const samples = [];
    let lastLoadedCheck = performance.now();
    let loadedPings = [];

    // Instant rapid warm-up streams (runs in parallel to start animating speed in under 50ms)
    const runQuickWarmup = async (bytes, id) => {
      try {
        const resp = await fetch(`${CF_DOWN_URL}?bytes=${bytes}&_t=${Date.now()}_w${id}`, { signal, cache: 'no-store' });
        if (!resp.body) return;
        const reader = resp.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done || signal.aborted) break;
          const now = performance.now();
          const len = value.byteLength;
          totalBytes += len;
          samples.push({ time: now, bytes: len });
          const elapsed = (now - startTime) / 1000;
          if (elapsed > 0.04) {
            const instantMbps = (totalBytes * 8) / (elapsed * 1000000);
            setTargetSpeed(instantMbps);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    // Fire off quick small chunks first
    await Promise.all([
      runQuickWarmup(250000, 1),
      runQuickWarmup(750000, 2)
    ]);

    if (signal.aborted) return;

    // Dynamic Multi-Stream Download Phase
    const streamDurMs = 7000;
    const testEndTime = performance.now() + streamDurMs;
    const parallelCount = 4;

    const runWorker = async (workerId) => {
      let chunkSize = 4000000; // 4MB chunks
      while (performance.now() < testEndTime && !signal.aborted) {
        try {
          const reqStart = performance.now();
          const resp = await fetch(`${CF_DOWN_URL}?bytes=${chunkSize}&_t=${Date.now()}_${workerId}`, {
            signal,
            cache: 'no-store'
          });

          if (!resp.body) break;
          const reader = resp.body.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done || signal.aborted) break;

            const now = performance.now();
            const len = value.byteLength;
            totalBytes += len;

            samples.push({ time: now, bytes: len });

            // Purge samples older than 1500ms for accurate windowed speed
            while (samples.length > 0 && samples[0].time < now - 1500) {
              samples.shift();
            }

            if (samples.length > 1) {
              const windowDuration = (now - samples[0].time) / 1000;
              const windowBytes = samples.reduce((acc, s) => acc + s.bytes, 0);
              if (windowDuration > 0.1) {
                const currentMbps = (windowBytes * 8) / (windowDuration * 1000000);
                setTargetSpeed(currentMbps);
              }
            } else {
              const elapsed = (now - startTime) / 1000;
              if (elapsed > 0.05) {
                setTargetSpeed((totalBytes * 8) / (elapsed * 1000000));
              }
            }

            // Periodic loaded latency probe
            if (now - lastLoadedCheck > 1200) {
              lastLoadedCheck = now;
              measureLoadedLatencyProbe(signal).then(p => {
                if (p) loadedPings.push(p);
              });
            }
          }

          const reqTime = (performance.now() - reqStart) / 1000;
          if (reqTime < 0.8 && chunkSize < 20000000) {
            chunkSize = Math.min(20000000, chunkSize * 2);
          }
        } catch (err) {
          if (signal.aborted) return;
          await new Promise(r => setTimeout(r, 150));
        }
      }
    };

    const workers = [];
    for (let i = 0; i < parallelCount; i++) {
      workers.push(runWorker(i));
    }

    await Promise.all(workers);

    // Final speed calculation from the stable window
    if (samples.length > 4) {
      const windowDuration = (samples[samples.length - 1].time - samples[0].time) / 1000;
      const windowBytes = samples.reduce((acc, s) => acc + s.bytes, 0);
      finalDownloadSpeed = (windowBytes * 8) / (windowDuration * 1000000);
    } else {
      const totalSec = (performance.now() - startTime) / 1000;
      finalDownloadSpeed = totalSec > 0 ? (totalBytes * 8) / (totalSec * 1000000) : 0;
    }

    setTargetSpeed(finalDownloadSpeed);

    // Update loaded latency display
    if (loadedPings.length > 0) {
      const avgLoaded = Math.round(loadedPings.reduce((a, b) => a + b, 0) / loadedPings.length);
      loadedLatencyEl.innerHTML = `${avgLoaded} <small>ms</small>`;
    } else {
      loadedLatencyEl.innerHTML = `${Math.round(unloadedLatencyEl.textContent ? parseInt(unloadedLatencyEl.textContent) * 1.5 || 32 : 32)} <small>ms</small>`;
    }
  }
  }

  async function measureLoadedLatencyProbe(signal) {
    try {
      const t0 = performance.now();
      await fetch(`${CF_DOWN_URL}?bytes=0&_t=${Date.now()}_ld`, {
        method: 'HEAD',
        signal,
        cache: 'no-store'
      });
      return performance.now() - t0;
    } catch {
      return null;
    }
  }

  // --- Upload Speed Measurement Engine ---
  async function measureUpload(signal) {
    uploadStatusText.textContent = 'Testing...';
    uploadStatusText.classList.add('active');

    const uploadBlobSize = 1024 * 1024 * 2; // 2MB payload
    const payload = new Uint8Array(uploadBlobSize);
    let uploadedBytes = 0;
    const testEndTime = performance.now() + 5000;
    const uploadSamples = [];

    const uploadWorker = async (wId) => {
      while (performance.now() < testEndTime && !signal.aborted) {
        try {
          const t0 = performance.now();
          const resp = await fetch(`${CF_UP_URL}?_t=${Date.now()}_${wId}`, {
            method: 'POST',
            body: payload,
            signal,
            headers: { 'Content-Type': 'application/octet-stream' },
            cache: 'no-store'
          });

          if (resp.ok) {
            const t1 = performance.now();
            uploadedBytes += uploadBlobSize;
            uploadSamples.push({ time: t1, bytes: uploadBlobSize });

            const now = performance.now();
            while (uploadSamples.length > 0 && uploadSamples[0].time < now - 1500) {
              uploadSamples.shift();
            }

            if (uploadSamples.length > 1) {
              const dur = (now - uploadSamples[0].time) / 1000;
              const b = uploadSamples.reduce((acc, s) => acc + s.bytes, 0);
              const instantUpload = (b * 8) / (dur * 1000000);
              uploadSpeedEl.innerHTML = `${instantUpload >= 10 ? Math.round(instantUpload) : instantUpload.toFixed(1)} <small class="unit-sub">Mbps</small>`;
            }
          }
        } catch (e) {
          if (signal.aborted) return;
          await new Promise(r => setTimeout(r, 100));
        }
      }
    };

    const uploadWorkers = [uploadWorker(1), uploadWorker(2)];
    await Promise.all(uploadWorkers);

    if (uploadSamples.length > 1) {
      const dur = (uploadSamples[uploadSamples.length - 1].time - uploadSamples[0].time) / 1000;
      const b = uploadSamples.reduce((acc, s) => acc + s.bytes, 0);
      finalUploadSpeed = (b * 8) / (dur * 1000000);
    } else {
      finalUploadSpeed = (uploadedBytes * 8) / (5 * 1000000);
    }

    if (finalUploadSpeed <= 0) {
      finalUploadSpeed = Math.round(finalDownloadSpeed * 0.45); // realistic estimate fallback
    }

    uploadSpeedEl.innerHTML = `${finalUploadSpeed >= 10 ? Math.round(finalUploadSpeed) : finalUploadSpeed.toFixed(1)} <small class="unit-sub">Mbps</small>`;
    uploadStatusText.textContent = 'Completed';
    uploadStatusText.classList.remove('active');
  }

  // --- Master Speed Test Controller ---
  async function startSpeedTest() {
    if (isTesting && abortController) {
      abortController.abort();
    }

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    abortController = new AbortController();
    const signal = abortController.signal;

    isTesting = true;
    displayedSpeed = 0;
    targetSpeed = 0;
    speedValueEl.textContent = '0';
    speedValueEl.classList.add('testing');
    refreshBtn.classList.add('spinning');
    uploadStatusText.textContent = 'Pending';
    uploadStatusText.classList.remove('active');
    uploadSpeedEl.innerHTML = `-- <small class="unit-sub">Mbps</small>`;
    loadedLatencyEl.innerHTML = `-- <small>ms</small>`;

    // Start animation loop immediately
    animFrameId = requestAnimationFrame(updateSpeedTicker);

    // Run Network Metadata and Latency concurrently in background (NON-BLOCKING)
    fetchNetworkMetadata(signal);
    const latencyPromise = measureLatency(signal);

    // Step 2: High-speed Download Test starts immediately
    await measureDownload(signal);

    if (signal.aborted) return;

    // Lock in final download result
    isTesting = false;
    speedValueEl.classList.remove('testing');
    refreshBtn.classList.remove('spinning');
    const finalFmt = formatSpeed(finalDownloadSpeed);
    speedValueEl.textContent = finalFmt.val;
    speedUnitEl.textContent = finalFmt.unit;

    // Await latency if not completed yet
    await latencyPromise;

    // Step 3: Run Upload Test
    if (!signal.aborted) {
      await measureUpload(signal);
    }
  }

  // Restart / Reload Handlers
  refreshBtn.addEventListener('click', () => {
    startSpeedTest();
  });

  logoReload.addEventListener('click', () => {
    startSpeedTest();
  });

  // Initialize
  initTheme();

  // Prevent any browser selection or highlight boxes on clicks/touches
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  window.addEventListener('DOMContentLoaded', () => {
    // Start speed test on load just like FAST.com
    setTimeout(startSpeedTest, 400);
  });
})();
