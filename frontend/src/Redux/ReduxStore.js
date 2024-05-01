import { configureStore } from "@reduxjs/toolkit"
import CitySlice from "./masterSlice/CitySlice/CitySlice"
const ReduxStore = configureStore({
  reducer: {
    CityStore: CitySlice,
  },
})

export default ReduxStore
