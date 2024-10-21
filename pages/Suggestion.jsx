import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import SuggestionHeader from '../components/mainHeader/suggestionHeader';
import restraunt from'../assets/resturant.png' ;
import bar from '../assets/bar.png';
 import excursion from '../assets/Excursion.png';


const suggestions = [
  {
    id: 1,
    title: 'Restaurants',
    icon: restraunt, // Replace with your image
    description: 'Explore a variety of restaurants',
  },
  {
    id: 2,
    title: 'Bars',
    icon: bar, // Replace with your image
    description: 'Find the best bars',
  },
  {
    id: 3,
    title: 'Excursions',
    icon: excursion, // Replace with your image
    description: 'Enjoy exciting excursions',
  },
];

const Suggestion = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <SuggestionHeader/>
      <Text style={styles.headerText}>Suggestions</Text>

      {/* Suggestions List */}
      <ScrollView>
        {suggestions.map((item) => (
          <TouchableOpacity key={item?.id} style={styles.card}>
            <View style={styles.iconContainer}>
              {/* <Image src={require(item?.icon)} style={styles.icon} /> */}
              <Image source={item?.icon } style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item?.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
    
    </SafeAreaView>
  );
};

export default Suggestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F4E79',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: '#E5F3E5',
    padding: 10,
    borderRadius: 8,
  },
  icon: {
    width: 40,
    height: 40,
  },
  textContainer: {
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#00A36C',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 18,
  },
});
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const Suggestion = () => {
//   return (
//     <View>
//       <Text>Suggestion</Text>
//     </View>
//   )
// }

// export default Suggestion

// const styles = StyleSheet.create({})