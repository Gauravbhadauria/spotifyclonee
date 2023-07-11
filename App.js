import {
  View,
  Text,
  Image,
  StatusBar,
  Touchable,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {songsList} from './src/Songs';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import Modal from 'react-native-modal';
import SongPlayer from './SongPlayer';
const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isVisible,setIsVisible]=useState(false)

  useEffect(() => {
    setupPlayer();
  }, []);
  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],

        // Icons for the notification on Android (if you don't like the default ones)
      });
      await TrackPlayer.add(songsList);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (State.Playing == playbackState) {
      if (progress.position.toFixed(0) == progress.duration.toFixed(0)) {
        if (currentIndex < songsList.length) {
          setCurrentIndex(currentIndex + 1);
        }
      }
    }
  }, [progress]);
  return (
    <LinearGradient
      colors={['#a34c0d', '#592804', '#241001', '#000000']}
      style={{flex: 1}}>
      <StatusBar translucent backgroundColor={'transparent'} />

      <Image
        source={require('./src/images/left.png')}
        style={{
          width: 24,
          height: 24,
          tintColor: 'white',
          marginTop: 60,
          marginLeft: 20,
        }}
      />
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          marginTop: 20,
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: '85%',
            height: 37,
            backgroundColor: '#b06a41',
            borderRadius: 5,
            flexDirection: 'row',
            paddingLeft: 15,
            alignItems: 'center',
          }}>
          <Image
            source={require('./src/images/search2.png')}
            style={{width: 18, height: 18, tintColor: 'white'}}
          />
          <Text style={{color: 'white', marginLeft: 10}}>Find in Playlist</Text>
        </View>
        <View
          style={{
            width: '15%',
            height: 37,
            backgroundColor: '#b06a41',
            borderRadius: 5,

            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 5,
          }}>
          <Text style={{color: 'white', fontWeight: '600'}}>Sort</Text>
        </View>
      </View>
      <Image
        source={{uri: songsList[currentIndex].artwork}}
        style={{
          width: '80%',
          height: '35%',
          alignSelf: 'center',
          marginTop: 20,
          borderRadius: 5,
        }}
      />
      <Text
        style={{
          fontSize: 30,
          color: 'white',
          fontWeight: '600',
          marginLeft: 20,
          marginTop: 20,
        }}>
        {songsList[currentIndex].title}
      </Text>
      <View style={{flexDirection: 'row', paddingLeft: 20, marginTop: 20}}>
        <Image
          source={require('./src/images/spotify.png')}
          style={{width: 18, height: 18}}
        />
        <Text style={{color: 'white', fontSize: 14, marginLeft: 10}}>
          English Songs
        </Text>
      </View>
      <View style={{flexDirection: 'row', paddingLeft: 20, marginTop: 10}}>
        <Text style={{color: '#bababa', fontSize: 12}}>20,169 saves</Text>
        <Text style={{color: '#bababa', fontSize: 12, marginLeft: 10}}>
          4h 26m
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          marginTop: 10,
          justifyContent: 'space-between',
          alignSelf: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('./src/images/plus.png')}
            style={{width: 18, height: 18, tintColor: '#bababa'}}
          />
          <Image
            source={require('./src/images/arrow-down.png')}
            style={{
              width: 18,
              height: 18,
              tintColor: '#bababa',
              marginLeft: 15,
            }}
          />
          <Image
            source={require('./src/images/option.png')}
            style={{
              width: 18,
              height: 18,
              tintColor: '#bababa',
              marginLeft: 15,
            }}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('./src/images/suffle.png')}
            style={{width: 30, height: 30, tintColor: '#bababa'}}
          />
          <TouchableOpacity
            onPress={async () => {
              if (State.Playing == playbackState) {
                await TrackPlayer.pause();
              } else {
                await TrackPlayer.skip(currentIndex);
                await TrackPlayer.play();
              }
            }}>
            {State.Playing == playbackState ? (
              <Image
                source={require('./src/images/pause.png')}
                style={{
                  width: 40,
                  height: 40,
                  marginLeft: 20,
                  marginRight: 10,
                  tintColor: '#3ad934',
                }}
              />
            ) : (
              <Image
                source={require('./src/images/play-button.png')}
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: 20,
                  marginRight: 10,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={songsList}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={{
                width: '100%',
                height: 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 10,
              }}
              onPress={async () => {
                await TrackPlayer.pause();
                await TrackPlayer.skip(index);
                await TrackPlayer.play();
                setCurrentIndex(index);
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: item.artwork}}
                  style={{width: 50, height: 50, borderRadius: 5}}
                />
                <View style={{marginLeft: 10}}>
                  <Text style={{color: 'white'}}>{item.title}</Text>
                  <Text style={{color: 'white', fontSize: 10}}>
                    {item.artist}
                  </Text>
                </View>
                {index == currentIndex && State.Playing == playbackState && (
                  <Image
                    source={require('./src/images/playing.png')}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: 'white',
                      marginLeft: 20,
                    }}
                  />
                )}
              </View>
              <Image
                source={require('./src/images/option.png')}
                style={{width: 18, height: 18, tintColor: '#bababa'}}
              />
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
       activeOpacity={1}
        style={{
          width: '100%',
          height: 70,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          justifyContent: 'space-between',
        }} onPress={()=>{
          setIsVisible(true)
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: songsList[currentIndex].artwork}}
            style={{width: 50, height: 50, borderRadius: 5}}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{color: 'white'}}>
              {songsList[currentIndex].title}
            </Text>
            <Text style={{color: 'white', fontSize: 10}}>
              {songsList[currentIndex].artist}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={async () => {
            if (State.Playing == playbackState) {
              await TrackPlayer.pause();
            } else {
              await TrackPlayer.skip(currentIndex);
              await TrackPlayer.play();
            }
          }}>
          <Image
            source={
              State.Playing == playbackState
                ? require('./src/images/pause2.png')
                : require('./src/images/play.png')
            }
            style={{width: 30, height: 30, tintColor: 'white'}}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <SongPlayer
      isVisible={isVisible}
        songsList={songsList}
        currentIndex={currentIndex}
        playbackState={playbackState}
        progress={progress}
        onChange={(x)=>{
          setCurrentIndex(x)
        }}
        onClose={()=>{
          setIsVisible(false)
        }}
      />
    </LinearGradient>
  );
};

export default App;

//'#a34c0d', '#592804', '#241001', '#000000'
