import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Placeholder from 'rn-placeholder';


const TrendsPlaceholder = (props) => {
  return (
    <View style={styles.container}>

      {[0, 0, 0, 0, 0, 0, 0].map((item, index) => (
        <View
          key={index}
          style={styles.itemContainer}>
          <Placeholder.Box
            width={'100%'}
            height={250}
            color="#C1C1C1"/>
        </View>
      ))}
    </View>
  );
};

export default Placeholder.connect(TrendsPlaceholder);


const styles = StyleSheet.create({
  itemContainer: { marginBottom: 10, width: '49%' },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'

  },
})
