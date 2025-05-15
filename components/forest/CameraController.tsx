"use client"

import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Vector3 } from "three"

interface CameraControllerProps {
  disabled?: boolean
}

export const CameraController = forwardRef(({ disabled = false }: CameraControllerProps, ref) => {
  const { camera, gl } = useThree()
  const orbitControlsRef = useRef<any>()
  const minHeight = 1.0
  const targetOffset = useRef(new Vector3(0, 0, 0))
  const [isCtrlPressed, setIsCtrlPressed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const lastMousePosition = useRef({ x: 0, y: 0 })
  const panSpeed = 0.05

  // Expose controls to parent
  useImperativeHandle(ref, () => ({
    orbitControls: orbitControlsRef.current,
    setTarget: (position: [number, number, number]) => {
      if (orbitControlsRef.current) {
        // Tính toán offset giữa camera và target mới
        targetOffset.current.set(
          position[0] - camera.position.x,
          position[1] - camera.position.y,
          position[2] - camera.position.z,
        )

        // Đặt target mới
        orbitControlsRef.current.target.set(position[0], position[1], position[2])
      }
    },
  }))

  // Simple movement state
  const keys = useRef<{ [key: string]: boolean }>({})
  const speed = useRef(0.5)

  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Kiểm tra e.key có tồn tại không
      if (!e.key) return

      const key = e.key.toLowerCase()
      keys.current[key] = true

      // Set higher speed when shift is pressed
      if (key === "shift") {
        speed.current = 1.0
      }

      // Detect Ctrl key press
      if (key === "control") {
        setIsCtrlPressed(true)
        if (orbitControlsRef.current) {
          // Disable rotation when Ctrl is pressed
          orbitControlsRef.current.enableRotate = false
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // Kiểm tra e.key có tồn tại không
      if (!e.key) return

      const key = e.key.toLowerCase()
      keys.current[key] = false

      // Reset speed when shift is released
      if (key === "shift") {
        speed.current = 0.5
      }

      // Detect Ctrl key release
      if (key === "control") {
        setIsCtrlPressed(false)
        if (orbitControlsRef.current) {
          // Re-enable rotation when Ctrl is released
          orbitControlsRef.current.enableRotate = true
        }
      }
    }

    // Handle mouse events for Ctrl+drag
    const handleMouseDown = (e: MouseEvent) => {
      if (isCtrlPressed) {
        setIsDragging(true)
        lastMousePosition.current = { x: e.clientX, y: e.clientY }
        // Prevent default behavior and orbit controls
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isCtrlPressed && isDragging) {
        // Calculate mouse movement delta
        const deltaX = e.clientX - lastMousePosition.current.x
        const deltaY = e.clientY - lastMousePosition.current.y

        // Update last position
        lastMousePosition.current = { x: e.clientX, y: e.clientY }

        // Pan camera based on mouse movement
        if (orbitControlsRef.current) {
          // Get camera right and up vectors
          const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
          const up = new Vector3(0, 1, 0)

          // Calculate pan amount
          const panX = -deltaX * panSpeed
          const panY = deltaY * panSpeed

          // Move camera and target
          camera.position.addScaledVector(right, panX)
          camera.position.addScaledVector(up, panY)
          orbitControlsRef.current.target.addScaledVector(right, panX)
          orbitControlsRef.current.target.addScaledVector(up, panY)
        }

        // Prevent default behavior
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [camera, isCtrlPressed, isDragging])

  // Cấu hình OrbitControls
  useEffect(() => {
    if (orbitControlsRef.current) {
      // Cấu hình cơ bản
      orbitControlsRef.current.rotateSpeed = 0.8
      orbitControlsRef.current.zoomSpeed = 1.2
      orbitControlsRef.current.maxDistance = 200

      // Vô hiệu hóa pan mặc định (chúng ta sẽ xử lý pan bằng Ctrl+drag)
      orbitControlsRef.current.enablePan = false

      // Cấu hình góc
      orbitControlsRef.current.minPolarAngle = Math.PI * 0.1
      orbitControlsRef.current.maxPolarAngle = Math.PI - 0.1

      // Cấu hình damping
      orbitControlsRef.current.enableDamping = true
      orbitControlsRef.current.dampingFactor = 0.1

      // Đặt target ban đầu ở phía trước camera
      const direction = new Vector3(0, 0, -1)
      direction.applyQuaternion(camera.quaternion)
      direction.multiplyScalar(10)

      const target = new Vector3()
      target.addVectors(camera.position, direction)
      orbitControlsRef.current.target.copy(target)

      // Lưu offset ban đầu
      targetOffset.current.copy(direction)
    }
  }, [camera, orbitControlsRef.current])

  // Movement implementation
  useFrame(() => {
    if (disabled || !orbitControlsRef.current) return

    // Get movement input
    const forward = keys.current["w"] || keys.current["arrowup"] || false
    const backward = keys.current["s"] || keys.current["arrowdown"] || false
    const left = keys.current["a"] || keys.current["arrowleft"] || false
    const right = keys.current["d"] || keys.current["arrowright"] || false
    const up = keys.current["e"] || false
    const down = keys.current["q"] || false

    // Skip if no movement
    if (!forward && !backward && !left && !right && !up && !down) return

    // Get camera direction
    const direction = new Vector3()
    camera.getWorldDirection(direction)
    direction.y = 0 // Keep movement horizontal
    direction.normalize()

    // Calculate movement vector
    const moveVector = new Vector3(0, 0, 0)

    // Forward/backward
    if (forward) {
      moveVector.add(direction.clone().multiplyScalar(speed.current))
    }
    if (backward) {
      moveVector.add(direction.clone().multiplyScalar(-speed.current))
    }

    // Left/right
    const rightVector = direction
      .clone()
      .cross(new Vector3(0, 1, 0))
      .normalize()
    if (right) {
      moveVector.add(rightVector.clone().multiplyScalar(speed.current))
    }
    if (left) {
      moveVector.add(rightVector.clone().multiplyScalar(-speed.current))
    }

    // Apply horizontal movement
    if (moveVector.length() > 0) {
      // Store current Y position
      const currentY = camera.position.y

      // Move camera
      camera.position.add(moveVector)

      // Restore Y position
      camera.position.y = currentY

      // Move target with camera to maintain relative position
      orbitControlsRef.current.target.add(moveVector)
    }

    // Handle vertical movement separately
    if (up) {
      camera.position.y += speed.current
      orbitControlsRef.current.target.y += speed.current
    }
    if (down) {
      camera.position.y -= speed.current
      if (camera.position.y < minHeight) {
        camera.position.y = minHeight
      }
      orbitControlsRef.current.target.y -= speed.current
      if (orbitControlsRef.current.target.y < minHeight) {
        orbitControlsRef.current.target.y = minHeight
      }
    }
  })

  return (
    <OrbitControls
      ref={orbitControlsRef}
      args={[camera, gl.domElement]}
      enablePan={false}
      enableZoom={!disabled}
      enableRotate={!disabled && !isCtrlPressed}
      keyPanSpeed={0}
      minPolarAngle={Math.PI * 0.1}
      maxPolarAngle={Math.PI - 0.1}
      minDistance={0.1}
      maxDistance={200}
      zoomSpeed={1.2}
      rotateSpeed={0.8}
      enableDamping={true}
      dampingFactor={0.1}
      keys={{
        LEFT: null,
        RIGHT: null,
        UP: null,
        BOTTOM: null,
      }}
    />
  )
})

CameraController.displayName = "CameraController"
