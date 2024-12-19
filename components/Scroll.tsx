import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const PlanOptions = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleOptionPress = (option: string) => {
    if (option === 'Quick Plans' && pathname !== '/screens/quickplans') {
      router.push('/screens/quickplans');
    } else if (option === 'Home' && pathname !== '/screens/planner') {
      router.push('/screens/planner');
    }
  };

  return (
    <View style={styles.optionsContainer}>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionPress('Home')}
      >
        <Text style={[
          styles.optionText,
          pathname === '/screens/planner' && styles.activeOption
        ]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionPress('Quick Plans')}
      >
        <Text style={[
          styles.optionText,
          pathname === '/screens/quickplans' && styles.activeOption
        ]}>
          Quick Plans
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionPress('Oct (2)')}
      >
        <Text style={styles.optionText}>Oct (2)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionPress('Nov (3)')}
      >
        <Text style={styles.optionText}>Nov (3)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingLeft: 20,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  optionText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'RobotoMedium',
    paddingBottom: 4,
  },
  activeOption: {
    borderBottomWidth: 2,
    borderBottomColor: '#008080',
    color: '#008080',
  }
});

export default PlanOptions;
