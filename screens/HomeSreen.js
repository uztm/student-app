import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableHighlight, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import subjects from './Subject';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.95;

const classDurationMinutes = 45;
const startTime = new Date(0, 0, 0, 9, 0); // 9:00 AM

const classStartTime = (index) => {
  const startTimeCopy = new Date(startTime);
  startTimeCopy.setMinutes(startTime.getMinutes() + index * classDurationMinutes);
  return startTimeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const classEndTime = (index) => {
  const startTimeCopy = new Date(startTime);
  startTimeCopy.setMinutes(startTime.getMinutes() + (index + 1) * classDurationMinutes);
  return startTimeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};



const getColor = (value, colorMap) => {
  switch (value) {
    case 'keldi':
      return colorMap.green;
    case 'kelmadi':
      return colorMap.red;
    case 'kechikdi':
      return colorMap.orange;
    default:
      return colorMap.black;
  }
};

const getAttendanceStatusColor = (attendance) => {
  const colorMap = {
    green: '#14AD51',
    red: '#FF0000',
    orange: '#FF9900',
    black: '#F0F2F4',
  };
  return getColor(attendance, colorMap);
};

const getClassStatusColor = (classStatus) => {
  switch (classStatus) {
    case 'Aktiv':
      return '#14AD51'; // Green
    case 'Tugagan':
      return '#777A7D'; // Red
    case 'Soon':
      return '#777A7D'; // Orange
    default:
      return '#F0F2F4'; // Black (fallback color)
  }
};

const getGradeColor = (grade) => {
  switch (grade) {
    case 0:
    case 1:
    case 2:
    case 3:
      return '#FF0000'; // Red
    case 4:
      return '#FF9900'; // Orange
    case 5:
      return '#14AD51'; // Green
    default:
      return '#F0F2F4'; // Black (fallback color)
  }
};

const WeekdayButton = ({ weekday, isActive, onPress }) => (
  <TouchableHighlight
    style={[
      styles.weekday,
      isActive ? styles.activeWeekday : null,
    ]}
    onPress={() => onPress(weekday)}
    underlayColor="#E5E5E5"
  >
    <View style={[styles.weekdayBackground, isActive ? styles.activeWeekdayBackground : null]}>
      <Text style={[styles.weekdayText, { color: isActive ? '#14AD51' : '#777A7D' }]}>{weekday}</Text>
    </View>
  </TouchableHighlight>
);

const HomeScreen = () => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const [activeWeekday, setActiveWeekday] = useState('Mon');

  const handleWeekdayPress = (weekday) => {
    setActiveWeekday(weekday);
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.teachingDays.some((dayData) => dayData.day === activeWeekday)
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, textAlign: 'left', color: '#5730FB' }}>Kundalik</Text>
        </View>
        <View style={styles.weekdaysContainer}>
          {weekdays.map((weekday, index) => (
            <WeekdayButton
              key={index}
              weekday={weekday}
              isActive={activeWeekday === weekday}
              onPress={handleWeekdayPress}
            />
          ))}
        </View>
      </View>
      {filteredSubjects.map((subject, index) => {
        const selectedDayData = subject.teachingDays.find((dayData) => dayData.day === activeWeekday);

        return (
          <View key={index} style={[styles.card, selectedDayData.classStatus === 'Aktiv' && styles.activeCard]}>
            <View style={styles.subjectInfo}>
              <View style={styles.subjectInfoWrp}>
                <View style={styles.rectangle}>
                  <Octicons name="book" size={28} color="#777A7D" />
                </View>
                <View style={styles.subNameWrp}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.time}>Start: {classStartTime(index)}</Text>
                  <Text style={styles.time}>End: {classEndTime(index)}</Text>
                </View>
                <View style={styles.attendanceContainer}>
                  <Text style={styles.attendanceLabel}>Davomat</Text>
                  <View
                    style={[
                      styles.attendanceStatus,
                      { backgroundColor: getAttendanceStatusColor(selectedDayData.attendance) },
                    ]}
                  >
                    <Text style={styles.attendanceStatusText}>{selectedDayData.attendance}</Text>
                  </View>
                </View>
                <View style={styles.gradeContainer}>
                  <Text style={styles.attendanceLabel}>Baho</Text>
                  <Text style={[styles.gradeText, { color: getGradeColor(selectedDayData.grade) }]}>
                    {selectedDayData.grade}
                  </Text>
                </View>
                <View style={styles.horizontalLine} />
                <View style={styles.attendanceContainer}>
                  <Text style={styles.attendanceLabel}>Dars holati</Text>
                  <View
                    style={[
                      styles.attendanceStatus,
                      { backgroundColor: getClassStatusColor(selectedDayData.classStatus) },
                    ]}
                  >
                    <Text style={styles.classStatusText}>{selectedDayData.classStatus}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      flexGrow: 1,
      backgroundColor: '#F0F2F4',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20,
      paddingBottom: 20,
  },
  card: {
      width: cardWidth,
      height: 80,
      borderRadius: 20,
      backgroundColor: '#FAFAFA',
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      marginBottom: 10,
      justifyContent: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'transparent', // This will be overridden based on classStatus
      marginVertical: 5, // Add margin to create space between each card
      paddingTop: 11,
  },
  activeCard: {
      borderColor: '#14AD51', // Green border color for 'Aktiv' classStatus
  },
  subjectInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  subjectInfoWrp: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'start',
      width: '100%',
  },
  subjectName: {
      fontSize: 14,
      fontWeight: 'bold',
      // paddingBottom: 10,
  },
  attendanceContainer: {
      alignItems: 'center',
  },
  attendanceLabel: {
      fontSize: 14,
      color: '#000000',
      paddingHorizontal: 6,
      borderRadius: 6,
      fontWeight: 'bold',
  },
  subNameWrp: {
      width: '25%',
  },
  attendanceStatus: {
      fontSize: 14,
      width: 72,
      fontWeight: 'bold',
      color: '#FFFFFF',
      paddingHorizontal: 6,
      borderRadius: 3,
      textAlign: 'center',
      top: 10,
  },
  attendanceStatusText: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: '700',
  },
  time: {
      fontSize: 10,
      color: '#666',
      marginTop: 5,
  },
  rectangle: {
      width: 60,
      height: 60,
      marginRight: 10,
      backgroundColor: '#F0F2F4', // Replace this with the desired rectangle color or styles
      borderRadius: 10,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
  },
  gradeContainer: {
      alignItems: 'center',
  },
  gradeText: {
      fontSize: 18,
      width: 40,
      fontWeight: 'bold',
      color: '#FFFFFF',
      paddingHorizontal: 6,
      borderRadius: 30,
      textAlign: 'center',
      marginTop: 5,
  },
  horizontalLine: {
      // Replace '50%' with the desired width value
      backgroundColor: '#CCCCCC',
      width: 3,
      height: 50,
      marginVertical: 10,
      width: 2, // Adjust the width of the horizontal line as needed
      alignSelf: 'center',
      // height: '70%',
  },
  classStatusText: {
      color: '#FFFFFF',
      fontWeight: '700',
      textAlign: 'center',
  },
  // Add styles for the weekdays row
  weekdaysContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // paddingHorizontal: 10,
      justifyContent: 'center',
      marginBottom: 10,
      width: '100%',
  },
  weekday: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  weekdayBackground: {
      backgroundColor: '#ffffff', // Add your desired background color here
      borderRadius: 10,
      width: 60,
      height: 50,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',

  },
  activeWeekdayBackground: {
      backgroundColor: '#ffffff', // Add your desired background color here
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      width: 70,
      height: 50,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#14AD51',
      borderWidth: 2,
  },
  weekdayText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#777A7D',
  },
  header: {
      // position: 'sticky',
      // top: 0,
      zIndex: 1,
      width: '100%',

      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
  },

});

export default HomeScreen;
