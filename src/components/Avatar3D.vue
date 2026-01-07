<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { useLuckyStore } from '@/stores/lucky';
import { LuckyState } from '@/types/lucky';
import * as THREE from 'three';

// Store
const luckyStore = useLuckyStore();

// 3D Scene refs
const groupRef = ref<THREE.Group>();

// Rotation speed based on state
const rotationSpeed = ref(0.005); // Slow rotation

// Calculate sphere layout using Fibonacci sphere algorithm
const calculateSpherePositions = (count: number, radius: number) => {
  const positions: Array<{
    x: number;
    y: number;
    z: number;
    theta: number;
    phi: number;
  }> = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere algorithm for uniform distribution
    const y = count > 1 ? 1 - (i / (count - 1)) * 2 : 0; // y from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    positions.push({
      x: x * radius,
      y: y * radius,
      z: z * radius,
      theta,
      phi: Math.asin(y),
    });
  }

  return positions;
};

// Dynamic sphere radius based on avatar count
const sphereRadius = computed(() => {
  const count = luckyStore.availableAvatars.length;
  return Math.max(20, Math.sqrt(count) * 2.5);
});

// Camera position
const cameraPosition = computed<[number, number, number]>(() => {
  const distance = sphereRadius.value * 2.5;
  return [0, 0, distance];
});

// Create texture from base64 data URL
const createTexture = (dataUrl: string): THREE.Texture => {
  const texture = new THREE.TextureLoader().load(dataUrl);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
};

// Sphere positions
const spherePositions = computed(() =>
  calculateSpherePositions(
    luckyStore.availableAvatars.length,
    sphereRadius.value
  )
);

// Avatars with positions
const sphereAvatars = computed(() => {
  return luckyStore.availableAvatars.map((avatar, index) => {
    const pos = spherePositions.value[index]!;
    const isSelected = luckyStore.currentDrawnEmpnos.includes(avatar.empno);
    const texture = createTexture(avatar.dataUrlThumbnail);
    return {
      ...avatar,
      position: pos,
      isSelected,
      texture,
    };
  });
});

// Calculate avatar size based on sphere radius and count
const avatarPlaneSize = computed(() => {
  const count = luckyStore.availableAvatars.length;
  // Adjust size based on density
  return Math.max(1.5, sphereRadius.value / Math.sqrt(count));
});

// Update rotation speed based on lucky state
watch(
  () => luckyStore.luckyState,
  (state) => {
    if (state === LuckyState.DRAWING) {
      // Fast rotation during drawing
      // 等差数列逆运算，计算出速率变化倍速（项数）
      let a = Math.sqrt(
        (2 * luckyStore.currentLuckyTime) / luckyStore.currentLuckySpeed
      );
      rotationSpeed.value = Math.min(0.005 * a, Math.PI);
    } else {
      // Slow rotation for INITIAL and SHOWING_RESULTS
      rotationSpeed.value = 0.005;
    }
  }
);

// Animation loop using requestAnimationFrame
const animate = () => {
  if (groupRef.value) {
    groupRef.value.rotation.y += rotationSpeed.value;
  }
  requestAnimationFrame(animate);
};

// Start animation on mount
onMounted(() => {
  animate();
});
</script>

<template>
  <div class="avatar-3d-container">
    <TresCanvas :alpha="true" clear-color="#000000" :clear-alpha="0">
      <!-- Camera -->
      <TresPerspectiveCamera
        :position="cameraPosition"
        :look-at="[0, 0, 0]"
        :fov="50"
      />

      <!-- Ambient Light -->
      <TresAmbientLight :intensity="1" />

      <!-- Directional Light -->
      <TresDirectionalLight
        :position="[sphereRadius + 1, sphereRadius + 1, sphereRadius + 1]"
        :intensity="1"
      />

      <!-- Avatar Group -->
      <TresGroup ref="groupRef">
        <TresMesh
          v-for="avatar in sphereAvatars"
          :key="avatar.empno"
          :position="[avatar.position.x, avatar.position.y, avatar.position.z]"
          :scale="avatar.isSelected ? [1.5, 1.5, 1.5] : [1, 1, 1]"
        >
          <!-- Plane Geometry for avatar image -->
          <TresPlaneGeometry :args="[avatarPlaneSize, avatarPlaneSize]" />

          <!-- Material with texture -->
          <TresMeshStandardMaterial
            :map="avatar.texture"
            :transparent="true"
            :side="THREE.DoubleSide"
            :emissive="0xffaa00"
            :emissive-intensity="avatar.isSelected ? 0.5 : 0"
          />
        </TresMesh>
      </TresGroup>
    </TresCanvas>
  </div>
</template>

<style scoped>
.avatar-3d-container {
  width: min(90vw, 78vh);
  height: min(90vw, 78vh);
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  margin-top: 1px;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
