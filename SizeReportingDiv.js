import React, { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, throttle } from './util/performance';
import { isInt } from './util/maths';
import './SizeReportingDiv.css';
import { extractFromObject } from './util/object';

/*
SizeReportingDiv component
author: Ruben Lemiengre

A React component which renders a DIV element with the wrapped content included
and reports the width and height of the content to a callback function whenever the size of the DIV is changed.
It takes advantage of the ResizeObserver Web API to detect the size changes.

The component is customizable with style and reporting mode for performance (none, debounce, throttle).

props:

onSizeUpdated: callback function triggered when the DIV element is resized
syntax: function updateSize(width, height) {...}

style: style to be applied to the DIV element

reportingMode: 
- throttle (default): the callback function will be triggered every [timeout] milliseconds during resizing
- debounce: the callback function will be triggered only after resizing has stopped for [timeout] milliseconds
- none: the callback function will be triggered continuously during resizing

timeout: time (in ms) to use for debouncing or throttling

[standard DIV props]:
Any props available to div elements will be applied as well
*/

export function SizeReportingDiv(props) {
	const {
		children,
		onSizeUpdated = () => null,
		style,
		reportingMode = 'throttle',
		timeout = 250
	} = props;
	const divStyle = Object.assign({}, style, {
		flex: '1 0 auto'
	});
	const _isMounted = useRef(false);
	//reference variable _divResizeObserver, to allow disconnection of the ResizeObserver during unmounting of the component
	let _divResizeObserver = useRef();

	//create an attributes object to forward from the components props to the rendered div
	//(to avoid errors because of unrecognized attributes)
	const createForwardedProps = _props =>
		extractFromObject(_props, [
			'onSizeUpdated',
			'style',
			'reportingMode',
			'timeout'
		]);

	//set _forwardedProps state based on the current props
	const [_forwardedProps, _setForwardedProps] = useState(
		createForwardedProps(props)
	);

	//when any of the provided props change
	useEffect(() => {
		//update _forwardedProps state based on the current props
		_setForwardedProps(createForwardedProps(props));
	}, [props]);

	//function  which returns a possibly debounced/throttled version of the onSizeUpdated prop
	//(depending on reportingMode prop)
	//optionally throttle or debounce the provided onSizeUpdated callback function
	//to make sure a barrage of events (such as mouse events) will not cause it to be called all the time
	const _refreshOnSizeUpdated = useCallback(() => {
		return reportingMode === 'none'
			? //reportingMode none --> return the provided callback as is
			  onSizeUpdated
			: //reportingMode debounce --> debounce the provided callback
			reportingMode === 'debounce'
			? debounce(onSizeUpdated, timeout)
			: //reportingMode 'throttle' (or anything else except 'none' or 'debounce') --> throttle the provided callback
			  throttle(onSizeUpdated, timeout);
	}, [onSizeUpdated, reportingMode, timeout]);

	//set the _onSizeUpdated callback with _refreshOnSizeUpdated
	//(this callback will be used instead of the onSizeUpdated prop)
	let _onSizeUpdated = useRef(_refreshOnSizeUpdated());

	//when timeout or reportingMode props change
	useEffect(() => {
		//throw warnings or errors if props are set incorrectly
		if (
			reportingMode !== 'throttle' &&
			reportingMode !== 'debounce' &&
			reportingMode !== 'none'
		)
			console.warn('reportingMode invalid');
		if (reportingMode !== 'none' && !isInt(timeout))
			throw new Error('timeout prop has to be an integer');
		//set _isMounted ref to true
		_isMounted.current = true;
	}, [timeout, reportingMode]);

	//when onSizeUpdated props, timeout or reportingMode change
	//--> update the used _onSizeUpdated function with the _refreshOnSizeUpdated function
	useEffect(() => {
		_onSizeUpdated.current = _refreshOnSizeUpdated();
	}, [_refreshOnSizeUpdated]);

	//ref callback which causes the DIV to be observed with ResizeObserver
	const _setRef = ref => {
		//component mounted
		if (ref !== null) {
			//creating a callback to pass to ResizeObserver
			//this callback will call the (perhaps throttled or debounced) onSizeUpdated callback function
			const divRefCallback_temp = divArray => {
				/*
				if:
					- the component is not unmounted yet
					- the (possibly throttled/debounced) _onSizeUpdated callback has been initialized
					- a contentRect prop is available
					- the contentRect widht and height values are not both zero
				then:
					call the provided callback function (except for the first time, right after mounting)
				*/
				if (
					_isMounted.current &&
					_onSizeUpdated.current &&
					divArray[0].contentRect &&
					!(
						divArray[0].contentRect.width === 0 &&
						divArray[0].contentRect.height === 0
					)
				) {
					_onSizeUpdated.current(
						divArray[0].contentRect.width,
						divArray[0].contentRect.height
					);
				}
			};
			//initialize a ResizeObserver with the newly created callback function
			_divResizeObserver.current = new ResizeObserver(divRefCallback_temp);
			//start observing the DIV for resize events:
			_divResizeObserver.current.observe(ref);
		} else {
			//component being unmounted
			_divResizeObserver.current.disconnect();
			_divResizeObserver = null;
		}
	};
	return (
		<div {..._forwardedProps} style={divStyle} ref={_setRef}>
			{children}
		</div>
	);
}
