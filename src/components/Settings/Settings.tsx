import React, { useEffect, useRef, useState } from "react";
import styles from "./Settings.module.scss";
import Icon from "@mdi/react";
import { mdiHumanFemale, mdiHumanMale } from "@mdi/js";
import { IconProps } from "@mdi/react/dist/IconProps";
import { useLoadedModel } from "@stores/loadedModel";
import { useEnvironment } from "@stores/environment";
import Switch from "react-switch";
import { useMaterial } from "@stores/material";
import { ChromePicker } from "react-color";

interface IconButtonProps extends IconProps {
  label?: string;
  onClick?: () => void;
}

function SwitchButton({ label, checked, onChange }) {
  return (
    <div className={styles.switchWrapper} onClick={onChange}>
      {label}
      <Switch
        checked={checked}
        uncheckedIcon={false}
        checkedIcon={false}
        onChange={() => {}}
        height={10}
        width={26}
        handleDiameter={16}
      />
    </div>
  );
}

export function IconButton({
  className,
  label,
  onClick,
  title,
  ...rest
}: IconButtonProps) {
  return (
    <div onClick={onClick} aria-label={title} className={styles.iconButton}>
      <Icon size={1} title={title} {...rest} /> {label}
    </div>
  );
}

export function Settings() {
  const { setName: setModelName, name } = useLoadedModel();
  const { showGrid, toggleGrid } = useEnvironment();
  const {
    wireframe,
    toggleWireframe,
    materialColor,
    setMaterialColor,
  } = useMaterial();

  return (
    <div className={styles.settings}>
      <div className={styles.gender}>
        <IconButton
          title="Male"
          onClick={() => setModelName("male")}
          path={mdiHumanMale}
        />
        <IconButton
          title="Female"
          onClick={() => setModelName("female")}
          path={mdiHumanFemale}
        />
      </div>
      <div className={styles.title}>Model Material</div>
      <SwitchButton
        checked={wireframe}
        onChange={toggleWireframe}
        label="Wireframe"
      />

      <ColorPicker color={materialColor} onChange={setMaterialColor} />
      <div className={styles.title}>Environment</div>
      <SwitchButton checked={showGrid} onChange={toggleGrid} label="Grid" />
      <div className={styles.title}>Post Processing</div>
      <SwitchButton checked={showGrid} onChange={toggleGrid} label="Grid" />
    </div>
  );
}

function ColorPicker({ color, onChange }) {
  const [show, setShow] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!divRef.current.contains(e.target as Node)) {
        setShow(false);
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className={styles.switchWrapper} onClick={() => {}}>
      Color
      <div className={styles.colorWrapper} ref={divRef}>
        <div
          className={styles.colorSwatch}
          style={{
            backgroundColor: color,
          }}
          onClick={() => setShow(!show)}
        />

        <div className={styles.colorModal}>
          {show && <ChromePicker color={color} onChange={onChange} />}
        </div>
      </div>
    </div>
  );
}
