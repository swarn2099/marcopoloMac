import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Animated,
  LayoutAnimation,
  UIManager,

} from 'react-native';
import sleep from 'await-sleep';
import setStateAsync from '../helpers/setStateAsync';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import Card from './FeaturedCard';
import { ScrollView } from 'react-native-gesture-handler';

export default class AnimatedCard extends React.Component {
  constructor(props) {
    super(props);

    this._ref = null;

    this.state = {
      scale: new Animated.Value(1),
      animValues: {
        top: new Animated.Value(0),
        left: new Animated.Value(0),
        right: new Animated.Value(0),
        height: new Animated.Value(0),
      },
      open: false,
      isAnimating: false,
    };

    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  onPressIn() {
    Animated.spring(this.state.scale, {
      toValue: 0.95,
    }).start();
  }

  onPressOut() {
    Animated.spring(this.state.scale, {
      toValue: 1,
    }).start();
  }

  async onPress() {
    await (this.props.onCardOpen || (async () => {}))();

    this._ref
      .getNode()
      .measure(async (nodeX, nodeY, nodeWidth, nodeHeight, pageX, pageY) => {
        let { top, left, right, height } = this.state.animValues;
        top.setValue(nodeY);
        // left.setValue(nodeX);
        // right.setValue(nodeX);
        // height.setValue(nodeHeight);

        let animation = Animated.parallel([
          Animated.spring(top, {
            toValue: nodeY - pageY,
          }),
          // Animated.spring(left, {
          //   toValue: 0,
          //   damping: 14,
          //   stiffness: 100,
          //   mass: 0.7,
          // }),
          // Animated.spring(right, {
          //   toValue: 0,
          //   damping: 14,
          //   stiffness: 100,
          //   mass: 0.7,
          // }),
          // Animated.spring(height, {
          //   toValue: 550,
          //   damping: 14,
          //   stiffness: 100,
          //   mass: 0.7,
          // }),
        ]);

        await setStateAsync(this, () => ({
          open: true,
          isAnimating: true,
        }));

        await new Promise(r => animation.start(r));

        await setStateAsync(this, () => ({
          isAnimating: false,
        }));
      });
  }

  render() {
    let { innerKey, cardStyle, shadow, height, ...rest } = this.props;
    let { scale, open, isAnimating, animValues } = this.state;

    return [
      <Animated.View
        key={innerKey}
        ref={r => {
          this._ref = r;
        }}
        style={[
          styles.animatedCard,
          { height, transform: [{ scale }] },
          open && {
            position: 'absolute',
            top: 0,
            left: 0,
            height: 300,
            zIndex: 999,
            // top: animValues.top,
            // left: animValues.left,
            // right: animValues.right,
            // height: animValues.height,
            transform: [
              {
                translateY: animValues.top,
              },
            ],
          },
        ]}
      >
        <ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={{ flex: 1 }}
        >
          <Card
            {...rest}
            fillParent
            onPressIn={!open ? this.onPressIn : undefined}
            onPressOut={!open ? this.onPressOut : undefined}
            onPress={!open ? this.onPress : undefined}
            shadow={!open && shadow}
            height
            cardStyle={[
              cardStyle,
              open && { borderRadius: 0, ...StyleSheet.absoluteFillObject },
            ]}
          />
        </ScrollView>
      </Animated.View>,
      open && (
        <View
          key={innerKey + '-placeholder'}
          style={[styles.animatedCard, { height }]}
        />
      ),
    ];
  }
}

const styles = StyleSheet.create({
  animatedCard: {
    marginBottom: 35,
  },
});
