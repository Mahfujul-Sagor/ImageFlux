import { View, Text, Image, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../../components';
import { FontAwesome } from '@expo/vector-icons';
import { CompareSlider } from '@mahfujul-sagor/native-image-comparison-slider';
import { TouchableOpacity } from 'react-native';

import { icons, images } from '../../constants';

const { width } = Dimensions.get('window');

const Home = () => {
  const [checkedState, setCheckedState] = useState({
    enhance: false,
  });

  const toggleCheckbox = (key) => {
    setCheckedState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className='flex-1 px-4 pt-10'>
          <View>
            <View className='w-full h-[278px] border border-secondary-200/50 items-center justify-center rounded-lg'>
              <Image source={icons.upload}/>
            </View>
            {/* <View className='rounded-lg w-full overflow-hidden justify-center items-center'>
              <CompareSlider
                before={images.example}
                after={images.enhancedExample}
                containerSize={{ width: width, height: 278 }}
              />
            </View> */}
          </View>
          <View className='w-full items-center mt-10'>
            <TouchableOpacity
              className={`w-16 h-20 rounded-lg justify-center items-center ${
                checkedState.enhance ? 'bg-green-500' : 'bg-slate-600'
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