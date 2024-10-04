import { View, Text, Image, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../../components';
import { FontAwesome } from '@expo/vector-icons';
import { CompareSlider } from '@mahfujul-sagor/native-image-comparison-slider';
import { TouchableOpacity } from 'react-native';

import { icons, images } from '../../constants';
import ToastManager, { Toast } from 'toastify-react-native';

const { width } = Dimensions.get('window');

const Home = () => {
  const [checkedState, setCheckedState] = useState({
    enhance: true,
  });

  const toggleCheckbox = (key) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    Toast.success(`Selected ${key} option`);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ToastManager/>
      <ScrollView>
        <View className='flex-1 px-4 pt-10'>
          <View className='space-y-10'>
            <Text className="text-2xl text-center text-gray-100 font-pmedium">
              {checkedState.enhance ? 'Upload Image' : "Let's get started"}
            </Text>
            {checkedState.enhance ? (
              <TouchableOpacity activeOpacity={0.6} >
                <View className='w-full h-[320px] border border-secondary-200/50 items-center justify-center rounded-lg'>
                  <Image source={icons.upload}/>
                </View>
                {/* <View className='rounded-lg w-full overflow-hidden justify-center items-center'>
                  <CompareSlider
                    before={images.example}
                    after={images.enhancedExample}
                    containerSize={{ width: width, height: 320 }}
                  />
                </View> */}
              </TouchableOpacity>
            ) : (
              <View>
                <View className='h-[320px] items-center justify-center rounded-lg'>
                  <Image source={images.empty} resizeMode='cover'/>
                </View>
              </View>
            )}
          </View>
          <View className='w-full items-center mt-10'>
            <TouchableOpacity
              activeOpacity={0.6}
              className={`w-[70px] h-20 rounded-lg justify-center items-center ${
                checkedState.enhance ? 'bg-green-500' : 'bg-slate-500'
              }`}
              onPress={() => toggleCheckbox('enhance')}
            >
              <FontAwesome
                name='magic'
                color='white'
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home;