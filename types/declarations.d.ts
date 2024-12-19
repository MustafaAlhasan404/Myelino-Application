declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare module 'react-native-cookies' {
  export function set(url: string, name: string, value: string): Promise<void>;
  export function get(url: string, name: string): Promise<string | undefined>;
}
