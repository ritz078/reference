import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Settings.module.scss";
import Icon from "@mdi/react";
import { mdiDownload, mdiHumanFemale, mdiHumanMale } from "@mdi/js";
import { IconProps } from "@mdi/react/dist/IconProps";
import { useEnvironment } from "@stores/environment";
import Switch from "react-switch";
import { useMaterial } from "@stores/material";
import { ChromePicker } from "react-color";
import { usePostProcessing } from "@stores/postProcessing";
import { useMode } from "@stores/mode";
import { useScene } from "@stores/scene";
import { MODEL_NAME } from "@constants/name";

interface IconButtonProps extends IconProps {
  label?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Settings() {
  const { showGrid, toggleGrid } = useEnvironment();
  const { materialColor, setMaterialColor } = useMaterial();
  const { editMode, toggleEditMode } = useMode();
  const { sobelRenderPass, toggleSobelRenderPass } = usePostProcessing();
  const { setModel, renderer, model } = useScene();

  const download = useCallback(() => {
    if (!renderer) return;

    const dataURL = renderer.domElement.toDataURL();
    const a = document.createElement("a");
    a.href = dataURL;
    a.style.display = "none";
    a.download = `${MODEL_NAME}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [renderer]);

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
      <div className={styles.name} />
      <div className={styles.settingContent}>
        <div className={styles.gender}>
          <div>
            <IconButton
              title="Male"
              onClick={() => setModel("male")}
              path={mdiHumanMale}
              selected={model === "male"}
            />
            <IconButton
              title="Female"
              onClick={() => setModel("female")}
              path={mdiHumanFemale}
              selected={model === "female"}
            />
          </div>

          <div className={styles.downloadMobile}>
            <IconButton
              title="Download"
              onClick={download}
              path={mdiDownload}
            />
          </div>
        </div>

        <div className={styles.separator} />

        <div className={styles.switchWrapperContainer}>
          <SwitchButton
            onChange={() => {
              if (sobelRenderPass) {
                toggleSobelRenderPass();
              }
              toggleEditMode();
            }}
            checked={editMode}
            label={"Edit"}
          />

          <SwitchButton
            checked={showGrid}
            onChange={toggleGrid}
            label="Floor Grid"
          />
          <SwitchButton
            checked={sobelRenderPass}
            onChange={_toggleSobelRenderPass}
            label="2D"
          />

          <ColorPicker
            disabled={sobelRenderPass}
            color={materialColor}
            onChange={setMaterialColor}
          />
        </div>
        <div className={styles.download} onClick={download}>
          Download
        </div>
      </div>
      <footer className={styles.footer}>
        Made by
        <a target={"_blank"} href="https://twitter.com/ritz078">
          @ritz078
        </a>
      </footer>
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
      Model Color
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
        height={8}
        width={24}
        onColor="#2196f3"
        handleDiameter={16}
        className={styles.switch}
      />
    </div>
  );
}

const IconButton = React.memo(function ({
  className,
  label,
  onClick,
  title,
  selected,
  ...rest
}: IconButtonProps) {
  return (
    <div
      onClick={onClick}
      aria-selected={selected}
      aria-label={title}
      className={styles.iconButton}
    >
      <Icon size={1} title={title} {...rest} />{" "}
      {label && <div className={styles.iconLabel}>{label}</div>}
    </div>
  );
});
