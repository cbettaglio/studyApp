import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Input, CheckBox } from "@rneui/themed";
import { ButtonGroup } from "@rneui/base";
import Modal from "react-native-modal";
const Stack = createNativeStackNavigator();
const navTheme = DefaultTheme;
navTheme.colors.background = "#E8FCCF";
// array for all quizzes
let quizArray = [
  {
    title: "Default",
    questions: [
      {
        prompt: "This is an input question",
        type: "input",
        answer: "Input",
      },
      {
        prompt: "This is a dropdown question",
        type: "drop-down",
        choices: ["choice1", "choice2", "choice3"],
        answer: "choice1",
      },
      {
        prompt: "This is a multiple choice question",
        type: "multiple-choice",
        choices: ["choice1", "choice2", "choice3"],
        answer: "choice2",
      },
    ],
  },
];
export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          initialParams={{
            quizDisplay: quizArray,
          }}
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={Quiz}
          initialParams={{
            userAnswers: [],
          }}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Summary"
          component={Summary}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Create a Quiz"
          component={CreateQuiz}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home({ route, navigation }) {
  // displays quizzes to home page
  const { quizDisplay } = route.params;
  return (
    <View>
      <Text style={styles.header}>Your quizzes:</Text>
      <FlatList
        // style={[styles.button, styles.buttonQuiz]}
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
  const [userAnswers, setUserAnswers] = useState(route.params.userAnswers);
  const [curAnswer, setCurAnswer] = useState("");
  let { prompt, type, choices } = questions[questionNum];
  let nextQuestion = () => {
    let nextQuestion = questionNum + 1;
    if (nextQuestion < questions.length) {
      // console.log("Going to next question...");
      // console.log({ questionNum: nextQuestion, questions: questions });
      // console.log("Question type:" + type);
      navigation.navigate("Quiz", {
        questionNum: nextQuestion,
        questions: questions,
        userAnswers,
      });
    } else {
      navigation.navigate("Summary", { userAnswers, questions });
    }
  };
  let questionType;
  if (type === "input") {
    questionType = <InputText handleAnswer={setCurAnswer}></InputText>;
  } else if (type === "drop-down") {
    questionType = (
      <DropDown choices={choices} handleAnswer={setCurAnswer}></DropDown>
    );
  } else {
    questionType = (
      <MultipleChoice
        choices={choices}
        handleAnswer={setCurAnswer}
      ></MultipleChoice>
    );
  }
  console.log("User answers array:" + userAnswers);
  return (
    <View>
      <Text>{prompt}</Text>
      {questionType}
      <Button
        title="submit"
        onPress={() => {
          setUserAnswers([...userAnswers, curAnswer]);
          nextQuestion();
        }}
      ></Button>
    </View>
  );
}

function InputText({ handleAnswer }) {
  let [answerText, setAnswerText] = useState("");
  return (
    <Input
      placeholder="Your answer"
      value={answerText}
      onChangeText={(value) => {
        setAnswerText(value);
        handleAnswer(value);
      }}
    ></Input>
  );
}

function DropDown({ choices, handleAnswer }) {
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
        setValue={(value) => {
          setValue(value);
          handleAnswer(value);
        }}
      />
    </>
  );
}

function MultipleChoice({ choices, handleAnswer }) {
  const [selectedIndex, setSelectedIndex] = useState();
  return (
    <ButtonGroup
      buttons={choices}
      vertical
      onPress={(value) => {
        setSelectedIndex(value);
        handleAnswer(choices[value]);
      }}
      selectedIndex={selectedIndex}
    ></ButtonGroup>
  );
}
function Summary({ navigation, route }) {
  const { userAnswers, questions } = route.params;
  let calculateCorrect = (userAnswer, answer) => {
    let correct = userAnswer == answer;
    return correct;
  };
  let totalScore = 0;
  for (let i = 0; i < questions.length; i++) {
    if (calculateCorrect(userAnswers[i], questions[i].answer)) {
      totalScore++;
    }
  }
  return (
    <View>
      <Text>{userAnswers}</Text>
      <Text>
        Your score: {totalScore} / {questions.length}
      </Text>
      <Button
        title="Home"
        onPress={() => navigation.navigate("Home", { userAnswers: [] })}
      ></Button>
    </View>
  );
}

