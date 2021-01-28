import React from "react";
import { useHistory } from "react-router-dom";
import { LinkBase } from "@aragon/ui";

import styles from "./index.module.scss";

type LogoProps = {
  user: string;
  showLine?: boolean;
};

function Logo({ user, showLine = false }: LogoProps) {
  const history = useHistory();
  const setUserFormat = (str: string) => {
    let substr = str.substring(0, 5) + "......" + str.substring(37);
    if (str === "") return str;
    return " / " + substr;
  };
  return (
    <LinkBase onClick={() => history.push("/")} style={{ marginRight: "8px" }}>
      <div className={styles.logoUser}>
        <p className={user === "" ? styles.font24 : styles.font20}>
          U8D{setUserFormat(user)}
        </p>
        {user === "" && showLine && <div className={styles.logoRight}></div>}
      </div>
    </LinkBase>
  );
}

export default Logo;
