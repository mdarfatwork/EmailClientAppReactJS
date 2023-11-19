import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  readMail: JSON.parse(localStorage.getItem('readmail')) || [],
  favoriteMail: JSON.parse(localStorage.getItem('favoritemail')) || [],
  bodyMail: [],
};

const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    favoriteMail: (state, action) => {
      const { payload: mailId } = action;
      if (!state.favoriteMail.some(mail => mail.mailId === mailId)) {
        state.favoriteMail.push({ mailId });
        localStorage.setItem('favoritemail', JSON.stringify(state.favoriteMail));
      }
    },
    readMail: (state, action) => {
      const { payload: mailId } = action;
      if (!state.readMail.some(mail => mail.mailId === mailId)) {
        state.readMail.push({ mailId });
        localStorage.setItem('readmail', JSON.stringify(state.readMail));
      }
    },
    bodyMail: (state, action) => {
      const { payload: mailId } = action;
      const index = state.bodyMail.findIndex(mail => mail.mailId === mailId);

      if (index !== -1) {
        state.bodyMail = state.bodyMail.filter(mail => mail.mailId !== mailId);
      } else {
        state.bodyMail = [{ mailId }];
      }
    },
  },
});

export const { favoriteMail, readMail, bodyMail } = mailSlice.actions;
export default mailSlice.reducer;
