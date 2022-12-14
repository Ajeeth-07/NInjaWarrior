function rectangularCollision({rectangle1, rectangle2}){
    return(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.height + rectangle2.position.y)
}


function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('#Tied').style.display = 'flex'
    if(player.health === enemy.health){
        document.querySelector('#Tied').innerHTML = 'TIE'
    }else if(player.health > enemy.health){
        document.querySelector('#Tied').innerHTML = 'PLAYER-1 WINS'    
    }else if(enemy.health > player.health){
        document.querySelector('#Tied').innerHTML = 'PLAYER-2 WINS'
    }
}

//DECREASING TIMER FUNCTION
let timer = 100
let timerId
function decreaseTimer(){
    if(timer>0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if(timer === 0){
        
        determineWinner({player, enemy, timerId})
    }
    
   
}
