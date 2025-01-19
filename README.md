# react-smoke-effect

>  A simple React library to add A Fog / Smoke effect

[![NPM](https://img.shields.io/npm/v/react-smoke-effect.svg)](https://www.npmjs.com/package/react-smoke-effect) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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
        particleImage={SmokeImage}
        particleCount={20}
        baseOpacity={0.4}
      />
    </div>
  )
}

export default App
```

## License

MIT © [YidirK](https://github.com/YidirK)
