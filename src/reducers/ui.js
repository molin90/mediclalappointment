
export const types = {
  /* COMMONS FOR EVERY WEB */
  /* CLIENT */
  GET_MAIN_INFO: 'UI/GET_MAIN_INFO',
  SET_MAIN_INFO: 'UI/SET_MAIN_INFO',
}

export const initialState = {
  /* COMMONS */
  /* CLIENT */
  mainInfo: null,

}

const UIReducer = (state = initialState, action) => {
  switch (action.type) {
    default: return state
  }
}

export const actions = {
  /* CLIENT */
  getMainInfo: () => ({ type: types.GET_MAIN_INFO }),
}

export default UIReducer;
