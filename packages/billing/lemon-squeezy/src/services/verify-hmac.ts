function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createHmac({ key, data }: { key: string; data: string }) {
  const encoder = new TextEncoder();
  const crypto = new Crypto();
  const encodedKey = encoder.encode(key);
  const encodedData = encoder.encode(data);

  const hmacKey = await crypto.subtle.importKey(
    'raw',
    encodedKey,
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );

  const signature = await window.crypto.subtle.sign(
    'HMAC',
    hmacKey,
    encodedData,
  );

  const hex = bufferToHex(signature);

  return { hex };
}
