import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <Heading label="Sign in" />
                <SubHeading label="Enter your credentials to access your account" />
                <div className="mt-4 w-full">
                    <InputBox placeholder="validemail@works.com" label="Email" />
                </div>
                <div className="mt-4 w-full">
                    <InputBox placeholder="password" label="Password" type="password" />
                </div>
                <div className="mt-6 w-full">
                    <Button label="Sign in" />
                </div>
                <div className="mt-4">
                    <BottomWarning label="Don't have an account?" buttonText="Sign up" to="/signup" />
                </div>
            </div>
        </div>
    );
};
