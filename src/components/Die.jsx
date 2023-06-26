const Die = (props) => {

    const styles = {
        backgroundColor: props.isHeld ? '#1cc66d' : 'white'
    }
    
    return(
        <div className="dice-die" style={styles} onClick={props.holdDice}>
            <h2>{props.value}</h2>
        </div>
    )
}

export default Die;