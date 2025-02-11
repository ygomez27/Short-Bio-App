import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, Button, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';





// const app =()=>{ return (<></>);}
//export feault app;
// export default function app { return(<></>)}
// function app{return(<></>)}
//export feault app;
const App = () => {
  const defaultProfile = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "2000-01-01",
    nationality: "American",
    bio: "A passionate student.",
    picture: null,
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempProfile, setTempProfile] = useState(defaultProfile);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load saved profile
  useEffect(() => {
    const loadProfile = async () => {
      const savedProfile = await AsyncStorage.getItem('studentProfile');
      if (savedProfile) setProfile(JSON.parse(savedProfile));
    };
    loadProfile();
  }, []);

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep picker open for iOS
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
      setTempProfile({ ...tempProfile, dateOfBirth: formattedDate });
    }
  };

  // Save profile
  const saveProfile = async () => {
    if (!tempProfile.firstName.trim() || 
        !tempProfile.lastName.trim() || 
        !tempProfile.dateOfBirth.trim() || 
        !tempProfile.nationality.trim() || 
        !tempProfile.bio.trim()) {
      alert("All fields are required!");
      return;
    }

    await AsyncStorage.setItem('studentProfile', JSON.stringify(tempProfile));
    setProfile(tempProfile);
    setModalVisible(false);
  };

  // Handle image selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setTempProfile({ ...tempProfile, picture: result.assets[0].uri });
    }
  };

  const openCamera = async () => { 
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserPicture(result.assets[0].uri);
    }
  };


  return (
    <View style={styles.container}>
      <Image source={profile.picture ? { uri: profile.picture } : require('./assets/icon.png')} style={styles.image} />
      <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
      <Text style={styles.info}>DOB: {profile.dateOfBirth}</Text>
      <Text style={styles.info}>Nationality: {profile.nationality}</Text>
      <Text style={styles.bio}>{profile.bio}</Text>
      
      <TouchableOpacity onPress={() => { setTempProfile(profile); setModalVisible(true); }} style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Show Selected Image */}
          {tempProfile.picture && (
            <Image source={{ uri: tempProfile.picture }} style={styles.modalImage} />
          )}

          <Button title="Pick an Image" onPress={pickImage} />
          <TextInput style={styles.input} placeholder="First Name" value={tempProfile.firstName} onChangeText={(text) => setTempProfile({ ...tempProfile, firstName: text })} />
          <TextInput style={styles.input} placeholder="Last Name" value={tempProfile.lastName} onChangeText={(text) => setTempProfile({ ...tempProfile, lastName: text })} />
          
          <TouchableOpacity onPress={showPicker} style={styles.input}>
            <Text>{tempProfile.dateOfBirth || "Select Date of Birth"}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(tempProfile.dateOfBirth || Date.now())}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TextInput style={styles.input} placeholder="Nationality" value={tempProfile.nationality} onChangeText={(text) => setTempProfile({ ...tempProfile, nationality: text })} />
          <TextInput style={styles.input} placeholder="Short Bio" value={tempProfile.bio} multiline onChangeText={(text) => setTempProfile({ ...tempProfile, bio: text })} />

          <Button title="Save" onPress={saveProfile} />
          <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  image: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold' },
  info: { fontSize: 16, color: '#666' },
  bio: { fontSize: 14, marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
  button: { marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 5 },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  
});

export default App;
