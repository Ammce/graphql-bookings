import React from 'react';
import Modal from 'react-awesome-modal';

const modal = props => {
    return (
        <div>
            <Modal
                visible={props.visibleModal}
                width="800"
                height="600"
                effect="fadeInUp"
            //onClickAway={() => this.closeModal()}
            >
                <div>
                    <h1>{props.header}</h1>
                    {props.children}
                    <button onClick={props.createEventAction}>Save</button>
                    <button onClick={props.closeModal}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default modal;