import React from "react";
import store from "../../store";
import { browserHistory } from "react-router";
import {
  fetchGuestFamily,
  uploadPhoto,
  submitGuestDetails,
  guestClearVisa,
} from "../../api/guestInformationApi.js";
import { dataSavedSuccessfully } from "../../actions/popup.action";

const maxLength = 9;
const smallName = name => {
  if (name.length > maxLength) {
    return name.substring(0, maxLength - 3) + "...";
  }
  return name;
};
class Visa extends React.Component {
  constructor(props) {
    super(props);
    let pIs = this.props.familyMember[0].guestVisaImages;
    pIs = pIs ? pIs : [];
    this.state = {
      page: null,
      visaImages: pIs,
      hasVisa: pIs.length > 0 ? true : null,
      currentGuestId: this.props.familyMember[0].guestId,
    };
  }

  setGuest(guestId) {
    let { familyMember } = this.props;
    let currentGuest = familyMember.find(m => {
      return m.guestId === guestId;
    });
    let passportImages = [];
    if (typeof currentGuest.guestVisaImages == "undefined") {
      passportImages = [];
    } else {
      passportImages = currentGuest.guestVisaImages;
    }
    let visaImages = passportImages ? passportImages : [];
    this.setState({
      currentGuestId: guestId,
      visaImages,
      hasVisa: visaImages.length > 0 ? true : null,
      page: null,
    });
  }

  saveInfo(information) {
    let { familyMember } = this.props;
    let primaryGuest = familyMember.find(m => {
      return m.guestIsPrimary;
    });

    let info = {
      ...information,
      guestId: this.state.currentGuestId,
    };

    submitGuestDetails(info)
      .then(() => {
        fetchGuestFamily(primaryGuest.guestId)
          .then(() => {
            this.props.setLoading(false);
          })
          .catch(er => {
            this.props.setLoading(false);
          });
      })
      .catch(er => {
        this.props.setLoading(false);
      });
  }

  clearVisa() {
    let { familyMember } = this.props;
    let primaryGuest = familyMember.find(m => {
      return m.guestIsPrimary;
    });
    this.props.setLoading(true);
    guestClearVisa(this.state.currentGuestId)
      .then(() => {
        fetchGuestFamily(primaryGuest.guestId)
          .then(() => {
            this.props.setLoading(false);
          })
          .catch(er => {
            this.props.setLoading(false);
          });
      })
      .catch(er => {
        this.props.setLoading(false);
      });
  }

  saveGuestDetails() {
    if (!this.state.page) {
      alert("Please select at least one picture");
      return;
    }
    this.props.setLoading(true);
    var self = this;
    uploadPhoto(this.state.page)
      .then(url => {
        self.saveInfo({
          guestVisaImages: [url],
        });
        self.props.setLoading(false);
        store.dispatch(
          dataSavedSuccessfully("RT PCR report saved successfully")
        );
      })
      .catch(e => {
        alert("Upload failed");
        self.props.setLoading(false);
      });
  }

