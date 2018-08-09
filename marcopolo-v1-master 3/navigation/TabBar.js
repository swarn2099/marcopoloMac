// import React from 'react';
// import { Animated, StyleSheet } from 'react-native';
// import { BlurView } from 'expo';
// import { TabBarBottom } from 'react-navigation';
//
// export default class TabBar extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       offset: new Animated.Value(0),
//     };
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (this.props.hidden !== nextProps.hidden) {
//       Animated.spring(this.state.offset, {
//         toValue: nextProps.hidden ? 100 : 0,
//         useNativeDriver: true,
//       }).start();
//     }
//   }
//
//   render() {
//     let { hidden, ...rest } = this.props;
//     let { offset } = this.state;
//
//     return (
//       <Animated.View
//         style={{
//           ...StyleSheet.absoluteFillObject,
//           top: undefined,
//           bottom: 0,
//           transform: [
//             {
//               translateY: offset,
//             },
//           ],
//         }}
//       >
//         <BlurView
//           intensity={100}
//           tint="light"
//           pointerEvents={hidden ? 'none' : 'auto'}
//         >
//           // <TabBarBottom {...rest} />
//         </BlurView>
//       </Animated.View>
//     );
//   }
// }
