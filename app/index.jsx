import { View, Text, Image, ScrollView, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompareSlider } from '@mahfujul-sagor/native-image-comparison-slider';
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const { width } = Dimensions.get('window');

const index = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={loading} />

      <ScrollView>
        <View className="flex-1 px-4 pb-8">
          <View className="flex-row justify-center items-center">
            <Image
              source={images.logo}
              className="w-[320px] h-[160px]"
              resizeMode="contain"
            />
          </View>
          <View className='rounded-lg w-full overflow-hidden justify-center items-center'>
            <CompareSlider
              before={images.example}
              after={images.enhancedExample}
              containerSize={{ width: width, height: 300 }}
            />
          </View>
          <View className="relative mt-6">
            <Text className="text-2xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200"><Text className='text-blue-300'>Image</Text>Flux</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[160px] h-[15px] absolute -bottom-2 -right-6"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-6 text-center">
            <Text className='font-psemibold'>Transform low-res portrait images into stunning high-res masterpieces with cutting-edge AI technology.</Text> Weather it's upscaling, enhancing or restoring, we brign your images to life!
          </Text>

          <CustomButton
            title="Start Enhancing Now!"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-8"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default index;
