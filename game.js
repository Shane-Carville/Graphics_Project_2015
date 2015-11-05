window.onload = function(){
    var canvas = document.getElementById("ctx"),
ctx = canvas.getContext("2d"),
height = canvas.height,
width = canvas.width,
key = [],
pause = false,
score = 0,
lives = 3,
youSuck = false;
    
    
document.addEventListener("keydown", function(e){
    key[e.keyCode] = true;
});

document.addEventListener("keyup", function(e){
    delete key[e.keyCode];
});
    
    
    RIGHT = 39;
    UP = 38;
    DOWN = 40;
    LEFT = 37;
    SPACE = 32;
    P = 80;
    
    paddle = {
        x: height/2 - 32,
        y: height - 10,
        update: function(){
            if(key[RIGHT]){
                this.x += 4;
            }
            
            if(key[LEFT]){
                this.x -= 4;
            }
            
            if(this.x <= 0){this.x = 0;}
            if(this.x >= width -64){this.x = width - 64;}
        },
        draw: function(){
            ctx.fillRect(this.x,this.y, 64,16);
        }
    }
    
    
    ball = {
        x:paddle.x+32,
        y:paddle.y -16,
        bx:2,
        by:2,
        r:8,
        holding:true,
        update:function(){
            if(this.holding){
        this.x = paddle.x +32;
                this.y =  paddle.y-16;
                if(key[SPACE])
                {
                    this.holding = false;
                }
    }
        else{
            this.x += this.bx;
            this.y += this.by;
            
            if(this.y>=paddle.y-this.r && (this.x>= paddle.x && this.x <= paddle.x+64) && this.y > paddle.y){
                this.by = -this.by  ;
            }
            if(this.y<= this.r){this.by = - this.by;}
            if(this.x<= - this.r || this.x >= width-this.r)
            {
                this.bx = - this.bx;
            }
            if(this.y > height +this.r)
            {
                this.holding = true;
                lives--;
            }
        }
    },
        draw:function(){
                   
ctx.beginPath();            ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
            ctx.stroke();
        }
    
    }
    
    
    
    blocks = [];
    for(var i=0; i<8; i++)
    {
        blocks[i] = new Array();
        for(var j=0; j<4; j++)
        {
        blocks[i][j] = 
            {
                x: 64+(i*64),
                y: 32+(j*32),
                broken: false,
                padding: 10,
                update: function()
                {
                    if(!this.broken)
                    {
                        if(ball.y < this.y +32 + ball.r && ball.x < this.x && ball.x < this.x +64 - ball.r && ball.y > this.y  -ball.r)
                        {
                            ball.by = -ball.by;
                            this.broken = true;
                            score+= 10;
                        }
                    }
                },
                draw: function()
                {
                    if(!this.broken)
                    {
                        ctx.strokeRect(this.x,this.y,64,32);
                    }
                }
        }        }
    }
    
function update(){
    paddle.update();
    ball.update();
    
    for(var i=0; i<8; i++)
    {
        for(var j=0; j<4; j++)
        {
        blocks[i][j].update();
        }
    }
    if(lives <= 0)
    {
        youSuck = true;
    }
    if(youSuck)
    {
        pause = true;
    }
};
    function draw(){
        ctx.fillStyle = "green";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle = "black";
        
        paddle.draw();
        ball.draw();
        for(var i=0; i<8; i++)
        {
            for(var j=0; j<4; j++)
            {
                blocks[i][j].draw();
            }
        }
        
           ctx.fillText("Score: " + score ,16,16);
    ctx.fillText("Lives: "+ lives ,16,32);
        if(youSuck)
        {
            ctx.fillText("Congrats YOU LOSE HAHAHAHAH", width/2, height/2);
        }
        if(pause && !youSuck)
        {
            ctx.fillText("Game Paused Good Luck", width/2, height/2);
        }
        if(score == 320)
        {
            alert("YOU WIN!!!!");
            document.location.reload();
        }
    }
        function step(){
        if(!pause)
        {
            update();
        }
        if(key[P] && !youSuck)
        {
            pause = !pause;   
        }
        draw();
        requestAnimationFrame(step);
        }
    
    step();
}