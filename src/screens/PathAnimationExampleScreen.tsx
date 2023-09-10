import React, { Dispatch, useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { spacing } from "../styles/Spacing";
import Svg, { Circle, G, Line, Path } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { appViewStyle } from "../styles/AppStyle";
import { Grid, LineChart, XAxis, YAxis } from "react-native-svg-charts";
import { PressableWithFeedback } from "../components/PressableWithFeedback";

const SvgPathProps = require("svg-path-properties");

interface ChildrenProps {
  x?: any;
  y?: any;
  width?: any;
  height?: any;
  data?: number[];
  ticks?: number[];
}

interface ChartData {
  index: number;
  value: number;
}

const TEST_DATA = [
  { index: 0, value: 81 },
  { index: 1, value: 41 },
  { index: 2, value: 69 },
  { index: 3, value: 90 },
  { index: 4, value: 81 },
  { index: 5, value: 12 },
  { index: 6, value: 0 },
  { index: 7, value: 26 },
  { index: 8, value: 15 },
  { index: 9, value: 64 },
  { index: 10, value: 17 },
  { index: 11, value: 45 },
  { index: 12, value: 28 },
  { index: 13, value: 40 },
  { index: 14, value: 52 },
  { index: 15, value: 6 },
  { index: 16, value: 80 },
  { index: 17, value: 46 },
  { index: 18, value: 37 },
  { index: 19, value: 68 },
  { index: 20, value: 95 },
  { index: 21, value: 97 },
  { index: 22, value: 6 },
  { index: 23, value: 88 },
  { index: 24, value: 78 },
  { index: 25, value: 58 },
  { index: 26, value: 88 },
  { index: 27, value: 57 },
  { index: 28, value: 85 },
  { index: 29, value: 45 },
];

const PathAnimationExampleScreen = () => {
  const Y_AXIS_WIDTH = 24;
  const CHART_HEIGHT = 300;
  const DATA_LENGTH = 30;

  const [data, setData] = useState<ChartData[]>([]);
  const [pathLength, setPathLength] = useState(0);
  const [smoothPathLength, setSmoothPathLength] = useState(0);

  const lineChartRef = useRef<LineChart<number>>(null);

  const ANIM_DURATION = 3000;

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  const strokeOffsetValue = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: pathLength - pathLength * strokeOffsetValue.value,
    };
  });
  const executePathAnim = () => {
    strokeOffsetValue.value = 0;
    strokeOffsetValue.value = withTiming(1, {
      duration: ANIM_DURATION,
    });
  };

  useEffect(() => {
    const tmpArray: ChartData[] = [];
    for (let i = 0; i < DATA_LENGTH; i++) {
      tmpArray.push({
        index: i,
        value: Math.floor(Math.random() * 100),
      });
    }
    setData([...TEST_DATA]);
  }, []);

  useEffect(() => {
    if (pathLength > 0) {
      executePathAnim();
    }
  }, [pathLength]);

  const CustomLine = ({
    x,
    y,
    data,
    setPathLength,
  }: ChildrenProps & {
    setPathLength: Dispatch<number>;
    setSmoothPathLength: Dispatch<number>;
  }) => {
    const CONTROL_RATIO = 0.15;
    const pathLengthRef = useRef(-1);
    const smoothPathLengthRef = useRef(-1);
    const pathStringArray: string[] = [];
    const smoothPathStringArray: string[] = [];
    const controlPointPathStringArray: string[] = [];

    const [pathString, setPathString] = useState("");
    const [smoothPathString, setSmoothPathString] = useState("");
    const [controlStartPointPathString, setControlStartPointPathString] =
      useState("");
    const [controlEndPointPathString, setControlEndPointPathString] =
      useState("");

    useEffect(() => {
      data!.map((value, index, array) => {
        if (index === array.length - 1) {
          pathStringArray.push(`L ${x(index)} ${y(value)}`);
          return;
        }

        let startTheta,
          endTheta,
          startDistance,
          endDistance,
          startControlPointX,
          startControlPointY,
          endControlPointX,
          endControlPointY;

        if (index === 0) {
          pathStringArray.push(`M ${x(index)} ${y(value)}`);
          smoothPathStringArray.push(`M ${x(index)} ${y(value)}`);
          startControlPointX = x(index);
          startControlPointY = y(array[index]);
        } else {
          startTheta =
            Math.atan2(
              y(array[index - 1]) - y(array[index + 1]),
              x(index - 1) - x(index + 1)
            ) + Math.PI;
          startDistance =
            Math.sqrt(
              Math.pow(y(array[index - 1]) - y(array[index + 1]), 2) +
                Math.pow(x(index - 1) - x(index + 1), 2)
            ) * CONTROL_RATIO;
          startControlPointX = x(index) + Math.cos(startTheta) * startDistance;
          startControlPointY =
            y(array[index]) + Math.sin(startTheta) * startDistance;
        }

        if (index === array.length - 2) {
          endControlPointX = x(index + 1);
          endControlPointY = y(array[index + 1]);
        } else {
          endTheta = Math.atan2(
            y(array[index]) - y(array[index + 2]),
            x(index) - x(index + 2)
          );
          endDistance =
            Math.sqrt(
              Math.pow(y(array[index]) - y(array[index + 2]), 2) +
                Math.pow(x(index) - x(index + 2), 2)
            ) * CONTROL_RATIO;
          endControlPointX = x(index + 1) + Math.cos(endTheta) * endDistance;
          endControlPointY =
            y(array[index + 1]) + Math.sin(endTheta) * endDistance;
        }

        pathStringArray.push(`L ${x(index)} ${y(value)}`);
        smoothPathStringArray.push(
          `C ${startControlPointX} ${startControlPointY} ${endControlPointX} ${endControlPointY} ${x(
            index + 1
          )} ${y(array[index + 1])}`
        );
        controlPointPathStringArray.push(
          `M ${x(index)} ${y(array[index])} 
           L ${startControlPointX} ${startControlPointY}`
        );
        controlPointPathStringArray.push(
          `M ${x(index + 1)} ${y(array[index + 1])}
        L ${endControlPointX} ${endControlPointY}`
        );
        console.log("index==============================", index);
        console.log("startTheta", startTheta);
        // console.log("startDistance", startDistance);
        console.log(
          "Math.cos(startTheta)",
          Math.round(Math.cos(Number(startTheta)))
        );
        console.log(
          "Math.sin(startTheta)",
          Math.round(Math.sin(Number(startTheta)))
        );
        console.log("endTheta", endTheta);
        console.log(
          "Math.cos(endTheta)",
          Math.round(Math.cos(Number(endTheta)))
        );
        console.log(
          "Math.sin(endTheta)",
          Math.round(Math.sin(Number(endTheta)))
        );
      });
      setPathString(pathStringArray.join(" "));
      setSmoothPathString(smoothPathStringArray.join(" "));
      setControlStartPointPathString(
        controlPointPathStringArray
          .map((value, index) => {
            if (index % 2 === 0) return value;
          })
          .join(" ")
      );
      setControlEndPointPathString(
        controlPointPathStringArray
          .map((value, index) => {
            if (index % 2 === 1) return value;
          })
          .join(" ")
      );

      const properties = new SvgPathProps.svgPathProperties(
        pathStringArray.join(" ")
      );
      pathLengthRef.current = properties.getTotalLength();

      const smoothPathProperties = new SvgPathProps.svgPathProperties(
        smoothPathStringArray.join(" ")
      );
      smoothPathLengthRef.current = smoothPathProperties.getTotalLength();
    }, [data]);

    useEffect(() => {
      // if (pathLengthRef.current !== -1) {
      setPathLength(pathLengthRef.current);
      // }
    }, [pathLengthRef]);

    useEffect(() => {
      if (smoothPathLengthRef.current !== -1) {
        setSmoothPathLength(smoothPathLengthRef.current);
      }
    }, [smoothPathLengthRef]);

    return (
      <Svg fill={"transparent"}>
        <AnimatedPath
          d={pathString}
          animatedProps={animatedProps}
          stroke={"#f88"}
          strokeWidth={2}
          strokeDasharray={pathLength}
        />
        <AnimatedPath
          d={smoothPathString}
          animatedProps={animatedProps}
          stroke={"#88f"}
          strokeWidth={2}
          strokeDasharray={smoothPathLength}
        />
        <Path d={controlStartPointPathString} stroke={"#add"} strokeWidth={4} />
        <Path d={controlEndPointPathString} stroke={"#dad"} strokeWidth={4} />
      </Svg>
    );
  };

  const CustomDot = ({ x, y, data }: ChildrenProps) => {
    return (
      <Svg fill={"transparent"}>
        {data?.map((value, index) => {
          return (
            <Circle
              key={index}
              cx={x(index)}
              cy={y(value)}
              fill={"#f66"}
              r={3}
              stroke={"#f66"}
            />
          );
        })}
      </Svg>
    );
  };

  return (
    <SafeAreaView
      style={{ ...appViewStyle.defaultRootView, backgroundColor: "white" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: spacing.m,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <YAxis
            style={{
              width: Y_AXIS_WIDTH,
              height: CHART_HEIGHT,
              paddingRight: spacing.xs,
            }}
            svg={{
              fill: "#1d1d1f",
            }}
            data={[...data.map((value) => value.value)]}
            numberOfTicks={4}
            formatLabel={(value) => (value === 0 ? "" : value)}
          />
          <LineChart
            ref={lineChartRef}
            style={{ flex: 1, height: CHART_HEIGHT }}
            data={[...data.map((value) => value.value)]}
            contentInset={{ top: 20, bottom: 4 }}
            svg={{
              // stroke: "black",
              stroke: "transparent",
              strokeWidth: 2,
            }}
          >
            <Grid />
            <CustomLine
              data={[...data.map((value) => value.value)]}
              setPathLength={setPathLength}
              setSmoothPathLength={setSmoothPathLength}
            />
            {/*<CustomDot />*/}
          </LineChart>
        </View>
        <XAxis
          style={{ paddingTop: spacing.s }}
          data={[...data.map((value) => value.index)]}
          contentInset={{
            left: Y_AXIS_WIDTH,
          }}
          svg={{
            fill: "#1d1d1f",
          }}
          numberOfTicks={6}
        />
      </View>
      <PressableWithFeedback
        title={"다시 그리기"}
        onPress={executePathAnim}
        alignTitleCenter={true}
        pressableStyle={{
          marginHorizontal: spacing.m,
          marginBottom: spacing.m,
        }}
      />
    </SafeAreaView>
  );
};

export default PathAnimationExampleScreen;
