/**
 * DropBeam File Chunker & Backpressure Streamer
 * Handles 16KB WebRTC DataChannel chunking, backpressure control,
 * speed calculations, and stream reconstruction into Blob objects.
 */

export const CHUNK_SIZE = 16384; // 16 KB (safe WebRTC DataChannel chunk size)
export const HIGH_WATER_MARK = 64 * 1024; // 64 KB backpressure threshold
export const LOW_WATER_MARK = 16 * 1024;  // 16 KB resume threshold

/**
 * Sends a single file over the WebRTC DataChannel with backpressure flow control.
 */
export async function sendFileOverDataChannel({
  file,
  dataChannel,
  fileId,
  onProgress,
  isCancelledRef
}) {
  if (!dataChannel || dataChannel.readyState !== 'open') {
    throw new Error('DataChannel is not open');
  }

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const metadata = {
    type: 'file-meta',
    id: fileId,
    name: file.name,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    totalChunks,
    chunkSize: CHUNK_SIZE
  };

  // 1. Send Header Metadata
  dataChannel.send(JSON.stringify(metadata));

  // Configure backpressure low threshold
  dataChannel.bufferedAmountLowThreshold = LOW_WATER_MARK;

  let offset = 0;
  let chunkIndex = 0;
  const startTime = Date.now();
  let lastSpeedCheckTime = startTime;
  let lastSpeedCheckBytes = 0;
  let currentSpeed = 0;

  // Helper to pause if buffer is full (Backpressure handling)
  const waitForBufferDrain = () => {
    return new Promise((resolve) => {
      if (dataChannel.bufferedAmount <= LOW_WATER_MARK) {
        return resolve();
      }

      const handleBufferedAmountLow = () => {
        dataChannel.removeEventListener('bufferedamountlow', handleBufferedAmountLow);
        resolve();
      };

      dataChannel.addEventListener('bufferedamountlow', handleBufferedAmountLow);

      // Safety fallback polling timeout
      const checkInterval = setInterval(() => {
        if (dataChannel.bufferedAmount <= LOW_WATER_MARK) {
          clearInterval(checkInterval);
          dataChannel.removeEventListener('bufferedamountlow', handleBufferedAmountLow);
          resolve();
        }
      }, 50);
    });
  };

  // 2. Stream Chunks
  while (offset < file.size) {
    if (isCancelledRef?.current) {
      dataChannel.send(JSON.stringify({ type: 'file-cancel', id: fileId }));
      throw new Error('Transfer cancelled');
    }

    if (dataChannel.readyState !== 'open') {
      throw new Error('DataChannel closed unexpectedly during transfer');
    }

    // Check backpressure before reading and sending
    if (dataChannel.bufferedAmount > HIGH_WATER_MARK) {
      await waitForBufferDrain();
    }

    const slice = file.slice(offset, offset + CHUNK_SIZE);
    const arrayBuffer = await slice.arrayBuffer();

    dataChannel.send(arrayBuffer);

    offset += arrayBuffer.byteLength;
    chunkIndex++;

    // Calculate Speed & ETA every 200ms
    const now = Date.now();
    const timeDelta = (now - lastSpeedCheckTime) / 1000;
    if (timeDelta >= 0.2 || offset === file.size) {
      const bytesDelta = offset - lastSpeedCheckBytes;
      currentSpeed = bytesDelta / timeDelta;
      lastSpeedCheckTime = now;
      lastSpeedCheckBytes = offset;
    }

    const totalElapsed = (now - startTime) / 1000;
    const avgSpeed = totalElapsed > 0 ? offset / totalElapsed : 0;
    const remainingBytes = file.size - offset;
    const etaSeconds = avgSpeed > 0 ? remainingBytes / avgSpeed : 0;

    if (onProgress) {
      onProgress({
        fileId,
        sentBytes: offset,
        totalBytes: file.size,
        progress: Math.min(100, (offset / file.size) * 100),
        speed: currentSpeed || avgSpeed,
        eta: etaSeconds
      });
    }
  }

  // 3. Send Completion Signal
  dataChannel.send(JSON.stringify({ type: 'file-complete', id: fileId }));
}

/**
 * FileReceiver class to reconstruct streamed ArrayBuffers into a downloadable Blob.
 */
export class FileReceiver {
  constructor(onProgress, onComplete, onError) {
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.onError = onError;
    this.reset();
  }

  reset() {
    this.currentFileMeta = null;
    this.receivedChunks = [];
    this.receivedBytes = 0;
    this.startTime = 0;
    this.lastSpeedCheckTime = 0;
    this.lastSpeedCheckBytes = 0;
  }

  handleMetadata(metadata) {
    this.currentFileMeta = metadata;
    this.receivedChunks = [];
    this.receivedBytes = 0;
    this.startTime = Date.now();
    this.lastSpeedCheckTime = this.startTime;
    this.lastSpeedCheckBytes = 0;

    if (this.onProgress) {
      this.onProgress({
        fileId: metadata.id,
        name: metadata.name,
        totalBytes: metadata.size,
        receivedBytes: 0,
        progress: 0,
        speed: 0,
        eta: 0
      });
    }
  }

  handleChunk(arrayBuffer) {
    if (!this.currentFileMeta) return;

    this.receivedChunks.push(arrayBuffer);
    this.receivedBytes += arrayBuffer.byteLength;

    const now = Date.now();
    const totalElapsed = (now - this.startTime) / 1000;
    const timeDelta = (now - this.lastSpeedCheckTime) / 1000;

    let currentSpeed = 0;
    if (timeDelta >= 0.2 || this.receivedBytes === this.currentFileMeta.size) {
      const bytesDelta = this.receivedBytes - this.lastSpeedCheckBytes;
      currentSpeed = bytesDelta / timeDelta;
      this.lastSpeedCheckTime = now;
      this.lastSpeedCheckBytes = this.receivedBytes;
    }

    const avgSpeed = totalElapsed > 0 ? this.receivedBytes / totalElapsed : 0;
    const remainingBytes = this.currentFileMeta.size - this.receivedBytes;
    const etaSeconds = avgSpeed > 0 ? remainingBytes / avgSpeed : 0;

    const progress = Math.min(100, (this.receivedBytes / this.currentFileMeta.size) * 100);

    if (this.onProgress) {
      this.onProgress({
        fileId: this.currentFileMeta.id,
        name: this.currentFileMeta.name,
        totalBytes: this.currentFileMeta.size,
        receivedBytes: this.receivedBytes,
        progress,
        speed: currentSpeed || avgSpeed,
        eta: etaSeconds
      });
    }
  }

  handleComplete() {
    if (!this.currentFileMeta) return;

    const blob = new Blob(this.receivedChunks, { type: this.currentFileMeta.mimeType });
    const url = URL.createObjectURL(blob);

    const completedFile = {
      id: this.currentFileMeta.id,
      name: this.currentFileMeta.name,
      size: this.currentFileMeta.size,
      mimeType: this.currentFileMeta.mimeType,
      url,
      blob
    };

    if (this.onComplete) {
      this.onComplete(completedFile);
    }

    this.reset();
  }
}
