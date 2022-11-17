import { udatabase } from "../OfflineData/UserAyncDetail";
export default class CommonDataManager {
  static myInstance = null;

  _userDetail = null;
  _clientDetail = null;
  _menuData = null;
  _groupData = null;
  _clientAppData = null;
  _moduleData = null;

  /**
   * @returns {CommonDataManager}
   */
  static getInstance = () => {
    if (CommonDataManager.myInstance == null) {
      CommonDataManager.myInstance = new CommonDataManager();
    }

    return this.myInstance;
  };

  async getMenuData() {
    const data = await udatabase.getUserDatAsync("menuData");
    this._menuData = JSON.parse(data.userData);
    return this._menuData;
  }

  setMenuData(menuData) {
    this._menuData = menuData;
  }

  async getUserDetail() {
    if (this._userDetail == null) {
      const data = await udatabase.getUserDatAsync("userdetail");
      if (data.userData) this._userDetail = JSON.parse(data.userData);

      return this._userDetail;
    } else return this._userDetail;
  }

  setUserDetail(userDetail) {
    this._userDetail = userDetail;
  }

  async getClientDetail() {
    if (this._clientDetail == null) {
      const data = await udatabase.getUserDatAsync("clientdetail");
      this._clientDetail = JSON.parse(data.userData);
      return this._clientDetail;
    } else return this._clientDetail;
  }

  setClientDetail(clientDetail) {
    this._clientDetail = clientDetail;
  }

  async getGroupDetail() {
    if (this._groupData == null) {
      const data = await udatabase.getUserDatAsync("groupData");
      this._groupData = JSON.parse(data.userData);
      return this._groupData;
    } else return this._groupData;
  }

  setGroupDetail(groupDetail) {
    this._groupData = groupDetail;
  }

  async getModuleDetail() {
    if (this._moduleData == null) {
      //this._moduleData  = null;
      const data = await udatabase.getUserDatAsync("moduleData");
      this._moduleData = JSON.parse(data.userData);
      //alert(JSON.stringify(data));
      return this._moduleData;
    } else return this._moduleData;
  }

  setModuleDetail(moduleData) {
    this._moduleData = moduleData;
  }
  async getClientAppData() {
    if (this._clientAppData == null) {
      const data = await udatabase.getUserDatAsync("clientApps");
      //alert(JSON.stringify(data));
      this._clientAppData = JSON.parse(data.userData);
      return this._clientAppData;
    } else return this._clientAppData;
  }

  setClientAppData(moduleData) {
    this._clientAppData = moduleData;
  }
}
