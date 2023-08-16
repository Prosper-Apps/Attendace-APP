import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { WelcomeCard } from "../components/Login";
import { COLORS, SIZES } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { generateToken } from "../api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setSignIn } from "../redux/Slices/AuthSlice";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Formik } from "formik";
import { KeyboardAvoidingView } from "react-native";
import * as Yup from "yup";
const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username);
  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .min(5, "Too short!")
      .max(24, "Too Long!")
      .required("Please enter your password."),
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
      }}
      className="bg-gray-100 px-3 justify-between relative"
    >
      <WelcomeCard />
      <Formik
        initialValues={{
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={({ password }) => {
          generateToken({ username, password })
            .then(async (data) => {
              await AsyncStorage.setItem("access_token", data.access_token);
              await AsyncStorage.setItem("refresh_token", data.refresh_token);
              Toast.show({
                type: "success",
                text1: "✅ Login successfull",
              });
              dispatch(
                setSignIn({ isLoggedIn: true, token: data.access_token })
              );
            })
            .catch((msg) => {
              Toast.show({
                type: "error",
                text1: `❌  ${msg}`,
              });
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          isValid,
          setFieldTouched,
        }) => (
          <React.Fragment>
            <View style={{ width: "100%", marginTop: 30 }}>
              <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
                <TextInput
                  value={values.password}
                  onChangeText={handleChange("password")}
                  placeholder="enter password"
                  textContentType="password"
                  onBlur={() => setFieldTouched("password")}
                  style={{ marginTop: Platform.OS === "ios" ? -10 : 0 }}
                  className="max-w-xs h-12 text-lg"
                />
                <Ionicons
                  name="lock-closed"
                  size={SIZES.xLarge}
                  color={COLORS.gray2}
                />
              </View>
            </View>
            {touched.password && errors.password && (
              <View style={{ width: "100%" }} className="left-1 mt-1">
                <Text className="text-red-600 text-base">
                  {errors.password}
                </Text>
              </View>
            )}

            <View
              style={{ width: "100%", flex: 1, justifyContent: "flex-end" }}
            >
              <TouchableOpacity
                disabled={!isValid}
                onPress={handleSubmit}
                className={`h-16 rounded-xl justify-center items-center ${
                  !isValid && "opacity-70"
                }`}
                style={{ width: "100%", backgroundColor: COLORS.primary }}
              >
                <Text className="text-xl font-bold text-white">Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Qrscan")}
                className="border h-16 rounded-xl my-4 justify-center items-center bg-white"
                style={{ width: "100%", borderColor: COLORS.primary }}
              >
                <Text
                  className="text-xl font-semibold "
                  style={{ color: COLORS.primary }}
                >
                  Rescan code
                </Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Login;
