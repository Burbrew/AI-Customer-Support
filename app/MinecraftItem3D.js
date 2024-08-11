import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEffect } from 'react';

export default function MinecraftItem3D({ item }) {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('3d-item').appendChild(renderer.domElement);

    const loader = new GLTFLoader();

    loader.load(`/path/to/${item}.glb`, function (gltf) {
      scene.add(gltf.scene);
    }, undefined, function (error) {
      console.error(error);
    });

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, [item]);

  return <div id="3d-item" style={{ width: '50%', height: '100%' }}></div>;
}
