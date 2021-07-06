import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'

export default function Add({navigation}) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);
  const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null)
      setImage(data.uri)
    }
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  if (hasGalleryPermission === null || hasCameraPermission=== null) {
    return <View />;
  }
  if (hasGalleryPermission === false || hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
  <View style={{flex:1}}>   
    <View style={styles.cameraContainer}>
      <Camera 
      ref={ref=>setCamera(ref)}
      style={styles.fixedRatio}
       type={type}
       ratio={'1:1'}
      >       
      </Camera>
    </View>
   
    <View style={styles.buttons}>
      <Button
      onPress={() => {
        setType(
          type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back
        );
      }}  title="Flip" >
      </Button>
      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image from Gallery" onPress={() => pickImage()} />
      <Button title="Post" onPress={() => navigation.navigate('Save', {image})} /> 
    </View>
    {image && <Image source = {{uri: image}} style={styles.image}/>}
    
  </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1, 
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  buttons: {
    width: 250,
    marginRight: 'auto',
    marginLeft: 'auto',
    padding: 20
  },
  image:{
    flex: 1,
    aspectRatio: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: 5
  }
})