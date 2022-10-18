import baseAPI from "../core/baseAPI";
import CommonDataManager from "../core/CommonDataManager";

/*
const requetActivityModel = {
    SignedInUserID: 286,
    UserID: 286,
    ClientID: 301,
    TaskID: 42490,
}
*/
const requetActivityModel = {
    SignedInUserID: 0,
    UserID: 0,
    ClientID: 0,
    TaskID: 0,
}

const getUserData = async () => {
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();

    let da = {
        SignedInUserID: userData.SignedInUserId,
        UserID: userData.UserId,
        ClientID: clientDetail.ClientID,
    }

    return da;
}


export const getJobQuotes = async (taskId, onSuccess, onFailure) => {
    let commonData = CommonDataManager.getInstance();
    let userData = await commonData.getUserDetail();
    let clientDetail = await commonData.getClientDetail();

    requetActivityModel.SignedInUserID = userData.SignedInUserId;
    requetActivityModel.UserID = userData.UserId;
    requetActivityModel.ClientID = clientDetail.ClientID;
    requetActivityModel.TaskID = taskId



    //console.log('jobquotedata: '+JSON.stringify(requetActivityModel));
    baseAPI.post('Task/GetTaskQuote/', requetActivityModel)
        .then((result) => {
            console.log(JSON.stringify(result.data));
            onSuccess(result.data)
        })
        .catch((error) => {
            console.log('error ' + error);
            onFailure(error)
        });
}

export const saveTaskQuoteAsync = async (data, onSuccess, onFailure) => {

    let userData = await getUserData()

    let dataTemp = { ...data, SignedInUserID: userData.SignedInUserID, UserID: userData.UserID, ClientID: userData.ClientID }
    console.log('saveTaskQuoteAsync: ' + JSON.stringify(dataTemp));

    baseAPI.post('Task/SetTaskQuote/', data)
        .then((result) => {
            console.log(JSON.stringify(result.data));
            onSuccess(result.data)
        })
        .catch((error) => {
            console.log('error ' + error);
            onFailure(error)
        });


}

export const saveTaskQuoteItemAsync = async (data, onSuccess, onFailure) => {

    let userData = await getUserData()

    let dataTemp = { ...data, SignedInUserID: userData.SignedInUserID, UserID: userData.UserID, ClientID: userData.ClientID }
    console.log('saveTaskQuoteItemAsync: ' + JSON.stringify(dataTemp));

    baseAPI.post('Task/SetTaskQuoteItem/', data)
        .then((result) => {
            console.log(JSON.stringify(result.data));
            onSuccess(result.data)
        })
        .catch((error) => {
            console.log('error ' + error);
            onFailure(error)
        });


}

export const deleteQuoteItem = (data, onSuccess, onFailure) => {
    // let commonData = CommonDataManager.getInstance();
    // let userData = await commonData.getUserDetail();
    // let clientDetail = await commonData.getClientDetail();

    console.log('deleteQuoteItem: ' + JSON.stringify(data));

    baseAPI.post('Task/SetTaskQuoteItem/', data)
        .then((result) => {
            console.log(JSON.stringify(result.data));
            onSuccess(result.data)
        })
        .catch((error) => {
            console.log('error ' + error);
            onFailure(error)
        });


}
