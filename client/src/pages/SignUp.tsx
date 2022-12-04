import React, { useEffect } from 'react';
import { redirect, useLocation } from 'react-router';
import { useAppSelector } from '../hooks';
import s from './SignUp.module.scss';

const SignUp = () => {
  const user_id = useAppSelector((state) => state.homeUser.user_id);

  useEffect(() => {
    if (user_id > 0) {
      redirect('/');
    }
  }, [user_id]);

  return <div>SignUp</div>;
};

export default SignUp;
