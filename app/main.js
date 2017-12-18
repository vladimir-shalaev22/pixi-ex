import 'pixi.js'

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

let state = {
  frame: 0,
  boxes: [
    [0, 0, [50, 20]],
    [30, 0, [190, 20]],
    [60, 0, [330, 20]],
    [90, 0, [470, 20]],
    [120, 0, [610, 20]]
  ]
}

const gravity = (speed) => speed < 50 ? speed + 2 : 50
const inertia = (pos, speed, limit) => {
  return [pos[0], Math.min(limit, pos[1] + speed)];
}

const moveBoxes = (prevState, frame) => {
  return prevState.map((box) => {
    const [start, speed, pos] = box;
    return start > frame ? box : [
      start, gravity(speed), inertia(pos, speed, 450)
    ];
  });
}

const nextState = (prevState) => {
  if (prevState.frame > 3000) { return prevState; }
  return {
    frame: prevState.frame + 1,
    boxes: moveBoxes(prevState.boxes, prevState.frame)
  }
}

// load the texture we need
PIXI.loader.add('box', 'gamebox.png').load((loader, resources) => {
    const boxes = state.boxes.map(([start, speed, pos]) => {
      let sprite = new PIXI.Sprite(resources.box.texture)
      sprite.position.set(pos[0], pos[1])
      app.stage.addChild(sprite);
      return sprite
    });

    // Listen for frame updates
    app.ticker.add(() => {
      state = nextState(state);
      state.boxes.forEach(([start, speed, pos], index) => {
        boxes[index].position.set(pos[0], pos[1])
      });
    });
});
