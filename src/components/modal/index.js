import React, { Component } from 'react';
import { TouchableWithoutFeedback, Platform } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';


class ModalComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (Platform.OS == "android")
            return (<Modal {...this.props}>
                {this.props.children}
            </Modal>)
        return (
            <Modal {...this.props}>
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => { this.props.onBackdropPress(); }}>
                    {this.props.children}
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}
export default ModalComponent;