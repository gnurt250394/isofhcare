import React, { Component } from 'react';
import { View, Text, TouchableOpacity,StyleSheet} from 'react-native';
import ScaledImage from 'mainam-react-native-scaleimage';

export default class Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTrade:false
        };
    }
    showTrade = () => {
        this.setState({showTrade:!this.state.showTrade})
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.btnTrade} onPress = {this.showTrade}>
                    <Text> Lịch sử giao dịch </Text>
                    {this.state.showTrade ? <ScaledImage width={10} source={require('@images/new/profile/ic_minus.png')}></ScaledImage> : <ScaledImage height={10} source={require('@images/new/profile/ic_plus.png')}></ScaledImage>

                    }
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{

    },
    btnTrade:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
    }
})