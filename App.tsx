import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { appViewStyle } from "./src/styles/AppStyle";
import "react-native-gesture-handler";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import MaskedCarouselScreen from "./src/screens/MaskedCarouselScreen";
import { spacing } from "./src/styles/Spacing";
import AnimatedSvgPathScreen from "./src/screens/AnimatedSvgPathScreen";
import { PressableWithFeedback } from "./src/components/PressableWithFeedback";
import PathAnimationExampleScreen from "./src/screens/PathAnimationExampleScreen";

export type AppStackParamList = {
  MainScreen: undefined;
  MaskedCarouselScreen: undefined;
  AnimatedSvgPathScreen: undefined;
  PathAnimationExampleScreen: undefined;
};

const AppStack = createStackNavigator<AppStackParamList>();

export type AppNavigationProps = StackScreenProps<
  AppStackParamList,
  keyof AppStackParamList
>;

const MainScreen = ({ navigation }: AppNavigationProps) => {
  return (
    <SafeAreaView style={appViewStyle.defaultRootView}>
      <Text style={{ padding: spacing.l, textAlign: "center", fontSize: 24 }}>
        RN playground
      </Text>
      <View style={{ gap: spacing.s, padding: spacing.m }}>
        <PressableWithFeedback
          title={"Masked carousel"}
          onPress={() => navigation.navigate("MaskedCarouselScreen")}
        />
        <PressableWithFeedback
          title={"SVG path animation"}
          onPress={() => navigation.navigate("AnimatedSvgPathScreen")}
        />
        <PressableWithFeedback
          title={"Example of SVG path animation"}
          onPress={() => navigation.navigate("PathAnimationExampleScreen")}
        />
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen
          name={"MainScreen"}
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name={"MaskedCarouselScreen"}
          component={MaskedCarouselScreen}
          options={{ headerTitle: "", headerLeftLabelVisible: false }}
        />
        <AppStack.Screen
          name={"AnimatedSvgPathScreen"}
          component={AnimatedSvgPathScreen}
          options={{ headerTitle: "", headerLeftLabelVisible: false }}
        />
        <AppStack.Screen
          name={"PathAnimationExampleScreen"}
          component={PathAnimationExampleScreen}
          options={{ headerTitle: "", headerLeftLabelVisible: false }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
