import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Colors from '../constants/Colors';
import {_} from 'lodash';
import FlashCardButton from "../components/FlashCardButton"
import Container from "../components/Container"
import { clearLocalNotification, setLocalNotification } from '../utils/helpers'

class QuizView extends Component {

  state = {
    cards: [],
    currentIndex: 0,
    numCorrect: 0,
    displayAnswer: false
  }

  resetQuiz() {
    this.setState({
      currentIndex: 0,
      numCorrect: 0,
      displayAnswer: false
    })
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const {deck} = navigation.state.params
    this.setState({
      cards: deck.questions
    })
    clearLocalNotification().then(setLocalNotification)
  }

  registerAnswer(isCorrect) {
    const {currentIndex, numCorrect} = this.state

    this.setState({
      currentIndex: currentIndex + 1,
      numCorrect: isCorrect ? numCorrect + 1 : numCorrect,
      displayAnswer: false
    })
  }

  renderAnswer(answer) {
    return (
      <Container>
        <Text style={styles.answer}>Answer is: {answer}</Text>
        <FlashCardButton
          onPress={() => this.registerAnswer(true)}
          title="Correct"
        />
        <FlashCardButton
          onPress={() => this.registerAnswer(false)}
          title="Incorrect"
        />
      </Container>
    )
  }

  renderResults() {
    const {cards, numCorrect} = this.state
    const percentageCorrect = (numCorrect / cards.length * 100).toFixed(2)
    return (
      <View style={styles.outerContainer}>
        <Text style={styles.caption}>
          You answered {percentageCorrect}% of questions correctly.
        </Text>
        <Container>
        <FlashCardButton
          onPress={() => this.resetQuiz()}
          title="Restart Quiz"
        />
        </Container>
      </View>
    )
  }

  renderAnswerButton() {
    return (
      <FlashCardButton
        onPress={() => {
          this.setState({
            displayAnswer: true
          })
        }}
        title="Display answer"
      />
    )
  }

  render() {
    const {cards, currentIndex, displayAnswer} = this.state
    if (cards === undefined || cards === null) {
      return (<View/>)
    }
    const displayResults = currentIndex === cards.length
    if (displayResults) {
      return this.renderResults()
    }
    const card = cards[currentIndex];
    return (
      <View style={styles.outerContainer}>
        <Text style={styles.caption}>
          {currentIndex + 1 + " / " + cards.length}
        </Text>
        <Container>
          <Text style={styles.question}>
            {card.question}
          </Text>
          <Container>
          {
            displayAnswer ? (
              this.renderAnswer(card.answer)
            ) : (
              this.renderAnswerButton()
            )
          }
          </Container>
        </Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  caption: {
    color: Colors.black,
    fontSize: 18,
  },
  question: {
    color: Colors.black,
    fontSize: 24,
  },
  answer: {
    color: Colors.black,
    fontSize: 18,
    marginBottom: 50
  },
})

export default QuizView;
