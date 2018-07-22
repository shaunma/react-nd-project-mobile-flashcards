import React, {Component} from 'react'
import * as service from '../utils/service'
import {AppLoading} from 'expo'
import {Alert, Button, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import Colors from '../constants/Colors';
import ExternalStyles from '../constants/Styles';
import {_} from 'lodash';
import FlashCardButton from "../components/FlashCardButton"
import Container from "../components/Container"

class DeckList extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'All Decks',
      headerRight: navigation.state.params ? navigation.state.params.headerRight : null
    }
  }

  state = {
    decks: {},
    searchTerm: ""
  }

  async componentDidMount() {
    await this.loadDecks();
    const {navigation} = this.props;
    if (Platform.OS === 'ios') {
      navigation.setParams({
        headerRight: this.getAddButton('Add Deck')
      })
    }
  }

  getAddButton(buttonTitle) {
    const {navigation} = this.props;
    const onPress = () => navigation.navigate(
      'DeckAdd',
      {
        addDeck: this.addDeck,
        decks: this.state.decks,
        loadDecks: () => this.loadDecks(),
      }
    )
    const AddButton = Platform.OS === 'android' ? FlashCardButton : Button
    return (
      <AddButton
        onPress={onPress}
        title={buttonTitle}
      />
    )
  }


  onSearchChange(text) {
    this.setState({
      searchTerm: text
    });
  }

  addDeck = (title) => {
    const deck = {
      [title]: {
        'title': title,
        'questions': []
      }
    }
    const unorderedDecks = {...this.state.decks, ...deck}
    const orderedDecks = {};

    Object.keys(unorderedDecks).sort().forEach(function (key) {
      orderedDecks[key] = unorderedDecks[key];
    });

    this.setState(
      {
        decks: orderedDecks
      }
    );
    service.updateDecks(orderedDecks)
  }

  renderItem = ({item}) => {
    const length = item.questions.length
    return (
      <View>
        <TouchableOpacity
          style={styles.deck}
          onPress={() => this.props.navigation.navigate(
            'DeckView',
            {
              title: item.title,
              loadDecks: () => this.loadDecks(),
            }
          )}
        >
          <Text style={styles.deckText}>{item.title}</Text>
          <Text style={styles.cardCount}>
            {length} {length === 1 ? 'card' : 'cards'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: Colors.gray,
          width: '100%'
        }}
      />
    );
  }

  doAlert() {
    Alert.alert(
      'Delete All',
      'This will delete all decks and cards. Are you sure?',
      [
        {text: 'Cancel'},
        {text: 'OK', onPress: () => this.deleteAll()}
      ]
    )
  }

  deleteAll() {
    service.resetData()
    this.setState(
      {
        "decks": {}
      }
    );
  }

  async loadDecks() {
    const decks = await service.getDecks();
    this.setState({decks});
  }

  render() {
    const {decks, searchTerm} = this.state;

    const isEmpty = (decks === undefined || decks === null || Object.keys(decks).length === 0)
    const keyExtractor = (deck) => (deck.title);
    const filteredDecks = searchTerm ? _.filter(decks,
      (deck) => (deck.title.toUpperCase().includes(searchTerm.toUpperCase())))
      : decks
    return (
      <Container>
        {
          isEmpty ? (
            <View style={{margin: 10}}>
              <Text style={ExternalStyles.cardTitle}>No decks.</Text>
            </View>
          ) : (
            <TextInput
              placeholder="Search"
              onChangeText={this.onSearchChange.bind(this)}
              style={ExternalStyles.textInput}
            />)
        }

        {
          !isEmpty && _.isEmpty(filteredDecks) ? (
            <View>
              <Text>No decks found with "{searchTerm}".</Text>
            </View>
          ) : (
            <FlatList
              style={styles.deckList}
              keyExtractor={keyExtractor}
              data={Object.values(filteredDecks)}
              renderItem={this.renderItem}
              ItemSeparatorComponent={this.renderSeparator}
            />
          )
        }

        {
          (Platform.OS === 'android') &&
          <View>
            {this.getAddButton("Add Deck")}
          </View>
        }

        {
          !isEmpty &&
          <View>
            <FlashCardButton
              title='Delete All'
              onPress={() => this.doAlert()}>
              Reset data
            </FlashCardButton>
          </View>
        }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  deck: {
    flex: 1,
    padding: 20,
    alignItems: 'center'
  },
  deckText: {
    fontSize: 24
  },
  deckList: {
    width: '90%',
  },
  cardCount: {
    fontSize: 20,
    color: Colors.purple
  }
})

export default DeckList;
