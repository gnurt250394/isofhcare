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
const ListSpecialQuestion = ({onSelected}) => {
  const [specialist, setSpecialist] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  useEffect(() => {
    getListSpecialist();
  }, [page]);
  const getListSpecialist = () => {
    bookingDoctorProvider
      .get_list_specialists(page, size)
      .then(res => {
        if (res && res.content.length > 0) {
          formatData(res.content);
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
    console.log('item: ', item);
  };
  const renderListSpecialist = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={onSelectSpecial(item)}
        style={[
          styles.containerItemSpecialist,
          {
            // backgroundColor: '#00CBA7',
            backgroundColor:
              index == 0 || index % 3 == 0
                ? '#AA6550'
                : index % 2 != 0
                ? '#E8505B'
                : '#FF8A00',
          },
        ]}>
        {/* <ScaleImage source={require('@images/new/user.png')} width={19} /> */}
        <Text style={{color: '#FFF'}} numberOfLines={2}>
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
  },
});
export default memo(ListSpecialQuestion);
