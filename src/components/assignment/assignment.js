import React, { Component } from "react";
import "./assignment.css";
import { connect } from "react-redux";
import { getContactDetails, getEventId } from "../../selectors";
import cloneDeep from "lodash/cloneDeep";
import $ from "jquery";
import { isMobile, AppShortName } from "../../config/config.js";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import { browserHistory } from "react-router";

class Assignment extends Component {
  constructor(props) {
    super(props);
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    this.state = {
      guestId:
        isLoggedIn == "true" ? window.localStorage.getItem("guestId") : null,
      guestName:
        isLoggedIn == "true"
          ? `${window.localStorage.getItem(
              "guestFirstName"
            )} ${window.localStorage.getItem("guestLastName")}`
          : null,
    };

    if (checkIsUserLoggedIn() === "false" || checkIsUserLoggedIn() !== "true") {
      browserHistory.push("/");
    }
  }
  componentDidMount() {
    $("body").attr("class", "");
    $("body").addClass("appContactBackground");
    fetchWelcomeDetails();
    if (isMobile) {
      $("#spanHeaderText").html("Home Work");
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
    const { guestName } = this.state;
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
          Home Work
        </h3>
        <div className=" mT90ContactUs">
          <div className="row">
            <div className="col-sm-4 col-xs-12  appGradientColor appBodyFontColor text-center p-3">
              <p className="appBodyFontFamily appBodyFontColor">
                Please click the button below to submit your assignment
              </p>
              <a
                href={`https://docs.google.com/forms/d/e/1FAIpQLSd79FEy-jkiCtTc1yZUNbAEAQHk-ldNQYoX_fYNAOiPjF6iWQ/viewform?usp=pp_url&entry.499125748=${guestName}`}
                className="btn btn-primary mt-4"
              >
                Home Work
              </a>
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

export default connect(mapStateToProps)(Assignment);
