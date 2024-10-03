import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../../components';

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className='text-white text-4xl font-bold'>Home Page</Text>
    </SafeAreaView>
  )
}

export default Home;