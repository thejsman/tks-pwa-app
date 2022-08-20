import React from "react";
import "./dashboard.css";
import {
  getGuestAddressing,
  getEventId,
  getGuestId,
  getWelcomeDetails,
  getEventName,
  getGuestFirstName,
  getGuestLastName
} from "../../selectors";
import { fetchWelcomeDetails } from "../../api/welcomeApi";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import cloneDeep from "lodash/cloneDeep";
import "../../config/config.js";
import $ from "jquery";
import { checkIsUserLoggedIn } from "../../api/storageAPI";
import Linkify from "react-linkify";

class dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $("body").addClass("appBody");
    if (!this.props.welcomeData) {
      fetchWelcomeDetails(this.props.eventId);
    }
    if (this.props.welcomeData && !this.props.welcomeData.welcomeVideo) {
      $("#youClickDiv #youIcon").remove();
    }
    $("html").scrollTop(0);
  }

  playAndPauseButton(welcomeData) {
    if (welcomeData) {
      let url = welcomeData.welcomeVideo;
      let id = url.split("/");
      let videoUrl =
        "https://www.youtube.com/embed/" +
        id[3] +
        "?autoplay=0&controls=1&showinfo=0&autohide=1";
      return videoUrl;
    }
    return null;
  }
  changeText(message) {
    if (message) {
      let arrayItem = message.split("\n");
      let text = arrayItem.map(item => {
        return item;
      });
      return text;
    }
    return null;
  }
  hideModal() {
    $(".modal-content").hide();
    $("iframe").attr("src", $("iframe").attr("src"));
    $(".fa-youtube-play").show();
  }
  playVideo() {
    const { welcomeData } = this.props;
    let url = welcomeData.welcomeVideo ? welcomeData.welcomeVideo : "";
    if (url) {
      $(".modal-content").fadeIn();
      $(".youTubeAttribute").attr("src", url);
      $("#video").height($(".modal-body").height() - 40);
      $(".fa-youtube-play").hide();
    }
  }

  setLocalStorage(
    eventId,
    guestId,
    isLoggedIn,
    eventName,
    guestFirstName,
    guestLastName,
    guestAddressing
  ) {
    window.localStorage.setItem("eventId", eventId);
    window.localStorage.setItem("guestId", guestId);
    window.localStorage.setItem("isLoggedIn", isLoggedIn);
    window.localStorage.setItem("guestFirstName", guestFirstName);
    window.localStorage.setItem("guestLastName", guestLastName);
    window.localStorage.setItem("guestAddressing", guestAddressing);
  }

  componentDidUpdate() {
    if (this.props.guestId || this.sessionEventId) {
      this.setLocalStorage(
        this.props.eventId,
        this.props.guestId,
        true,
        this.props.eventName,
        this.props.guestFirstName,
        this.props.guestLastName,
        this.props.guestAddressing
      );
    }
    if (this.props.welcomeData && !this.props.welcomeData.welcomeVideo) {
      $("#youClickDiv #youIcon").remove();
    }
  }

  render() {
    const { welcomeData } = this.props;
    let videoSrc = this.playAndPauseButton(welcomeData);
    let msg = welcomeData && welcomeData.welcomeMessage;
    let text = this.changeText(msg);
    let guestNickName = "";
    if (
      localStorage.getItem("guestAddressing") === null ||
      localStorage.getItem("guestAddressing") === ""
    ) {
      guestNickName = localStorage.getItem("guestFirstName");
    } else {
      guestNickName = localStorage.getItem("guestAddressing");
    }
    let welcomeVideo = "";
    let welcomeImage = "";
    if (welcomeData) {
      welcomeVideo = welcomeData.welcomeVideo ? welcomeData.welcomeVideo : "";
      welcomeImage = welcomeData.welcomeImage ? welcomeData.welcomeImage : "";
      let welcomeBG = welcomeData.welcomeBackground
        ? welcomeData.welcomeBackground
        : "";
      if (welcomeBG.length > 0) {
        $("body").css("background-image", "url('" + welcomeBG + "')");
      }
    }

    return (
      <div>
        <div className="container">
          <div className="Dashboard-Center is-Responsive">
            <div className="invitationBox">
              <div className="videoContainer">
                <div className="dashboardImage">
                  {/* <i className="fa fa-youtube-play" id="youIcon"></i> */}
                  {/* <img src={welcomeImage} className="dashboardImage" /> */}
                  <h2
                    className="appBodyFontColor"
                    style={{
                      textAlign: "center",
                      textTransform: "uppercase",
                      paddingTop: "30px"
                    }}
                  >
                    Disclaimer
                  </h2>
                </div>
              </div>
              <div className="invitationMessage appGradientColor appFontColor">
                <p
                  className="paragraphCommon appBodyFontFamily  appBodyFontColor text-capitalize"
                  style={{ fontWeight: "400" }}
                >
                  I understand that I have been nominated to attend the MDRT Training Program to be held in Sydney, Australia from 28th-31st August’2022 and confirm that I would be personally attending all the training events as per the schedule to be held during these days.<br/><br/> I also confirm that I will not extend my stay, further than the duration of the training program, and will return once the training is completed as per the schedule. I also understand that I will be representing HDFC Bank to this event and confirm that my conduct always would be in line with the Bank’s Code of Conduct.<br/><br/> Any deviation on this observed/highlighted might attract action as per Bank’s guidelines.
                </p>
                {/* {text && text.length > 0 && (
                  <div
                    className="message appBodyFontFamily paragraphCommon appBodyFontColor"
                    style={{ marginTop: "10px" }}
                  >
                    {
                      // text.map((lines) =>
                      <p className="lineFormat">
                        <Linkify properties={{ target: "_blank" }}>
                          {msg}
                        </Linkify>
                      </p>
                      // )
                    }
                  </div>
                )} */}
              </div>
            </div>
            <div className="form-group">
              <button
                type="button"
                className="btn btn-primary btn-def btn-block DisclaimerAccept"
                style={{ fontSize: "18px" }}
                onClick={() => {
                  browserHistory.push("/menus");
                }}
              >
                Accept & Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    welcomeData: getWelcomeDetails(state),
    eventId: getEventId(state),
    guestId: getGuestId(state),
    eventName: getEventName(state),
    guestAddressing: getGuestAddressing(state),
    guestFirstName: getGuestFirstName(state),
    guestLastName: getGuestLastName(state)
  };
}
export default connect(mapStateToProps)(dashboard);
