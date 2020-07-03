import React, {useState, useEffect, memo} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import bookingDoctorProvider from '@data-access/booking-doctor-provider';
const {height, width} = Dimensions.get('screen');
const ListSpecialQuestion = ({onSelected, onFocus = true}) => {
  const [specialist, setSpecialist] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  useEffect(() => {
    onFocus && getListSpecialist();
  }, [page, onFocus]);
  const getListSpecialist = () => {
    bookingDoctorProvider
      .get_list_specialists(page, size)
      .then(res => {
        if (res && res.length > 0) {
          formatData(res);
        } else {
          formatData([]);
        }
      })
      .catch(err => {
        formatData([]);
      });
  };
  const formatData = data => {
    if (data.length == 0) {
      if (page == 0) {
        setSpecialist(preState => []);
      }
    } else {
      if (page == 0) {
        setSpecialist(preState => data);
      } else {
        setSpecialist(preState => [...preState, ...data]);
      }
    }
  };
  const loadMoreSpecialist = () => {
    if (specialist.length >= (page + 1) * size) {
      setPage(preState => preState + 1);
    }
  };
  const onSelectSpecial = item => () => {
    onSelected && onSelected(item);
    let data = [...specialist];
    data.forEach(e => {
      if (e.id == item.id) {
        e.selected = true;
      } else {
        e.selected = false;
      }
    });
    setSpecialist(data);
    console.log('item: ', item);
  };
  const renderListSpecialist = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={onSelectSpecial(item)}
        style={[
          styles.containerItemSpecialist,
          {
            backgroundColor: !item.selected ? '#FFF' : '#3161AD',
          },
        ]}>
        {/* <ScaleImage source={require('@images/new/user.png')} width={19} /> */}
        <Text
          style={{
            color: item.selected ? '#FFF' : '#3161AD',
            fontWeight: 'bold',
          }}
          numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  const keyExtractor = (item, index) => `${index}`;

  return (
    <View>
      <FlatList
        data={specialist}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          backgroundColor: '#00000010',
          paddingVertical: 10,
          paddingRight: 10,
        }}
        renderItem={renderListSpecialist}
        keyExtractor={keyExtractor}
        horizontal={true}
        onEndReached={loadMoreSpecialist}
        onEndReachedThreshold={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerItemSpecialist: {
    maxWidth: width / 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 30,
    padding: 15,
    borderColor: '#3161AD',
    borderWidth: 1,
  },
});
export default memo(ListSpecialQuestion);
