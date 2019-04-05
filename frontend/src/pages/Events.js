import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import CreateEventForm from '../components/Events/CreateEvent';
import AuthContext from '../context/auth-context';


class Events extends Component {

    state = {
        visibleModal: false,
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.descriptionEl = React.createRef();
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
    }

    openModal = () => {
        this.setState({
            visibleModal: true
        })
    }

    closeModal = () => {
        this.setState({
            visibleModal: false
        })
    }

    createEventAction = (e) => {
        e.preventDefault();
        let data = {
            price: +this.priceEl.current.value,
            description: this.descriptionEl.current.value,
            title: this.titleEl.current.value,
            date: new Date(this.dateEl.current.value).toISOString(),
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.openModal}>Create Event</button>
                <Modal
                    openModal={this.openModal}
                    closeModal={this.closeModal}
                    visibleModal={this.state.visibleModal}
                    createEventAction={this.createEventAction}
                    header={"Add Event"}
                >
                    <CreateEventForm
                        eventData={this.state.eventData}
                        handleEventChange={this.handleEventChangeTitle}
                        titleEl={this.titleEl}
                        descriptionEl={this.descriptionEl}
                        priceEl={this.priceEl}
                        dateEl={this.dateEl}
                    />
                </Modal>
            </div>
        );
    }
}

export default Events;