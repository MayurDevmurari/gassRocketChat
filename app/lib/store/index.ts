import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '../../reducers';
import sagas from '../../sagas';
import applyAppStateMiddleware from './appStateMiddleware';
import applyInternetStateMiddleware from './internetStateMiddleware';

let sagaMiddleware;
let enhancers;

if (__DEV__) {
	const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
	const Reactotron = require('reactotron-react-native').default;
	sagaMiddleware = createSagaMiddleware({
		sagaMonitor: Reactotron.createSagaMonitor()
	});

	enhancers = compose(
		applyAppStateMiddleware(),
		applyInternetStateMiddleware(),
		applyMiddleware(reduxImmutableStateInvariant),
		applyMiddleware(sagaMiddleware),
		Reactotron.createEnhancer()
	);
} else {
	sagaMiddleware = createSagaMiddleware();
	enhancers = compose(applyAppStateMiddleware(), applyInternetStateMiddleware(), applyMiddleware(sagaMiddleware));
}

const store = createStore(reducers, enhancers);
sagaMiddleware.run(sagas);

export default store;
