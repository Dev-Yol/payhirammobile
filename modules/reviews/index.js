import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar as Solid} from '@fortawesome/free-solid-svg-icons';
import {faStar as Regular} from '@fortawesome/free-regular-svg-icons';
import {connect} from 'react-redux';
import Api from 'services/api/index.js';
import {Routes, Color} from 'common';
import {Spinner} from 'components';
import styles from 'modules/reviews/Styles.js';
import Button from 'components/Form/Button';
import UserImage from 'components/User/Image';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStar: 0,
      isLoading: false,
      comment: '',
    };
  }

  componentDidMount = () => {
    this.retrieve()
  }

  retrieve = () => {
    const { data } = this.props.navigation.state.params;
    const { user } = this.props.state;
    if(user == null || data == null || (data && data.partner == null)){
      Alert.alert(
        "Error Message",
        'Invalid request of page.',
        [
          { text: "Ok", onPress: () => {
            this.props.navigation.pop()
          }}
        ],
        { cancelable: false }
      );
      return
    }
    let parameter = null
    if(data.account_id == user.id){
      parameter = {
        condition: [{
          column: 'payload',
          clause: '=',
          value: 'account'
        }, {
          column: 'payload_value',
          clause: '=',
          value: data.partner.account_id
        }]
      }

      this.retrieveUser(data.partner.account_id)
    }else{
      parameter = {
        condition: [{
          column: 'payload',
          clause: '=',
          value: 'account'
        }, {
          column: 'payload_value',
          clause: '=',
          value: data.account_id
        }]
      }
      this.retrieveUser(data.account_id)
    }
    Api.request(Routes.ratingsRetrieve, parameters, response => {
        this.setState({isLoading: false});
        console.log('response', response)
      },
      (error) => {
        this.setState({isLoading: false});
      }
    );
  }

  retrieveUser = (id) => {
    let parameter = {
      condition: [{
        column: 'id',
        value: id,
        clause: '='
      }]
    }
    Api.request(Routes.accountRetrieve, parameter, response => {
        this.setState({isLoading: false});
        if(response.data.length > 0){
          this.setState({
            data: response.data[0]
          })
        }else{
          this.setState({
            data: null
          })
        }
      },
      (error) => {
        this.setState({isLoading: false});
      }
    );
  }

  submit = () => {
    const { data } = this.props.navigation.state.params;
    const { user } = this.props.state;
    if(user == null || data == null || (data && data.partner == null)){
      Alert.alert(
        "Error Message",
        'Invalid request of page.',
        [
          { text: "Ok", onPress: () => {
            this.props.navigation.pop()
          }}
        ],
        { cancelable: false }
      );
      return
    }
    let parameters = {
      account_id: user.account_information.account_id,
      payload: 'account',
      payload_value: data.account_id,
      payload_1: 'request',
      payload_value_1: data.id,
      comments: this.state.comment,
      value: this.state.selectedStar,
      status: 'full',
    };
    this.setState({isLoading: true});
    Api.request(Routes.ratingsCreate, parameters, response => {
        this.setState({isLoading: false}, () => {
          this.props.navigation.pop();
        });
      },
      (error) => {
        this.setState({isLoading: false});
      },
    );
  };

  renderStars = () => {
    const starsNumber = [1, 2, 3, 4, 5];
    return starsNumber.map((star, index) => {
      return this.state.selectedStar > index ? (
        <TouchableOpacity
          onPress={() => {
            this.setState({selectedStar: index + 1});
          }}
          key={index}
          style={styles.StarContainer}>
          <FontAwesomeIcon
            color={'#FFCC00'}
            icon={Solid}
            size={50}
            style={{
              color: '#FFCC00',
            }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            this.setState({selectedStar: index + 1});
          }}
          key={index}
          style={styles.StarContainer}>
          <FontAwesomeIcon
            color={'#FFCC00'}
            icon={Regular}
            size={50}
            style={{
              color: '#FFCC00',
            }}
          />
        </TouchableOpacity>
      );
    });
  };

  handleComment = (value) => {
    this.setState({comment: value});
  };


  renderDetails = (data) => {
    const { theme } = this.props.state;
    return(
      <View style={{
        flex: 1
      }}>
        <View style={styles.AvatarContainer}>
          {
            data && (
              <UserImage
                user={data}
                style={{
                  height: 100,
                  width: 100
                }}
                size={100}
                color={Color.white}
                />
            )
          }

          {
            data && (
              <Text style={[{fontWeight: 'bold', color: Color.white}]}>
                {data.username}
              </Text>
            )
          }
        </View>
        <View style={styles.RatingTitleContainer}>
          <Text style={styles.RatingTitleTextStyle}>
            How would you rate the service of our partner?
          </Text>
        </View>
        <View style={styles.RatingContainer}>{this.renderStars()}</View>
        <View style={styles.ExperienceTextContainer}>
          <Text style={styles.ExperienceTextStyle}>
            Tell us about your experience
          </Text>
        </View>
        <View style={styles.CommentContainer}>
          <TextInput
            style={styles.CommentTextStyle}
            onChangeText={this.handleComment}
          />
        </View>
        <View style={styles.ButtonContainer}>
         <Button
          style={{
            backgroundColor: theme ? theme.secondary : Color.secondary
          }}
          title={'Submit'}
          onClick={() => this.submit()}/>
        </View>
      </View>
    )
  }
  render() {
    const { theme } = this.props.state;
    const { data } = this.state;
    return (
      <View style={styles.ReviewsContainer}>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {data && this.renderDetails(data)}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);
