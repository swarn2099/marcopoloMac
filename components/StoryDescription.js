import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  Share,
  Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import { showLocation } from 'react-native-map-link';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import StoryCard from './storyCard';
import Button from './Button';

const StoryDescription = props => (
  <View
    style={[
      styles.container,
      !props.isAnimating && props.open && { backgroundColor: '#fff' },
    ]}
  >
    <ScrollView
      contentContainerStyle={props.isAnimating && styles.content}
      scrollEnabled={!props.isAnimating}
    >
      <StoryCard
        name={props.event.name}
        type={props.event.type}
        image={props.event.image}
        interested={props.event.interested}
        sponsored={props.event.sponsored}
        cardStyle={[
          props.open &&
            ifIphoneX({
              paddingTop: 50,
            }),
          Platform.OS === 'android' && {
            paddingTop: 35,
          },
          props.open
            ? styles.header
            : {
                position: 'absolute',
                top: props.dimensions.pageY,
                left: props.dimensions.pageX,
                width: props.dimensions.width,
                height: props.dimensions.height,
              },
          { height: props.height || props.dimensions.height },
        ]}
      />
      <View
        style={[
          styles.description,
          !props.open && {
            position: 'absolute',
            top: props.dimensions.pageY + props.dimensions.height,
            left: props.dimensions.pageX,
            width: props.dimensions.width,
            height: 0,
            padding: 0,
            paddingBottom: 0,
          },
        ]}
      >
        <Markdown style={markdownStyles}>
          {`**Here's the story**  \n
          \n\n${props.event.description}`}
        </Markdown>

        <View style={styles.buttons}>
          <Button
            style={{ backgroundColor: '#e9e9e9' }}
            textStyle={{ color: '#3d9cf5' }}
            onPress={() =>
              Share.share({
                title: 'Check out this Story',
                message: `Check out this story on marco/polo! "${
                  props.event.name
                }"`,
                url: 'http://getmarcopolo.co/',
              })
            }
          >
            Share
          </Button>
          {props.event.external && (
            <Button
              onPress={() => Linking.openURL(props.event.link)}
            >
              Read the Article
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
    <TouchableWithoutFeedback onPress={props.close}>
      <View
        style={[
          styles.closeButton,
          !props.open && { opacity: 0 },
          ifIphoneX({
            right: 30,
          }),
          Platform.OS === 'android' && {
            top: 35,
          },
        ]}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
);

const markdownStyles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  strong: {
    fontWeight: '900',
  },
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
  },
  header: {
    flex: 0,
    borderRadius: 0,
  },
  description: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    padding: 10,
    paddingBottom: 40,
  },
  closeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    borderRadius: 12,
    position: 'absolute',
    top: 15,
    right: 15,
    opacity: 0.85,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 10,
    fontWeight: '900',
  },
  buttons: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});

export default StoryDescription;
