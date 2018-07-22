import React, {Component} from 'react'
import * as service from "../utils/service"
import {Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput} from 'react-native'
import {_} from 'lodash'
import Colors from '../constants/Colors'
import FlashCardButton from "../components/FlashCardButton"
import Container from "../components/Container"


class CardAdd extends Component {
  state = {
    question: '',
    answer: ''
  }

  onChangeQuestion = (question) => {
    this.setState({question})
  }

  onChangeAnswer = (answer) => {
    this.setState({answer})
  }

  onSubmit = async () => {
    const {question, answer} = this.state
    const {navigation} = this.props
    const {deck} = navigation.state.params

    if (_.find(deck, ['question', question]) !== undefined) {
      Alert.alert('Error', 'The question already exists.')
      return;
    }

    await this.addQuestion(deck.title, question, answer)

    Keyboard.dismiss()

    navigation.goBack()
    navigation.state.params.loadDeck(true)

    this.setState({
      question: '',
      answer: ''
    })
  }

  // Add new question to the state
  addQuestion = async (title, question, answer) => {
    const decks = await service.getDecks();
    const newDeck = {
      ...decks,
      [title]: {
        ...decks[title],
        questions: decks[title].questions.concat({question, answer})
      }
    }
    await service.updateDecks(newDeck)
  }

  render() {
    const {question, answer} = this.state
    const isSubmitEnabled = !!(question && answer)

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        enabled={true}
      >
        <Container>
          <Text style={styles.title}>Add Card</Text>
          <TextInput
            returnKeyType='next'
            onChangeText={this.onChangeQuestion}
            placeholder='Question'
            value={question}
            style={styles.textInput}
            underlineColorAndroid='transparent'
          />
          <TextInput
            returnKeyType='done'
            onChangeText={this.onChangeAnswer}
            onSubmitEditing={this.onSubmit}
            placeholder='Answer'
            value={answer}
            style={styles.textInput}
            underlineColorAndroid='transparent'
          />
          <FlashCardButton
            onPress={this.onSubmit}
            disabled={!isSubmitEnabled}
            title="Submit"
          >
          </FlashCardButton>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    paddingBottom: 30,
  },
  textInput: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.gray,
    width: '90%',
    padding: 10,
    marginHorizontal: 0,
    marginVertical: 5
  }
})

export default CardAdd;
