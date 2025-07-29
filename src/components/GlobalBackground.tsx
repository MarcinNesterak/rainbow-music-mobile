import React from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';

const GlobalBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageBackground
      source={require('../assets/images/tapeta.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  }
});

export default GlobalBackground; 