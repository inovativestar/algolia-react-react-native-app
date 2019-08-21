import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Placeholder from 'rn-placeholder';

const ListPlaceholder = (props) => {
  const style = { backgroundColor: props.bgColor };
  return (
    <View >
        {[0, 0, 0, 0, 0, 0, 0].map((item, index) => (
          <View
            key={index}
            style={style}
          >
            <View style={styles.cornerRadius}>
              <View
                style={{
                  backgroundColor:'#AAA',
                  width: 100,
                  height: "100%",
                }}
              />
            <View style={styles.txtView}>
              <View
                style={styles.title}
              ></View>
              <View
                style={styles.subTitle}
              ></View>
              <View
                style={styles.subTitle2}
              ></View>
            </View>

            </View>
          </View>
        ))}

    </View>
  );
};

export default Placeholder.connect(ListPlaceholder);

const styles = StyleSheet.create({

  cornerRadius : {
    overflow       : 'hidden',
    flexDirection  : 'row-reverse',
    alignItems     : 'center',
    backgroundColor: '#eee',
    borderRadius   : 7,
    margin         : 10,
    height         : 100,
  },
  txtView: {
    flex: 1,
    padding:10,
    direction:'rtl',
    alignSelf: 'stretch',
   },
  title: {
     borderRadius   : 3,
     height:14,
     width:'60%',
     backgroundColor:'#AAA',
     alignSelf: 'stretch',
   },
  subTitle: {
    marginTop:17,
    borderRadius   : 3,
    height:11,
    width:'92%',
    backgroundColor:'#AAA',
    alignSelf: 'stretch',
  },
  subTitle2: {
    marginTop:10,
    borderRadius   : 3,
    height:11,
    width:'80%',
    backgroundColor:'#AAA',
    alignSelf: 'stretch',
  },

  itemContainer: {  marginBottom: 10, padding: 10 },

})
