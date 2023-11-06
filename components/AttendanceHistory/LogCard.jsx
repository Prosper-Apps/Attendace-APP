import { View, Text } from "react-native";
import React from "react";
import PropTypes from "prop-types";
import { COLORS } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const LogCard = ({ type, time }) => {
  return (
    <View
      style={{ backgroundColor: COLORS.primary }}
      className={`w-full flex-row h-16 rounded-xl py-2 px-4 justify-between items-center  ${
        type === "IN" ? " border-green-600" : "bg-red-400 "
      }`}
    >
      <Text className="text-white font-semibold">
        CHECKED {type} AT {time}
      </Text>
      <View
        className={`justify-between items-center rounded-full p-1 ${
          type === "IN" ? "bg-green-500" : "bg-red-500 "
        }`}
      >
        <MaterialCommunityIcons name="clock-check" color={"white"} size={30} />
      </View>
    </View>
  );
};

LogCard.propTypes = {
  type: PropTypes.string,
  time: PropTypes.string,
};

LogCard.defaultProps = {
  type: "OUT",
  time: "10:00 AM",
};

export default LogCard;