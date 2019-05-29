import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';


class ModalComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal {...this.props}>
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={()=>{this.props.onBackdropPress(); }}>
                    {this.props.children}
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}
export default ModalComponent;