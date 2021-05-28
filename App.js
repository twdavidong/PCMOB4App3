import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

export default function App() {  // ======================== Start Default Function ========================
  return (
      <NavigationContainer>
        <Stack.Navigator mode="modal">
          <Stack.Screen component={ChatScreen} name="Chat by David OngTW" />
          <Stack.Screen 
                        component={LoginScreen}
                        name="Login"
                        options={{headerShown: false}}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }  // =============== End Default Function =============================

const styles = StyleSheet.create({ // Styles =============================
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    },
});
