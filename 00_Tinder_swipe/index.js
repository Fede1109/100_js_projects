const DECISION_THRESHOLD = 75
let isAnimating = false
let pullDeltaX = 0

function startDrag (event) {
    if (isAnimating) return

    //get the 1st article element
    const actualCard = event.target.closest('article')

    //get initial position of mouse finger
    const startX = event.pageX ?? event.touches[0].pageX

    //liste the mouse and touch movements
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true})

    function onMove(event){
        //current position of mouse/finger
        const currentX = event.pageX ?? event.touches[0].pageX
        //the distance between the initial and current position
        pullDeltaX = currentX - startX

        if (pullDeltaX === 0) return

        isAnimating = true

        const deg = pullDeltaX / 14
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
        actualCard.style.cursor = 'grabbing'
    }

    function onEnd(event){

        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
    
        document.removeEventListener('touchmove', onMove, { passive: true })
        document.removeEventListener('touchend', onEnd, { passive: true})

        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

        if (decisionMade){
            const goRight = pullDeltaX >= 0
            const goLeft = !goRight
            actualCard.classList.add(goRight ? 'go-right' : 'go-left')
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove()
            }, { once: true })
        }else{
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-right', 'go-left')
        }
        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')
            pullDeltaX = 0
            isAnimating = false
        })
    }
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })