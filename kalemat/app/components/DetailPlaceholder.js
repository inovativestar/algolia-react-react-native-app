import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Placeholder from 'rn-placeholder';


const DetailPlaceholder = (props) => {
  return (
    <View style={styles.container}>
      <View style={{
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          width: '100%',
          flexDirection: 'row',
        }}>
          <View style={{ width: '100%' }}>
            <Placeholder.Box
              height={'100%'}
              width={'100%'}
              color="#C1C1C1"
              animate='fade'
            />
          </View>

        </View>

      </View>

      <View style={{backgroundColor: '#fff', width:'100%',}} >
      <View style={{ width: 160 , paddingLeft:15, height:55 , flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',}}>
        {/*  meta data */}
        <Placeholder.Box
          height={25}
          width={55}
          color="#C1C1C1"
          animate='fade'
          radius={4}
        />
        <Placeholder.Box
          height={25}
          width={80}
          color="#C1C1C1"
          animate='fade'
          radius={4}
        />
      </View>
      </View>
      <View style={{ backgroundColor: '#fff', padding: 20, flexGrow: 1, }}>
        <Placeholder.Paragraph
          lineNumber={14}
          textSize={16}
          lineSpacing={9}
          color="#C1C1C1"
          width="100%"
          lastLineWidth="70%"
          firstLineWidth="50%"
          animate='fade'
        />
      </View>


    </View>
  );
};

export default Placeholder.connect(DetailPlaceholder);


const styles = StyleSheet.create({
  itemContainer: {},
  container: {
    flex: 1
  },
})
