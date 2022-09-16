
const detect = {

  get isBrowser(): boolean {
    return typeof window !== 'undefined';
  },

  get isNodeJS(): boolean {
    return typeof window === 'undefined';
  },

  get isMobileDevice(): boolean {
    return typeof window !== 'undefined' && ('ontouchstart' in window || 'onmsgesturechange' in window);
  }

};

export default detect; 