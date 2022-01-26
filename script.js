var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

document.addEventListener('keydown', aim, true);
document.addEventListener('keyup', aim2, true);

canvas.addEventListener("mousemove", e => {

    mouse_pos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    }
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var left = false;
var right = false;
var up = false;
var down = false;
let jump = 0;
let rotation = 0;
let score = 0;

let secondsPassed = 0;
let oldTimeStamp = 0;

function Car(x, y, infected){
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.r = 15;
    this.m = 2.5;
    this.colliding = true;
    this.infected = infected;
    this.vel = 1;
    this.jump_vel = 10;
    this.health = 100;
    this.move_x_left = true;
    this.move_x_right = true;
    this.move_y_up = true;
    this.move_y_down = true;
    this.rotation = 0;
    this.drift_rotation = 0;
    this.speed_rate = 0;
    this.diff = 0;
    this.diff_change = 0;

    this.draw = function(){
        /* Graphics
        c.beginPath();
        c.rect(this.x, this.y, 40, 40);
        if (this.health <= 0){
            c.fillStyle = "black";
        }
        else{
            c.fillStyle = "#ff5961";
        }

        c.fill();
        */

        var img = new Image();
        img.src = 'car.png';

        /*
        c.save(); // save current state
        c.beginPath();
        c.arc(this.x - 20 + this.targetx, this.y - 20 + this.targety, 4, 0, 2 * Math.PI);
        c.fillStyle = "#68f907";
        c.fill();
        c.stroke();
        c.restore(); // restore original states (no rotation etc)
        */

        c.save(); // save current state
        c.translate(this.x - 7.5, this.y - 7.5);
        c.rotate(this.rotation * Math.PI / 180); // rotate
        c.translate(-this.x - 7.5,-this.y - 7.5);
        c.drawImage(img, this.x - 7.5, this.y - 7.5, 30, 30); // draws a chain link or dagger
        c.restore(); // restore original states (no rotation etc)

        ///////////////////////////

        /*
        if (left == true && up == true && this.x > 0){
            c.save(); // save current state
            c.translate(this.x - 20, this.y - 20);
            c.rotate((rotation - 2.5) * Math.PI / 180); // rotate
            c.translate(-this.x - 20,-this.y - 20);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
            rotation -= 2.5;
        }
        
        ////////////////
        else if (right == true && up == true && this.x < window.innerWidth - 41){
            c.save(); // save current state
            c.translate(this.x - 20, this.y - 20);
            c.rotate((rotation + 2.5) * Math.PI / 180); // rotate
            c.translate(-this.x - 20,-this.y - 20);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
            rotation += 2.5;
        }
        
        ////////////////
        else {
            c.save(); // save current state
            c.translate(this.x - 20, this.y - 20);
            c.rotate(rotation * Math.PI / 180); // rotate
            c.translate(-this.x - 20,-this.y - 20);
            c.drawImage(img, this.x, this.y, 40, 40); // draws a chain link or dagger
            c.restore(); // restore original states (no rotation etc)
        }
        */

        /*
        if (down == true && right == false && left == false && this.y < window.innerWidth - 41){
            playerVariable.dy = 5;
        }
        else if ((down == true && right == true) || (down == true && left == true) && this.y < window.innerHeight - 41){
            playerVariable.dy = 3.5;
        }
        */

        if (right == true){
            this.rotation += 3;
        }

        if (left == true){
            this.rotation -= 3;
        }

        ////////////////////////////////////////////

        if (this.diff < this.rotation){
            this.diff += 2.25;
        }

        else if (this.diff > this.rotation){
            this.diff += -2.25;
        }

        playerVariable.dy = 0;

        ////////////////
        if (up == false){
            if (this.speed_rate > 0){
                this.speed_rate -= 0.25;
            }
        }
        ////////////////
        else if (up == true){
            if (this.speed_rate < 10){
                this.speed_rate += 0.25;
            }
        }
        
        if (this.speed_rate == 0){
            this.diff = this.rotation;
        }

        ///////////////

        if (Math.sqrt((this.x - objectives[objectives.length - 1].x) * (this.x - objectives[objectives.length - 1].x) + (this.y - objectives[objectives.length - 1].y) * (this.y - objectives[objectives.length - 1].y)) < 50){
            objectives[objectives.length - 1].die();
        }

        ///////////////

        playerVariable.dx = Math.cos((this.diff - 90) * (Math.PI / 180)) * this.speed_rate;
        playerVariable.dy = Math.sin((this.diff - 90) * (Math.PI / 180)) * this.speed_rate;

        if (this.y > window.innerHeight - 15){
            this.y = window.innerHeight - 15;
        }
        else if (this.y < 30){
            this.y = 30;
        }

        if (this.x > window.innerWidth - 15){
            this.x = window.innerWidth - 15;
        }
        else if (this.x < 30){
            this.x = 30;
        }

        // Movement
        this.x += this.dx;
        this.y += this.dy;
    }
}

function Objective(x, y, life_time){
    this.x = x;
    this.y = y;
    this.life_time = life_time;

    this.draw = function(){
        if (this.life_time > 2.5){
            c.beginPath();
            c.arc(this.x, this.y, this.life_time, 0, 2 * Math.PI);
            c.fillStyle = "#fff";
            c.fill();

            this.life_time -= 0.1;
        }

        else{
            score = 0;

            playerVariable.x = canvas.width / 2;
            playerVariable.y = canvas.height / 2;
            playerVariable.rotation = 0;
            playerVariable.diff = 0;

            this.spawn();
        }
    }

    this.spawn = function(){
        objectives.push(new Objective(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), 30));
    }

    this.die = function(){
        this.spawn();
        score++;
    }
}

var objectives = [];
objectives.push(new Objective(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), 30));

var playerVariable = new Car(canvas.width / 2, canvas.height / 2);

function aim(e){
    if(e.keyCode == 37 || e.keyCode == 65){
        left = true;
    }

    if(e.keyCode == 39 || e.keyCode == 68){
        right = true;
    }

    if(e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32){
        up = true;
    }

    if(e.keyCode == 40 || e.keyCode == 83){
        down = true;
    }
}

function aim2(e){
    if((e.keyCode == 37 && left == true) || (e.keyCode == 65 && left == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        left = false;
    }

    if((e.keyCode == 39 && right == true) || (e.keyCode == 68 && right == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        right = false;
    }

    if((e.keyCode == 38 && up == true) || (e.keyCode == 87 && up == true) || (e.keyCode == 32 && up == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        up = false;
    }

    if((e.keyCode == 40 && down == true) || (e.keyCode == 83 && down == true)){
        playerVariable.dx = 0;
        playerVariable.dy = 0;
        down = false
    }
}

function animate(timeStamp){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // GameObjects
    objectives[objectives.length - 1].draw();
    playerVariable.draw();

    c.font = "50px monospace";
    c.fillText(score, canvas.width / 2 - 35, 75);

    c.font = "15px monospace";
    c.fillText("reach the each objective to not die and increase score", canvas.width / 2 - 250, canvas.height - 25);

    c.restore();
}

animate();