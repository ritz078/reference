import { useThree } from "react-three-fiber";
import { useEffect, useMemo } from "react";
import { Mesh, SkinnedMesh } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { convertPointerToCoordinate } from "@utils/convertPointerToCoordinate";
import { usePostProcessing } from "@stores/postProcessing";
import { MODEL_NAME } from "@constants/name";

export function useTransformOnClick(orbitalControls) {
  const { raycaster, gl, camera, scene } = useThree();
  const transformControls = useMemo<TransformControls>(
    () => new TransformControls(camera, gl.domElement),
    []
  );
  const sobelRenderPass = usePostProcessing((state) => state.sobelRenderPass);

  useEffect(() => {
    function handleChange(e) {
      orbitalControls.enabled = !e.value;
    }

    transformControls.addEventListener("dragging-changed", handleChange);
    transformControls.mode = "rotate";
    transformControls.axis = "local";
    scene.add(transformControls);

    return () => {
      transformControls.removeEventListener("dragging-changed", handleChange);
      transformControls.dispose();
    };
  }, [transformControls]);

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

      const intersectedBoneMesh = intersects.filter(
        (x) => x.object instanceof Mesh && !(x.object instanceof SkinnedMesh)
      );

      if (intersectedBoneMesh.length) {
        const boneMesh = intersectedBoneMesh[0].object as Mesh;
        const rootBone = boneMesh.parent;

        transformControls.attach(rootBone);
      }
      // checking if orbitalControls is enabled tells us whether the uer clicked
      // somewhere on the canvas or if it's just the pointerup event that is triggered when
      // we stop the dragging of transformControls. We detach the transformControl only if
      // the user has clicked somewhere else in the canvas.
      else if (orbitalControls.enabled) {
        transformControls.detach();
      }
    }

    gl.domElement.addEventListener("pointerup", handleClick);
    return () => {
      gl.domElement.addEventListener("pointerup", handleClick);
    };
  }, [sobelRenderPass, orbitalControls]);
}
