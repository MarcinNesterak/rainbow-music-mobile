import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const plusIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const AddPlaylistButton = ({ onPress, style }: { onPress: () => void, style?: object }) => {
  return (
    <TouchableOpacity style={[styles.addButtonItem, style]} onPress={onPress}>
      <SvgXml xml={plusIcon} width="24" height="24" />
      <Text style={styles.addButtonTitle}>Dodaj playlistę</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButtonItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addButtonTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default AddPlaylistButton;
