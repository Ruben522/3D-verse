import React from "react";
import ModeloSTL from "./ModeloSTL";
import ModeloGLTF from "./ModeloGLTF";
import ModeloFallback from "./ModeloFallback";

const componentMap = {
  stl: ModeloSTL,
  gltf: ModeloGLTF,
  glb: ModeloGLTF,
};

const Model3D = (props) => {
  if (!props.modelPath) return null;

  const extension = props.modelPath.split('.').pop().toLowerCase();
  const RenderComponent = componentMap[extension] || ModeloFallback;

  return <RenderComponent {...props} />;
};

export default Model3D;