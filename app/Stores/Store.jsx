import React from 'react';
import Api from '../Api';
import AddToFavoriteList from './AddToFavoriteList';
import UpdateStoreForm from './UpdateStoreForm';

class Store extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(`.store-${this.props.data.id}.info.modal`)
            .modal({
                allowMultiple: false,
                onApprove: () => {
                    this.showUpdateForm();
                },
                onDeny: () => {
                    this.deleteStore();
                }
            });
    }

    deleteStore() {
        Api.deleteStore(this.props.data.id, this.props.auth.token)
            .done((data) => {
                this.props.deleteStoreData();
            });
    }

    selectStore(event) {
        event.preventDefault();
        this.props.selectStore(this.props.data);
    }

    showAddToFavoriteList() {
        $(`.fav-store-${this.props.data.id}.modal`).modal('show');
    }

    showStoreInfo() {
        $(`.store-${this.props.data.id}.info.modal`).modal('show');
    }

    showUpdateForm() {
        $(`.update-store-${this.props.data.id}.form.modal`).modal('show');
    }

    renderAddToFavoriteList() {
        if (this.props.auth.isLogin) {
            let props = {
                auth: this.props.auth,
                data: this.props.data,
                favoriteList: this.props.favoriteList,
                updateFavoriteList: this.props.updateFavoriteList.bind(this)
            }
            return <AddToFavoriteList {...props} />;
        }
    }

    renderModifyButton() {
        if (this.props.auth.isLogin && this.props.auth.username == this.props.data.provide_by) {
            return (
                <div className="actions">
                    <div className="two fluid ui inverted buttons">
                        <div className="ui ok green basic inverted button">
                            <i className="refresh icon"></i>修改
					        </div>
                        <div className="ui cancel red basic inverted button">
                            <i className="remove icon"></i>刪除
					        </div>
                    </div>
                </div>
            );
        }
    }

    renderStoreInfo() {
        let storeClass = `ui basic store-${this.props.data.id} info modal`;
        let type = this.props.data.type ? <div>商家類別：{this.props.data.type__name}</div> : <div>商家類別：無</div>;
        let area = this.props.data.area ? <div>區域：{this.props.data.area__name}</div> : <div>區域：無</div>;
        let mapSrc = `https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${this.props.data.address}&z=16&output=embed&t=`;
        return (
            <div>
                <div className={storeClass}>
                    <div className="header">{this.props.data.name}</div>
                    <div className="content">
                        <div>地址：{this.props.data.address}</div>
                        <div>電話：{this.props.data.phone}</div>
                        <div>平均價格：{this.props.data.avg_price}</div>
                        {type}
                        {area}
                        <div>提供者：{this.props.data.provide_by}</div>
                        <iframe width="600" height="400" src={mapSrc} allowFullScreen></iframe>
                    </div>
                    {this.renderModifyButton()}
                </div>
            </div>
        );

    }

    renderUpdateForm() {
        if (this.props.auth.isLogin && this.props.auth.username == this.props.data.provide_by) {
            return <UpdateStoreForm auth={this.props.auth} data={this.props.data} updateStoreData={this.props.updateStoreData.bind(this)} />;
        }
    }

    render() {
        let imgClass = this.props.data.image_url ? '' : 'default-img';
        return (
            <div className="store">
                <div className="store-desc">
                    <img className={imgClass} src={this.props.data.image_url} alt="" />
                    <div className="store-name">{this.props.data.name}</div>
                    <div className="store-ani"></div>
                </div>
                <div className="add" onClick={this.selectStore.bind(this)}>
                    <i className="checkmark box icon large"></i>
                </div>
                <div className="favorite" onClick={this.showAddToFavoriteList.bind(this)}>
                    <i className="empty heart icon large"></i>
                </div>
                <div className="details" onClick={this.showStoreInfo.bind(this)}>
                    <i className="ellipsis horizontal icon large"></i>
                </div>
                {this.renderAddToFavoriteList()}
                {this.renderStoreInfo()}
                {this.renderUpdateForm()}
            </div>
        );
    }
};

export default Store;
