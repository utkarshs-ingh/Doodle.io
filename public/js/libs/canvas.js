window.addEventListener('load', ()=>{ 
    window.addEventListener('resize', resize); 
    InitDrawing();
}); 

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var sketch = document.getElementById('canvas');
var sketch_style = getComputedStyle(sketch);
var canvas_style = getComputedStyle(canvas);
canvas.width = parseInt(sketch_style.getPropertyValue('width'))-15;
canvas.height = parseInt(sketch_style.getPropertyValue('height'))-15;

function resize(){ 
    sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'))-15;
    canvas.height = parseInt(sketch_style.getPropertyValue('height'))-15;
} 

var colorInput = document.getElementById('color');
var clearBtn = document.getElementById('clear');
var eraseBtn = document.getElementById('erase');
var penBtn = document.getElementById('pen');
function InitDrawing() {

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};
    ctx.lineWidth = 3;
    
    colorInput.addEventListener('input', () => {
        ctx.strokeStyle = colorInput.value;
        ctx.lineWidth = 3;
    }, false);

    eraseBtn.addEventListener('click', () => {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 25;
    }, false);

    clearBtn.addEventListener('click', function() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, false);

    penBtn.addEventListener('click', function() {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
    }, false);

    ['touchmove','mousemove'].forEach(event => canvas.addEventListener(event, function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.clientX - canvas.offsetLeft;
        mouse.y = e.clientY - canvas.offsetTop;
    }, false));


    ['touchstart','mousedown'].forEach(event => canvas.addEventListener(event, function(e) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        if(drawON) {
            ['touchmove','mousemove'].forEach(event => canvas.addEventListener(event, onPaint, false));
            ['touchmove','mousemove'].forEach(event => canvas.addEventListener(event, draw, false));
        }
    }, false));

    ['touchcancel','mouseup'].forEach(event => canvas.addEventListener(event, function() {
        ['touchmove','mousemove'].forEach(event => canvas.removeEventListener(event, onPaint, false));
    }, false));

    

    var draw = function() {
        var base64ImageData = canvas.toDataURL("image/png");
        socket.emit("canvas-data", base64ImageData);
    }

    var onPaint = function() {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();
    };

};
