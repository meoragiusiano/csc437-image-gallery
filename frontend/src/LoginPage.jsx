import React, { useActionState } from "react";
import { Link, useNavigate } from "react-router";
import { VALID_ROUTES } from "../../shared/ValidRoutes.js";
import "./LoginPage.css";

export function LoginPage({ isRegistering, onAuthSuccess }) {
    const navigate = useNavigate();

    const [result, submitAction, isPending] = useActionState(
        async (_previousState, formData) => {
            const username = formData.get("username");
            const password = formData.get("password");

            if (isRegistering) {
                const email = formData.get("email");
                try {
                    const response = await fetch("/api/users", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, email, password })
                    });
                    if (!response.ok) {
                        let message = `HTTP ${response.status} ${response.statusText}`;
                        try {
                            const body = await response.json();
                            if (body.message) message = body.message;
                        } catch {}
                        return message;
                    }
                    const data = await response.json();
                    onAuthSuccess(data.token);
                    navigate(VALID_ROUTES.HOME);
                    return null;
                } catch {
                    return "Could not connect to the server. Please try again.";
                }
            } else {
                try {
                    const response = await fetch("/api/auth/tokens", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password })
                    });
                    if (!response.ok) {
                        let message = `HTTP ${response.status} ${response.statusText}`;
                        try {
                            const body = await response.json();
                            if (body.message) message = body.message;
                        } catch {}
                        return message;
                    }
                    const data = await response.json();
                    onAuthSuccess(data.token);
                    navigate(VALID_ROUTES.HOME);
                    return null;
                } catch {
                    return "Could not connect to the server. Please try again.";
                }
            }
        },
        null
    );

    const usernameInputId = React.useId();
    const emailInputId = React.useId();
    const passwordInputId = React.useId();

    return (
        <>
            <h2>{isRegistering ? "Register a new account" : "Login"}</h2>
            <form className="LoginPage-form" action={submitAction}>
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} name="username" required disabled={isPending} />

                {isRegistering && (
                    <>
                        <label htmlFor={emailInputId}>Email</label>
                        <input id={emailInputId} name="email" type="email" required disabled={isPending} />
                    </>
                )}

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} name="password" type="password" required disabled={isPending} />

                <input type="submit" value={isPending ? "Submitting..." : "Submit"} disabled={isPending} />
            </form>
            <div aria-live="polite">
                {result && <p style={{ color: "red" }}>{result}</p>}
            </div>
            <p>
                {isRegistering ? (
                    <>Already have an account? <Link to={VALID_ROUTES.LOGIN}>Login here</Link></>
                ) : (
                    <>Don't have an account? <Link to={VALID_ROUTES.REGISTER}>Register here</Link></>
                )}
            </p>
        </>
    );
}
