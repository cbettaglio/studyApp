import { useState, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Input, CheckBox, Icon, ListItem } from "@rneui/themed";
import { ButtonGroup } from "@rneui/base";
import Modal from "react-native-modal";

// Stack screens
const Stack = createNativeStackNavigator();
// creater new theme
const navTheme = DefaultTheme;
navTheme.colors.background = "#FFFEFE";
// import fonts
SplashScreen.preventAutoHideAsync();
async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync);
}

// functions for creating a responsive design
// src code: https://medium.com/simform-engineering/create-responsive-design-in-react-native-f84522a44365
const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;

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
  cacheFonts([FontAwesome.font]);
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
  const [fontsLoaded] = useFonts({
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  // displays quizzes to home page
  const { quizDisplay } = route.params;
  return (
    <View style={[styles.container]} onLayout={onLayoutRootView}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text style={[styles.header, { flexWrap: "wrap" }]}>Your quizzes:</Text>
        {/* <Image
          style={{
            width: 90,
            height: 102,
            marginLeft: horizontalScale(-15),
            margin: 35,
          }}
          source={require("../appComponents/assets/apple.png")}
        ></Image> */}
      </View>
      <FlatList
        style={{ height: "40%" }}
        // style={[styles.button, styles.buttonQuiz]}
        data={quizDisplay}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={[styles.button, styles.buttonQuiz]}
              onPress={() =>
                navigation.navigate("Quiz", {
                  quizTitle: item.title,
                  questions: item.questions,
                  questionNum: 0,
                })
              }
            >
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <Text style={styles.quizTextStyle}>{item.title}</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: horizontalScale(-72),
                  }}
                >
                  <Pressable
                    style={[{ margin: 40 }]}
                    onPress={() => console.log("pressed")}
                  >
                    <Icon name="edit" color="#FFFEFE"></Icon>
                  </Pressable>
                  <Pressable
                    style={[{ margin: 40 }]}
                    onPress={() => console.log("pressed")}
                  >
                    <Icon name="delete" color="#FFFEFE"></Icon>
                  </Pressable>
                </View>
              </View>
              <Text
                style={{
                  color: "white",
                  textAlign: "left",
                  fontSize: 15,
                  marginLeft: 40,
                  marginBottom: 20,
                }}
              >
                Total questions: {item.questions.length}
              </Text>
            </Pressable>
          );
        }}
      ></FlatList>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Pressable
          onPress={() => navigation.navigate("Create a Quiz")}
          style={styles.iconButton}
        >
          <Icon name="add" color="#FFFEFE" size={60}></Icon>
        </Pressable>
      </View>
    </View>
  );
}
function Quiz({ route, navigation }) {
  const { quizTitle, questions, questionNum } = route.params;
  const userAnswers = route.params.userAnswers;
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
        quizTitle,
        userAnswers: [...userAnswers, curAnswer],
      });
    } else {
      navigation.navigate("Summary", {
        userAnswers: [...userAnswers, curAnswer],
        questions,
        quizTitle,
      });
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
    <View style={styles.container}>
      <Text
        style={[
          styles.header,
          {
            textAlign: "center",
            marginTop: verticalScale(40),
            marginBottom: verticalScale(-40),
          },
        ]}
      >
        {quizTitle}
      </Text>
      <View
        style={[
          styles.questionContainer,
          {
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "auto",
            marginBottom: "auto",
            width: "85%",
            height: "40%",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            gap: 15,
          }}
        >
          <Text style={[styles.header2, { padding: 10 }]}>{prompt}</Text>
          {questionType}
          <Pressable
            style={{
              backgroundColor: "#134611",
              borderRadius: 20,
              padding: 12,
              elevation: 2,
              margin: 8,
            }}
            onPress={() => {
              nextQuestion();
            }}
          >
            <Text style={styles.textStyle}>Submit</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Pressable
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate("Home", { quizDisplay: quizArray })
          }
        >
          <Icon name="home" color="#FFFEFE" size={50}></Icon>
        </Pressable>
      </View>
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
// summary function intially provided by instrutor, adjusted for different question types
function Summary({ navigation, route }) {
  const { quizTitle, userAnswers, questions } = route.params;
  console.log(questions);
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
    <View style={styles.container}>
      <Text style={[styles.header, { textAlign: "center" }]}>{quizTitle}</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.header2}>
          Your score: {totalScore} / {questions.length}
        </Text>
      </View>
      <FlatList
        data={questions}
        renderItem={({ item, index }) => {
          console.log(item);
          let userSelected = userAnswers[index];
          let userCorrect = calculateCorrect(userSelected, item.answer);

          console.log(item.type);
          if (item.type == "input") {
            let { prompt } = item;
            return (
              <View style={styles.questionContainer} key={index}>
                <Text style={styles.bodyText}>{prompt}</Text>
                <Text style={styles.header3}>Your answer: {userSelected}</Text>
              </View>
            );
          } else {
            let { prompt, answer, choices } = item;
            return (
              <View style={styles.questionContainer} key={index}>
                <Text style={styles.bodyText}>{prompt}</Text>
                {choices.map((value, choiceIndex) => {
                  let correct = false;
                  let userDidSelect = false;
                  userDidSelect = userSelected == choiceIndex;
                  correct = userCorrect;
                  return (
                    <CheckBox
                      containerStyle={{
                        backgroundColor: userDidSelect
                          ? correct == true
                            ? "lightgreen"
                            : "red"
                          : undefined,
                      }}
                      checked={userDidSelect == correct}
                      textStyle={{
                        textDecorationLine: correct
                          ? undefined
                          : "line-through",
                      }}
                      key={value}
                      title={value}
                    ></CheckBox>
                  );
                })}
              </View>
            );
          }
        }}
      ></FlatList>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Pressable
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate("Home", { quizDisplay: quizArray })
          }
        >
          <Icon name="home" color="#FFFEFE" size={50}></Icon>
        </Pressable>
      </View>
    </View>
  );
}

