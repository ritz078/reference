import { useThree } from "react-three-fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Object3D } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export function useTransformOnClick(orbitalControls) {
  const { raycaster, gl, camera, scene, invalidate } = useThree();
  const transformControls = useRef<TransformControls>(
    new TransformControls(camera, gl.domElement)
  );

  useEffect(() => {
    function setChangingTrue() {
      orbitalControls.current.enabled = false;
    }

    function setChangingFalse() {
      orbitalControls.current.enabled = true;
    }

    function handleChange() {
      invalidate();
    }

    transformControls.current.addEventListener("mouseDown", setChangingTrue);
    transformControls.current.addEventListener("mouseUp", setChangingFalse);
    transformControls.current.addEventListener("change", handleChange);
    scene.add(transformControls.current);
    transformControls.current.mode = "rotate";
    transformControls.current.space = "local";

    return () => {
      transformControls.current.removeEventListener(
        "mouseDown",
        setChangingTrue
      );
      transformControls.current.removeEventListener(
        "mouseUp",
        setChangingFalse
      );
      transformControls.current.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      ev.preventDefault();

      const x = (ev.clientX / window.innerWidth) * 2 - 1;
      const y = -(ev.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera({ x, y }, camera);

      const intersects = raycaster
        .intersectObjects(
          scene.children.find((child) => child instanceof Group).children
        )
        // @ts-ignore
        .filter((child) => child.object?.skeleton?.bones?.length);

      if (intersects.length) {
        const object = intersects[0].object;

        // @ts-ignore
        transformControls.current.attach(object.skeleton.bones[0]);
      } else {
        transformControls.current.detach();
      }
    }

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, []);
}
