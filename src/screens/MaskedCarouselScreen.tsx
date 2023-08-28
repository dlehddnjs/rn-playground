import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { appViewStyle } from "../styles/AppStyle";
import MaskedCarousel, {
  CarouselItemProps,
} from "../masked_carousel/MaskedCarousel";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { spacing } from "../styles/Spacing";

const MaskedCarouselScreen = () => {
  const data: CarouselItemProps[] = [
    {
      title: "브랜드 A 한정 특가",
      subTitle: "단독 최대 50% 할인",
      imgSrc: require("../images/img_0.jpg"),
    },
    {
      title: "HOT SUMMER 무제한 쿠폰팩",
      subTitle: "최대 20% 할인 쿠폰",
      imgSrc: require("../images/img_1.jpg"),
    },
    {
      title: "브랜드 B 23 S/S 시즌 오프",
      subTitle: "단독 최대 50% 할인",
      imgSrc: require("../images/img_2.jpg"),
    },
    {
      title: "브랜드 C 스페셜 위크",
      subTitle: "신상품 발매",
      imgSrc: require("../images/img_3.jpg"),
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={appViewStyle.defaultRootView}>
        <View
          style={{ flex: 1, justifyContent: "center", backgroundColor: "gray" }}
        >
          <MaskedCarousel data={data} height={300} />
          <Text style={{ marginTop: spacing.l, textAlign: "center" }}>
            {"Image by Pexels from Pixabay"}
          </Text>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default MaskedCarouselScreen;
