import ButtonComponent from "./ButtonComponent";
import { useEffect, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { ImGoogle3 } from "react-icons/im";
import InputBox from "./InputBox";
import { useFormik, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { RegisterSchema, LoginSchema } from "../schemas/formValidation";
import { useSnackbar } from "notistack";
import { useRecoilState } from "recoil";
import { authTokenAtom, userDataAtom } from "../Atom";
import axios from "axios";

const RegisterValues = {
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
};

const LoginValues = {
  email: "",
  password: "",
};

function LoginSignUp(props) {
  const [authToken, setAuthToken] = useRecoilState(authTokenAtom);
  const [userData, setUserData] = useRecoilState(userDataAtom);
  let RegisterFormik, LoginFormik;
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  if (props.type === "register") {
    RegisterFormik = useFormik({
      initialValues: RegisterValues,
      validationSchema: RegisterSchema,
      onSubmit: async (values, action) => {
        try {
          let response = await axios({
            url: "http://localhost:3000/auth/register",
            method: "POST",
            data: values,
            headers: {
              "content-type": "application/json",
            },
          });
          if (response.status === 201) {
            console.log("message", response.data.message);
            enqueueSnackbar(response.data.message, { variant: "success" });
            navigate("/login");
          }
        } catch (err) {
          enqueueSnackbar(err.response.data.error, { variant: "error" });
        }
      },
    });
  } else {
    LoginFormik = useFormik({
      initialValues: LoginValues,
      validationSchema: LoginSchema,
      onSubmit: async (values, action) => {
        try {
          let response = await axios({
            url: "http://localhost:3000/auth/login",
            method: "POST",
            data: values,
            headers: {
              "content-type": "application/json",
            },
          });
          console.log("response", response);
          if (response.status === 201) {
            console.log("Login success");
            if (response.data.token) {
              console.log("inside login",response.data.user);
              let token = response.data.token;
              let user =JSON.stringify(response.data.user);
              localStorage.setItem("user",user);
              localStorage.setItem("authToken", token);
              setAuthToken(token);
            }
            console.log("Login successfull");
            enqueueSnackbar(response.data.message, { variant: "success" });
            navigate("/");
          }
        } catch (err) {
          enqueueSnackbar(err.response.data.error, { variant: "error" });
        }
      },
    });
  }

  return (
    <div className="lg:w-[70%]">
      <h1 className="text-[30px] font-bold">{props.title}</h1>
      <h4 className="my-1 mb-3">
        {props.additionalText}
        <span className="cursor-pointer font-bold text-red-700 mx-2 underline">
          {props.redirectingBtn}
        </span>
      </h4>
      <form
        onSubmit={
          props.type === "register"
            ? RegisterFormik.handleSubmit
            : LoginFormik.handleSubmit
        }
        className="flex flex-col my-4"
        action=""
      >
        <label className=" font-semibold" htmlFor="email">
          Email
        </label>
        <InputBox
          type="email"
          placeholder="name@gmail.com"
          name="email"
          value={
            props.type === "register"
              ? RegisterFormik.values.email
              : LoginFormik.values.email
          }
          handleChange={
            props.type === "register"
              ? RegisterFormik.handleChange
              : LoginFormik.handleChange
          }
        />

        {props.type === "register" ? (
          RegisterFormik.errors.email && RegisterFormik.touched.email ? (
            <p className="text-red-500 my-2">{RegisterFormik.errors.email}</p>
          ) : null
        ) : LoginFormik.errors.email && LoginFormik.touched.email ? (
          <p className="text-red-500 my-2">{LoginFormik.errors.email}</p>
        ) : null}

        <label className="font-semibold" htmlFor="password">
          Password
        </label>
        <InputBox
          type="password"
          placeholder="6+ Characters"
          name="password"
          value={
            props.type === "register"
              ? RegisterFormik.values.password
              : LoginFormik.values.password
          }
          handleChange={
            props.type === "register"
              ? RegisterFormik.handleChange
              : LoginFormik.handleChange
          }
        />

        {props.type === "register" ? (
          RegisterFormik.errors.password && RegisterFormik.touched.password ? (
            <p className="text-red-500 my-2">
              {RegisterFormik.errors.password}
            </p>
          ) : null
        ) : LoginFormik.errors.password && LoginFormik.touched.password ? (
          <p className="text-red-500 my-2">{LoginFormik.errors.password}</p>
        ) : null}

        {props.type === "register" && (
          <>
            <label className="font-semibold" htmlFor="password">
              Confirm Password
            </label>
            <InputBox
              type="password"
              placeholder="6+ Characters"
              name="confirmPassword"
              value={RegisterFormik.values.confirmPassword}
              handleChange={RegisterFormik.handleChange}
            />
            {RegisterFormik.errors.confirmPassword &&
            RegisterFormik.touched.confirmPassword ? (
              <p className="text-red-500 my-2">
                {RegisterFormik.errors.confirmPassword}
              </p>
            ) : null}
          </>
        )}
    
         {props.type==="register" ? (
            <>
            <div className="flex font-bold mt-2 mb-4 ">
            <h1>Register as: </h1>
          <div className="mx-2 ">
            <label  className="flex">
              <input
                type="radio"
                name="role"
                value="tutor"
                checked={RegisterFormik.values.role === "tutor"}
                onChange={RegisterFormik.handleChange}
                className="mx-2"
              />
              Tutor
            </label>
          </div>
          <div className="mx-2">
            <label className="flex">
              <input
                type="radio"
                name="role"
                value="student"
                checked={RegisterFormik.values.role === "student"}
                onChange={RegisterFormik.handleChange} 
                className="mx-2"
              />
              Student
            </label>
          </div>
        </div>
        {RegisterFormik.errors.role &&
            RegisterFormik.touched.role ? (
              <p className="text-red-500 mb-2">
                {RegisterFormik.errors.role}
              </p>
            ) : null}
            </>
         ):null}
        <ButtonComponent
          type="submit"
          icon={<MdOutlineEmail size="2rem" />}
          text={props.firstBtnText}
          bgcolor="bg-blue-500"
        />
      </form>
      {/* <div className='flex items-center justify-center my-3'>
            <span className='font-bold'>OR</span>
        </div> */}
      {/* <button className='bg-red-500'  onClick={() => enqueueSnackbar('I love hooks')}>Show </button> */}

      {/* <ButtonComponent icon={<ImGoogle3 size="2rem"/>} text={props.secondBtnText} bgcolor="bg-primary-color"/> */}
    </div>
  );
}

export default LoginSignUp;