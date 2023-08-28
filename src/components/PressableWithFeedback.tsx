import { Pressable, Text, ViewStyle } from "react-native";
import { spacing } from "../styles/Spacing";
import { appTextStyle } from "../styles/AppStyle";
import React, { Dispatch } from "react";

interface PressableWithFeedbackProps {
  title: string;
  onPress: Dispatch<void>;
  pressableStyle?: ViewStyle;
  alignTitleCenter?: boolean;
}
export const PressableWithFeedback = ({
  title,
  onPress,
  pressableStyle,
  alignTitleCenter = false,
}: PressableWithFeedbackProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#EEE" : "#FFF",
        },
        {
          padding: spacing.m,
          borderWidth: 1,
          borderRadius: 15,
        },
        pressableStyle,
      ]}
      onPress={() => onPress()}
    >
      <Text
        style={{
          ...appTextStyle.mainListTitle,
          textAlign: alignTitleCenter ? "center" : "left",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};
