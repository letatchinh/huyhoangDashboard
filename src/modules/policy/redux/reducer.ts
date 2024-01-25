import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

interface resources {
  key: string,
  name: string
}; 
interface PolicyState extends initStateSlice<resources> {
  resources?: resources[],
  isGetResourcesLoading?: boolean,
  getResourcesFailed?: any,
  actions?: resources[], 
};

class PolicyClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState : PolicyState;
  constructor() {
    super('policy');
    this.clone = {
      ...this.initReducer,
      getResourcesRequest: (state: PolicyState , { payload}: any) => {
        state.isGetResourcesLoading = true; 
      },
      getResourcesSuccess: (state: PolicyState , { payload }: any) => {
        state.resources = payload.resources;
        state.isGetResourcesLoading = false;
        state.actions = payload.actions;
      //   const { actions, resources } = payload;

      // const nextResources = resources.map((resource: any) => {
      //   const resourceWithKey = { resource };
      //   const nextResource = actions.reduce((acc : any, action: any) => {
      //     const actionWithKey = {
      //       [action.key]: action
      //     };

      //     return {
      //       ...acc,
      //       ...actionWithKey
      //     };
      //   }, resourceWithKey);

      //   return nextResource;
      // });

      // state.isGetResourcesLoading = false;
      // state.resources = nextResources;
      // state.actions = actions;
      },
      getResourcesFailed: (state: PolicyState , { payload}: any) => {
        state.isGetResourcesLoading = false;
        state.getResourcesFailed = payload;
      },
      updateResourcesRequest: (state: PolicyState , { payload}: any) => {
        state.isGetResourcesLoading = true; 
      },
      updateResourcesSuccess: (state: PolicyState , { payload }: { payload: { actions: resources[], resources: resources[] } }) => {
        state.resources = payload.resources;
        state.isGetResourcesLoading = false;
        state.actions = payload.actions;
      },
      updateResourcesFailed: (state: PolicyState , { payload}: any) => {
        state.isGetResourcesLoading = false;
        state.getResourcesFailed = payload;
      },
      updateResourceRedux: (state: PolicyState, { payload }: any) => {
        state.resources = state.resources;
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      resources: [],
      isGetResourcesLoading: false,
      getResourcesFailed: false
      // Want Add more State Here...
    }
  }
  createSlice_() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.clone,
    });
  }
  
}

const newSlice = new PolicyClassExtend();
const data = newSlice.createSlice_();


export const policySliceAction = data.actions;
export default data.reducer;