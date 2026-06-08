let currentBGM: HTMLAudioElement | null = null;

export const playSFX = (sfxName: 'start' | 'back' | 'button' | 'error' | 'sixseven') => {
  if (localStorage.getItem('sfxEnabled') === 'false') return;
  
  const ext = sfxName === 'sixseven' ? 'mp3' : 'ogg';
  const audio = new Audio(`./sfx/${sfxName}.${ext}`);
  audio.volume = 0.8;
  audio.play().catch(e => console.warn('SFX bloqueado por el navegador:', e));
};

export const playBGM = (bgmName: 'menu' | 'theme') => {
  if (currentBGM) {
    currentBGM.pause();
    currentBGM.currentTime = 0;
  }
  
  if (localStorage.getItem('bgmEnabled') === 'false') return;
  
  currentBGM = new Audio(`./bgm/${bgmName}.mp3`);
  currentBGM.loop = true;
  currentBGM.volume = 0.7;
  currentBGM.play().catch(e => console.warn('BGM bloqueado por el navegador:', e));
};

export const stopBGM = () => {
  if (currentBGM) {
    currentBGM.pause();
    currentBGM = null;
  }
};