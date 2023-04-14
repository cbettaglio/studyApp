import { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, ListItem, ButtonGroup } from "@rneui/themed";
const Stack = createNativeStackNavigator();
let quizzes = [
  {
    title: "Default",
    key: 1,
    questions: {
      prompt: "This is a input question",
      type: "input",
      answer: "Input answer",
    },
  },
];
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          intialParams={{
            quizDisplay: quizzes,
          }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          intialParams={{
            quizDisplay: quizzes,
          }}
          name="Quiz"
          component={Quiz}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home({ route, navigation }) {
  const { quizDisplay } = route.params;
  console.log(quizDisplay);
  return (
    <View>
      <Text>Your quizzes:</Text>
      <FlatList
        data={route.params}
        renderItem={({ item }) => {
          return (
            <Button
              title={item.title}
              onPress={() => navigation.navigate("Quiz")}
            ></Button>
          );
        }}
      ></FlatList>
    </View>
  );
}
function Quiz() {
  return (
    <View>
      <Text>Quiz!</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  },
});
