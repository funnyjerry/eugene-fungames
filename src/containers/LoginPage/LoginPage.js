import React, { Component } from 'react';
import { func, string, object, bool } from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loader } from "../../components/Loader/Loader";

import ScrollDialog from "../../components/ScrollDialog/ScrollDialog";
import ConfirmName from "../../components/ConfirmName/ConfirmName";

import { api } from "../../config";
import * as authAction from "../../modules/auth/auth.actions";

import googleIcon from '../../images/social/googleIcon.svg.png';

import classes from "./LoginPage.less";


class LoginPage extends Component {
	static propTypes = {
		confirmAge: string,
		confirmAgeSaga: func,
		googleLoginUserSaga: func,
		setLoginNameSaga: func,
		userData: object,
		userLoaded: bool,
		userLoginStatus: string,
		userSessionId: string
	}

	state = {
		termsOfService: "",
		modalVisibility: false,
	}

	componentDidMount() {
		const { userSessionId, googleLoginUserSaga } = this.props;

		if (userSessionId !== "") {
			googleLoginUserSaga(userSessionId);
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.userLoaded && !prevProps.userLoaded) {
			this.setState({ modalVisibility: true });
		}
	}

	handleModalClose = () => {
		this.setState({ modalVisibility: false });
	};

	handleConfirmAge = (data) => {
		this.props.confirmAgeSaga(data);
	}

	loginBtnClick = () => {
		loader.show();
	}

	render() {
		const { confirmAge } = this.props;

		const { modalVisibility } = this.state;

		return (
			<div className={classes.loginPage}>
				<div className={classes.loginPageButtonWrapper}>
					<div className={`btn white darken-4 col s10 m4 ${classes.loginPageLoginBtn} ${classes.loginPageGoogleBtn}`}>
						<a onClick={this.loginBtnClick} href={`${api.urls.auth.googleLogin}${document.location.host}`}>
							<div className={`left ${classes.loginPageGoogleIcon}`}>
								<img width="20px" alt="Google &quot;G&quot; Logo" src={googleIcon} />
							</div>
							Sign in with Google
						</a>
					</div>

					<div className={`social-wrap a ${classes.loginPageFaceBookBtn}`}>
						<a onClick={this.loginBtnClick} id="facebook" href={`${api.urls.auth.faceBookLogin}${document.location.host}`}>Sign in with Facebook</a>
					</div>
				</div>

				<ScrollDialog
					handleConfirmAge={this.handleConfirmAge}
					open={modalVisibility && confirmAge !== "success"}
					handleClose={this.handleModalClose}
				/>

				<ConfirmName open={confirmAge === "success"} setLoginName={this.props.setLoginNameSaga} />
			</div>
		);
	}
}

function mapStateToProps({ auth }) {
	return {
		userLoaded: auth.userLoaded,
		userLoginStatus: auth.userLoginStatus,
		userData: auth.userData,
		userSessionId: auth.userSessionId,
		confirmAge: auth.confirmAge
	};
}

export default withRouter(connect(mapStateToProps, { ...authAction })(LoginPage));
