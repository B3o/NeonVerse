import { useRef } from 'react'
import { Mesh, BackSide, Vector3, ShaderMaterial, Color } from 'three'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'

// Vertex shader for the skybox
const vertexShader = `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Fragment shader for the skybox gradient
const fragmentShader = `
varying vec3 vWorldPosition;
varying vec2 vUv;
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform vec3 midColor;
uniform float time;

// Pseudo-random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Noise function
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Star field function
float starField(vec2 uv, float threshold) {
    float n = noise(uv * 500.0);
    return step(threshold, n);
}

void main() {
    float h = normalize(vWorldPosition).y;
    float t = time * 0.2;
    
    // Create a smooth gradient between three colors
    vec3 gradientColor;
    if (h > 0.0) {
        gradientColor = mix(midColor, topColor, h);
    } else {
        gradientColor = mix(midColor, bottomColor, -h);
    }
    
    // Add subtle animation to the gradient
    float pulse = sin(t) * 0.05;
    gradientColor += pulse;
    
    // Add stars
    vec2 uv = vUv;
    float starIntensity = starField(uv + vec2(t * 0.01, t * 0.005), 0.97);
    float twinkle = sin(time * 3.0 + random(uv) * 10.0) * 0.5 + 0.5;
    
    // Add star color
    vec3 starColor = vec3(0.9, 0.95, 1.0) * starIntensity * twinkle;
    
    // Combine gradient and stars
    vec3 finalColor = gradientColor + starColor;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`

export function Skybox() {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0001
    }
  })

  const uniforms = {
    topColor: { value: new Color('#000045') },
    midColor: { value: new Color('#100035') },
    bottomColor: { value: new Color('#000025') },
    time: { value: 0 }
  }

  return (
    <Sphere
      ref={meshRef}
      args={[100, 64, 64]} // Large sphere to contain the scene
      position={new Vector3(0, 0, 0)}
    >
      <shaderMaterial
        ref={materialRef}
        side={BackSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </Sphere>
  )
}
