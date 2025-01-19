import React, { useEffect, useRef, Suspense } from 'react'
import * as THREE from 'three'
import DefaultSmoke from '../assets/smoke.png'
import PropTypes from 'prop-types'

const SmokeScene = ({
  backgroundColor = 'transparent',
  particleCount = 10,
  baseOpacity = 0.45,
  particleImage = DefaultSmoke
}) => {
  const mountRef = useRef(null)

  useEffect(() => {
    let scene, camera, renderer, clock
    let smokeParticles = []

    const USE_LOW_RES = window.innerWidth < 1024

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    )
    camera.position.z = 1000

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      precision: USE_LOW_RES ? 'lowp' : 'mediump'
    })

    const pixelRatio = USE_LOW_RES
      ? 0.75
      : Math.min(window.devicePixelRatio, 1.5)
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    clock = new THREE.Clock()

    const createNoisePattern = () => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      z: Math.random() * 1000,
      frequency: 0.2 + Math.random() * 0.3
    })

    const initSmoke = async () => {
      const textureLoader = new THREE.TextureLoader()
      const smokeTexture = await textureLoader.loadAsync(particleImage)

      smokeTexture.minFilter = THREE.LinearFilter
      smokeTexture.magFilter = THREE.LinearFilter

      const createParticle = () => {
        const smokeMaterial = new THREE.MeshLambertMaterial({
          map: smokeTexture,
          transparent: true,
          opacity: baseOpacity * 0.777,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })

        const smokeGeometry = new THREE.PlaneGeometry(300, 300)
        const particle = new THREE.Mesh(smokeGeometry, smokeMaterial)

        particle.position.set(
          (Math.random() - 0.5) * window.innerWidth,
          (Math.random() - 0.5) * window.innerHeight,
          -200 + Math.random() * 400
        )

        particle.rotation.z = Math.random() * Math.PI * 2

        particle.velocity = {
          x: (Math.random() - 0.5) * 0.4,
          y: (Math.random() - 0.5) * 0.4,
          z: (Math.random() - 0.5) * 0.2,
          rotation: (Math.random() - 0.5) * 0.002
        }

        particle.noisePattern = {
          position: createNoisePattern(),
          rotation: createNoisePattern(),
          scale: createNoisePattern()
        }

        particle.baseScale = 2 + Math.random() * 2
        particle.scale.set(particle.baseScale, particle.baseScale, 1)

        particle.baseOpacity = baseOpacity
        particle.material.opacity = particle.baseOpacity
        particle.fadeState = 'visible'
        particle.fadeSpeed = 0.5 + Math.random() * 0.5

        return particle
      }

      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle()
        smokeParticles.push(particle)
        scene.add(particle)
      }
    }

    const light = new THREE.DirectionalLight(0xffffff, 0.4)
    light.position.set(0, 0, 1000)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)

    const noise = (x, y, z) => {
      return (Math.sin(x) + Math.sin(y) + Math.sin(z)) / 3
    }

    const isParticleVisible = (position) => {
      const vector = position.clone().project(camera)
      return Math.abs(vector.x) <= 1.2 && Math.abs(vector.y) <= 1.2
    }

    const resetParticle = (particle) => {
      const side = Math.floor(Math.random() * 4)
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      switch (side) {
        case 0:
          particle.position.x = (Math.random() - 0.5) * screenWidth
          particle.position.y = screenHeight * 0.6
          particle.velocity.y = -Math.abs(particle.velocity.y)
          break
        case 1:
          particle.position.x = screenWidth * 0.6
          particle.position.y = (Math.random() - 0.5) * screenHeight
          particle.velocity.x = -Math.abs(particle.velocity.x)
          break
        case 2:
          particle.position.x = (Math.random() - 0.5) * screenWidth
          particle.position.y = -screenHeight * 0.6
          particle.velocity.y = Math.abs(particle.velocity.y)
          break
        case 3:
          particle.position.x = -screenWidth * 0.6
          particle.position.y = (Math.random() - 0.5) * screenHeight
          particle.velocity.x = Math.abs(particle.velocity.x)
          break
      }

      particle.position.z = -200 + Math.random() * 400
      particle.material.opacity = particle.baseOpacity
      particle.fadeState = 'visible'
      particle.scale.set(particle.baseScale, particle.baseScale, 1)
      particle.noisePattern = {
        position: createNoisePattern(),
        rotation: createNoisePattern(),
        scale: createNoisePattern()
      }
    }

    let prevTime = 0
    const animate = (time) => {
      if (time - prevTime < 1000 / 30) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      prevTime = time

      const delta = clock.getDelta()
      const currentTime = time * 0.001

      smokeParticles.forEach((particle) => {
        const { noisePattern } = particle

        if (particle.fadeState === 'visible') {
          const xNoise =
            noise(
              currentTime * noisePattern.position.frequency +
                noisePattern.position.x,
              currentTime * 0.5,
              0
            ) * 100

          const yNoise =
            noise(
              0,
              currentTime * noisePattern.position.frequency +
                noisePattern.position.y,
              currentTime * 0.5
            ) * 100

          particle.position.x += xNoise * delta + particle.velocity.x * 30
          particle.position.y += yNoise * delta + particle.velocity.y * 30
          particle.position.z +=
            noise(currentTime, particle.position.x, particle.position.y) *
            delta *
            20

          particle.rotation.z +=
            particle.velocity.rotation +
            noise(currentTime * noisePattern.rotation.frequency, 0, 0) *
              delta *
              0.5

          const scaleNoise = noise(
            currentTime * noisePattern.scale.frequency + noisePattern.scale.x,
            0,
            0
          )
          const scale = particle.baseScale * (1 + scaleNoise * 0.2)
          particle.scale.set(scale, scale, 1)

          if (!isParticleVisible(particle.position)) {
            particle.fadeState = 'fading'
          }
        } else if (particle.fadeState === 'fading') {
          particle.material.opacity -= delta * particle.fadeSpeed

          if (particle.material.opacity <= 0) {
            particle.fadeState = 'hidden'
            resetParticle(particle)
          }
        }
      })

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }, 250)
    }

    window.addEventListener('resize', handleResize)

    let animationFrameId
    initSmoke().then(() => {
      mountRef.current?.appendChild(renderer.domElement)
      animate(0)
    })

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }

      smokeParticles.forEach((particle) => {
        scene.remove(particle)
        particle.geometry.dispose()
        particle.material.dispose()
        if (particle.material.map) {
          particle.material.map.dispose()
        }
      })

      renderer.dispose()
      smokeParticles = []
    }
  }, [particleCount, baseOpacity, particleImage])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        background: backgroundColor
      }}
    >
      <Suspense fallback={null}>
        <div
          ref={mountRef}
          style={{
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            mixBlendMode: 'screen'
          }}
        />
      </Suspense>
    </div>
  )
}

SmokeScene.propTypes = {
  backgroundColor: PropTypes.string,
  particleCount: PropTypes.number,
  baseOpacity: PropTypes.number,
  particleImage: PropTypes.string
}

export default SmokeScene
