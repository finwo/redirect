import { writable } from 'svelte/store';
import { syncedObject } from './storage';

const Buff       = ('function' === typeof Buffer) ? Buffer : require('buffer').Buffer;
const { PBKDF2 } = require('@finwo/digest-pbkdf2');
const supercop   = require('supercop');

const apiAuth    = syncedObject<Record<string,string>>('api_auth');
const apiServer  = 'http://localhost:5000';

export const isLoading  = writable(true);
export const isLoggedIn = writable(false);
export const user       = writable(null);

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
  const tokenResponse = await (await fetch(`${apiServer}/v1/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usr: username,
      sig: signature.toString('base64'),
      at: timecode,
    })
  })).json();

  // Update the actual token
  apiAuth.token = tokenResponse.token;

  // Retrieve the current user
  const userResponse = await (await fetch(`${apiServer}/v1/users/self`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiAuth.token}`,
    },
  })).json();

  user.set(userResponse.user);
  isLoggedIn.set(!!userResponse.user);
};


;(() => {
  // Do login check here
})();

setTimeout(() => {
  isLoading.set(false);
}, 1);
