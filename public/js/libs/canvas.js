window.addEventListener('load', ()=>{ 
        InitDrawing();
}); 

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var sketch = document.querySelector('#canvas');
var sketch_style = getComputedStyle(sketch);
canvas.width = parseInt(sketch_style.getPropertyValue('width'));
canvas.height = parseInt(sketch_style.getPropertyValue('height'));

function InitDrawing() {

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};

    canvas.addEventListener('mousemove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);

    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'blue';

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
        canvas.addEventListener('mousemove', draw, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

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