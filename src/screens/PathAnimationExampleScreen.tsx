import React, { Dispatch, useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { spacing } from "../styles/Spacing";
import Svg, { G, Line, Path } from "react-native-svg";
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

const PathAnimationExampleScreen = () => {
  const Y_AXIS_WIDTH = 24;
  const CHART_HEIGHT = 300;
  const DATA_LENGTH = 10;

  const [data, setData] = useState<ChartData[]>([]);
  const [pathLength, setPathLength] = useState(0);
  const [smoothPathLength, setSmoothPathLength] = useState(0);

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
        value: Math.round(Math.random() * 100),
      });
    }
    // tmpArray.push({
    //   index: 0,
    //   value: 0,
    // });
    // tmpArray.push({
    //   index: 1,
    //   value: 50,
    // });
    // tmpArray.push({
    //   index: 2,
    //   value: 10,
    // });
    // tmpArray.push({
    //   index: 3,
    //   value: 50,
    // });
    // tmpArray.push({
    //   index: 4,
    //   value: 0,
    // });
    // tmpArray.push(
    //   { index: 0, value: 16 },
    //   { index: 1, value: 79 },
    //   { index: 2, value: 14 },
    //   { index: 3, value: 72 },
    //   { index: 4, value: 70 },
    //   { index: 5, value: 85 },
    //   { index: 6, value: 97 }
    // );
    console.log("data", tmpArray);
    setData([...tmpArray]);
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

        pathStringArray.push(`L ${x(index)} ${y(value)}`);
        // // smoothPathStringArray.push(`L ${x(index)} ${y(value)}`);
        // startTheta =
        //   Math.atan2(
        //     y(array[index - 1]) - y(array[index + 1]),
        //     x(index - 1) - x(index + 1)
        //   ) + Math.PI;
        // endTheta = Math.atan2(
        //   y(array[index]) - y(array[index + 2]),
        //   x(index) - x(index + 2)
        // );
        // startDistance =
        //   Math.sqrt(
        //     Math.pow(y(array[index - 1]) - y(array[index + 1]), 2) +
        //       Math.pow(x(index - 1) - x(index + 1), 2)
        //   ) * CONTROL_RATIO;
        // endDistance =
        //   Math.sqrt(
        //     Math.pow(y(array[index]) - y(array[index + 2]), 2) +
        //       Math.pow(x(index) - x(index + 2), 2)
        //   ) * CONTROL_RATIO;
        // startControlPointX =
        //   x(index - 1) + Math.round(Math.cos(startTheta)) * startDistance;
        // startControlPointY =
        //   y(array[index - 1]) +
        //   Math.round(Math.sin(startTheta)) * startDistance;
        // endControlPointX =
        //   x(index) + Math.round(Math.cos(endTheta)) * endDistance;
        // endControlPointY =
        //   y(value) + Math.round(Math.sin(endTheta)) * endDistance;
        if (index === 3) {
          console.log("x(index)", x(index - 1));
          console.log("y(array[index - 1])", y(array[index - 1]));
          console.log("x(index)", x(index + 1));
          console.log("y(array[index - 1])", y(array[index + 1]));
          console.log("startTheta", startTheta);
          console.log("startDistance", startDistance);
          console.log(
            "Math.cos(startTheta)",
            Math.round(Math.cos(Number(startTheta)))
          );
          console.log(
            "Math.sin(startTheta)",
            Math.round(Math.sin(Number(startTheta)))
          );
          console.log("startControlPointX", startControlPointX);
          console.log("startControlPointY", startControlPointY);
        }

        // // smoothPathStringArray.push(
        // //   `C ${Math.cos(startTheta)} ${Math.sin(startTheta)} ${Math.cos(
        // //     endTheta
        // //   )} ${Math.sin(endTheta)} ${x(index)} ${y(value)}`
        // // );
        //
        // smoothPathStringArray.push(
        //   `C ${startControlPointX} ${startControlPointY} ${endControlPointX} ${endControlPointY} ${x(
        //     index
        //   )} ${y(value)}`
        // );
        // controlPointPathStringArray.push(
        //   `M ${x(index - 1)} ${y(array[index - 1])}
        //    L ${startControlPointX} ${startControlPointY}`
        // );
        // controlPointPathStringArray.push(
        //   `M ${x(index)} ${y(array[index])}
        // L ${endControlPointX} ${endControlPointY}`
        // );
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
      if (pathLengthRef.current !== -1) {
        setPathLength(pathLengthRef.current);
      }
    }, [pathLengthRef]);

    useEffect(() => {
      if (smoothPathLengthRef.current !== -1) {
        setSmoothPathLength(smoothPathLengthRef.current);
      }
    }, [smoothPathLengthRef]);

    return (
      <Svg fill={"transparent"}>
        {/*<AnimatedPath*/}
        {/*  d={pathString}*/}
        {/*  animatedProps={animatedProps}*/}
        {/*  stroke={"#f88"}*/}
        {/*  strokeWidth={2}*/}
        {/*  strokeDasharray={pathLength}*/}
        {/*/>*/}
        <AnimatedPath
          d={smoothPathString}
          animatedProps={animatedProps}
          stroke={"#88f"}
          strokeWidth={2}
          strokeDasharray={smoothPathLength}
        />
        {/*<Path d={controlStartPointPathString} stroke={"#add"} strokeWidth={4} />*/}
        {/*<Path d={controlEndPointPathString} stroke={"#dad"} strokeWidth={4} />*/}
      </Svg>
    );
  };

  const AxisLine = () => (
    <G>
      {/* X Axis */}
      <Line x1="0%" x2="100%" y1="100%" y2="100%" stroke="#000" />
      {/* Y Axis */}
      <Line x1="0%" x2="0%" y1="0%" y2="100%" stroke="#000" />
    </G>
  );

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
            style={{ flex: 1, height: CHART_HEIGHT }}
            data={[...data.map((value) => value.value)]}
            contentInset={{ top: 20 }}
            svg={{
              stroke: "transparent",
              strokeWidth: 2,
            }}
            numberOfTicks={4}
          >
            <AxisLine />
            <Grid />
            <CustomLine
              data={[...data.map((value) => value.value)]}
              setPathLength={setPathLength}
              setSmoothPathLength={setSmoothPathLength}
            />
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
