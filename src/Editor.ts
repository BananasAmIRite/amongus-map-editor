export default class Editor {
  private map: boolean[][];
  private currentMousePosition: { x: number; y: number };
  public constructor(private elem: HTMLCanvasElement, private img: HTMLImageElement, private scale: number) {
    this.elem.width = img.width;
    this.elem.height = img.height;
    this.elem.style.width = `${img.width}px`;
    this.elem.style.height = `${img.height}px`;
    this.map = [];
    this.currentMousePosition = { x: 0, y: 0 };
    this.loadMap();
    this.addListeners();

    this.render();
  }

  private loadMap() {
    const width = Math.ceil(this.img.width / this.scale);
    const height = Math.ceil(this.img.height / this.scale);

    for (let y = 0; y < height; y++) {
      this.map.push([]);
      for (let x = 0; x < width; x++) {
        this.map[y].push(false);
      }
    }
  }

  private addListeners() {
    let mouseDown = false;
    let lastSquare = [-1, -1];
    this.elem.addEventListener('mousemove', (e) => {
      this.currentMousePosition.x = e.offsetX;
      this.currentMousePosition.y = e.offsetY;

      if (mouseDown) {
        const curSquare = [Math.floor(e.offsetX / this.scale), Math.floor(e.offsetY / this.scale)];
        if (curSquare[0] !== lastSquare[0] || curSquare[1] !== lastSquare[1]) {
          //   this.map[curSquare[1]][curSquare[0]] = !this.map[curSquare[1]][curSquare[0]];
          this.map[curSquare[1]][curSquare[0]] = true;
        }

        lastSquare = curSquare;
      }
    });

    this.elem.addEventListener('mousedown', (e) => {
      mouseDown = true;
      const x = Math.floor(e.offsetX / this.scale);
      const y = Math.floor(e.offsetY / this.scale);
      this.map[y][x] = !this.map[y][x];
    });

    this.elem.addEventListener('mouseup', (e) => {
      mouseDown = false;
      lastSquare = [-1, -1];
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        const url = Buffer.from(JSON.stringify(this.toJson())).toString('base64');
        const a = document.createElement('a');

        a.download = 'data.json';
        a.href = `data:application/json;base64,${url}`;
        a.target = '_blank';
        a.click();
      }
    });
  }

  private render() {
    const ctx = this.elem.getContext('2d');
    if (!ctx) throw new Error('No context defined');

    ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);

    const mX = Math.floor(this.currentMousePosition.x / this.scale);
    const mY = Math.floor(this.currentMousePosition.y / this.scale);

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const elem = this.map[y][x];
        let v = 0;
        if (elem) v += 0.6;
        if (x === mX && y === mY) v += 0.2;

        ctx.fillStyle = `rgba(255,255, 255, ${v})`;
        ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
      }
    }

    window.requestAnimationFrame(() => this.render());
  }

  private toJson() {
    return {
      scale: this.scale,
      collisionBlocks: this.map,
    };
  }
}
