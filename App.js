import React from 'react';
import {StyleSheet, View} from 'react-native';
import DeckList from "./screens/DeckList"
import DeckView from "./screens/DeckView"
import DeckAdd from "./screens/DeckAdd"
import CardAdd from "./screens/CardAdd"
import QuizView from "./screens/QuizView"
import { createStackNavigator } from 'react-navigation'
import { setLocalNotification } from './utils/helpers'

const MainNavigator = createStackNavigator({
  DeckList: {
    screen: DeckList,
  },
  DeckView: {
    screen: DeckView
  },
  DeckAdd: {
    screen: DeckAdd
  },
  CardAdd: {
    screen: CardAdd
  },
  QuizView: {
    screen: QuizView
  }
})

export default class App extends React.Component {

  componentDidMount() {
    setLocalNotification()
  }

  render() {
    return (
      <View style={styles.container}>
        <MainNavigator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
