import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import FastImage, { Source } from "react-native-fast-image";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export interface CarouselItemProps {
  imgSrc: ImageSourcePropType;
  title?: string;
  subTitle?: string;
}

export interface MaskedCarouselProps {
  data: CarouselItemProps[];
  height: number;
  width?: number;
  distanceRatioFromCenter?: number;
  titleBottomMargin?: number;
  subtitleBottomMargin?: number;
  titleTextStyle?: TextStyle;
  subtitleTextStyle?: TextStyle;
  carouselContainerStyle?: ViewStyle;
}

const MaskedCarouselStyles = StyleSheet.create({
  titleTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 25,
    position: "absolute",
    left: 0,
  },
  subtitleTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    position: "absolute",
    left: 0,
  },
});

const MaskedCarousel = ({
  data,
  height,
  width = SCREEN_WIDTH,
  titleTextStyle = undefined,
  subtitleTextStyle = undefined,
  carouselContainerStyle = undefined,
  distanceRatioFromCenter = 1.4,
  titleBottomMargin = 0.2,
  subtitleBottomMargin = 0.1,
}: MaskedCarouselProps) => {
  const offsetXValue = useSharedValue(0);
  const offsetXTextValue = useSharedValue(0);
  const opacityValue = useSharedValue(1);
  const startXValue = useSharedValue(0);
  const startXTextValue = useSharedValue(0);
  const isLeft = useSharedValue(false);
  const isRight = useSharedValue(false);

  const [centerImageIndex, setCenterImageIndex] = useState(0);
  const [indexForSide, setIndexForSide] = useState(0);
  const [isReleased, setIsReleased] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [preloadImages, setPreloadImages] = useState<Source[]>([]);

  const animatedStylesLeft = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      transform: [{ translateX: -width + offsetXValue.value }],
    };
  });
  const animatedStylesRight = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      transform: [{ translateX: width + offsetXValue.value }],
    };
  });

  const animatedTextCenter = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      transform: [
        { translateX: offsetXTextValue.value * distanceRatioFromCenter },
      ],
    };
  });
  const animatedSubTextCenter = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      transform: [{ translateX: offsetXValue.value }],
    };
  });
  const animatedTextLeft = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      transform: [
        {
          translateX: -width * distanceRatioFromCenter + offsetXTextValue.value,
        },
      ],
    };
  });
  const animatedSubTextLeft = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      transform: [{ translateX: -width + offsetXValue.value }],
    };
  });
  const animatedTextRight = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      transform: [
        {
          translateX: width * distanceRatioFromCenter + offsetXTextValue.value,
        },
      ],
    };
  });
  const animatedSubTextRight = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      height: height,
      width: width,
      transform: [{ translateX: width + offsetXValue.value }],
    };
  });

  useEffect(() => {
    FastImage.clearDiskCache();
    FastImage.clearMemoryCache();

    const uris: Source[] = data.map((image) => ({
      uri: Image.resolveAssetSource(image.imgSrc).uri,
    }));

    setPreloadImages([...uris]);

    FastImage.preload(uris);
  }, []);

  useEffect(() => {
    if (isImageLoaded) {
      offsetXValue.value = 0;
      startXValue.value = 0;
      offsetXTextValue.value = 0;
      startXTextValue.value = 0;
      setIndexForSide(centerImageIndex);
      setIsImageLoaded(false);
    }
  }, [isImageLoaded]);

  useAnimatedReaction(
    () => {
      return {
        imageOffset: offsetXValue.value,
        textOffset: offsetXTextValue.value,
      };
    },
    (data) => {
      if (isReleased) {
        startXValue.value = data.imageOffset;
        startXTextValue.value = data.textOffset;
      }
    },
    [isReleased]
  );

  useAnimatedReaction(
    () => {
      return offsetXValue.value;
    },
    (data) => {
      if (data < 0) {
        isRight.value = true;
        return;
      } else if (data > 0) {
        isLeft.value = true;
        return;
      } else {
        isRight.value = false;
        isLeft.value = false;
      }
    },
    [offsetXValue.value]
  );

  const getLeftIndex = (index: number) => {
    return index - 1 < 0 ? data.length - 1 : index - 1;
  };

  const getRightIndex = (index: number) => {
    return index + 1 === data.length ? 0 : index + 1;
  };

  const dragGesture = Gesture.Pan()
    .onStart((_) => {
      runOnJS(setIsReleased)(false);
      opacityValue.value = 1;
    })
    .onUpdate((e) => {
      offsetXValue.value = startXValue.value + e.translationX;
      offsetXTextValue.value = startXTextValue.value + e.translationX;

      if (offsetXValue.value < -width) {
        offsetXValue.value = -width;
      } else if (offsetXValue.value > width) {
        offsetXValue.value = width;
      }

      if (offsetXTextValue.value < -width) {
        offsetXTextValue.value = -width;
      } else if (offsetXTextValue.value > width) {
        offsetXTextValue.value = width;
      }
    })
    .onEnd((e) => {
      runOnJS(setIsReleased)(true);
      if (Math.abs(e.velocityX) > 500) {
        if (e.velocityX > 0 && isLeft.value) {
          offsetXValue.value = withTiming(width, {}, (finished) => {
            if (finished) {
              isLeft.value = false;
              if (centerImageIndex - 1 < 0) {
                runOnJS(setCenterImageIndex)(data.length - 1);
              } else {
                runOnJS(setCenterImageIndex)(centerImageIndex - 1);
              }
            }
          });
          offsetXTextValue.value = withTiming(width * distanceRatioFromCenter);
          return;
        } else {
          offsetXValue.value = withTiming(0);
          offsetXTextValue.value = withTiming(0);
        }
        if (e.velocityX < 0 && isRight.value) {
          offsetXValue.value = withTiming(-width, {}, (finished) => {
            if (finished) {
              isRight.value = false;
              if (centerImageIndex + 1 === data.length) {
                runOnJS(setCenterImageIndex)(0);
              } else {
                runOnJS(setCenterImageIndex)(centerImageIndex + 1);
              }
            }
          });
          offsetXTextValue.value = withTiming(-width * distanceRatioFromCenter);
          return;
        } else {
          offsetXValue.value = withTiming(0);
          offsetXTextValue.value = withTiming(0);
        }
      } else {
        if (isLeft && offsetXValue.value > 0) {
          if (offsetXValue.value > width / 2) {
            offsetXValue.value = withTiming(width, {}, (finished) => {
              if (finished) {
                isLeft.value = false;
                if (centerImageIndex - 1 < 0) {
                  runOnJS(setCenterImageIndex)(data.length - 1);
                } else {
                  runOnJS(setCenterImageIndex)(centerImageIndex - 1);
                }
              }
            });
            offsetXTextValue.value = withTiming(
              width * distanceRatioFromCenter
            );
          } else {
            offsetXValue.value = withTiming(0);
            offsetXTextValue.value = withTiming(0);
          }
          return;
        }
        if (isRight && offsetXValue.value < 0) {
          if (offsetXValue.value < -width / 2) {
            offsetXValue.value = withTiming(-width, {}, (finished) => {
              if (finished) {
                isRight.value = false;
                if (centerImageIndex + 1 === data.length) {
                  runOnJS(setCenterImageIndex)(0);
                } else {
                  runOnJS(setCenterImageIndex)(centerImageIndex + 1);
                }
              }
            });
            offsetXTextValue.value = withTiming(
              -width * distanceRatioFromCenter
            );
          } else {
            offsetXValue.value = withTiming(0);
            offsetXTextValue.value = withTiming(0);
          }
          return;
        }
      }
    });

  return (
    <GestureDetector gesture={dragGesture}>
      <View
        style={{
          ...carouselContainerStyle,
          width: "100%",
          flexDirection: "row",
        }}
      >
        {/* CENTER IMAGE */}
        <View>
          <FastImage
            source={preloadImages[centerImageIndex]}
            onLoadEnd={() => {
              setIsImageLoaded(true);
            }}
            style={{
              height: height,
              width: width,
            }}
          />
        </View>

        {/* LEFT IMAGE */}
        <MaskedView
          style={{
            height: height,
            width: width,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          androidRenderingMode={"software"}
          maskElement={
            <Animated.View
              style={{
                ...animatedStylesLeft,
              }}
            >
              <View
                style={{
                  height: height,
                  width: width,
                  backgroundColor: "black",
                }}
              />
            </Animated.View>
          }
        >
          <FastImage
            source={preloadImages[getLeftIndex(indexForSide)]}
            style={{
              height: height,
              width: width,
            }}
          />
        </MaskedView>

        {/* RIGHT IMAGE */}
        <MaskedView
          style={{
            height: height,
            width: width,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          androidRenderingMode={"software"}
          maskElement={
            <Animated.View
              style={{
                ...animatedStylesRight,
              }}
            >
              <View
                style={{
                  height: height,
                  width: width,
                  backgroundColor: "black",
                }}
              />
            </Animated.View>
          }
        >
          <FastImage
            source={preloadImages[getRightIndex(indexForSide)]}
            style={{
              height: height,
              width: width,
            }}
          />
        </MaskedView>

        {/* CENTER TITLE, TEXT */}
        {data[centerImageIndex].title ? (
          <Animated.View
            style={{
              ...animatedTextCenter,
            }}
          >
            <Text
              style={{
                ...MaskedCarouselStyles.titleTextStyle,
                ...titleTextStyle,
                width: width,
                bottom: height * titleBottomMargin,
              }}
              allowFontScaling={false}
            >
              {data[centerImageIndex].title}
            </Text>
          </Animated.View>
        ): null}
        {data[centerImageIndex].subTitle ? (
          <Animated.View
            style={{
              ...animatedSubTextCenter,
            }}
          >
            <Text
              style={{
                ...MaskedCarouselStyles.subtitleTextStyle,
                ...subtitleTextStyle,
                width: width,
                bottom: height * subtitleBottomMargin,
              }}
              allowFontScaling={false}
            >
              {data[centerImageIndex].subTitle}
            </Text>
          </Animated.View>
        ): null}

        {/* LEFT TITLE, TEXT */}
        {data[getLeftIndex(indexForSide)].title ? (
          <Animated.View
            style={{
              ...animatedTextLeft,
            }}
          >
            <Text
              style={{
                ...MaskedCarouselStyles.titleTextStyle,
                ...titleTextStyle,
                width: width,
                bottom: height * titleBottomMargin,
              }}
              allowFontScaling={false}
            >
              {data[getLeftIndex(indexForSide)].title}
            </Text>
          </Animated.View>
        ) : null}
        {data[getLeftIndex(indexForSide)].subTitle ? (
          <Animated.View
            style={{
              ...animatedSubTextLeft,
            }}
          >
            <Text
              style={{
                ...MaskedCarouselStyles.subtitleTextStyle,
                ...subtitleTextStyle,
                width: width,
                bottom: height * subtitleBottomMargin,
              }}
              allowFontScaling={false}
            >
              {data[getLeftIndex(indexForSide)].subTitle}
            </Text>
          </Animated.View>
        ): null}

        {/* RIGHT TITLE, TEXT */}
        {data[getRightIndex(indexForSide)].title ? (
          <Animated.View
            style={{
              ...animatedTextRight,
            }}
          >
            <Text
              style={{
                ...MaskedCarouselStyles.titleTextStyle,
                ...titleTextStyle,
                width: width,
                bottom: height * titleBottomMargin,
              }}
              allowFontScaling={false}
            >
              {data[getRightIndex(indexForSide)].title}
            </Text>
          </Animated.View>
        ): null}
        {data[getRightIndex(indexForSide)].subTitle ? (
          <Animated.View
            style={{
              ...animatedSubTextRight,
            }}
          >
            <Text
              style={{
                ...MaskedCarouselStyles.subtitleTextStyle,
                ...subtitleTextStyle,
                width: width,
                bottom: height * subtitleBottomMargin,
              }}
              allowFontScaling={false}
            >
              {data[getRightIndex(indexForSide)].subTitle}
            </Text>
          </Animated.View>
        ): null}
      </View>
    </GestureDetector>
  );
};

export default MaskedCarousel;