function CreateQuiz({ navigation, route }) {
  let [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setIndex] = useState();
  const [questions, setQuestions] = useState([]);
  let [questionPrompt, setQuestionPrompt] = useState("");
  let [dropChoices, setDropChoices] = useState([]);
  let [multiChoices, setMultiChoices] = useState([]);
  let [inputAnswer, setInputAnswer] = useState("");
  let [choicesText, setChoicesText] = useState("");
  let questionType;
  let type;
  let questionObject;
  let [selectedIndex2, setSelectedIndex2] = useState();
  let formatDropChoices = dropChoices.map((value, index) => {
    return (
      <CheckBox
        key={index}
        title={value}
        checked={selectedIndex2 === index}
        onPress={() => setSelectedIndex2(index)}
      ></CheckBox>
    );
  });
  let formatMultiChoices = multiChoices.map((value, index) => {
    return (
      <CheckBox
        key={index}
        title={value}
        checked={selectedIndex2 === index}
        onPress={() => setSelectedIndex2(index)}
      ></CheckBox>
    );
  });
  if (selectedIndex === 0) {
    type = "input";
    questionType = (
      <>
        <Text>Enter Answer:</Text>
        <Input placeholder="Answer" onChangeText={setInputAnswer}></Input>
      </>
    );
    questionObject = {
      prompt: questionPrompt,
      type: type,
      answer: inputAnswer,
    };
  } else if (selectedIndex === 1) {
    type = "drop-down";
    questionType = (
      <>
        <Text>Enter choices:</Text>
        <Input placeholder="Add a choice" onChangeText={setChoicesText}></Input>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => {
            setDropChoices([...dropChoices, choicesText]);
            // console.log(dropChoices);
          }}
        >
          <Text style={styles.textStyle}>Add choice</Text>
        </Pressable>
        <Text>Choices: (Please mark which answer is correct)</Text>
        {formatDropChoices}
      </>
    );
    questionObject = {
      prompt: questionPrompt,
      type: type,
      choices: dropChoices,
      answer: selectedIndex2,
    };
  } else if (selectedIndex === 2) {
    type = "multiple-choice";
    questionType = (
      <>
        <Text>Enter choices:</Text>
        <Input placeholder="Add a choice" onChangeText={setChoicesText}></Input>
        {formatMultiChoices}
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setMultiChoices([...multiChoices, choicesText])}
        >
          <Text style={styles.textStyle}>Add choice</Text>
        </Pressable>
      </>
    );
    questionObject = {
      prompt: questionPrompt,
      type: type,
      choices: multiChoices,
      answer: selectedIndex2,
    };
  }
  let renderItem = ({ item }) => {
    // console.log("Returning flatlist...");
    // console.log(item.type);
    if (item.type !== "input") {
      return (
        <>
          <Text>{item.prompt}</Text>
          <Text>choices: {item.choices}</Text>
          <Text>answer: {item.choices[item.answer]}</Text>
        </>
      );
    } else {
      return (
        <>
          <Text>{item.prompt}</Text>
          <Text>answer: {item.answer}</Text>
        </>
      );
    }
  };
  return (
    <View>
      <Text>Enter quiz title</Text>
      <Input placeholder="Title..." onChangeText={setTitle}></Input>
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
              <Input
                placeholder="Question prompt"
                onChangeText={setQuestionPrompt}
              ></Input>
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
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setQuestions([...questions, questionObject]);
                  console.log(questions);
                  // clear the arrays
                  setDropChoices([]);
                  setMultiChoices([]);
                }}
              >
                <Text style={styles.textStyle}>Save Question</Text>
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
      <Text>Your questions:</Text>
      <FlatList data={questions} renderItem={renderItem}></FlatList>
      <Button
        title="Save"
        onPress={() => {
          let quiz = {
            title: title,
            questions: questions,
          };
          quizArray.push(quiz);
          // console.log("quiz just added:" + { quiz });
          // console.log("quiz array:" + { quizArray });
          navigation.navigate("Home", { quizDisplay: quizArray });
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  backgrounColor: {
    backgroundColor: "green",
  },
  buttonQuiz: {
    backgroundColor: "#134611",
    margin: 5,
  },
  header: {
    fontSize: 30,
    fontFamily: "Nunito-Regular",
    margin: 20,
    textAlign: "center",
  },
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
