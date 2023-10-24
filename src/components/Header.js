import PropTypes from 'prop-types'
import Button from './Button'

const Header = ({title, onAdd, showAdd}) => { // destructuring props 
    return (
        <header className='header'>
            <h1>{title}</h1>
            <Button 
                text={showAdd?'Close':'New'} 
                color={showAdd?'steelblue':'red'} 
                onClick={onAdd} 
            />
        </header>
    )
}

Header.defaultProps = {
    title : 'My Businesses'
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

export default Header