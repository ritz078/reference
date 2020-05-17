import { useThree } from "react-three-fiber";
import { useEffect, useMemo } from "react";
import { Mesh, SkinnedMesh } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { convertPointerToCoordinate } from "@utils/convertPointerToCoordinate";
import { useMaterial } from "@stores/material";
import { usePostProcessing } from "@stores/postProcessing";
import { MODEL_NAME } from "@constants/name";

export function useTransformOnClick(orbitalControls) {
  const { raycaster, gl, camera, scene, invalidate } = useThree();
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );
  const { wireframe, toggleWireframe } = useMaterial();
  const sobelRenderPass = usePostProcessing((state) => state.sobelRenderPass);

  useEffect(() => {
    function handleChange(e) {
      orbitalControls.enabled = !e.value;
      invalidate();
    }

    transformControls.addEventListener("dragging-changed", handleChange);
    transformControls.mode = "rotate";
    transformControls.axis = "local";
    scene.add(transformControls);

    return () => {
      transformControls.removeEventListener("dragging-changed", handleChange);
      transformControls.dispose();
    };
  }, []);

  useEffect(() => {
    function handleClick(ev: MouseEvent) {
      if (sobelRenderPass) return;
      ev.preventDefault();

      raycaster.setFromCamera(
        convertPointerToCoordinate(ev, gl.domElement),
        camera
      );

      const intersects = raycaster.intersectObject(
        scene.getObjectByName(MODEL_NAME),
        true
      );

      console.log(scene.getObjectByName(MODEL_NAME));

      if (intersects.length) {
        if (!wireframe) toggleWireframe();
      }

      const intersectedBoneMesh = intersects.filter(
        (x) => x.object instanceof Mesh && !(x.object instanceof SkinnedMesh)
      );

      if (intersectedBoneMesh.length) {
        const boneMesh = intersectedBoneMesh[0].object as Mesh;
        const rootBone = boneMesh.parent;

        transformControls.attach(rootBone);
      } else {
        transformControls.detach();
      }
    }

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [wireframe, sobelRenderPass]);
}
