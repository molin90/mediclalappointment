import axios from 'axios';
import { call, put, select, all, delay } from 'redux-saga/effects';
import { actions as uiActions } from 'reducers/ui';
import { API } from '../../config/constants/api';

/* MAILING */
export const mailFetch = data => (
  axios({
    method: 'POST',
    url: API.USER.SEND_MAIL,
    withCredentials: true,
    data,
  })
)

/* CLIENT THINGS */
