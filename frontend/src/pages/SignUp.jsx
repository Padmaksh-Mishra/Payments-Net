import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                username : username,
                firstname : firstname,
                lastname : lastname,
                password : password,
            });
            localStorage.setItem("token", response.data.data.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <Heading label="Sign up" />
                <SubHeading label="Enter your information to create an account" />
                <div className="mt-4 w-full">
                    <InputBox
                        onChange={(e) => setfirstname(e.target.value)}
                        placeholder="Arthur"
                        label="First Name"
                    />
                </div>
                <div className="mt-4 w-full">
                    <InputBox
                        onChange={(e) => setlastname(e.target.value)}
                        placeholder="Morgan"
                        label="Last Name"
                    />
                </div>
                <div className="mt-4 w-full">
                    <InputBox
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="validemail@works.com"
                        label="Email"
                    />
                </div>
                <div className="mt-4 w-full">
                    <InputBox
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Make sure to use a strong password"
                        label="Password"
                        type="password"
                    />
                </div>
                <div className="mt-6 w-full">
                    <Button onClick={handleSignup} label="Sign up" />
                </div>
                <div className="mt-4">
                    <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
                </div>
            </div>
        </div>
    );
};
