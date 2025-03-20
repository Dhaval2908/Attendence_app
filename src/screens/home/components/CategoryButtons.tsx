import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fontNormalize, smartScale } from '../../../theme/constants/normalize';
import { Colors } from '../../../theme/colors';

interface CategoryButtonsProps {
  selectedCategory: 'Upcoming' | 'Ongoing' | 'Past';
  onSelectCategory: (category: 'Upcoming' | 'Ongoing' | 'Past') => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.categoryButtons}>
      {['Upcoming', 'Ongoing', 'Past'].map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategoryButton
          ]}
          onPress={() => onSelectCategory(category as 'Upcoming' | 'Ongoing' | 'Past')}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.selectedCategoryButtonText
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButtons: {
    flexDirection: 'row',
    paddingVertical: smartScale(8),
    paddingHorizontal: smartScale(20),
  },
  categoryButton: {
    marginRight: smartScale(10), 
    paddingVertical: smartScale(8),
    paddingHorizontal: smartScale(8),
    borderRadius: smartScale(20),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  categoryButtonText: {
    fontSize: fontNormalize(13),
    color: Colors.black,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  selectedCategoryButtonText: {
    color: Colors.white,
  },
});

export default CategoryButtons;
