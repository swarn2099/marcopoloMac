import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

const Card = props => {
  let { children, backgroundImage, cardStyle, shadow, ...rest } = props;

  if (backgroundImage && typeof backgroundImage === 'string') {
    backgroundImage = {backgroundImage};
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
    shadowOffset: { width: 0, height: 15 },
    shadowColor: '#000000',
    shadowRadius: 20,
    shadowOpacity: 0.4,
  },
  card: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    borderColor: 'black',
    borderBottomColor: '#bbb',

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
    borderBottomColor: '#bbb',

  },
});

export default Card;
