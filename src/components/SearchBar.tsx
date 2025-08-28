import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { BlurView } from '@react-native-community/blur';

const searchIconXml = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="gray"/></svg>`;

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.icon}>
        <SvgXml xml={searchIconXml} width="22" height="22" />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Szukaj piosenki..."}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 50,
    overflow: 'hidden', // Kluczowe dla BlurView
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
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
  icon: {
    marginRight: 10,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 17,
    color: '#000',
    zIndex: 1,
  },
});

export default SearchBar; 