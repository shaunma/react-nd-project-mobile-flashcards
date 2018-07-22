import React, {Component} from 'react'
import * as service from '../utils/service'
import {Button, Platform, StyleSheet, Text, View} from 'react-native'
import {_} from 'lodash';
import FlashCardButton from "../components/FlashCardButton"
import ExternalStyles from '../constants/Styles';
import Container from "../components/Container"

class DeckView extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: navigation.state.params ? navigation.state.params.headerTitle : null,
      headerRight: navigation.state.params ? navigation.state.params.headerRight : null
    };
  }

  state = {
    deck: null
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const deck = await this.loadDeck(false)
    if (Platform.OS === 'ios') {
      navigation.setParams({
        headerRight: this.getAddButton(deck, 'Add Card'),
        headerTitle: (
          deck.title
        )
      });
    }
  }

  getAddButton(deck, buttonTitle) {
    const {navigation} = this.props;
    const onPress = () => navigation.navigate(
      'CardAdd',
      {
        deck,
        loadDeck: () => this.loadDeck(true),
      }
    )
    const AddButton = Platform.OS === 'android' ? FlashCardButton : Button;
    return (
      <AddButton
        onPress={onPress}
        title={buttonTitle}
      />
    )
  }

  async loadDeck(loadDecks) {
    const {title} = this.props.navigation.state.params;
    const deck = await service.getDeck(title);
    this.setState({deck});
    if (loadDecks) {
      this.props.navigation.state.params.loadDecks()
    }
    return deck;
  }

  render() {
    const {deck} = this.state
    if (deck === undefined || deck === null) {
      return (<View/>)
    }
    const numQuestions = deck.questions.length
    return (
      <Container>
        <Text style={ExternalStyles.cardTitle}>
          {deck.title}
        </Text>
        <Text style={ExternalStyles.cardCount}>
          {numQuestions} cards
        </Text>

        {
          numQuestions > 0 &&
          <View style={{margin: 10}}>
            <FlashCardButton
              onPress={() => this.props.navigation.navigate(
                'QuizView',
                {
                  deck: deck
                }
              )}
              title="Start Quiz"
            >
            </FlashCardButton>
          </View>
        }
        {
          (Platform.OS === 'android') &&
          <View>
            {this.getAddButton(deck, "Add Card")}
          </View>
        }
      </Container>
    )
  }
}

const styles = StyleSheet.create({})

export default DeckView;
