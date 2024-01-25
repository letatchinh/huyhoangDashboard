import { get } from "lodash";
import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { UserResponseOne } from "../user.modal";
import { createSlice } from "@reduxjs/toolkit";

interface UserState extends initStateSlice{
  policy?: {},
  isGetPolicyLoading?: boolean,
  getPolicyFailed?: any,
};
class UserClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('user');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: UserState, { payload }: { payload?: PaginateResult<UserResponseOne> }) => {
        state.isLoading = false;
        state.list = get(payload, 'docs', []);
      },
      getPolicyRequest: (state: UserState, { payload }: any) => {
        state.policy = {};
        state.isGetPolicyLoading = true;
      },
      getPolicySuccess: (state: UserState, { payload }: any) => {
        state.isGetPolicyLoading = false;
        state.policy = payload;
      },
      getPolicyFailed: (state: UserState, { payload }: any) => {
        state.isGetPolicyLoading = false;
        state.getPolicyFailed = payload
      },
    };
    this.cloneInitState = {
      ...this.initialState,
      policy: {},
      isGetPolicyLoading: false,
      getPolicyFailed: false
      // Want Add more State Here...
    };
  };
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.clone,
    });
  }
  
}

const newSlice = new UserClassExtend();
const data = newSlice.createSlice();


export const userSliceAction  = data.actions;
export default data.reducer;