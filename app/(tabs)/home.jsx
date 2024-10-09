import { View, Text, Image, ScrollView, Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, TransformLoader } from "../../components";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { CompareSlider } from "@mahfujul-sagor/native-image-comparison-slider";
import { TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import ToastManager, { Toast } from "toastify-react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ToastAndroid } from 'react-native';
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions/resize";
import {
  enhance,
  generativeRestore,
  upscale,
} from "@cloudinary/url-gen/actions/effect";
import { icons, images } from "../../constants";
import { generateRandomString } from "../../lib/utils";
import { useGlobalContext } from "../../context/GlobalProvider";
import { CLOUDINARY_CLOUD_NAME, API_BASE_URL } from "@env";

const { width } = Dimensions.get("window");

const Home = () => {
  const { session } = useGlobalContext();  

  const [checkedState, setCheckedState] = useState({
    enhance: true,
  });
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedImageUri, setSavedImageUri] = useState(null);
  const [public_id, setPublicId] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);

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

      if (!result.canceled) {
        setImageUri(result.assets[0]);
        Toast.success("Image selected!");
        await handleImageUpload(result.assets[0]);
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

      const transformedUrl = transformedImage.toURL();
      return transformedUrl;
    } catch (error) {
      console.error("Transformation failed: ", error);
      Toast.error("Transformation failed!");
      return null;
    }
  }, []);

  useEffect(() => {
    if (savedImageUri && public_id) {
      generateEnhancedImage(public_id).then((enhancedImage) => {
        setEnhancedImage(enhancedImage);
      });
    }
  }, [generateEnhancedImage, public_id, savedImageUri]);

  const handleImageUpload = async (imageUri) => {
    if (!imageUri) {
      Toast.error("Please select an image first!");
      return;
    }

    setUploading(true);

    const userId = session?.userId;

    if (!userId) {
      Toast.error("Session ID is missing or invalid!");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri.uri,
      type: imageUri.mimeType,
      name: imageUri.name,
    });
    formData.append("upload_preset", "production");

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${userId}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        Toast.success("Uploaded successfully!");

        setSavedImageUri(result.data.secure_url);
        setPublicId(result.data.public_id);

        generateEnhancedImage(result.data.public_id).then((enhancedImage) => {
          setEnhancedImage(enhancedImage);
        });
      } else {
        const errorMessage = await response.text();
        console.error(`HTTP error! Status: ${response.status}`, errorMessage);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast.error("Error uploading image!");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (public_id) => {
    if (!public_id) {
      Toast.error("Please select an image first!");
      return;
    }

    setDeleting(true);

    try {
      const userId = session?.userId;

      const response = await fetch(`${API_BASE_URL}/api/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${userId}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id }),
      });

      if (response.ok) {
        Toast.success("Deleted successfully!");
        setSavedImageUri(null);
        setPublicId(null);
        setEnhancedImage(null);
        setImageUri(null);
      } else {
        const errorMessage = await response.text();
        console.error(`HTTP error! Status: ${response.status}`, errorMessage);
        Toast.error("Error deleting image!");
      }
    } catch (error) {
      console.log("Error deleting image: ", error);
      Toast.error("Error deleting image!");
    } finally {
      setDeleting(false);
    }
  };

  const handleImageDownload = async (url) => {
    try {
      const randomString = generateRandomString(7);
      const fileUri = `${FileSystem.documentDirectory}ImageFlux-AI-${randomString}.jpg`;
  
      // Download the file to app storage
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      console.log('Image downloaded to:', uri);
      
      // Share it so the user can save it in their preferred location
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
        ToastAndroid.show('Image saved!', ToastAndroid.SHORT);
      } else {
        console.log("Sharing isn't available on this device");
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      ToastAndroid.show('Error downloading image!', ToastAndroid.SHORT);
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
              uploading ? (
                <View className="rounded-lg w-full h-[320px] overflow-hidden justify-center items-center">
                  <TransformLoader
                    isLoading={uploading}
                    text="Uploading..."
                    background="bg-blue-500"
                  />
                </View>
              ) : imageUri ? (
                <>
                  {deleting ? (
                    <View className="rounded-lg w-full h-[320px] overflow-hidden justify-center items-center">
                      <TransformLoader
                        isLoading={deleting}
                        text="Deleting..."
                        background="bg-red-500"
                      />
                    </View>
                  ) : (
                    <View className="rounded-lg w-full h-[320px] overflow-hidden justify-center items-center">
                      <CompareSlider
                        before={imageUri}
                        after={enhancedImage}
                        containerSize={{ width: width, height: 320 }}
                      />
                    </View>
                  )}
                  <View className="mt-10 flex-row items-center justify-evenly ">
                    <CustomButton
                      title={
                        <MaterialIcons
                          name="delete-outline"
                          color="white"
                          size={25}
                        />
                      }
                      handlePress={() => handleImageDelete(public_id)}
                      isLoading={deleting}
                      containerColor="bg-red-500"
                      textColor="text-white"
                      containerStyles="w-[62px]"
                    />
                    <CustomButton
                      title={
                        <Feather name="download" color="white" size={25} />
                      }
                      handlePress={() => handleImageDownload(enhancedImage)}
                      isLoading={uploading}
                      containerColor="bg-blue-500"
                      textColor="text-white"
                      containerStyles="w-[62px]"
                    />
                  </View>
                </>
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
