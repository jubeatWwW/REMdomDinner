import React from 'react';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    unselectStore() {
        event.preventDefault();
        this.props.unselectStore(this.props.data);
    }

    render() {
        return (
            <li>
                <div>
                    {this.props.data.name}
                </div>
                <div className="shake-ani">
                    <div className="list-remove-icon" onClick={this.unselectStore.bind(this)}></div>
                </div>
            </li>
        );
    }
};

export default ListItem;
