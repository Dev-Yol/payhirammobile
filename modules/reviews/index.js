import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar as Solid} from '@fortawesome/free-solid-svg-icons';
import {faStar as Regular} from '@fortawesome/free-regular-svg-icons';

import styles from 'modules/reviews/Styles.js';
import SubmitReview from './SubmitReviewButton';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStar: 0,
    };
  }

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

  render() {
    return (
      <View style={styles.ReviewsContainer}>
        <View style={styles.AvatarContainer}>
          <Image
            source={{
              uri: 'https://reactjs.org/logo-og.png',
            }}
            style={{width: 100, height: 100, borderRadius: 100 / 2}}
          />
        </View>
        <View style={styles.NameContainer}>
          <Text style={styles.NameTextStyle}>KEENAN MENDIOLA</Text>
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
          <TextInput style={styles.CommentTextStyle} />
        </View>
        <View style={styles.ButtonContainer}>
          <SubmitReview
            buttonColor="#22B173"
            buttonWidth="100%"
            buttonHeight={50}
            fontSize={16}
            textColor="#FFFFFF"
            buttonText="Submit"
            onPress={() => {}}
          />
        </View>
      </View>
    );
  }
}

export default Reviews;
