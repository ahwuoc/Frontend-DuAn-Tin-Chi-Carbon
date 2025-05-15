"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 2

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(300, 300)
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = false

    // Earth
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32)

    // Load texture
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load(
      "/images/earth-texture.jpg",
      () => {
        // Texture loaded callback
      },
      undefined,
      () => {
        // Error callback - use a simple material if texture fails to load
        earthMaterial.color = new THREE.Color(0x16a34a)
      },
    )

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 5,
    })

    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      earth.rotation.y += 0.001
      controls.update()

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      renderer.setSize(300, 300)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <div ref={containerRef} className="h-[300px] w-[300px] mx-auto cursor-grab active:cursor-grabbing" />
}
