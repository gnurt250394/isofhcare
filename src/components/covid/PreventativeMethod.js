import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';

const PreventativeMethod = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.txtHeader}>BIỆN PHÁP NGĂN NGỪA</Text>
      <Text style={styles.txtContent}>
        Hiện tại, chưa có vắc xin ngăn ngừa COVID-19. Tránh tiếp xúc với virus
        là cách tốt nhất để ngăn ngừa lây nhiễm. Các biện pháp tiêu chuẩn để
        ngăn chặn sự lây lan của virus đường hô hấp, bao gồm:
      </Text>
      <View style={styles.containerGuide1}>
        <ScaledImage
          source={require('@images/new/covid/ic_hand_washing.png')}
          height={45}
        />
        <Text style={styles.txtCenter}>
          Rửa tay thường xuyên bằng xà phòng và nước trong ít nhất 20 giây.
        </Text>
        <Text style={styles.txtHelp}>
          (Nếu không có xà phòng và nước, hãy sử dụng thuốc khử trùng tay chứa
          cồn)
        </Text>
      </View>

      <View style={styles.containerGuide2}>
        <View style={styles.groupGuide2}>
          <ScaledImage
            source={require('@images/new/covid/ic_away_eye.png')}
            height={45}
          />
          <Text style={styles.txtCenter}>
            Tránh chạm vào mắt, mũi và miệng bằng tay không rửa sạch.
          </Text>
        </View>
        <View style={styles.groupGuide2}>
          <ScaledImage
            source={require('@images/new/covid/ic_keep_distance.png')}
            height={45}
          />
          <Text style={styles.txtCenter}>
            Duy trì khoảng cách ít nhất 2 mét với bất kỳ ai bị sốt và ho.
          </Text>
        </View>
      </View>
      <View style={styles.containerGuide2}>
        <View style={styles.groupGuide2}>
          <ScaledImage
            source={require('@images/new/covid/ic_clean.png')}
            height={45}
          />
          <Text style={styles.txtCenter}>
            Làm sạch và khử trùng các vật và bề mặt thường xuyên chạm vào.
          </Text>
        </View>
        <View style={styles.groupGuide2}>
          <ScaledImage
            source={require('@images/new/covid/ic_cover_mouth.png')}
            height={45}
          />
          <Text style={styles.txtCenter}>
            Che miệng khi ho hoặc hắt hơi bằng khăn giấy, sau đó ném khăn giấy
            vào thùng rác.
          </Text>
        </View>
      </View>
      <View style={styles.containerGuide2}>
        <View style={styles.groupGuide2}>
          <ScaledImage
            source={require('@images/new/covid/ic_home.png')}
            height={45}
          />
          <Text style={styles.txtCenter}>Hãy ở nhà nếu bạn bị bệnh.</Text>
        </View>
        <View style={styles.groupGuide2}>
          <ScaledImage
            source={require('@images/new/covid/ic_wear_mask.png')}
            height={45}
          />
          <Text style={styles.txtCenter}>Đeo khẩu trang mọi lúc mọi nơi.</Text>
        </View>
      </View>
    </View>
  );
};

export default PreventativeMethod;

const styles = StyleSheet.create({
  groupGuide2: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
  },
  containerGuide2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  txtHelp: {
    textAlign: 'center',
    color: '#00000060',
    paddingHorizontal: 20,
  },
  txtCenter: {
    textAlign: 'center',
    paddingTop: 5,
  },
  containerGuide1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  txtContent: {
    color: '#00000080',
    textAlign: 'center',
  },
  txtHeader: {
    color: '#3161AD',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});
