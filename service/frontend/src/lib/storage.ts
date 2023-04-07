import { observer } from '@finwo/observer';

const cache: Record<string, {[index:string|symbol]:any}> = {};

export function syncedObject<T = {[index:string|symbol]:any}>(name: string) {
  if (cache[name]) return cache[name];
  const org = JSON.parse(localStorage.getItem(name) || '{}');
  const obs = observer<T>(org, (...chain) => {
    localStorage.setItem(name, JSON.stringify(org));
  });
  return cache[name] = obs;
}
