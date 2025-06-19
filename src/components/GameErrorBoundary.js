import React from 'react';

class GameErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error){
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error game caught:" , error ,errorInfo);
    }

    render() {
        if(this.state.hasError){
            return <h2 className='text-center'>Something went wrong while loading the game, try reloading the page.</h2>
        }

        return this.props.children;
    }
}

export default GameErrorBoundary;