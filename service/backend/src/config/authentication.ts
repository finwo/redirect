const { PBKDF2 } = require('@finwo/digest-pbkdf2');
const supercop   = require('supercop');

export const num_iterations = 1024;
export const window_time    = 150;
export const token_expiry   = 7200;

// Generate a promise to a keypair we'll use for authentication clients
export const keypair = new Promise(resolve => {
  const serverSeed = process.env.KP_SEED || 'supers3cret';
  (new PBKDF2(serverSeed, 'redirectionService', num_iterations, 32))
    .deriveKey(()=>{}, async (key: string) => {
      const seed = Buffer.from(key, 'hex');
      resolve(await supercop.createKeyPair(seed));
    });
});
