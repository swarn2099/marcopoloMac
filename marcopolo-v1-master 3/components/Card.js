import React from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  Elevation,
  TouchableWithoutFeedback,
} from 'react-native';
import { Shadow } from 'expo';
import {BoxShadow} from 'react-native-shadow'
const Card = props => {
  let { children, backgroundImage, cardStyle, shadow, ...rest } = props;

  if (backgroundImage && typeof backgroundImage === 'string') {
    backgroundImage = { uri: backgroundImage };
  }

  return (
    <View style={shadow && styles.shadow}>
      <TouchableWithoutFeedback {...rest}>
        <View style={[styles.card, cardStyle]}>
          <View style={styles.cardContent}>{children}</View>
          {backgroundImage && (
            <Image
              style={styles.cardImage}
              resizeMode="cover"
              source={backgroundImage}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
     ios: {
       shadowOffset: { width: 0, height: 15 },
       shadowColor: '#000000',
       shadowRadius: 20,
       shadowOpacity: 0.4,
     },
     android: {
       elevation: 10,
     },
   }),
  },
  card: {
    flex: 1,
    ...Platform.select({
     ios: {
       paddingLeft: 10,
       paddingTop: 10,
       paddingRight: 10,
     },
     android: {
       elevation: 5,
       marginBottom: 10,
       paddingLeft: 0,
       paddingTop: 0,
       paddingRight: 0,
     },
   }),
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
  },
  cardContent: {
    flex: 1,
    zIndex: 1,



  },
});

export default Card;
