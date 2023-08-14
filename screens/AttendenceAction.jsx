import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { WelcomeCard } from "../components/AttendenceAction";
import { Entypo } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import { getPreciseDistance } from "geolib";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCheckin,
  setCheckin,
  setCheckout,
} from "../redux/Slices/AttendenceSlice";
import Toast from "react-native-toast-message";
import { getOfficeLocation } from "../api/userApi";
const AttendenceAction = ({ navigation }) => {
  const dispatch = useDispatch();
  const checkin = useSelector(selectCheckin);
  const [isLoading, setIsLoading] = useState(true);
  const [dateTime, setDateTime] = useState(null);
  const [inTarget, setInTarget] = useState(false);
  const { employeeCode } = useSelector((state) => state.user.userDetails);
  const currentDate = new Date().toISOString();
  const radiusInMeters = 300;
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const userCords = {
        latitude,
        longitude,
      };
      getOfficeLocation(employeeCode)
        .then(({ latitude, longitude }) => {
          const targetLocation = {
            latitude: 11.791261756732942, // Convert to numbers
            longitude: 75.5905692699706, // Convert to numbers
          };
          // 11.791130806353708, 75.59082113912703 test coordinates ,
          const distance = getPreciseDistance(userCords, targetLocation);
          setInTarget(distance <= radiusInMeters);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          Toast.show({
            type: "error",
            text1: "OUT OF BOUND",
            text2: "Please make sure you are at work place",
          });
        });
    })();
  }, []);
  useEffect(() => {
    // Function to update the date and time in the specified format
    const updateDateTime = () => {
      const currentDate = new Date();
      const dateFormat = "d MMM yyyy @hh:mm a";
      const formattedDate = format(currentDate, dateFormat);
      setDateTime(formattedDate);
    };

    // Call the updateDateTime function initially
    updateDateTime();

    // Set up a recurring update every 30 seconds
    const intervalId = setInterval(updateDateTime, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  const handleCheckin = () => {
    dispatch(setCheckin({ checkinTime: currentDate, location: "Head Office" }));
    Toast.show({
      type: "success",
      text1: "✅ CHECKED IN",
    });
  };
  const handleChekout = () => {
    Alert.alert("Check out", "Are you sure you want to check out", [
      {
        text: "Cancel",
        onPress: () => {
          Toast.show({
            type: "success",
            text1: "CHECK-OUT CANCELLED",
          });
          return;
        },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch(setCheckout({ checkoutTime: currentDate }));
          Toast.show({
            type: "success",
            text1: "✅ CHECKED OUT",
          });
        },
      },
    ]);
  };
  return (
    <SafeAreaView className="flex-1 items-center bg-white">
      {/* chevron  */}
      <View style={{ width: "100%" }}>
        <View className="flex-row pb-4 pt-2 items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0  pb-4 pt-2 "
            onPress={() => navigation.goBack()}
          >
            <Entypo
              name="chevron-left"
              size={SIZES.xxxLarge - SIZES.xSmall}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View className="justify-self-center text-center">
            <Text className="text-lg font-medium">Attendence action</Text>
          </View>
        </View>
      </View>
      <View style={{ width: "100%" }} className="px-3">
        <WelcomeCard />
        <View className="h-72 mt-4">
          <View className="p-4">
            <Text className="text-lg text-gray-500 font-semibold">
              DATE AND TIME*
            </Text>
            <View className="flex-row items-end border-b border-gray-400 pb-2 mb-6 justify-between">
              <Text className="text-base font-medium text-gray-500">
                {dateTime}
              </Text>
              <MaterialCommunityIcons
                name="calendar-month"
                size={SIZES.xxxLarge}
              />
            </View>
            <Text className="text-lg text-gray-500 font-semibold">
              LOCATION*
            </Text>
            <View className="flex-row items-end border-b border-gray-400 pb-2 mb-4 justify-between">
              <Text className="text-base font-medium text-gray-500">
                {isLoading ? (
                  <View className="">
                    <ActivityIndicator size={"small"} />
                  </View>
                ) : inTarget ? (
                  "Head Office"
                ) : (
                  "Out of bound"
                )}
              </Text>
              <MaterialCommunityIcons
                name="map-marker"
                size={SIZES.xxxLarge - SIZES.xSmall}
              />
            </View>
            {checkin ? (
              <TouchableOpacity
                className={`justify-center ${
                  inTarget === false && `opacity-50`
                } items-center h-16 mt-4 rounded-2xl bg-red-500`}
                disabled={!inTarget}
                onPress={inTarget && handleChekout}
              >
                <Text className="text-xl font-bold text-white">CHECK-OUT</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`justify-center ${
                  inTarget === false && `opacity-50`
                } items-center h-16 mt-4 rounded-2xl bg-green-500`}
                disabled={!inTarget}
                onPress={inTarget && handleCheckin}
              >
                <Text className="text-xl font-bold text-white">CHECK-IN</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AttendenceAction;
