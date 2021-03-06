import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import { init as websocketInit, emit } from './actions/websocket'
import App from './components/App'
import RootReducer from './reducers'

const initialState = {
    docker: {
        containers: {},
        networks: {},
    },
    filters: {
        networks: {
            values: [],
            current: '',
        },
        containers: {
            current: '',
            all: false
        }
    },
    view: {
        selectedContainerId: ''
    }
}

Array.prototype.pairs = function (func) {
    for (var i = 0; i < this.length - 1; i++) {
        for (var j = i; j < this.length - 1; j++) {
            func([this[i], this[j+1]]);
        }
    }
}

function startUp () {
    const middleware = [ thunkMiddleware.withExtraArgument({ emit }) ]
    middleware.push(loggerMiddleware)

    const setup = applyMiddleware(...middleware)(createStore)

    const store = setup(RootReducer, initialState)
    websocketInit(store)

    return store
}

render(
    <Provider store={startUp()}>
        <App />
    </Provider>,
    document.getElementById('root')
)