// create quiz function
function CreateQuiz({ navigation, route }) {
  cacheFonts([FontAwesome.font]);
  let [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setIndex] = useState();
  const [questions, setQuestions] = useState([]);
  let [questionPrompt, setQuestionPrompt] = useState("");
  let [dropChoices, setDropChoices] = useState([]);
  let [multiChoices, setMultiChoices] = useState([]);
  let [inputAnswer, setInputAnswer] = useState("");
  let [choicesText, setChoicesText] = useState("");
  let [editModal, setEditModal] = useState(false);
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
        checkedColor="#3DA35D"
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
        checkedColor="#3DA35D"
      ></CheckBox>
    );
  });
  if (selectedIndex === 0) {
    type = "input";
    questionType = (
      <>
        <Text style={styles.header3}>Enter Answer:</Text>
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
        <Text style={styles.header3}>Enter choices:</Text>
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
        <Text style={styles.header3}>
          Choices: (Please mark which answer is correct)
        </Text>
        {formatDropChoices}
      </>
    );
    questionObject = {
      prompt: questionPrompt,
      type: type,
      choices: dropChoices,
      answer: dropChoices[selectedIndex2],
    };
  } else if (selectedIndex === 2) {
    type = "multiple-choice";
    questionType = (
      <>
        <Text style={styles.header3}>Enter choices:</Text>
        <Input placeholder="Add a choice" onChangeText={setChoicesText}></Input>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setMultiChoices([...multiChoices, choicesText])}
        >
          <Text style={styles.textStyle}>Add choice</Text>
        </Pressable>
        <Text style={styles.header3}>
          Choices: (Please mark which answer is correct)
        </Text>
        {formatMultiChoices}
      </>
    );
    questionObject = {
      prompt: questionPrompt,
      type: type,
      choices: multiChoices,
      answer: multiChoices[selectedIndex2],
    };
  }
  // delete function works.. but app has to re-render so it is slow
  let handleDelete = (question) => {
    console.log(question);
    questions.splice(question, 1);
    setQuestions(questions);
  };
  let replaceIndex;
  let renderItem = ({ item, index }) => {
    // console.log("Returning flatlist...");
    // console.log(item.type);
    if (item.type !== "input") {
      return (
        <View style={styles.questionContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.header3}>Question #{index + 1}</Text>
              <Text style={[styles.bodyText, { marginTop: 5 }]}>
                {item.prompt}
              </Text>
              <Text style={styles.bodyText}>Choices:</Text>
              <FlatList
                data={item.choices}
                renderItem={({ item }) => {
                  return (
                    <Text style={[styles.bodyText, { marginLeft: 20 }]}>
                      {item}
                    </Text>
                  );
                }}
              ></FlatList>
              <Text style={styles.bodyText}>Answer: {item.answer}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: -15,
                marginLeft: horizontalScale(80),
              }}
            >
              <Pressable
                onPress={() => {
                  replaceIndex = index;
                  setEditModal(true);
                  setModalVisible(true);
                  console.log(replaceIndex);
                  console.log(questions[replaceIndex].prompt);
                }}
              >
                <Icon reverse name="edit" color="#134611" size="18"></Icon>
              </Pressable>
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  handleDelete(questions[index]);
                }}
              >
                <Icon reverse name="delete" color="#134611" size="18"></Icon>
              </Pressable>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.questionContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.header3}>Question #{index + 1}</Text>
              <Text style={[styles.bodyText, { marginTop: 5 }]}>
                {item.prompt}
              </Text>
              <Text style={styles.bodyText}>Answer: {item.answer}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: -15,
                marginLeft: horizontalScale(80),
              }}
            >
              <Pressable
                onPress={() => {
                  replaceIndex = index;
                  setEditModal(true);
                  setModalVisible(true);
                  console.log(replaceIndex);
                  console.log(questions[replaceIndex].prompt);
                }}
              >
                <Icon reverse name="edit" color="#134611" size="18"></Icon>
              </Pressable>
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  handleDelete(questions[index]);
                }}
              >
                <Icon reverse name="delete" color="#134611" size="18"></Icon>
              </Pressable>
            </View>
          </View>
        </View>
      );
    }
  };
  let ifNoQuestions = () => {
    if (questions.length === 0) {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.header3}>You currently have no questions</Text>
        </View>
      );
    }
  };
  let modalMode;

  if (editModal == false) {
    modalMode = (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={[styles.modalText, styles.header2]}>
              Create a question
            </Text>
            <Input
              placeholder="Question prompt"
              onChangeText={setQuestionPrompt}
            ></Input>
            <Text style={[styles.modalText, styles.header3]}>
              Question type:
            </Text>
            <CheckBox
              checked={selectedIndex === 0}
              onPress={() => setIndex(0)}
              checkedIcon="dot-circle-o"
              checkedColor="#3DA35D"
              uncheckedIcon="circle-o"
              title="Input"
            />
            <CheckBox
              checked={selectedIndex === 1}
              onPress={() => setIndex(1)}
              checkedIcon="dot-circle-o"
              checkedColor="#3DA35D"
              uncheckedIcon="circle-o"
              title="Drop Down"
            />
            <CheckBox
              checked={selectedIndex === 2}
              onPress={() => setIndex(2)}
              checkedIcon="dot-circle-o"
              checkedColor="#3DA35D"
              uncheckedIcon="circle-o"
              title="Multiple Chpice"
            />
            {questionType}
            <View
              style={[
                styles.buttonContainer,
                { marginTop: 10, marginBottom: -10 },
              ]}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (questionPrompt.length == 0) {
                    Alert.alert(
                      "Missing question prompt",
                      "Please enter a question prompt"
                    );
                  } else if (type == undefined) {
                    Alert.alert(
                      "Missing question type",
                      "Please select a question type"
                    );
                  } else if (type == "input" && inputAnswer.length == 0) {
                    Alert.alert("Missing answer", "Please enter an answer");
                  } else if (type == "drop-down" && dropChoices.length == 0) {
                    Alert.alert(
                      "Missing choice options",
                      "Please enter at least one choice option"
                    );
                  } else if (
                    type == "multiple-choice" &&
                    multiChoices.length == 0
                  ) {
                    Alert.alert(
                      "Missing choice options",
                      "Please enter at least one choice option"
                    );
                  } else if (type !== "input" && selectedIndex2 == null) {
                    Alert.alert("Missing answer", "Please select an answer");
                  } else {
                    setModalVisible(!modalVisible);
                    setQuestions([...questions, questionObject]);
                    // console.log(questions);
                    // clear the arrays
                    setDropChoices([]);
                    setMultiChoices([]);
                    // clear inputs
                    setQuestionPrompt("");
                    setInputAnswer("");
                    setChoicesText("");
                    setSelectedIndex2();
                  }
                }}
              >
                <Text style={styles.textStyle}>Save Question</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // clear the arrays
                  setDropChoices([]);
                  setMultiChoices([]);
                }}
              >
                <Text style={styles.textStyle}>Exit</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </>
    );
  } else {
    console.log("Edit modal mode is on...");

    // change questionType
    if (selectedIndex === 0) {
      type = "input";
      questionType = (
        <>
          <Text style={styles.header3}>Enter Answer:</Text>
          <Input placeholder="New answer" onChangeText={setInputAnswer}></Input>
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
          <Text style={styles.header3}>Enter choices:</Text>
          <Input
            placeholder="Add a choice"
            onChangeText={setChoicesText}
          ></Input>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => {
              setDropChoices([...dropChoices, choicesText]);
              // console.log(dropChoices);
            }}
          >
            <Text style={styles.textStyle}>Add choice</Text>
          </Pressable>
          <Text style={styles.header3}>
            Choices: (Please mark which answer is correct)
          </Text>
          {formatDropChoices}
        </>
      );
      questionObject = {
        prompt: questionPrompt,
        type: type,
        choices: dropChoices,
        answer: dropChoices[selectedIndex2],
      };
    } else if (selectedIndex === 2) {
      type = "multiple-choice";
      questionType = (
        <>
          <Text style={styles.header3}>Enter choices:</Text>
          <Input
            placeholder="Add a choice"
            onChangeText={setChoicesText}
          ></Input>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setMultiChoices([...multiChoices, choicesText])}
          >
            <Text style={styles.textStyle}>Add choice</Text>
          </Pressable>
          <Text style={styles.header3}>
            Choices: (Please mark which answer is correct)
          </Text>
          {formatMultiChoices}
        </>
      );
      questionObject = {
        prompt: questionPrompt,
        type: type,
        choices: multiChoices,
        answer: multiChoices[selectedIndex2],
      };
    }
    modalMode = (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={[styles.modalText, styles.header2]}>
              Edit question
            </Text>
            <Input
              placeholder="New prompt"
              onChangeText={setQuestionPrompt}
            ></Input>
            <Text style={[styles.modalText, styles.header3]}>
              Question type:
            </Text>
            <CheckBox
              checked={selectedIndex === 0}
              onPress={() => setIndex(0)}
              checkedIcon="dot-circle-o"
              checkedColor="#3DA35D"
              uncheckedIcon="circle-o"
              title="Input"
            />
            <CheckBox
              checked={selectedIndex === 1}
              onPress={() => setIndex(1)}
              checkedIcon="dot-circle-o"
              checkedColor="#3DA35D"
              uncheckedIcon="circle-o"
              title="Drop Down"
            />
            <CheckBox
              checked={selectedIndex === 2}
              onPress={() => setIndex(2)}
              checkedIcon="dot-circle-o"
              checkedColor="#3DA35D"
              uncheckedIcon="circle-o"
              title="Multiple Chpice"
            />
            {questionType}
            <View
              style={[
                styles.buttonContainer,
                { marginTop: 10, marginBottom: -10 },
              ]}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  if (questionPrompt.length == 0) {
                    Alert.alert(
                      "Missing question prompt",
                      "Please enter a question prompt"
                    );
                  } else if (type == undefined) {
                    Alert.alert(
                      "Missing question type",
                      "Please select a question type"
                    );
                  } else if (type == "input" && inputAnswer.length == 0) {
                    Alert.alert("Missing answer", "Please enter an answer");
                  } else if (type == "drop-down" && dropChoices.length == 0) {
                    Alert.alert(
                      "Missing choice options",
                      "Please enter at least one choice option"
                    );
                  } else if (
                    type == "multiple-choice" &&
                    multiChoices.length == 0
                  ) {
                    Alert.alert(
                      "Missing choice options",
                      "Please enter at least one choice option"
                    );
                  } else if (type !== "input" && selectedIndex2 == null) {
                    Alert.alert("Missing answer", "Please select an answer");
                  } else {
                    setModalVisible(!modalVisible);
                    // setQuestions([...questions, questionObject]);
                    // console.log(questions);
                    console.log("questions before splice" + questions);
                    questions.splice(replaceIndex, 1, questionObject);
                    console.log("questions after splice" + questions);
                    setQuestions(questions);
                    // clear the arrays
                    setDropChoices([]);
                    setMultiChoices([]);
                    // clear inputs
                    setQuestionPrompt("");
                    setInputAnswer("");
                    setChoicesText("");
                    setSelectedIndex2();
                  }
                }}
              >
                <Text style={styles.textStyle}>Change Question</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  // clear the arrays
                  setDropChoices([]);
                  setMultiChoices([]);
                }}
              >
                <Text style={styles.textStyle}>Exit</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </>
    );
  }
  // Create quiz return starts here
  return (
    <View style={styles.container}>
      <Text style={[{ textAlign: "center" }, styles.header]}>
        Create a Quiz
      </Text>
      <Text style={styles.header2}>Enter quiz title:</Text>
      <Input
        style={{ margin: 5 }}
        placeholder="Title..."
        onChangeText={setTitle}
      ></Input>
      <Pressable
        style={styles.buttonOpen}
        onPress={() => {
          setEditModal(false);
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>Add a question</Text>
      </Pressable>
      <Text style={styles.header2}>Your questions:</Text>
      {ifNoQuestions()}
      <FlatList data={questions} renderItem={renderItem}></FlatList>
      <View style={styles.centeredView}>{modalMode}</View>
      <View style={[styles.buttonContainer, { marginTop: 10 }]}>
        <Pressable
          style={{
            width: horizontalScale(120),
            backgroundColor: "#134611",
            borderRadius: 20,
            padding: 10,
            elevation: 2,
            margin: 10,
            marginBottom: -40,
          }}
          onPress={() => {
            if (title.length == 0) {
              Alert.alert(
                "Missing quiz title",
                "Quiz must contain a title to save"
              );
            } else if (questions.length == 0) {
              Alert.alert(
                "Missing question",
                "Quiz must contain at least one question to save"
              );
            } else {
              let quiz = {
                title: title,
                questions: questions,
              };
              quizArray.push(quiz);
              // console.log("quiz just added:" + { quiz });
              // console.log("quiz array:" + { quizArray });
              navigation.navigate("Home", { quizDisplay: quizArray });
            }
          }}
        >
          <Text style={styles.textStyle}>Save</Text>
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate("Home", { quizDisplay: quizArray })
          }
        >
          <Icon name="home" color="#FFFEFE" size={50}></Icon>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionContainer: {
    backgroundColor: "#FFFEFE",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  container: {
    borderRadius: 40,
    marginTop: verticalScale(40),
    margin: 20,
    backgroundColor: "#E8FCCF",
    height: verticalScale(720),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  backgrounColor: {
    backgroundColor: "green",
  },
  buttonQuiz: {
    backgroundColor: "#3DA35D",
    margin: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconButton: {
    width: horizontalScale(90),
    height: verticalScale(90),
    backgroundColor: "#3DA35D",
    borderRadius: 90,
    padding: 10,
    elevation: 2,
    marginRight: horizontalScale(5),
    marginBottom: verticalScale(-40),
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonCreateQuiz: {
    backgroundColor: "#134611",
    borderRadius: 100,
    height: 100,
    width: 100,
    padding: 10,
    elevation: 2,
  },
  header: {
    fontSize: 48,
    fontFamily: "Nunito-Bold",
    color: "#134611",

    margin: 35,
  },
  header2: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  header3: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#134611",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#3DA35D",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 8,
    marginBottom: 20,
  },
  buttonClose: {
    backgroundColor: "#134611",
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    margin: 8,
  },
  bodyText: {
    fontSize: 15,
    marginLeft: 10,
    marginTop: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  quizTextStyle: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Nunito-Regular",
    textAlign: "left",
    fontSize: 25,
    margin: 40,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFFEFE",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
