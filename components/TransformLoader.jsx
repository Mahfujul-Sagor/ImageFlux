import { View, ActivityIndicator, Dimensions, Platform, Text } from "react-native";

const TransformLoader = ({ isLoading, text, background }) => {
  const osName = Platform.OS;
  // const screenHeight = Dimensions.get("screen").height;
  const screenWidth = Dimensions.get("screen").width;

  if (!isLoading) return null;

  return (
    <View
      className={`absolute flex justify-center items-center w-full transition-colors duration-150 border border-secondary-200/50 ${background ? background : 'bg-primary'} rounded-lg z-10`}
      style={{
        height: 320,
        width: screenWidth,
      }}
    >
      <Text className='text-white font-medium'>
        {text}
      </Text>
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default TransformLoader;