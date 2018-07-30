import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const Button = props => {
  let { children, style, textStyle, ...rest } = props;

  return (
    <TouchableOpacity {...rest}>
      <View style={[styles.button, style]}>
        <Text style={[styles.buttonText, textStyle]}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007aff',
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Button;
