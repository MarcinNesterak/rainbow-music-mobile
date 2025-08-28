import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { BlurView } from '@react-native-community/blur';

const plusIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const AddPlaylistButton = ({ onPress, style }: { onPress: () => void, style?: object }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.content}>
        <SvgXml xml={plusIcon} width="24" height="24" />
        <Text style={styles.addButtonTitle}>Dodaj playlistę</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default AddPlaylistButton;
