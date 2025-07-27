import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PASTEL_RAINBOW = [
  '#FFC3A0', // Brzoskwiniowy
  '#FFD6A5', // Morelowy
  '#FDFFB6', // Pastelowy żółty
  '#CAFFBF', // Miętowy
  '#9BF6FF', // Błękitny
  '#A0C4FF', // Lawendowy niebieski
  '#BDB2FF', // Pastelowy fiolet
  '#FFADAD', // Koralowy róż
];

const GlobalBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient
      colors={PASTEL_RAINBOW}
      style={styles.gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GlobalBackground; 