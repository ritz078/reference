import { useEffect, useMemo } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useThree } from "react-three-fiber";
import { MODEL_NAME } from "@constants/name";

export function useLoader(path: string, onLoad: () => void) {
  const { scene } = useThree();

  const loader = useMemo(() => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);
    return loader;
  }, []);

  useEffect(() => {
    if (!path) return;

    if (scene.getObjectByName(MODEL_NAME)) {
      scene.remove(scene.getObjectByName(MODEL_NAME));
    }
    loader.load(`/models/${path}.glb`, (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.name = MODEL_NAME;

      onLoad();
    });
  }, [path, loader]);
}
