import path from 'path';
import { fileURLToPath } from 'url';
import murmurhash from 'murmurhash';
import cryptojs from 'crypto-js';

/* Path Resolve */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parentDir = path.resolve(__dirname, '../..');


/* generate encryption */

const murmur3 = (str: string) => {
    return murmurhash.v3(str).toString();
}

const generateFingerprint = () => {
  const parts = [
    globalThis.crypto?.randomUUID?.() || Math.random().toString(36),
    Date.now().toString(36),
    typeof performance !== 'undefined' ? performance.now().toString(36) : '0',
    typeof navigator !== 'undefined'
      ? navigator.userAgent.replace(/\W+/g, '')
      : 'nodejs',
    typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '0x0',
    typeof navigator !== 'undefined' ? navigator.language : 'en',
    Math.random().toString(36).substring(2, 15),
  ].join('|');

  return murmur3(parts);
}

// The main getVisitorId
export const getVisitorId = async (orgId: string) => {
    return Date.now().toString(36);
}


export const generateEncryption = (text: string, key: string) => {
    return cryptojs.HmacSHA256(text, key).toString(cryptojs.enc.Hex);
}


export const convertToBlob = (base64URI: string) => {
    const splitDataURI = base64URI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++){
        ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ia], { type: mimeString })    
}
