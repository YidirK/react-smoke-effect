# react-smoke-effect

>  A simple React library to add A Fog / Smoke effect

[![NPM](https://img.shields.io/npm/v/react-smoke-effect.svg)](https://www.npmjs.com/package/react-smoke-effect)  [![NPM](https://img.shields.io/npm-stat/dw/yidirk)](https://www.npmjs.com/package/react-smoke-effect) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

##

## Install

```bash
npm install --save react-smoke-effect
```

## Usage

```jsx
import React from 'react'
import  SmokeScene  from "react-smoke-effect"
import SmokeImage from "./assets/smoke.png"

const App = () => {
  return (
    <div>
      <SmokeScene
        backgroundColor="#D3A863"
        particleImage={SmokeImage} //  particleImage="/path/to/image.png"
        particleCount={20}
        baseOpacity={0.4}
      />
      // or for default settings
      <SmokeScene
        particleImage={SmokeImage} />
    </div>
  )
}

export default App
```
## Props
| Prop             | Type         | Default             | Description                 |
| ----------------- |--------------|---------------------|-----------------------------|
| backgroundColor | string / hex | 'transparent'       | Background color.           |
| particleCount | number       | 10                  | Number of particles to use. |
| baseOpacity| number       | 0.45                | Opacity of particles.       |
| particleImage | string       | [(default smoke)](https://github.com/YidirK/react-smoke-effect/blob/master/src/assets/smoke.png) |Image of particles                  |


## License

MIT © [YidirK](https://github.com/YidirK)

This module was bootstrapped with [create-react-library](https://www.npmjs.com/package/create-react-library).
