import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const subscribeNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/subscribe `, { email })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState: {
    status: 'idle',
    message: '',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.status = 'loading'
        state.message = ''
        state.error = null
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.message = action.payload.message
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default newsletterSlice.reducer
