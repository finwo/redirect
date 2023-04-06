import { writable } from 'svelte/store';

const Buff       = ('function' === typeof Buffer) ? Buffer : require('buffer').Buffer;
const { PBKDF2 } = require('@finwo/digest-pbkdf2');
const supercop   = require('supercop');

const apiServer  = 'http://localhost:5000';

export const isLoading  = writable(true);
export const isLoggedIn = writable(false);

export const performLogin = async (username, password) => {

  // Generate le keypair
  const keypair = await new Promise(resolve => {
    (new PBKDF2(password, username, 4096, 32))
      .deriveKey(()=>{}, (key: string) => {
        const seed  = Buff.from(key, 'hex');
        resolve(supercop.createKeyPair(seed));
      });
  });

  // Build signed message
  const timecode  = Math.floor(Date.now() / 1000);
  const message   = `${timecode}|${username}|${timecode}`;
  const signature = await keypair.sign(message);

  // Fetch server-signed auth token
  const tokenData = await fetch(`${apiServer}/v1/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usr: username,
      sig: signature.toString('base64'),
      at: timecode,
    })
  });

  console.log({
    timecode,
    message,
    signature,
    tokenData,
  });

  // TODO: fetch current user

  // DEBUG
  isLoggedIn.set(true);

  // console.log({ keypair, pubkey: keypair.publicKey.toString('base64') });

    // return new Promise(resolve => {
    //   (new PBKDF2(password, this.username, num_iterations, 32))
    // });





};


;(() => {
  // Do login check here
})();

setTimeout(() => {
  isLoading.set(false);
  console.log('called');
}, 1);
