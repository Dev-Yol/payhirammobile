import { connect } from 'react-redux';
class NotificationHandler{
  function onRegister (token){
  //   console.log("[App] onRegister", token)
  }

  onOpenNotification = (notify) => {
    // console.log("[App] onOpenNotification", notify)
  }

  onNotification = (notify) => {
    const { user } = this.props.state;
    let data = null
    if(user == null || !notify.data){
      return
    }
    data = notify.data
    console.log('notification-data', data)
    let payload = data.payload
    console.log('payload', payload)
    switch(payload.toLowerCase()){
      case 'message': {
          const { messengerGroup } = this.props.state;
          let members = JSON.parse(data.members)
          console.log('members', members)
          if(messengerGroup == null && members.indexOf(user.id) > -1){
            console.log('[messengerGroup] on empty', data)
            const { setUnReadMessages } = this.props;
            setUnReadMessages(data)
            return
          }
          if(parseInt(data.messenger_group_id) === messengerGroup.id && members.indexOf(user.id) > -1){
            if(parseInt(data.account_id) != user.id){
              const { updateMessagesOnGroup } = this.props;
              updateMessagesOnGroup(data);
            }
            return
          }
        }
        break
      case 'notifications': {
          if(parseInt(data.to) == user.id){
            console.log("[Notifications] data", data)
            const { updateNotifications } = this.props;
            updateNotifications(1, data)
          }
        }
        break
      case 'requests': {
          console.log('requests', user)
          let unReadRequests = this.props.state.unReadRequests
          if(data.target == 'public'){
            console.log("[Public Requests]", data)
            unReadRequests.push(data)
            const { setUnReadRequests } = this.props;
            setUnReadRequests($unReadRequests);
          }else if(data.target == 'partners'){
            const { user } = this.props.state;
            if(user == null){
              return
            }else{
              console.log("[Partner Requests]", data.scope)

              console.log("[Partner Requests] user", user.plan.original.data[0])
              if(user.scope_location.includes(data.scope)){
                console.log("[Partner Requests] added", data)
                unReadRequests.push(data)
                const { setUnReadRequests } = this.props;
                setUnReadRequests($unReadRequests);
              }else{
                console.log("[Partner Requests] Empty")
              }
            }
          }else if(data.target == 'circle'){
            //
          }
        }
        break
      case 'update-request': {
          const { requests, request } = this.props.state;
          if(request != null && request.code == data.code){
            const { setRequest } = this.props;
            setRequest({
              ...request,
              status: data.status
            })
            return
          }
          if(requests.length > 0){
            const { setUpdateRequests } = this.props;
            setUpdateRequests(data)
            return
          }
        }
        break
      case 'payments': {
        const { setAcceptPayment } = this.props;
        let topicId = topic.length > 1 ? topic[1] : null
        console.log('[payments]', data)
        if(topicId && parseInt(topicId) == user.id){
          if(data.transfer_status == 'requesting'){
            setAcceptPayment(data)
            Alert.alert(
              "Payment Request",
              "There\'s new payment request, would you like to open it?",
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    setAcceptPayment(null)
                  },
                  style: "cancel"
                },
                { text: "Yes", onPress: () => {
                  this.props.navigation.navigate('recievePaymentRequestStack')
                } }
              ]
            );            
          }else{
            // declined or completed here
            console.log('on confirm', data)
            setAcceptPayment(data)
            const { setPaymentConfirmation } = this.props;
            setPaymentConfirmation(false)
            this.props.navigation.navigate('Dashboard')
          }

        }else{

        }
        
      }
      break
      case 'comments': {
        const { setComments } = this.props;
        let topicId = topic.length > 1 ? topic[1] : null
        console.log('[comments]', data)
        if(topicId && parseInt(topicId) == user.id){
          setComments(data)
        }else{

        }
        
      }
      break
    }
  }
}

 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setUnReadMessages: (messages) => dispatch(actions.setUnReadMessages(messages)),
    setUnReadRequests: (requests) => dispatch(actions.setUnReadRequests(requests)),
    updateRequests: (request) => dispatch(actions.updateRequests(request)),
    setRequest: (request) => dispatch(actions.setRequest(request)),
    updateNotifications: (unread, notification) => dispatch(actions.updateNotifications(unread, notification)),
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
    viewChangePass: (changePassword) => dispatch(actions.viewChangePass(changePassword)),
    setComments: (comments) => dispatch(actions.setComments(comments)),
    setPaymentConfirmation: (flag) => dispatch(actions.setPaymentConfirmation(flag))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationHandler);
