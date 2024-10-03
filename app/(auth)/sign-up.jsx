import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import ToastManager, { Toast } from 'toastify-react-native';

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    question: "",
    answer: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "" || form.question === "" || form.answer === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username, form.question, form.answer);
      setUser(result);
      setIsLogged(true);

      Toast.success("Signed up successfully");
      router.replace("/home");
    } catch (error) {
      Toast.error("Error signing up");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ToastManager />
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 pb-20"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[320px] h-[160px]"
          />

          <Text className="text-2xl font-semibold text-white mt-6 font-psemibold">
            Sign Up to <Text className="text-secondary-200 text-2xl"><Text className='text-blue-300'>Image</Text>Flux</Text>
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-8"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-6"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-6"
          />

          <Text className='font-pregular text-gray-100 mt-6'><Text className='text-red-500 font-psemibold text-base'>Note:</Text> This section will be necessary for changing password later on.</Text>

          <FormField
            title="Question"
            value={form.question}
            handleChangeText={(e) => setForm({ ...form, question: e })}
            otherStyles="mt-4"
          />

          <FormField
            title="Answer"
            value={form.answer}
            handleChangeText={(e) => setForm({ ...form, answer: e })}
            otherStyles="mt-6"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;