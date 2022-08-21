import Editor from './Editor';

const SCALE = 25;

window.onload = () => {
  document.getElementById('map-picker-form')?.addEventListener('submit', onMapPick);
};

function onMapPick(e: SubmitEvent) {
  e.preventDefault();
  const target = e.target as HTMLFormElement;
  const filePicker = target.elements.namedItem('file-picker') as HTMLInputElement;
  const f = filePicker.files?.[0];
  if (!f) return;
  display('canvas');
  const cnv = document.getElementById('canvas') as HTMLCanvasElement;
  if (!cnv) throw new Error('no canvas present');
  createMap(cnv, f);
}

async function createMap(elem: HTMLCanvasElement, file: File) {
  const url = URL.createObjectURL(file);

  const ctx = elem.getContext('2d');
  if (!ctx) throw new Error('no context');

  const img = document.createElement('img') as HTMLImageElement;
  img.src = url;
  elem.style.imageRendering = 'pixelated';
  // ctx.filter = 'url(#remove-alpha)';
  ctx.imageSmoothingEnabled = false;
  img.onload = () => {
    // @ts-ignore
    window.editor = new Editor(elem, img, SCALE);

    URL.revokeObjectURL(url);
  };
}

function display(elem: string) {
  for (const c of document.body.children) {
    if (!(c instanceof HTMLElement)) continue;
    c.style.display = 'none';
  }
  const toDisplay = document.getElementById(elem);
  if (!toDisplay) throw new Error('nothing to display');
  toDisplay.style.display = 'block';
}
