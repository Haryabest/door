import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll } from '@react-three/drei'
import { easing } from 'maath'
import { motion } from 'framer-motion'

export const Carousel3D = () => (
  <div className="w-full h-full" style={{ background: '#fcf8d4' }}>
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }} style={{ background: '#fcf8d4' }}>
      <fog attach="fog" args={['#fcf8d4', 8.5, 12]} />
      <ScrollControls pages={3} style={{ scrollbarWidth: 'none' as any, msOverflowStyle: 'none' as any }}>
        <Rig rotation={[0, 0, 0.15]}>
          <Carousel />
        </Rig>
      </ScrollControls>
    </Canvas>
  </div>
)

function Rig(props: any) {
  const ref = useRef<THREE.Group>(null!)
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2)
    if (state.events.update) state.events.update()
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return <group ref={ref} {...props} />
}

function Carousel({ radius = 1.4, count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={`/img${Math.floor(i % 10) + 1}_.jpg`}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ))
}

function Card({ url, ...props }: any) {
  const ref = useRef<THREE.Object3D>(null!)
  const [hovered, hover] = useState(false)
  const pointerOver = (e: any) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  useFrame((_state, delta) => {
    if (ref.current) {
      const image = ref.current as any
      easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
      if (image.material) {
        easing.damp(image.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
        easing.damp(image.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
      }
    }
  })
  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      color="#f5e6b8"
      {...props}
    />
  )
}

export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="w-6 h-10 border-2 border-[#EFE4C8]/50 rounded-full flex items-start justify-center p-2">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1 h-2 bg-[#EFE4C8]/70 rounded-full border border-[#EFE4C8]"
        />
      </div>
    </div>
  )
}
