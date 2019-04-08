import React from 'react';
import { InputText } from 'primereact/inputtext';
import './CreateEvent.css';

const createEvent = props => {
    return (
        <form className="form_add_event">
            <div className="form_add_event_element">
                <label className="form_add_event_label" htmlFor="title">Title</label>
                <InputText className="form_add_event_input" type="text" id="title" ref={props.titleEl} />
            </div>
            <div className="form_add_event_element">
                <label className="form_add_event_label" htmlFor="description">Description</label>
                <InputText className="form_add_event_input" type="text" id="description" ref={props.descriptionEl} />
            </div>
            <div className="form_add_event_element">
                <label className="form_add_event_label" htmlFor="price">Price</label>
                <InputText className="form_add_event_input" type="number" id="price" ref={props.priceEl} />
            </div>
            <div className="form_add_event_element">
                <label className="form_add_event_label" htmlFor="date">Date</label>
                <input className="form_add_event_input" type="date" id="date" ref={props.dateEl} />
            </div>
        </form>
    );
}

export default createEvent;