import {createSlice} from '@reduxjs/toolkit';
import {fetchMedia} from '../thunks/fetch_media';

const artSlice = createSlice({
  name: 'art',
  initialState: [],
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchMedia.fulfilled, (state, {payload}) => {
      if (payload.collection === 'art') {
        return payload.media;
      }
    });
    builder.addCase(fetchMedia.rejected, (state, action) => {
      console.error(action);
    });
  },
});

export default artSlice.reducer;
