export function debounce(func, timeout = 250) {
	//set a variable for the timer
	let timer;
	//return a debounced function
	return (...args) => {
		//the debounced function is invoked
		//clear the last timeout
		//(the function shouldn't be executed if it
		//is called again within the provided timeframe)
		clearTimeout(timer);
		//set a new timeout after which the function will be executed
		//(unless the function is called again within [timeout] ms)
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

export const throttle = (func, timeout) => {
	//initially, execution is allowed (no need to pause yet)
	var pauseExecution = false;
	//return a throttled function
	return function () {
		//the throttled function is invoked
		//if throttle is not active (and thus function execution is not paused):
		if (!pauseExecution) {
			//run the provided function
			func.apply(this, arguments);
			//pause further execution of the function for subsequent calls
			//(until timeout has passed)
			pauseExecution = true;
			//set a timer (with the provided timeout parameter)
			//after which time further execution of the provided function will be allowed again
			setTimeout(function () {
				pauseExecution = false;
			}, timeout);
		}
	};
};
