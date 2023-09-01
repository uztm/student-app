import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, TouchableHighlight } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import subjects from './Subject';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.95;



const AnalyticsComponent = () => {
  const getTotalSubjects = () => {
    const subjectsForWeekday = subjects.filter((subject) => subject.teachingDays.some((day) => day.day === activeWeekday));
    return subjectsForWeekday.length;
  };

  const getCompletedSubjects = () => {
    const subjectsForWeekday = subjects.filter((subject) => subject.teachingDays.some((day) => day.day === activeWeekday));
    return subjectsForWeekday.filter((subject) => subject.teachingDays.some((day) => day.classStatus === 'Tugagan'));
  };

  const getAverageGrade = () => {
    const completedSubjects = getCompletedSubjects();
    if (completedSubjects.length === 0) return 0;

    const totalGrades = completedSubjects.reduce((acc, subject) => {
      const teachingDay = subject.teachingDays.find((day) => day.day === activeWeekday);
      if (typeof teachingDay.grade === 'number') {
        return acc + teachingDay.grade;
      }
      return acc;
    }, 0);
    return totalGrades / completedSubjects.length;
  };

  const getAttendancePercentage = () => {
    const subjectsForWeekday = subjects.filter((subject) => subject.teachingDays.some((day) => day.day === activeWeekday));
    const attendedSubjects = subjectsForWeekday.filter((subject) => subject.teachingDays.some((day) => day.attendance === 'keldi'));
    return (attendedSubjects.length / subjectsForWeekday.length) * 100;
  };

  const getProductivityScore = () => {
    const averageGrade = getAverageGrade();
    const attendancePercentage = getAttendancePercentage();
    return (averageGrade + attendancePercentage) / 2;
  };

  const labels = subjects.map((subject) => subject.name);

  const renderChart = (subject, activeWeekday) => {
    const teachingDay = subject.teachingDays.find((day) => day.day === activeWeekday);

    // Define the color for the low status (e.g., when grade < 4)
    const lowStatusColor = '#FF0000'; // Red color

    return (
      <View key={subject.name} style={styles.chartContainer}>
        {teachingDay && ( // Check if teachingDay exists before rendering the label and BarChart
          <>
            <Text
              style={{
                color: teachingDay.grade !== ' ' ? (teachingDay.attendance === 'keldi' ? '#14AD51' : teachingDay.grade < 4 ? lowStatusColor : '#FF9900') : '#777A7D',
                fontWeight: 'bold',
                fontSize: 12,
                backgroundColor: '#fff',
                padding: 2,
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              {subject.name}
            </Text>
            <BarChart
              style={{ height: 150, width: 30 }} // Adjust the height and width as needed
              data={[
                {
                  value: teachingDay.grade !== ' ' ? teachingDay.grade : 0,
                  svg: {
                    fill: teachingDay.grade !== ' '
                      ? teachingDay.attendance === 'keldi'
                        ? '#14AD51'
                        : teachingDay.grade < 4
                        ? lowStatusColor
                        : '#FF9900'
                      : '#000',
                  },
                },
              ]}
              yAccessor={({ item }) => item.value}
              contentInset={{ top: 15, bottom: 0 }}
              yMin={0}
              gridMin={5}
            />
          </>
        )}
      </View>
    );
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

  const handleWeekdayPress = (weekday) => {
    setActiveWeekday(weekday);
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const [activeWeekday, setActiveWeekday] = useState('Mon');

  return (
    <View style={styles.container}>
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
      <View style={styles.infoWrapper}>
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Octicons name="graph" size={20} color="#5730FB" />
            <Text style={styles.header}>Umumiy o'rtacha ko'rsatgich</Text>
          </View>

          <Text style={styles.infoText}>Jami darslar soni: {getTotalSubjects()}</Text>
          <Text style={styles.infoText}>O'rtacha baho: {getAverageGrade().toFixed(2)}</Text>
          <Text style={styles.infoText}>Davomat foizi: {getAttendancePercentage().toFixed(2)}%</Text>
          <Text style={styles.infoText}>Hosildorlik reytingi: {getProductivityScore().toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.card}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20}}><MaterialCommunityIcons name="chart-box-outline" size={24} color="#5730FB" /><Text style={styles.header}>Fanlar kesimida kunlik analitika</Text></View>
        <View style={styles.chartScrollViewContainer2}>
          <ScrollView horizontal contentContainerStyle={styles.chartScrollViewContainer} showsHorizontalScrollIndicator={true}>
            {subjects.map((subject) => renderChart(subject, activeWeekday))}
          </ScrollView>
        </View>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5730FB',
    marginLeft: 5,
  },
 
  infoContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    width: cardWidth,
    padding: 15,
    borderRadius: 15,
    // paddingTop: 30
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
    backgroundColor: '#F0F2F4',
    padding: 5,
    borderRadius: 5,
    overflow: 'hidden',
    fontWeight: 'bold',
    width: '100%',
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    alignItems: 'start',
    justifyContent: 'flex-end',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5, // for Android shadow
    // margin: 10,
    padding: 15,
    height: 260,
    width: cardWidth,
  },
  chartScrollViewContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: '#ECEEF0',
    
  },
  chartScrollViewContainer2:{
    flexDirection: 'row',
    // alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ECEEF0',
    width: '100%'
  },
  chartContainer: {
    paddingHorizontal: 2,
    paddingTop: 15,
    
    backgroundColor: '#ECEEF0',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '100%'
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  customXAxisContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  labelNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  labelText: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
  },
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
});

export default AnalyticsComponent;
