import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'

// A top level container. Contents are top center aligned.
class Container extends Component {

  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center'
  }
})

export default Container;
