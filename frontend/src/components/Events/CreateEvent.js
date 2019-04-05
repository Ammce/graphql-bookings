import React from 'react';

const createEvent = props => {
    return (
        <form>
            <div>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={props.titleEl} />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input type="text" id="description" ref={props.descriptionEl} />
            </div>
            <div>
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={props.priceEl} />
            </div>
            <div>
                <label htmlFor="date">Date</label>
                <input type="date" id="date" ref={props.dateEl} />
            </div>
        </form>
    );
}

export default createEvent;