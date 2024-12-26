import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.icon}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle} />
            <View style={styles.iconHandle} />
          </View>
        </View>
        <TextInput
          placeholder="Search for the plans"
          style={styles.input}
          placeholderTextColor="#666"
          selectionColor="#008080"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: "#008080",
    bottom: 3, // Adjusted to center the handle vertically
    right: 3, // Positioned to the right of the circle
  },
  iconHandle: {
    position: 'absolute',
    width: 3,
    height: 7.5,
    backgroundColor: "#008080",
    top: 10, // Adjusted to center the handle vertically
    left: 11, // Positioned to the right of the circle
    transform: [{ rotate: '-45deg' }],
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: 'Roboto',
  },
});

export default SearchBar;
