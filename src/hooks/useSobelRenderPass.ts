import { useEffect, useMemo, useRef } from "react";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { useFrame, useThree } from "react-three-fiber";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader";

export function useSobelRenderPass() {
  const { scene, camera, gl, size } = useThree();

  const composer = useMemo(() => {
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const sobelEffect = new ShaderPass(SobelOperatorShader);
    sobelEffect.uniforms["resolution"].value.x =
      window.innerWidth * window.devicePixelRatio;
    sobelEffect.uniforms["resolution"].value.y =
      window.innerHeight * window.devicePixelRatio;

    composer.addPass(sobelEffect);
    console.log(composer.readBuffer);
    return composer;
  }, [camera, scene, gl]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);

  useFrame((_, delta) => {
    composer.render(delta);
  }, 1);
}
