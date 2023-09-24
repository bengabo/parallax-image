let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Loading screen
let loading_screen = document.getElementById("loading");

/**
 * Images loader
 */
let loaded = false;
let load_counter = 0;

let background = new Image();
let stars_01 = new Image();
let stars_02 = new Image();
let stars_03 = new Image();
let shadows = new Image();
let mask = new Image();
let planets = new Image();
let stars_04 = new Image();
let title = new Image();

let layers_list = [
  {
    image: background,
    src: "/layer_1_1.png",
    z_index: -2,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
    maxOffsetX: 100,
    maxOffsetY: 100,
    delay: 0,
  },
  {
    image: stars_01,
    src: "/layer_2_1.png",
    z_index: -1.8,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
    delay: 0,
  },
  {
    image: stars_02,
    src: "/layer_3_1.png",
    z_index: -1.5,
    position: { x: 0, y: 0 },
    blend: "overlay",
    opacity: 0.7,
    delay: 0,
  },
  {
    image: stars_03,
    src: "/layer_4_1.png",
    z_index: -1.25,
    position: { x: 0, y: 0 },
    blend: "overlay",
    opacity: 0.8,
    delay: 0,
  },
  {
    image: shadows,
    src: "/layer_5_1.png",
    z_index: -0.75,
    position: { x: 0, y: 0 },
    blend: "multiply",
    opacity: 1,
    maxOffsetX: 100,
    maxOffsetY: 100,
    delay: 0,
  },
  {
    image: mask,
    src: "/layer_6_1.png",
    z_index: 0,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
    delay: 0,
  },
  {
    image: planets,
    src: "/layer_7_1.png",
    z_index: 0.25,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
    delay: 0,
  },
  {
    image: stars_04,
    src: "/layer_8_1.png",
    z_index: 1.25,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 0.8,
    maxOffsetX: 100,
    maxOffsetY: 100,
    delay: 0,
  },
  {
    image: title,
    src: "/layer_9_1.png",
    z_index: 1.5,
    position: { x: canvas.width, y: 0 },
    blend: null,
    opacity: 1,
    maxOffsetX: 120,
    maxOffsetY: 100,
    delay: 2000,
  },
];

const hideLoading = () => {
  // loading_screen.classList.add("hidden");
};

layers_list.forEach((layer, index) => {
  layer.image.onload = () => {
    load_counter += 1;
    if (load_counter >= layers_list.length) {
      hideLoading();
      requestAnimationFrame(drawCanvas);
    }
  };

  layer.image.src = layer.src;
});

let getOffset = (layer) => {
  let touch_multip = 0.1;
  let touch_offset_x = pointer.x * layer.z_index * touch_multip;
  let touch_offset_y = pointer.y * layer.z_index * touch_multip;

  // Limit movement based on maxOffsetX and maxOffsetY
  if (touch_offset_x > layer.maxOffsetX) {
    touch_offset_x = layer.maxOffsetX;
  }
  if (touch_offset_x < -layer.maxOffsetX) {
    touch_offset_x = -layer.maxOffsetX;
  }
  if (touch_offset_y > layer.maxOffsetY) {
    touch_offset_y = layer.maxOffsetY;
  }
  if (touch_offset_y < -layer.maxOffsetY) {
    touch_offset_y = -layer.maxOffsetY;
  }

  let offset = {
    x: touch_offset_x,
    y: touch_offset_y,
  };

  return offset;
};
const drawCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // const rotate_x = pointer.y * 0.15 + motion.y * 1.2;
  // const rotate_y = pointer.x * 0.15 + motion.x * 1.2;
  // const transform_string =
  //   "rotateX(" + rotate_x + "deg), rotateY(" + rotate_y + "deg)";
  // canvas.style.transform = transform_string;
  layers_list.forEach((layer, index) => {
    layer.position = getOffset(layer);
    // Blend modes
    layer.blend
      ? (ctx.globalCompositeOperation = layer.blend)
      : (ctx.globalCompositeOperation = "normal");
    // Opacity
    ctx.globalAlpha = layer.opacity;
    ctx.drawImage(layer.image, layer.position.x, layer.position.y);
  });
  requestAnimationFrame(drawCanvas);
};

/**
 * Mouse ctrl
 */
let moving = false;

let pointer_init = {
  x: 0,
  y: 0,
};

let pointer = {
  x: 0,
  y: 0,
};

const pointerStart = (event) => {
  moving = true;

  if (event.type === "touchstart") {
    pointer_init.x = event.touches[0].clientX;
    pointer_init.y = event.touches[0].clientY;
  } else if (event.type === "mousedown") {
    pointer_init.x = event.clientX;
    pointer_init.y = event.clientY;
  }
};
canvas.addEventListener("touchstart", pointerStart);
canvas.addEventListener("mousedown", pointerStart);

const pointerMmove = (event) => {
  event.preventDefault();
  if (moving === true) {
    let current_x = 0;
    let current_y = 0;
    if (event.type === "touchemove") {
      current_x = event.touches[0].clientX;
      current_y = event.touches[0].clientY;
    } else if (event.type === "mousemove") {
      current_x = event.clientX;
      current_y = event.clientY;
    }
    pointer.x = current_x - pointer_init.x;
    pointer.y = current_y - pointer_init.y;
  }
};

window.addEventListener("touchmove", pointerMmove);
window.addEventListener("mousemove", pointerMmove);
canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
});
canvas.addEventListener("mousemove", (event) => {
  event.preventDefault();
});

window.addEventListener("touchend", (event) => {
  endGesture();
});
window.addEventListener("mouseup", (event) => {
  endGesture();
});

const endGesture = () => {
  moving = false;
  pointer.x = 0;
  pointer.y = 0;
};

/**
 * Motion ctrl
 */

// let motion_init = {
//   x: null,
//   y: null,
// };
// let motion = {
//   x: 0,
//   y: 0,
// };

// window.addEventListener("deviceorientation", (event) => {
//   if (!motion_init.x && !motion_init.y) {

//   }
// });

// if (window.scrollX === 0) {
// } else if (window.scrollX === 90) {
// } else if (window.scrollX === -90) {
// } else {
// }
