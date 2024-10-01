import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { Link } from 'expo-router';

const index = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className='text-white'>Hello world!</Text>
      <Link href='home'><Text className='text-white underlined'>Go to home page</Text></Link>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  )
}

export default index;