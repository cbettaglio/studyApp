# studyApp

App for students, used to create quizzes, take quizzes, and review results

Components:

Home page

- where user sees all of their created quizzes (Displayed buy title and number of questions)
  - quizzes are stored in a global variable called quizArray, displayed through a flatlist
- button to create a new quiz

Quiz

- User is displayed question one by one
- question display changes depending on question type
- Submit button takes user to the next question, if it is the last question it takes the user to the summary screen
- home button navigates user back to home

Summary:
** orginal code provided by course instructor, adjusted for different question types **

- Screen that allows user to review quiz results
- Title of quiz displayed at top
- total score calculated
- Display of each question
  - correct answers are marked with a check mark
  - if user chose correct answer, background color is green
  - if user chose incorrect answer, background color is red
- home button navigates user back to home

Create a quiz

- Screen for user to create a new quiz
- Input field for user to enter quiz title
- Add a question button
  - displays a Modal for user to create a question
  - input for question prompt
  - dropdown menu for user chose question type (all created as components)
    - Input
      If input select, user is prompted to enter the answer
    - Drop down
    - Multiple choice
      If drop down or multiple choice selected, user is prompted to enter choices, user is also provided a means of selecteing which choice is the correct answer
  - Save question button
    - adds new question to an array of questions for that quiz
  - Exit
    - exits modal while saving no changes
- quiz questions displayed
  - if there are no questions "You currently have no questions" is displayed
  - if else, questions displayed in a flatlist:
    - question prompt
    - question choices (if question type is drop down or multiple choice)
    - question answer
    - Edit and delete buttons (displayed as icons)
      - Edit: Allows user to change and save question properties (prompt, type, choices, or answer)
      - Delete: removes question from the array
- Save button
  - pushes the new quiz to quizArray variable
- home button
  - navigates user to home page
