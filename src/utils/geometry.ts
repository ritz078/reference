import { Box3, Object3D, Vector3 } from "three";

export function getCenter(model: Object3D): Vector3 {
  const box = new Box3();
  box.setFromObject(model);
  const center = new Vector3();
  box.getCenter(center);
  return center;
}

export function getModelCenter(model: Object3D, modelName: string) {
  const _model =
    modelName === "male" || modelName === "female"
      ? model.children[0].children[0]
      : model;

  return getCenter(_model);
}
