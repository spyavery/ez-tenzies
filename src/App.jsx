import { useState, useEffect, useRef } from 'react'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import "@fontsource/karla"
import './App.css'

function App() {
  const [startGame, setStartGame] = useState(false)

  const [count, setCount] = useState(0)
  const [dice, setDice] = useState(createAllDice())
  const [tenzie, setTenzie] = useState(false)
  const [bestRoll, setBestRoll] = useState(() =>
    JSON.parse(localStorage.getItem("bestRoll")) || 0
  )
  const [bestTime, setBestime] = useState(() => 
    JSON.parse(localStorage.getItem("bestTime") || 0)
  )

  const [startTime, setStartTime] = useState(null)
  const [now, setNow] = useState(null)
  const timerRef = useRef(null)

  //handle start of timer
  function handleStart() {
    setStartTime(Date.now())
    setNow(Date.now())

    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setNow(Date.now())
    }, 10)
  }

  function handleStop() {
    clearInterval(timerRef.current)
    if(secondsPassed < bestTime || bestTime === 0) {
      localStorage.setItem("bestTime", secondsPassed)
      setBestime(secondsPassed)
    }
  }

  let secondsPassed = 0;
  if(startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  //check if all dice are held and are same values
  useEffect(() => {
    //get all isHeld die
    const allHeld = dice.every(die => die.isHeld)
    //get the first value of dice
    const firstValue = dice[0].value
    //check if every value === first value
    const tenzies = dice.every(die => die.value === firstValue)

    //check if all values are same and aall are held
    if(allHeld && tenzies) {
      setTenzie(true)
      handleStop()
      if(count < bestRoll || bestRoll === 0) {
        localStorage.setItem('bestRoll', count)
        setBestRoll(count)
      }
    }
  }, [dice])




  

  //generate dice numbers
  function generateDice(){
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }


  function createAllDice() {
    const die = []
    for(let i = 0; i < 10; i++) {
      die.push(generateDice())
    }

    return die
  }



  function rollDice(){
    if(startGame){
      if(!tenzie){
        setDice(prevDice => prevDice.map(die => {
          return !die.isHeld
          ? generateDice()
          : die
        }))
        setCount(count + 1)
      } else {
        handleStart()
        setCount(0)
        setTenzie(false)
        setDice(createAllDice())
      }
    } else {
      setCount(1)
      setStartGame(true)
      handleStart()
    }
  }
  
  function holdDice(id){
    if(startGame){
      setDice(prevDice => prevDice.map(die => {
        return die.id === id
        ? {...die, isHeld: !die.isHeld}
        : die
      }))
    }
  }

  const diceElements = dice.map(die => {
    return( 
      <Die 
        key={die.id} 
        value={die.value} 
        isHeld={die.isHeld} 
        holdDice={() => holdDice(die.id)}
      />
    )
  })



  return (
    <>
      <div className="count-timer">Timer: {secondsPassed.toFixed(2)}s</div>
      <main>
        {tenzie && <Confetti />}
        <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same. Click each die to freeze 
          it at its current value between rolls.</p>
        <div className="dice-container">
          {diceElements}
        </div>
        <button className='dice-btn' onClick={rollDice}>{!startGame ? 'Start Game' : tenzie ? 'New Game' : 'Roll'}</button>
        <div className="count-holder">Roll Count: {count}</div>
      </main>
      <div className="tenzie-results">
        {bestTime !== 0 &&
            <p>Best Time: {bestTime}s</p>
        }
        {bestRoll !== 0 &&
            <p>Best Roll: {bestRoll}</p>
        }
      </div>
    </>
  )
}

export default App
