<<<<<<< HEAD
import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
=======
import React, { Component } from "react";
// import FormErrors from "../FormErrors";
// import Validate from "../utility/FormValidation";
import { Auth } from "aws-amplify";
import { Translation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import ChangePasswordVerification from "./ChangePasswordVerification";
>>>>>>> develop

class ForgotPasswordVerification extends Component {
  state = {
    verificationCode: "",
    email: "",
    newpassword: "",
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  passwordVerificationHandler = async event => {
    event.preventDefault();

<<<<<<< HEAD
=======
    // AWS Cognito integration here
>>>>>>> develop
    try {
      await Auth.forgotPasswordSubmit(
        this.state.email,
        this.state.verificationCode,
        this.state.newpassword
      );

      this.props.history.push("/change-password-confirmation");
    } catch (error) {
      console.log(error);
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <Translation>
        {t => (
          <section className="section auth">
            <div
              className="container"
              style={{
                width: "464px",
                fontFamily: "IBM Plex Sans",
                fontSize: "16px"
              }}
            >
              <h1>&nbsp;&nbsp;{t("flot.split.sommaire.definir")}</h1>
              <p>{t("flot.split.sommaire.code")}</p>
              {/* <FormErrors formerrors={this.state.errors} /> */}

<<<<<<< HEAD
          <form onSubmit={this.passwordVerificationHandler}>
            <div className="field">
              <p className="control">
                <input
                  type="text"
                  className="input"
                  id="verificationCode"
                  aria-describedby="verificationCodeHelp"
                  placeholder="Enter verification code"
                  value={this.state.verificationCode}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input 
                  className="input" 
                  type="email"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  type="password"
                  className="input"
                  id="newpassword"
                  placeholder="New password"
                  value={this.state.newpassword}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Submit
                </button>
              </p>
=======
              <form onSubmit={this.passwordVerificationHandler}>
                <div className="field">
                  <p className="control">
                    <input
                      type="text"
                      className="input"
                      id="verificationcode"
                      aria-describedby="verificationCodeHelp"
                      placeholder={t("flot.split.sommaire.verification")}
                      value={this.state.verificationcode}
                      onChange={this.onInputChange}
                    />
                  </p>
                </div>
                <div className="field">
                  <p className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      id="email"
                      aria-describedby="emailHelp"
                      placeholder={t(
                        "flot.split.auth.oublier.indication.email"
                      )}
                      value={this.state.email}
                      onChange={this.onInputChange}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control has-icons-left">
                    <input
                      type="password"
                      className="input"
                      id="newpassword"
                      placeholder={t("flot.split.sommaire.definir")}
                      value={this.state.newpassword}
                      onChange={this.onInputChange}
                    />
                    <span className="icon is-small is-left">
                      <i className="fas fa-lock"></i>
                    </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control">
                    <Modal
                      trigger={
                        <button
                          className="ui medium button is-success"
                          style={{ float: "right", margin: "0 0 50px 0" }}
                          onClick={this.handleOpen}
                        >
                          {t("collaborateur.attribut.bouton.soumettre")}
                        </button>
                      }
                      onClose={this.handleClose}
                      size="small"
                    >
                      <Modal.Content>
                        <ChangePasswordVerification />
                      </Modal.Content>
                    </Modal>
                  </p>
                </div>
              </form>
>>>>>>> develop
            </div>
          </section>
        )}
      </Translation>
    );
  }
}

export default ForgotPasswordVerification;
