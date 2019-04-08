import React, { Component, Fragment } from 'react';

import Modal from '../components/Modal/Modal';
import CreateEventForm from '../components/Events/CreateEvent';
import AuthContext from '../context/auth-context';
import { Card } from 'primereact/card'
import { Growl } from 'primereact/growl';


class Events extends Component {

    state = {
        visibleModal: false,
        events: [],
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.descriptionEl = React.createRef();
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
    }

    componentDidMount() {
        this.getAllEvents();
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

        if (data.title.trim().length === 0 || data.description.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
              mutation {
                createEvent(data: {title: "${data.title}", description: "${data.description}", date: "${data.date}", price: ${data.price}}) {
                  _id
                  title
                  description
                  price
                  creator {
                      _id
                      email
                  }
                }
              }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Baerer ' + this.context.token
            }
        })
            .then(res => {
                return res.json();
            })
            .then(resData => {
                this.setState(prevState => {
                    return {
                        events: [...prevState.events, resData.data.createEvent]
                    }
                }, () => {
                    this.closeModal();
                    this.showSuccess(resData.data.createEvent);
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    getAllEvents = () => {
        let requestBody = {
            query: `
              query {
                events{
                  _id
                  title
                  description
                  price
                  creator {
                      _id
                      email
                  }
                }
              }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return res.json();
            })
            .then(resData => {
                this.setState({
                    events: resData.data.events
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    showSuccess = (data) => {
        this.growl.show({ severity: 'success', summary: 'Event Created', detail: `Event ${data.title} is created now` });
    }

    render() {
        let eventsList = this.state.events.map(event => <Card key={event._id}>
            <h5>{event.title}</h5>
        </Card>)
        return (
            <Fragment>
                <Growl ref={(el) => this.growl = el} />
                <div>
                    {this.context.token && <button onClick={this.openModal}>Create Event</button>}
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
                <div>
                    <h1>See list of events bellow</h1>
                    {eventsList}
                </div>
            </Fragment>
        );
    }
}

export default Events;