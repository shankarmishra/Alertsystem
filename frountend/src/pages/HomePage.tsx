import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';

const HomePage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [crimeData, setCrimeData] = useState<any>(null);
  const [rapeData, setRapeData] = useState<any>(null);
  const [lifeCycleData, setLifeCycleData] = useState<any>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const screenWidth = Dimensions.get('window').width;

  const states = [
    { label: 'All States', value: 'All States' },
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'West Bengal', value: 'West Bengal' },
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Haryana', value: 'Haryana' },
    { label: 'Bihar', value: 'Bihar' },
  ];

  const rawCrimeData = {
    'All States': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [500, 520, 540, 560, 580, 600, 620, 640, 660, 680],
      total: 5800,
    },
    'Andhra Pradesh': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
      total: 590,
    },
    'Karnataka': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [40, 42, 44, 46, 48, 50, 52, 54, 56, 58],
      total: 520,
    },
    'Maharashtra': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [70, 72, 74, 76, 78, 80, 82, 84, 86, 88],
      total: 770,
    },
    'Tamil Nadu': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [60, 62, 64, 66, 68, 70, 72, 74, 76, 78],
      total: 710,
    },
    'Delhi': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [100, 102, 104, 106, 108, 110, 112, 114, 116, 118],
      total: 1090,
    },
    'Gujarat': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
      total: 440,
    },
    'Rajasthan': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
      total: 290,
    },
    'West Bengal': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [80, 82, 84, 86, 88, 90, 92, 94, 96, 98],
      total: 880,
    },
    'Punjab': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [60, 62, 64, 66, 68, 70, 72, 74, 76, 78],
      total: 710,
    },
    'Haryana': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
      total: 590,
    },
    'Bihar': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
      total: 440,
    },
  };

  const rawRapeData = {
    'All States': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [200, 210, 220, 230, 240, 250, 260, 270, 280, 290],
      total: 2350,
    },
    'Andhra Pradesh': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
      total: 290,
    },
    'Karnataka': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
      total: 250,
    },
    'Maharashtra': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
      total: 380,
    },
    'Tamil Nadu': {
      labels: Array.from({ length: 10 }, (_, i) => `${2013 + i}`),
      data: [25, 27, 29, 31, 33, 35, 37, 39, 41, 43],
      total: 355,
    },
  };

  const rawLifeCycleData = {
    'All States': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [50, 200, 350, 500, 450], total: 1550 },
    'Andhra Pradesh': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [30, 120, 180, 250, 220], total: 800 },
    'Karnataka': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [25, 100, 150, 220, 200], total: 695 },
    'Maharashtra': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [40, 160, 220, 300, 270], total: 990 },
    'Tamil Nadu': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [35, 140, 200, 280, 250], total: 905 },
    'Delhi': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [60, 250, 300, 380, 350], total: 1340 },
    'Gujarat': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [20, 80, 120, 150, 130], total: 500 },
    'Rajasthan': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [15, 60, 90, 120, 110], total: 395 },
    'West Bengal': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [50, 200, 280, 350, 320], total: 1200 },
    'Punjab': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [40, 160, 240, 310, 280], total: 1030 },
    'Haryana': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [25, 100, 150, 210, 190], total: 675 },
    'Bihar': { labels: ['Infancy', 'Childhood', 'Adolescence', 'Adulthood', 'Old Age'], data: [20, 80, 120, 180, 160], total: 560 },
  };

  const fetchData = () => {
    setCrimeData(rawCrimeData[selectedState]);
    setRapeData(rawRapeData[selectedState]);
    setLifeCycleData(rawLifeCycleData[selectedState]);
  };

  const requestLocationPermission = () => {
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    });
  };

  useEffect(() => {
    fetchData();
    requestLocationPermission();
  }, [selectedState]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <Text style={styles.title}>Crime Statistics</Text>
        <Picker
          selectedValue={selectedState}
          onValueChange={(itemValue) => setSelectedState(itemValue)}
        >
          {states.map((state) => (
            <Picker.Item key={state.value} label={state.label} value={state.value} />
          ))}
        </Picker>

        <BarChart
          data={{
            labels: crimeData?.labels || [],
            datasets: [{ data: crimeData?.data || [] }],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
          }}
        />

        <Text style={styles.subtitle}>Rape Incidents</Text>
        <BarChart
          data={{
            labels: rapeData?.labels || [],
            datasets: [{ data: rapeData?.data || [] }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
          }}
        />

        <Text style={styles.subtitle}>Age Group Data</Text>
        <ProgressChart
          data={{
            labels: lifeCycleData?.labels || [],
            data: lifeCycleData?.data.map((val: number) => val / lifeCycleData.total) || [],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
        />

        <Text style={styles.subtitle}>Location Data</Text>
        {location ? (
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        ) : (
          <Text>No location available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginLeft: 10,
  },
  map: {
    width: 250,
    height: 300,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default HomePage;
