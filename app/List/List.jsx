import React from 'react';
import Api from '../Api';
import FavoriteList from './FavoriteList';
import ListItem from './ListItem';

class List extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('.tab-thinking')
            .on('click', () => {
                $.tab('change tab', 'thinking');
            });
        $('.tab-favorite')
            .on('click', () => {
                $.tab('change tab', 'favorite');
            });
        $('.tab-thinking').trigger('click');

        $('.ui.random-result.modal').modal({
            allowMultiple: false,
            onApprove: () => {
            }
        });
    }

    addFavoriteList(event) {
        event.preventDefault();
        Api.addFavoriteList(this.refs.listname.value, this.props.auth.token)
            .done((data) => {
                $('#add-list-form input').val('');
                let sid = [];
                this.props.storesData.map((storeData) => {
                    sid.push(storeData.id);
                });
                Api.addStoreToFavoriteList(data.id.toString(), sid, this.props.auth.token)
                    .done(() => {
                        this.props.updateFavoriteList();
                    });
            })
            .fail(() => {
                $('#add-list-form').val('');
            });
    }

    renderFavoriteList() {
        if (this.props.favoriteListlength === 0) {
            return;
        }
        return this.props.favoriteList.map((list) => {
            let props = {
                auth: this.props.auth,
                key: list.listname_id,
                listName: list.listname,
                listNameId: list.listname_id,
                selectFavorite: this.props.selectFavorite.bind(this),
                storesData: list.storesData,
                updateFavoriteList: this.props.updateFavoriteList.bind(this)
            };
            return (<FavoriteList {...props} />);
        });
    }

    renderListButton() {
        if (this.props.storesData.length != 0) {
            let addFavoriteForm;
            if (this.props.auth.isLogin) {
                addFavoriteForm = (
                    <div id="add-list-form" className="add-list-form">
                        <input type="text" name="listname" placeholder="最愛清單名稱" ref="listname" />
                        <button className="add-favorite" onClick={this.addFavoriteList.bind(this)}>加入最愛</button>
                    </div>
                );
            }
            return (
                <div>
                    <div className="list-exec">
                        <div className="ui vertical animated green button random" onClick={this.props.randomDecide.bind(this)}>
                          <div className="hidden content">隨機</div>
                          <div className="visible content">
                            <i className="cube icon"></i>
                          </div>
                        </div>
                        <div className="ui vertical animated button clear" onClick={this.props.resetRandom.bind(this)}>
                          <div className="hidden content">清除</div>
                          <div className="visible content">
                            <i className="trash icon"></i>
                          </div>
                        </div>
                    </div>
                    {addFavoriteForm}
                </div>
            );
        }
    }

    renderListItem() {
        if (this.props.storesData.length == 0) {
            return (<li>無選擇</li>);
        }
        return this.props.storesData.map((storeData) => {
            return (<ListItem key={storeData.id} data={storeData} unselectStore={this.props.unselectStore.bind(this)} />);
        });
    }

    renderRandomStore() {
        return (
            <div className="ui basic random-result modal">
                <div className="header">去吃{this.props.randomStore.name}吧！</div>
                <div className="actions">
                    <div className="two fluid ui inverted buttons">
                        <div className="ui ok green basic inverted button">
                            <i className="map icon"></i>Google Map
					    </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="list">
                <button className="tab-thinking ui teal button" data-tab="thinking">選擇列表</button>
                <button className="tab-favorite ui blue button" data-tab="favorite">最愛</button>
                <div className="ui tab" data-tab="favorite">
                    {this.renderFavoriteList()}
                </div>
                <div className="ui tab thinking" data-tab="thinking">
                    {this.renderListButton()}
                    < ul >
                        {this.renderListItem()}
                    </ul >
                </div>
                {this.renderRandomStore()}
            </div>
        );
    }
};

export default List;
