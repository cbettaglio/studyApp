import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Input, CheckBox } from "@rneui/themed";
import { ButtonGroup } from "@rneui/base";
import Modal from "react-native-modal";
const Stack = createNativeStackNavigator();
let quizzes = [
  {
    title: "Default",
    key: 1,
    questions: [
      {
        prompt: "This is an input question",
        type: "input",
        answer: "Input answer",
      },
      {
        prompt: "This is a dropdown question",
        type: "drop-down",
        choices: ["choice1", "choice2", "choice3"],
        answer: "dropdown",
      },
      {
        prompt: "This is a multiple choice question",
        type: "multiple-choice",
        choices: ["choice1", "choice2", "choice3"],
        answer: "choices",
      },
    ],
  },
];
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          initialParams={{
            quizDisplay: quizzes,
          }}
          name="Home"
          component={Home}
        />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Summary" component={Summary} />
        <Stack.Screen name="Create a Quiz" component={CreateQuiz} />
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
        data={quizDisplay}
        renderItem={({ item }) => {
          return (
            <Button
              title={item.title}
              onPress={() =>
                navigation.navigate("Quiz", {
                  questions: item.questions,
                  questionNum: 0,
                })
              }
            ></Button>
          );
        }}
      ></FlatList>
      <Button
        title="Create a Quiz"
        onPress={() => navigation.navigate("Create a Quiz")}
      ></Button>
    </View>
  );
}
function Quiz({ route, navigation }) {
  const { questions, questionNum } = route.params;
  let { prompt, type, choices } = questions[questionNum];
  let nextQuestion = () => {
    let nextQuestion = questionNum + 1;
    if (nextQuestion < questions.length) {
      console.log("Going to next question...");
      console.log({ questionNum: nextQuestion, questions: questions });
      console.log("Question type:" + type);
      navigation.navigate("Quiz", {
        questionNum: nextQuestion,
        questions: questions,
      });
    } else {
      navigation.navigate("Summary");
    }
  };
  let questionType;
  if (type === "input") {
    questionType = <InputText></InputText>;
  } else if (type === "drop-down") {
    questionType = <DropDown choices={choices}></DropDown>;
  } else {
    questionType = <MultipleChoice choices={choices}></MultipleChoice>;
  }

  return (
    <View>
      <Text>{prompt}</Text>
      {questionType}
      <Button title="submit" onPress={nextQuestion}></Button>
    </View>
  );
}

function InputText() {
  return <Input placeholder="Your answer"></Input>;
}

function DropDown({ choices }) {
  console.log(choices);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const items = choices.map((choices) => {
    return {
      label: choices,
      value: choices,
    };
  });

  return (
    <>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
      />
    </>
  );
}

function MultipleChoice({ choices }) {
  const [selectedIndex, setSelectedIndex] = useState();
  return (
    <ButtonGroup
      buttons={choices}
      vertical
      onPress={(value) => setSelectedIndex(value)}
      selectedIndex={selectedIndex}
    ></ButtonGroup>
  );
}
function Summary({ navigation }) {
  return (
    <View>
      <Button title="Home" onPress={() => navigation.navigate("Home")}></Button>
    </View>
  );
}

function CreateQuiz({ navigation }) {
  let [title, setTitle] = useState("");
  return (
    <View>
      <Text>Enter quiz title</Text>
      <Input placeholder="Title..." onChangeText={setTitle}></Input>
      <Questions></Questions>
      <Button title="Save" onPress={() => {}}></Button>
    </View>
  );
}

function Questions() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setIndex] = useState();
  let questions = [];
  let [dropChoices, setDropChoices] = useState([]);
  let [multiChoices, setMultiChoices] = useState([]);
  let [choicesText, setChoicesText] = useState("");
  let questionType;
  if (selectedIndex === 0) {
    questionType = (
      <>
        <Text>Enter Answer:</Text>
        <Input placeholder="Answer"></Input>
      </>
    );
  } else if (selectedIndex === 1) {
    questionType = (
      <>
        <Text>Enter choices:</Text>
        <Text>{dropChoices}</Text>
        <Input placeholder="Add a choice" onChangeText={setChoicesText}></Input>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setDropChoices([...dropChoices, choicesText])}
        >
          <Text style={styles.textStyle}>Add choice</Text>
        </Pressable>
      </>
    );
  } else if (selectedIndex === 2) {
    questionType = (
      <>
        <Text>Enter choices:</Text>
        <Text>{multiChoices}</Text>
        <Input placeholder="Add a choice" onChangeText={setChoicesText}></Input>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setMultiChoices([...multiChoices, choicesText])}
        >
          <Text style={styles.textStyle}>Add choice</Text>
        </Pressable>
      </>
    );
  }
  return (
    <>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Create a question</Text>
              <Input placeholder="Question prompt"></Input>
              <Text style={styles.modalText}>Question type:</Text>
              <CheckBox
                checked={selectedIndex === 0}
                onPress={() => setIndex(0)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title="Input"
              />
              <CheckBox
                checked={selectedIndex === 1}
                onPress={() => setIndex(1)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title="Drop Down"
              />
              <CheckBox
                checked={selectedIndex === 2}
                onPress={() => setIndex(2)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title="Multiple Chpice"
              />
              {questionType}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Add a question</Text>
        </Pressable>
      </View>
    </>
  );
}

function CreateInput() {
  return <Text>You chose input</Text>;
}
function CreateDropDown() {
  return <Text>You chose Drop Down</Text>;
}
function CreateMultipleChoice() {
  return <Text>You chose Drop Down</Text>;
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