  componentWillReceiveProps(nextProps) {
    let { familyMember } = nextProps;
    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });
    this.setState({
      hasVisa:
        currentGuest.guestVisaImages && currentGuest.guestVisaImages.length > 0
          ? true
          : null,
    });
  }

  render() {
    let { appSettings, familyMember } = this.props;
    let currentGuest = familyMember.find(m => {
      return m.guestId === this.state.currentGuestId;
    });
    let passportImages = currentGuest.guestVisaImages;
    let visaImages = passportImages ? passportImages : [];

    let pis = visaImages;
    let visaQuestion = appSettings ? appSettings.visaQuestion : "";
    return (
      <div className="informationScreenDividesTop">
        <div
          className="card-header myInformation-card-header appBodyFontColor appGradientColor collapsed"
          data-toggle="collapse"
          data-parent="#accordion"
          href="#ROOM REQUIREMENT"
        >
          <a className="card-title">
            <i className="icon-my-visa" aria-hidden="true" />
            RT PCR REPORT
            <i className="fa" aria-hidden="true" />
          </a>
        </div>
        <div
          id="ROOM REQUIREMENT"
          className="card-body myInformation-card-body appGradientColor collapse"
          data-parent="#accordion"
        >
          <div className="row">
            <div className="myPassportBtnTop">
              {familyMember &&
                familyMember.map(guest => {
                  return (
                    <button
                      className={`btn btn-default btn-responsive ankur appBodyFontFamily appBodyFontColor ${
                        guest.guestId === currentGuest._id ? "active" : ""
                      }`}
                      key={guest.guestId}
                      id={guest.guestId}
                      onClick={() => {
                        this.setGuest(guest.guestId);
                      }}
                    >
                      {guest.guestName}
                    </button>
                  );
                })}
            </div>
          </div>
          {pis.length > 0 ? null : (
            <div>
              <div className="row">
                <p className="info-statement appBodyFontFamily appBodyFontColor">
                  {this.props.visaQuestion}
                </p>
              </div>
              <div className="myPassportBtnRadio">
                <form>
                  <div className="radio-group">
                    <input type="radio" id="option-three" name="selector" />
                    <label
                      htmlFor="option-three"
                      onClick={() => {
                        this.setState({
                          hasVisa: true,
                          page: null,
                        });
                      }}
                    >
                      YES
                    </label>
                    <input type="radio" id="option-four" name="selector" />
                    <label
                      htmlFor="option-four"
                      onClick={() => {
                        this.setState({
                          hasVisa: false,
                        });
                      }}
                    >
                      NO
                    </label>
                  </div>
                </form>
              </div>
            </div>
          )}
          {this.state.hasVisa || pis.length > 0 ? (
            <div>
              <div className="row text-center">
                {this.state.page || pis[0] ? (
                  <label
                    className="btn-bs-file myInformationBtn ankur appBodyFontFamily appBodyFontColor active abl-filename"
                    id="visaPhotoLabel"
                  >
                    <span>
                      {smallName(
                        this.state.page ? this.state.page.name : "upload visa"
                      )}
                    </span>
                  </label>
                ) : null}
                {this.state.page || pis[0] ? null : (
                  <div className="col-md-12">
                    <label
                      className="btn-bs-file Myaddress-btn-bs-file myInformationBtn"
                      id="visaLabel"
                      name="visaImage"
                      onClick={() => {
                        this.refs.visaUpload.click();
                      }}
                    >
                      UPLOAD RP PCR REPORT
                    </label>
                    <input
                      type="file"
                      tabIndex="0"
                      id="visaImage"
                      accept="image/*,application/pdf"
                      ref="visaUpload"
                      className="myInformationBtn"
                      style={{ display: "none" }}
                      onChange={e => {
                        this.setState({
                          page: e.target.files[0],
                        });
                      }}
                    />
                    <br />
                    <canvas
                      id="canvas"
                      height="420"
                      width="560"
                      className="camera-box"
                      style={{ display: "none" }}
                    />
                    <span id="visaUploadError" style={{ color: "white" }} />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="update-info">Click Save.</div>
                <button
                  className="myInformationBtn btnSave"
                  id="save-visa-btn"
                  onClick={() => {
                    pis.length > 0 ? this.clearVisa() : this.saveGuestDetails();
                  }}
                >
                  {pis.length > 0 ? "CLEAR" : "SAVE"}
                </button>
              </div>
            </div>
          ) : null}
          {this.state.hasVisa === false ? (
            <div className="row text-center" id="visa-na">
              <div className="col-md-12">
                <p className="disable-msg">
                  Please get in touch with a wedding representative to get
                  assistance regarding your travel.
                </p>
              </div>
              <div className="col-md-12">
                <button
                  className="myInformationBtn btnSave"
                  onClick={() => {
                    browserHistory.push("/contactUs");
                  }}
                >
                  go to contact us page
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
export default Visa;
