import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import InputForm from '../components/InputForm';
import MyHead from '../components/MyHead';
import PrimaryButton from '../components/PrimaryButton';
import Welcome from '../components/Welcome';
import { RegisterInterface } from '../models/auth.model';
import { BaseResponse } from '../models/baseResponse.model';
import { MessageResponseModel } from '../models/messageResponse.model';
import { registerUser } from '../services/auth.service';

const Register = () => {
  const initialValues: RegisterInterface = {
    username: '',
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    photo: '',
    isAdmin: false,
  };
  const router = useRouter();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerValues, setRegisterValues] =
    useState<RegisterInterface>(initialValues);

  const onchangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterValues({
      ...registerValues,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutation(registerUser, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push('/login');
      } else {
        setRegisterError(data?.data?.message);
      }
    },
    onError: (e: AxiosError) => {
      const data: BaseResponse<MessageResponseModel> = e.response?.data as any;
      if (data?.data.message) {
        setRegisterError(data.data.message);
      } else {
        setRegisterError(e.message);
      }
    },
  });

  const submitHadler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, displayName, email, phoneNumber, password, isAdmin } =
      registerValues;
    mutation.mutate({
      username,
      displayName,
      email,
      phoneNumber,
      password,
      isAdmin,
    } as any);
  };
  return (
    <div className="md:max-w-[80%] w-[100%] lg:max-w-[60%] m-auto items-center justify-center flex flex-col">
      <MyHead title="Happy Quizy - Register" />
      <Welcome />
      <form
        onSubmit={submitHadler}
        action=""
        className="w-[100%] lg:w-[50%] h-[60%] bg-neutral-800 items-start justify-start flex flex-col p-5 gap-4"
      >
        <InputForm
          label="Username"
          name="username"
          onChange={onchangeHandler}
          errorMessage="Username should be 3-16 characters and shouldn't include any special character!"
          pattern="^[A-Za-z0-9]{3,16}$"
          required={true}
        />
        <InputForm
          label="Display name"
          name="displayName"
          onChange={onchangeHandler}
          isRequired={false}
        />
        <InputForm
          label="Email"
          type="email"
          name="email"
          onChange={onchangeHandler}
          isRequired={false}
        />
        <InputForm
          label="Phone number"
          name="phoneNumber"
          onChange={onchangeHandler}
          isRequired={false}
        />
        <InputForm
          label="Password"
          required={true}
          name="password"
          onChange={onchangeHandler}
          errorMessage="Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!"
          pattern={`^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`}
          type="password"
        />
        <InputForm
          label="Confirm Password"
          name="confirmPassword"
          onChange={onchangeHandler}
          errorMessage="Passwords don't match!"
          pattern={registerValues.password}
          required={true}
          type="password"
        />
        {registerError && (
          <div className="my-2">
            <li className="text-red-500">{registerError}</li>
          </div>
        )}
        <div className="flex items-center justify-center w-full mt-5">
          <PrimaryButton
            type="submit"
            text="Register"
            isLoading={mutation.isLoading}
          />
        </div>
      </form>
      <div className="flex items-center justify-center w-full mt-5">
        <p className="text-white">Already have an account ?</p>
        <div className="w-3"></div>
        <Link href="/login">
          <span className="text-lg text-blue-700 font-bold">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
