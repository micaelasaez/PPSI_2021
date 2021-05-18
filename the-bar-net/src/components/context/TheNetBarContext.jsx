import React, { Component } from 'react';

const TheNetBarContext = React.createContext({
    user: {},
    isLogged: false,
    carritoTotal: 0,
    setIsLogged: () => {},
});

class TheNetBarProvider extends Component {
    state = {
        user: {},
        isLogged: false,
        carritoTotal: 0
    };

    componentDidMount() {
        // fetchs ?
    }

    // funcs
    // ej 
    // getUserProfile = async () => {
        //func
        // this.setState({
        //     //obj
        // }, 
        //     // callback
        // )
    // }

    //set state funcs
    setIsLogged = isLogged => this.setState({ ...this.state, isLogged });

    render() {
        return (
            <TheNetBarContext.Provider
                value={{
                    ...this.state,
                    setIsLogged: this.setIsLogged
                }}
            >
                {this.props.children}
            </TheNetBarContext.Provider>
        )
    }
}


export const TheNetBar = {
    Consumer: TheNetBarContext.Consumer,
    Provider: TheNetBarProvider,
    Context: TheNetBarContext
}