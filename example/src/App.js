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
