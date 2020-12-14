import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { format, getHours, getMinutes, parse } from "date-fns";
import useLocalData from "../useLocalData";

export default function Home() {
  const time = useTime();
  const localData = useLocalData();
  console.log("localData", localData);

  return (
    <div className={styles.container}>
      <Head>
        <title>Erlojua</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.digital}>{format(time, "HH:mm")}</div>

        <SvgFrame>
          <Face />
          <Ball time={time} />
          <Ball time={localData.sunrise} color="blue" radius={0.02} />
          <Ball time={localData.sunset} color="blue" radius={0.02} />
          <Ball
            time={parse("8:00", "HH:mm", new Date())}
            color="salmon"
            radius={0.02}
          />
          <Ball
            time={parse("16:00", "HH:mm", new Date())}
            color="salmon"
            radius={0.02}
          />
          <Ball
            time={parse("7:00", "HH:mm", new Date())}
            color="black"
            radius={0.02}
          />
          <Ball
            time={parse("20:00", "HH:mm", new Date())}
            color="black"
            radius={0.02}
          />
        </SvgFrame>
      </main>
    </div>
  );
}

function SvgFrame({ children }) {
  // By applying the transform we move the origin to the
  // center of the viewbox and flip it vertically
  return (
    <svg viewBox="0 0 2.1 2.1" style={{ width: "100%" }}>
      <g transform="translate(1.05, 1.05) scale(1, -1)">{children}</g>
    </svg>
  );
}
function Face() {
  return <circle className={styles.face} cx="0" cy="0" r="1" />;
}

function Ball({ time, radius = 0.04, color }) {
  // See https://en.wikipedia.org/wiki/Law_of_cosines#/media/File:Sinus_und_Kosinus_am_Einheitskreis_1.svg
  const θ = ((getHours(time) + getMinutes(time) / 60) / 24) * 2 * Math.PI;

  return (
    <circle
      className={styles.sunhand}
      cx={Math.cos(θ + Math.PI / 2)}
      cy={Math.sin(θ - Math.PI / 2)}
      r={radius}
      style={{ fill: color }}
    />
  );
}

function useTime() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const handle = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(handle);
  }, []);
  return time;
}
