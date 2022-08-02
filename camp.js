const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7


const background =  new sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/background.png'
})

const shop =  new sprite({
    position: {
        x:600,
        y:128
    },
    imageSrc: './img/shop.png',
    scale :2.75,
    framesMax:6
})

const player =  new Fighter({
    position: {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc: './img/samurai/idle.png',
    framesMax:8,
    scale:2.5,
    offset: {
        x:215,
        y:155
    },
    sprites:{
        idle:{
            imageSrc: './img/samurai/idle.png',
            framesMax:8,
        },
        run:{
            imageSrc: './img/samurai/Run.png',
            framesMax:8,
        },
        jump:{
            imageSrc: './img/samurai/Jump.png',
            framesMax:2
        },
        fall:{
            imageSrc: './img/samurai/Fall.png',
            framesMax:2
        },
        attack1:{
            imageSrc: './img/samurai/Attack1.png',
            framesMax:6
        },
        takeHit:{
            imageSrc: './img/samurai/Take hot.png',
            framesMax:4
        },
        death:{
            imageSrc: './img/samurai/Death.png',
            framesMax:6
        }
    },
    attackBox:{
        offset:{
            x:100,
            y:50
        },
        width:160,
        height:50
    }
  
})



const enemy =  new Fighter({
    position: {
        x:400,
        y:100
    },
    velocity: {
        x:0,
        y:0
    },
       color : 'blue',
       offset: {
        x:-50,
        y:0
    },
    imageSrc: './img/Kenji/idle.png',
    framesMax:4,
    scale:2.5,
    offset: {
        x:215,
        y:165
    },
    sprites:{
        idle:{
            imageSrc: './img/Kenji/Idle.png',
            framesMax:4,
        },
        run:{
            imageSrc: './img/Kenji/Run.png',
            framesMax:8,
        },
        jump:{
            imageSrc: './img/Kenji/Jump.png',
            framesMax:2
        },
        fall:{
            imageSrc: './img/Kenji/Fall.png',
            framesMax:2
        },
        attack1:{
            imageSrc: './img/Kenji/Attack1.png',
            framesMax:4
        },
        takeHit:{
            imageSrc: './img/Kenji/Take hit.png',
            framesMax:3
        },
        death:{
            imageSrc: './img/Kenji/Death.png',
            framesMax:7
        }
    },
    attackBox:{
        offset:{
            x:-170,
            y:50
        },
        width:170,
        height:50
    }
})


console.log(player)

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
    
}



decreaseTimer()


function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //PLAYER MOVEMENTS
    
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastKey === 'd'){
      player.velocity.x = 5
      player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }
    
    // PLAYER JUMPING ANIMATION
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }


    //ENEMY MOVEMENTS
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
      enemy.velocity.x = 5
      enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

    // ENENMY JUMPING ANIMATION
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }


    //DETECT FOR COLLISION & ENEMY GETS HIT
    if(rectangularCollision({
        rectangle1:player,
        rectangle2:enemy
    }) && player.isAttacking && player.framesCurrent === 4){
        enemy.takeHit()
        player.isAttacking = false
         
        gsap.to('#Enemy-Health', {
            width:enemy.health + '%'
        })
    }

    //IF PLAYER MISSES
    if(player.isAttacking && player.framesCurrent ===4){
        player.isAttacking = false
    }
    //ENEMY COLLISION
    if(rectangularCollision({
        rectangle1:enemy,
        rectangle2:player
    }) && enemy.isAttacking && enemy.framesCurrent ===2){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#Player-Health', {
            width:player.health + '%'
        })
    }

    //IF ENEMY MISSES
    if(enemy.isAttacking && enemy.framesCurrent ===2){
        enemy.isAttacking = false
    }
        

    //END GAME ON HEALTH
    if(player.health <=0 || enemy.health <=0){
        determineWinner({player, enemy, timerId})
    } 
}
animate()

window.addEventListener('keydown', (event) => {
    if(!player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
            break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
            break
            case 'w':
             player.velocity.y = -20
            break
            case ' ':
             player.Attack()
            break
    }
       
    }
    //ENEMY MOVEMENT
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
            break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
            break
            case 'ArrowUp':
             enemy.velocity.y = -20
            break
            case 'ArrowDown':
             enemy.Attack()
            break
    }
    
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
           keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        
    }

    //enemy keys
    switch(event.key){
        case 'ArrowRight':
           keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
        
    }
    
})
