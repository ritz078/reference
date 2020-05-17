import { useEffect, useMemo, useRef } from "react";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { useFrame, useThree } from "react-three-fiber";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader";
import { usePostProcessing } from "@stores/postProcessing";

export function useSobelRenderPass() {
  const { scene, camera, gl, size } = useThree();
  const soberRenderPass = usePostProcessing((state) => state.sobelRenderPass);

  const composer = useMemo(() => {
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const sobelEffect = new ShaderPass(SobelOperatorShader);
    console.log(sobelEffect);
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

  useFrame(
    (_, delta) => {
      if (soberRenderPass) {
        composer.render(delta);
      }
    },
    soberRenderPass ? 1 : 0
  );
}
