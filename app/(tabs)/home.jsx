import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../../components";
import { FontAwesome } from "@expo/vector-icons";
import { CompareSlider } from "@mahfujul-sagor/native-image-comparison-slider";
import { TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import * as FileSystem from 'expo-file-system';
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions/resize";

import { icons, images } from "../../constants";
import ToastManager, { Toast } from "toastify-react-native";
import { CLOUDINARY_CLOUD_NAME } from "@env";
import {
  enhance,
  generativeRestore,
  upscale,
} from "@cloudinary/url-gen/actions/effect";

const { width } = Dimensions.get("window");

const Home = () => {
  const [checkedState, setCheckedState] = useState({
    enhance: true,
  });
  // Original image
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Uploaded image
  const [savedImageUri, setSavedImageUri] = useState(null);
  // TODO: add loader for transforming
  const [isTransforming, setIsTransforming] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [public_id, setPublicId] = useState(null);

  const toggleCheckbox = (key) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });

      console.log(result.assets[0]);

      if (!result.canceled) {
        setImageUri(result.assets[0]);
        Toast.success("Image selected!");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.error("Error picking image!");
    }
  };

  const generateEnhancedImage = useCallback(async (public_id) => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: CLOUDINARY_CLOUD_NAME,
      },
    });

    try {
      let transformedImage = cld.image(public_id);

      transformedImage = transformedImage.resize(
        Resize.fit().width(320).height(180)
      );
      console.log("image resized successfully");

      transformedImage = transformedImage.effect(upscale());
      console.log("image upscaled successfully");

      transformedImage = transformedImage.effect(enhance());
      console.log("image enhanced successfully");

      transformedImage = transformedImage.effect(generativeRestore());
      console.log("image generative restored successfully");

      return transformedImage.toURL();
    } catch (error) {
      console.error("Transformation failed: ", error);
      Toast.error("Transformation failed!");
      return null;
    }
  }, []);

  useEffect(() => {
    if (savedImageUri) {
      generateEnhancedImage(public_id).then((enhancedImage) => {
        setEnhancedImage(enhancedImage);
      });
    }
  }, [generateEnhancedImage]);

  const handleImageUpload = async (imageUri) => {
    if (!imageUri) {
      Toast.error("Please select an image first!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri.uri,
      type: imageUri.mimeType,
      name: imageUri.name,
    });
    formData.append("upload_preset", "production");

    try {
      const response = await fetch("http://192.168.0.106:8081/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        Toast.success("Uploaded successfully!");
        setSavedImageUri(result.data.secure_url);
        setPublicId(result.data.public_id);
        generateEnhancedImage(public_id).then((enhancedImage) => {
          setEnhancedImage(enhancedImage);
        });
      } else {
        const errorMessage = await response.text();
        console.error("Error uploading image: ", errorMessage);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast.error("Error uploading image!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ToastManager />
      <ScrollView>
        <View className="flex-1 px-4 pt-10">
          <View className="space-y-10">
            <Text className="text-2xl text-center text-gray-100 font-pmedium">
              {checkedState.enhance ? "Upload Image" : "Let's get started"}
            </Text>
            {checkedState.enhance ? (
              imageUri ? (
                <View className="rounded-lg w-full h-[320px] overflow-hidden justify-center items-center">
                  <CompareSlider
                    before={imageUri}
                    after={enhancedImage}
                    containerSize={{ width: width, height: 320 }}
                  />
                </View>
              ) : (
                <TouchableOpacity activeOpacity={0.6} onPress={pickImage}>
                  <View className="w-full h-[320px] border border-secondary-200/50 items-center justify-center rounded-lg">
                    <Image source={icons.upload} alt="upload" />
                  </View>
                </TouchableOpacity>
              )
            ) : (
              <View>
                <View className="h-[320px] items-center justify-center rounded-lg">
                  <Image source={images.empty} resizeMode="cover" alt="empty" />
                </View>
              </View>
            )}
            <View className="mt-10 items-center">
              {uploading ? (
                <ActivityIndicator size="large" color="#00ff00" />
              ) : (
                <CustomButton
                  title="Upload Image"
                  handlePress={() => handleImageUpload(imageUri)}
                  isLoading={uploading}
                  containerColor="bg-blue-400"
                  containerStyles="w-full"
                  textColor="text-white"
                />
              )}
            </View>
          </View>
          <View className="w-full items-center mt-10">
            <TouchableOpacity
              activeOpacity={0.6}
              className={`w-[70px] h-20 rounded-lg justify-center items-center ${
                checkedState.enhance ? "bg-green-500" : "bg-slate-500"
              }`}
              onPress={() => toggleCheckbox("enhance")}
            >
              <FontAwesome name="magic" color="white" size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
