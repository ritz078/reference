import { useFrame, useThree } from "react-three-fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Group } from "three";

export function useHighlightOnHover() {
  const { scene, gl, camera, raycaster } = useThree();
  const intersectedRef = useRef(null);
  const mouse = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handleMouseMove(ev: MouseEvent) {
      ev.preventDefault();

      mouse.current.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    }

    gl.domElement.addEventListener("mousemove", handleMouseMove);
    return () =>
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    raycaster.setFromCamera(mouse.current, camera);
    const intersects = raycaster
      .intersectObjects(
        scene.children.find((child) => child instanceof Group).children
      )
      .filter((child) => child.object);

    if (intersectedRef.current) {
      scene.remove(intersectedRef.current);
      intersectedRef.current = null;
    }

    if (intersects.length) {
      if (intersectedRef.current !== intersects[0].object) {
        const box = new THREE.BoxHelper(intersects[0].object, 0xffff00);
        scene.add(box);
        intersectedRef.current = box;
      }
    }
  });
}
