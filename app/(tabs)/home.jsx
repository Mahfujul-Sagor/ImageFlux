import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className='text-white'>Home Page</Text>
    </SafeAreaView>
  )
}

export default Home;