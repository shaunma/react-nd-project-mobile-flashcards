import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Colors from '../constants/Colors';

// A custom pre-styled button.
class FlashCardButton extends Component {

  render() {
    const {
      title,
    } = this.props;
    return (
      <TouchableOpacity
        {...this.props}
      >
        <View style={styles.button}>
          <Text style={styles.text}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 5,
    width: 160,
    padding: 10,
    backgroundColor: Colors.blue,
    marginHorizontal: 0,
    marginVertical: 5
  },
  text: {
    color: Colors.white,
    fontSize: 18
  },
})

export default FlashCardButton;
