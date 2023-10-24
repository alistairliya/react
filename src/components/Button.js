import PropTypes from 'prop-types'

const Button = ({color, text, onClick, disabled=false}) => {
    if(disabled)
        color = 'white'
    return (
        <button 
            onClick={onClick} 
            style={{backgroundColor:color}} 
            className='btn'
            disabled={disabled}
        >
            {text}
        </button>
    )
}

Button.defaultProps = {
    color : 'steelBlue' 
}

Button.propTypes = {
    text : PropTypes.string,
    color : PropTypes.string,
    onClick: PropTypes.func,
}

export default Button