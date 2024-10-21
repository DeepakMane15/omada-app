import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./index.css";

import BackgroundImage from "../../assets/images/background.png";
import Logo from "../../assets/images/logo.png";
import { useMutation } from "@tanstack/react-query";
import { GetAccessToken, GetAuthToken, LoginApi } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { login } from "../../utils/redux/authSlice";
import { hideLoader } from "../../utils/redux/loaderSlice";

const Auth = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const mutation = useMutation({
        mutationFn: async () => {
            try {
                // Step 1: Call LoginApi with credentials (username, password)
                const loginResponse = await LoginApi({
                    username: inputUsername,
                    password: inputPassword,
                });

                // Step 2: Call GetAuthToken with CSRF token and session ID from the login response
                const { csrfToken, sessionId } = loginResponse.data;
                const authTokenResponse = await GetAuthToken({ csrfToken, sessionId });

                // Step 3: Call GetAccessToken with the authorization code from the previous response
                const { code } = authTokenResponse.data;
                const accessTokenResponse = await GetAccessToken(code);

                // Step 4: Dispatch Redux login action with access and refresh tokens
                const { accessToken, refreshToken } = accessTokenResponse.data.result;
                dispatch(login({ accessToken, refreshToken }));

                // Hide loader and finish login process
                dispatch(hideLoader());
                setLoading(false);
            } catch (error) {
                console.error("API failed:", error.response?.data || error.message);
                setShow(true); // Show error message
                setLoading(false); // Stop loading spinner
                dispatch(hideLoader());
            }
        },
        onError: (error) => {
            console.error("Mutation failed:", error);
            setLoading(false);
            dispatch(hideLoader());
        },
    });


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        mutation.mutate();
    };

    const handlePassword = () => { };

    return (
        <div
            className="sign-in__wrapper"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            {/* Overlay */}
            <div className="sign-in__backdrop"></div>
            {/* Form */}
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                {/* Header */}
                <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={Logo}
                    alt="logo"
                />
                <div className="h4 mb-2 text-center">Sign In</div>
                {/* ALert */}
                {show ? (
                    <Alert
                        className="mb-2"
                        variant="danger"
                        onClose={() => setShow(false)}
                        dismissible
                    >
                        Incorrect username or password.
                    </Alert>
                ) : (
                    <div />
                )}
                <Form.Group className="mb-2 form-group" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputUsername}
                        placeholder="Username"
                        onChange={(e) => setInputUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2 form-group" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="Password"
                        onChange={(e) => setInputPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="checkbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                {!loading ? (
                    <Button className="w-100" variant="primary" type="submit">
                        Log In
                    </Button>
                ) : (
                    <Button className="w-100" variant="primary" type="submit" disabled>
                        Logging In...
                    </Button>
                )}
                <div className="d-grid justify-content-end">
                    <Button
                        className="text-muted px-0"
                        variant="link"
                        onClick={handlePassword}
                    >
                        Forgot password?
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Auth;
