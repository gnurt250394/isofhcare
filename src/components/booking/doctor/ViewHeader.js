import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScaleImage from "mainam-react-native-scaleimage";

class ViewHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onPress, label, name, subName, source, button, iconRight } = this.props
        let ContainerComponent = button ? TouchableOpacity : View
        return (
            <ContainerComponent style={styles.btnVoucher}
                onPress={onPress ? onPress : () => { }}
            >
                <View style={styles.container}>
                    <ScaleImage style={{
                        marginTop: 4,
                    }} height={13} source={source} />
                    <View style={styles.flex}>
                        <Text >{label}</Text>
                        {name ?
                            <Text style={styles.txtname}>BS {name}</Text>
                            :
                            <Text style={styles.txtname}>{subName}</Text>

                        }
                    </View>
                </View>
                {iconRight && <ScaleImage style={styles.imgmdk} height={11} source={require("@images/new/booking/ic_next.png")} />}

            </ContainerComponent>
        );
    }
}

export default ViewHeader;


const styles = StyleSheet.create({
    flex: {
        flex: 1,
        paddingLeft: 7,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    btnVoucher: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 0.7,
        borderBottomColor: '#ccc'
    },
    txtname: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000000",
    },
})