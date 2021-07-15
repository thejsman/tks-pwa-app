import React, { Component } from "react";
import "./shagaan.css";
import { connect } from "react-redux";
import { getContactDetails, getEventId } from "../../selectors";
import cloneDeep from "lodash/cloneDeep";
import $ from "jquery";
import { isMobile, AppShortName } from "../../config/config.js";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import { browserHistory } from "react-router";

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactData: cloneDeep(props.contactData),
    };
    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() !== "true") {
      browserHistory.push("/");
    }
  }
  componentDidMount() {
    const rpForm = document.getElementById("razorpay_btn");
    const script = document.createElement("script");
    document.head.appendChild(script);
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_HVOhJMIIYYRpOK");
    script.async = true;
    rpForm.appendChild(script);

    $("body").attr("class", "");

    fetchWelcomeDetails();
    if (isMobile) {
      $("#spanHeaderText").html("Shagan");
      $(".notificationBell").show();
      $(".appLogo").hide();
      $(".chat").show();
    }
    $("html").scrollTop(0);
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.contactData) {
      fetchWelcomeDetails();
    }
    if (this.props.contactData !== nextProps.contactData) {
      this.setState({ contactData: cloneDeep(nextProps.contactData) });
    }
  }
  render() {
    $(".backIcon").show();
    $(".backIconMobile").show();
    const responsive = {
      0: {
        items: 1,
      },
    };
    const { contactData = {} } = this.state;
    let contacts = contactData.contactItems;
    return (
      <div className="container-fluid respobsiveMarginTop contactusmaincontent">
        <h3 className="headingTop headingTopMobile appBodyFontColor appBodyFontFamily d-none d-sm-block">
          &nbsp;
        </h3>
        <div className=" mT90ContactUs">
          <div>
            <img
              className="img-fluid w-100"
              src="https://s3-ap-southeast-1.amazonaws.com/tksproduction/bmtimages/Jvc6rndfyZBW2ikBC.jpeg"
            ></img>
          </div>
          <div className="text-center">
            <h5 className="text-white my-2 appBodyFontFamily pt-4">
              Pay Shagan Digitally
            </h5>
            <div className="BtnCommon responsiveBtn rsvpWeddingGuestName my-5">
              <div>
                <form id="razorpay_btn"></form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contactData: getContactDetails(state),
    eventId: getEventId(state),
  };
}

export default connect(mapStateToProps)(ContactUs);
