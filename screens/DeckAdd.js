import React, {Component} from 'react'
import {Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput} from 'react-native'
import Colors from '../constants/Colors'
import FlashCardButton from "../components/FlashCardButton"
import Container from "../components/Container"

class DeckAdd extends Component {
  state = {
    title: '',
    alreadyExist: false
  }

  onChangeText = (title) => {
    this.setState({title})
  }

  onSubmit = () => {
    const {title} = this.state
    const {navigation} = this.props
    const {decks} = navigation.state.params

    if (title.length === 0) {
      return;
    }

    if (decks !== undefined && decks !== null && decks.hasOwnProperty(title)) {
      Alert.alert('Error', 'The deck already exists.')
      return;
    }

    navigation.state.params.addDeck(title)

    Keyboard.dismiss()

    this.props.navigation.replace('DeckView', {
      title: title,
      loadDecks: () => navigation.state.params.loadDecks()
    });

    this.setState({
      title: ''
    })
  }

  render() {
    const {title} = this.state

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        enabled={true}
      >
        <Container
          scrollEnabled={false}
          keyboardShouldPersistTaps='never'
        >
          <Text style={styles.title}>What is the title of your new deck?</Text>
          <TextInput
            returnKeyType='done'
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmit}
            placeholder='Deck Title'
            value={title}
            autoFocus={true}
            underlineColorAndroid='transparent'
            style={styles.textInput}
          />

          <FlashCardButton
            onPress={this.onSubmit}
            disabled={title.length === 0}
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
    paddingBottom: 10,
  },
  input: {
    width: '100%',
    padding: 20,
  },
  textInput: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Colors.gray,
    width: '90%',
    padding: 10,
    margin: 10
  }
})

export default DeckAdd;
