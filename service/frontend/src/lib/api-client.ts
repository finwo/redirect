import { writable } from 'svelte/store';
import { syncedObject } from './storage';

const Buff       = ('function' === typeof Buffer) ? Buffer : require('buffer').Buffer;
const { PBKDF2 } = require('@finwo/digest-pbkdf2');
const supercop   = require('supercop');

const apiAuth    = syncedObject<Record<string,string>>('api_auth');
const apiServer  = `http://api.${document.location.hostname}`;

export const isLoading  = writable(true);
export const isLoggedIn = writable(false);
export const user       = writable(null);

const http = {
  async _call(method: string, path: string, data: object) {
    const opts: any = { method, headers: {} };
    if (apiAuth.token) {
      opts.headers['Authorization'] = `Bearer ${apiAuth.token}`;
    }
    if (data) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(data);
    }
    return (await fetch(`${apiServer}${path}`, opts)).json();
  },
  _get(path: string) {
    return http._call('GET', path, null);
  },
  _post(path: string, data: object) {
    return http._call('POST', path, data);
  },
  _put(path: string, data: object) {
    return http._call('PUT', path, data);
  },

  async login(username, password) {

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
    const tokenResponse = await http._post('/v1/auth', {
      usr: username,
      sig: signature.toString('base64'),
      at: timecode,
    }, false);

    // Update the actual token
    apiAuth.token = tokenResponse.token;
    await http.updateLoginStatus();
  },

  async updateLoginStatus() {
    // Retrieve the current user
    const userResponse = await http._get('/v1/users/self');
    user.set(userResponse.user);
    isLoggedIn.set(!!userResponse.user);
  },

};

export const performLogin = (username: string, password: string) => {
  return http.login(username, password);
};

export const logout = () => {
  apiAuth.token = null;
  http.updateLoginStatus();
};

export const listPorts = (page = 0, offset = -1) => {
  const limit = 20;
  if (offset < 0) offset = limit * page;
  return http._get(`/v1/ports?limit=${limit}&offset=${offset}`);
};

export const editPort = (key, newData) => {
  return http._put(`/v1/ports/${key}`, newData);
};

http.updateLoginStatus()
  .then(() => {
    isLoading.set(false);
  });
