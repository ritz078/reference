import React from "react";
import styles from "./Settings.module.scss";
import Icon from "@mdi/react";
import { mdiGrid, mdiHumanFemale, mdiHumanMale } from "@mdi/js";
import { IconProps } from "@mdi/react/dist/IconProps";
import { useLoadedModel } from "@stores/loadedModel";
import { useEnvironment } from "@stores/environment";

interface IconButtonProps extends IconProps {
  label?: string;
  onClick?: () => void;
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
      <div className={styles.separator} />
      <div className={styles.gender}>
        <IconButton onClick={toggleGrid} title="Grid" path={mdiGrid} />
      </div>
    </div>
  );
}
