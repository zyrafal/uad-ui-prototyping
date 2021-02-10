import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import { CSSTransition } from "react-transition-group";
import { toTokenUnitsBN } from "../../../utils/number";
import BigNumber from "bignumber.js";
import SettingModal from "../../common/SettingModal";
import ModalTitle from "../../common/SettingModal/ModalTitle";
import ModalBtn from "../../common/SettingModal/ModalBtn";
import "../../NavBar/fade.css";
type StreamingProps = {
  streamTimeleft: Function;
  releasableAmount: Function;
  unreleasedAmount: Function;
  release: Function;
  boostStream: Function;
  cancelStream: Function;
  addr: string;
  decimals: number;
  prefix?: string;
  roundable?: boolean;
};

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = (d < 10 ? "0" + d : d) + ":";
  var hDisplay = (h < 10 ? "0" + h : h) + ":";
  var mDisplay = (m < 10 ? "0" + m : m) + ":";
  var sDisplay = s < 10 ? "0" + s : s;
  return dDisplay + hDisplay + mDisplay + sDisplay;
}
function Streaming({
  streamTimeleft,
  releasableAmount,
  unreleasedAmount,
  release,
  boostStream,
  cancelStream,
  addr,
  decimals,
  prefix = "uAD",
  roundable = true,
}: StreamingProps) {
  const [leftTime, setLeftTime] = useState(0);
  const [totalLeftTime, setTotalLeftTime] = useState(0);
  const [releasable, setReleasable] = useState(new BigNumber(0));
  const [unreleased, setUnreleased] = useState(new BigNumber(0));
  const [streamSetting, setStreamSetting] = useState(false);
  const [penalty, setPenalty] = useState("0");
  const [streamingWidth, setStreamingWidth] = useState("0");
  const progressbar = useRef<HTMLDivElement>(null);
  const progressbarwidth = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(70);
  const [canBoost, setCanBoost] = useState(true);
  useEffect(() => {
    const updateStreamingInfo = async () => {
      const [timeleft, releasableValue, unreleasedValue] = await Promise.all([
        streamTimeleft(addr),
        releasableAmount(addr),
        unreleasedAmount(addr),
      ]);
      const diff =
        (new BigNumber(toTokenUnitsBN(unreleasedValue, decimals)).toNumber() -
          new BigNumber(toTokenUnitsBN(releasableValue, decimals)).toNumber()) *
        0.25;
      if (diff < 0.001) setPenalty("<0.001");
      else setPenalty(parseFloat(diff.toFixed(3)).toString());
      if (releasableValue === unreleasedValue) {
        setCanBoost(false);
        setStreamingWidth("0");
      }
      setReleasable(new BigNumber(toTokenUnitsBN(releasableValue, decimals)));
      setUnreleased(new BigNumber(toTokenUnitsBN(unreleasedValue, decimals)));
      if (totalLeftTime === 0) {
        setWidth((70 * (unreleasedValue - releasableValue)) / unreleasedValue);
        setLeftTime(timeleft);
        setTotalLeftTime(timeleft);
      }
    };

    updateStreamingInfo();
    const id = setInterval(updateStreamingInfo, 10000);
    return () => {
      clearInterval(id);
    };
  }, [
    addr,
    decimals,
    releasableAmount,
    streamTimeleft,
    unreleasedAmount,
    totalLeftTime,
  ]);

  useEffect(() => {
    const timer = setInterval(function () {
      if (progressbar && progressbar.current) {
        let temp = progressbar.current.innerText;
        let time = parseInt(temp) - 1;
        if (time === -1) return;
        temp = time.toString();
        progressbar.current.innerText = temp;
        if (progressbarwidth && progressbarwidth.current) {
          temp = progressbarwidth.current.innerText;
        } else temp = "70";
        setStreamingWidth(
          ((parseFloat(temp) * leftTime) / totalLeftTime).toString()
        );
        setLeftTime(time);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [leftTime, totalLeftTime, streamingWidth]);

  const handleStreamSetting = async (type) => {
    if (type === "claim") {
      await release(addr);
    } else if (type === "boost") {
      await boostStream(addr);
      const [timeleft, releasableValue, unreleasedValue] = await Promise.all([
        streamTimeleft(addr),
        releasableAmount(addr),
        unreleasedAmount(addr),
      ]);
      setLeftTime(timeleft);
      setTotalLeftTime(timeleft);

      setReleasable(new BigNumber(toTokenUnitsBN(releasableValue, decimals)));
      setUnreleased(new BigNumber(toTokenUnitsBN(unreleasedValue, decimals)));
    } else if (type === "cancel") {
      await cancelStream(addr);
    }
    setStreamSetting(false);
  };
  return (
    <>
      <div
        className={styles.streaming}
        onClick={() => {
          setStreamSetting(true);
        }}
      >
        <div
          className={styles.process}
          style={{
            width: streamingWidth + "%",
          }}
        ></div>
        <div style={{ display: "none" }} ref={progressbar}>
          {leftTime}
        </div>
        <div style={{ display: "none" }} ref={progressbarwidth}>
          {width}
        </div>
        <div className={styles.info}>
          <div className={styles.stream}>
            <p>Streaming</p>
            <p>{secondsToDhms(leftTime)}</p>
          </div>
          <div className={styles.claim}>
            <p>Claimable</p>
            <p>
              {roundable
                ? parseFloat(releasable.toNumber().toFixed(3)).toString()
                : parseFloat(releasable.toNumber().toFixed(9)).toString()}
              /
              {roundable
                ? parseFloat(unreleased.toNumber().toFixed(3)).toString()
                : parseFloat(unreleased.toNumber().toFixed(9)).toString()}{" "}
              {prefix}
            </p>
          </div>
        </div>
      </div>

      <CSSTransition
        in={streamSetting}
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <div>
          <SettingModal onClose={setStreamSetting} bgColor="#060606">
            <ModalTitle>
              <p>Streaming</p>
              <p>settings</p>
            </ModalTitle>
            <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
              <ModalBtn
                height="22vh"
                bgColor="#FEB258"
                clickAction={handleStreamSetting}
                type="claim"
              >
                <div className={styles.flexBlock}>
                  <p
                    style={{
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: "rgba(0,0,0,0.4)",
                    }}
                  >
                    Claim
                  </p>
                  <p
                    style={{
                      fontSize: "32px",
                      lineHeight: "38px",
                      color: "#000000",
                    }}
                  >
                    {roundable
                      ? parseFloat(releasable.toNumber().toFixed(3)).toString()
                      : parseFloat(releasable.toNumber().toFixed(9)).toString()}
                    /
                    {roundable
                      ? parseFloat(unreleased.toNumber().toFixed(3)).toString()
                      : parseFloat(
                          unreleased.toNumber().toFixed(9)
                        ).toString()}{" "}
                    {prefix}
                  </p>
                </div>
              </ModalBtn>
              {canBoost && (
                <>
                  <ModalBtn
                    height="22vh"
                    bgColor="#3C67FF"
                    clickAction={handleStreamSetting}
                    type="boost"
                  >
                    <div className={styles.flexBlock}>
                      <p
                        style={{
                          fontSize: "20px",
                          lineHeight: "24px",
                          color: "#ffffff",
                        }}
                      >
                        {secondsToDhms(leftTime)}
                      </p>
                      <p
                        style={{
                          fontSize: "32px",
                          lineHeight: "38px",
                          color: "#ffffff",
                        }}
                      >
                        Make 2x faster for 25% penalty ({penalty.toString()}{" "}
                        <span>{prefix}</span>)
                      </p>
                    </div>
                  </ModalBtn>

                  <ModalBtn
                    height="17vh"
                    bgColor="#E60419"
                    clickAction={handleStreamSetting}
                    type="cancel"
                  >
                    <div className={styles.flexBlock}>
                      <p
                        style={{
                          fontSize: "32px",
                          lineHeight: "38px",
                          color: "#ffffff",
                          paddingTop: "36px",
                        }}
                      >
                        Cancel
                      </p>
                    </div>
                  </ModalBtn>
                </>
              )}
            </div>
          </SettingModal>
        </div>
      </CSSTransition>
    </>
  );
}

export default Streaming;
