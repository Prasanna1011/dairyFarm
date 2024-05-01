import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const CitySLice = createSlice({
  name: "CityData",
  initialState: { city: [], loading: true },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllTodos.pending, (state, { payload }) => {
        state.loading = true
      })
      .addCase(getAllTodos.fulfilled, (state, { payload }) => {
        state.loading = false
        state.city = payload
      })
      .addCase(getAllTodos.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })
  },
})
export const getAllTodos = createAsyncThunk("todo/getToDo", async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/todos")
    return data
  } catch (error) {
    return error.message
  }
})
export default CitySLice.reducer
