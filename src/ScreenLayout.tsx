// // ScreenLayout.tsx
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import Navbar from '../src/screens/home/componant/BottomNavBar';  // Adjust the path as necessary
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../src/navigation/types';

// // ScreenLayout.tsx
// type ScreenLayoutProps = {
//     children: React.ReactNode;
//     navigation: StackNavigationProp<RootStackParamList, 'Home'>;
//   };
  
//   const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, navigation }) => {
//     return (
//       <View style={styles.container}>
//         <Navbar navigation={navigation} />
//         <View style={styles.content}>{children}</View>  {/* This will render the children passed to the layout */}
//       </View>
//     );
//   };
  

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     paddingTop: 50,  // Adjust for navbar height
//   },
// });

// export default ScreenLayout;
