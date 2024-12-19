import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  value: string;
  type?: 'email' | 'password';
  style?: StyleProp<ViewStyle>;
  onChangeText?: (text: string) => void;
};

export const CustomInput = ({
  type = 'email',
  value,
  onChangeText,
  style,
}: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, styles.shadow, style]}>
      <Ionicons
        name={type === 'email' ? 'mail-outline' : 'lock-closed-outline'}
        size={18}
      />
      <TextInput
        style={{ flex: 1 }}
        value={value}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        onChangeText={onChangeText}
        secureTextEntry={type === 'password' && !visible}
        placeholder={type === 'email' ? 'Email Address/Username' : 'Password'}
      />
      {type === 'password' && (
        <Pressable onPress={() => setVisible(!visible)}>
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={18}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
    gap: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
