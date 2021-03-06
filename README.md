# react-size-reporting-div

## Version

[![NPM version](https://img.shields.io/npm/v/react-size-reporting-div.svg?style=popout-square)](https://www.npmjs.com/package/react-size-reporting-div)

## Author

[Ruben Lemiengre - RedHot Coding](https://redhotcoding.com)

## Description

A React component which renders a DIV element with the provided content inside it and reports the width and height of the content to a callback function whenever the size of the DIV is changed.

-  The component is customizable with style and reporting mode for performance (none, debounce, throttle).

-  It takes advantage of the ResizeObserver Web API to detect the size changes.

## Installation

Use the package manager **npm** to install react-size-reporting-div.

```bash
>> npm install --save react-size-reporting-div
```

## Demo

Check out a working demo on [CodeSandbox](https://codesandbox.io/s/react-size-reporting-div-demo-i6sgh).

## Basic usage

```js
import { SizeReportingDiv } from "react-size-reporting-div";
import { useState } from "react";

const MyComponent = (props) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%"
      }}
    >
      <SizeReportingDiv
        onSizeUpdated={props.onSizeUpdated}
        style={{
          width: "100%",
          height: "100px",
          resize: "vertical",
          overflow: "auto",
          backgroundColor: "grey",
          color: "white",
          padding: "5px"
        }}
        reportingMode="debounce"
        timeout={500}
      >
        <p>resize me!</p>
      </SizeReportingDiv>
    </div>
  );
};

export default function App() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const _onSizeUpdated = (width, height) => {
    setWidth(width);
    setHeight(height);
  };
  return (
    <>
      <div>
        DIV width: {width} DIV height: {height}
      </div>
      <div className="App">
        <MyComponent onSizeUpdated={_onSizeUpdated} />
      </div>
    </>
  );
}
```

## Props

-  **onSizeUpdated**:

   callback function, triggered when the DIV element is resized

   syntax:

   ```js
   function updateSize(width, height) {
      ...
   }
   ```

-  **reportingMode**:

   -  throttle (default):

      the callback function will be triggered every [timeout] milliseconds during resizing

   -  debounce:

      the callback function will be triggered only after resizing has stopped for [timeout] milliseconds

   -  none:
      the callback function will be triggered continuously during resizing

-  **timeout**:

   time (in milliseconds) to use for debouncing or throttling

-  **style**:

   style to be applied to the DIV element

-  **[standard div props]**:

   Any props available to div elements will be applied as well

## License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

https://choosealicense.com/licenses/mit/

## Contributors

**rlemiengre**  
[https://github.com/rlemiengre](https://github.com/rlemiengre)
