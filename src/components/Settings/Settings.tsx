import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Settings.module.scss";
import Icon from "@mdi/react";
import { mdiHumanFemale, mdiHumanMale } from "@mdi/js";
import { IconProps } from "@mdi/react/dist/IconProps";
import { useLoadedModel } from "@stores/loadedModel";
import { useEnvironment } from "@stores/environment";
import Switch from "react-switch";
import { useMaterial } from "@stores/material";
import { ChromePicker } from "react-color";
import { usePostProcessing } from "@stores/postProcessing";
import { useMode } from "@stores/mode";

interface IconButtonProps extends IconProps {
  label?: string;
  onClick?: () => void;
}

export function Settings() {
  const { setName: setModelName } = useLoadedModel();
  const { showGrid, toggleGrid } = useEnvironment();
  const { materialColor, setMaterialColor } = useMaterial();
  const { editMode, toggleEditMode } = useMode();
  const { sobelRenderPass, toggleSobelRenderPass } = usePostProcessing();

  const _toggleSobelRenderPass = useCallback(() => {
    if (editMode) {
      toggleEditMode();
    }

    if (showGrid) {
      toggleGrid();
    }

    toggleSobelRenderPass();
  }, [showGrid, editMode]);

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
      <SwitchButton
        onChange={toggleEditMode}
        checked={editMode}
        label={"Edit"}
      />

      <div className={styles.title}>Environment</div>
      <SwitchButton checked={showGrid} onChange={toggleGrid} label="Grid" />
      <div className={styles.title}>Post Processing</div>
      <SwitchButton
        checked={sobelRenderPass}
        onChange={_toggleSobelRenderPass}
        label="2D"
      />

      <div className={styles.title}>Material</div>
      <ColorPicker
        disabled={sobelRenderPass}
        color={materialColor}
        onChange={setMaterialColor}
      />
    </div>
  );
}

function ColorPicker({ color, onChange, disabled = false }) {
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

  const className = `${styles.switchWrapper} ${
    disabled ? styles.disabled : ""
  }`;

  return (
    <div className={className}>
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

function SwitchButton({ label, checked, onChange, disabled = false }) {
  const className = `${styles.switchWrapper} ${
    disabled ? styles.disabled : ""
  }`;

  return (
    <div className={className} onClick={onChange}>
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
