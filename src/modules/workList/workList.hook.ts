
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetch, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { workListActions } from "./redux/reducer";
import { get } from "lodash";
import { cloneInitState } from "./workList.modal";
import { RootState } from "~/redux/store";
const MODULE = "workList";
const MODULE_VI = "List công việc";
const getSelector = (key: keyof cloneInitState) => (state: RootState) =>
  state[MODULE][key];
  const listWorkConfig = getSelector('listWorkConfig');
  const loadingListWorkConfig = getSelector('isLoadingListWorkConfig');
  const getListWorkConfigFailed = getSelector('getListWorkConfigFailed');
  const dataBoardConfig = getSelector('dataBoardConfig')
const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdLoadingSelector,
  getByIdSelector,
  getByIdFailedSelector,
  deleteSuccessSelector,
  deleteFailedSelector,
  isSubmitLoadingSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const useWorkListPaging = () => useSelector(pagingSelector);

export const useGetWorkLists = (query?:any) => {
  return useFetchByParam({
    action: workListActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param:query
  });
};
export const useGetWorkList = (id: any) => {
  return useFetchByParam({
    action: workListActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};
export const useGetListBoardConfig = (query?:any) => {
  return useFetchByParam({
    action: workListActions.getListBoardConfigRequest,
    loadingSelector: loadingListWorkConfig,
    dataSelector: listWorkConfig,
    failedSelector: getListWorkConfigFailed,
    param:query
  });
}

export const useCreateWorkList = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: workListActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};
export const useListBoardConfigItem = (query?:any) => {
  const data = useSelector(dataBoardConfig);
   return [data]
};
export const useUpdateWorkList = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: workListActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteWorkList = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: workListActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};
export const useUpdatePosition = (payload?: any) => {
  return useSubmit({
    action: workListActions.updatePosition,
    loadingSelector: isSubmitLoadingSelector,
    
  })
}
export const useUpdatePositionBoardConfig = (payload?: any) => {
  return useSubmit({
    action: workListActions.updatePositionBoardConfig,
    loadingSelector: isSubmitLoadingSelector,
    
  })
};
export const useResetAction = () => {
  return useResetState(workListActions.resetAction);
}

export const useWorkListQueryParams = (sprintId?: any) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const code = query.get('code');
  const name = query.get('name');
  const createdAt = query.get('createdAt');
  const taskId = query.get('taskId')
  const statusId = query.get("statusId");
  const assignUser = query.get("assignUser");
  const startDate = query.get("startDate");
  const endDate = query.get("endDate");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      sprintId,
      code,
      name,
      createdAt,
      taskId,
      statusId,
      assignUser,
      startDate,
      endDate,
    };
    return [queryParams];

  }, [page, limit,sprintId, keyword, createSuccess,code,name,createdAt,taskId,statusId,startDate,endDate,assignUser, deleteSuccess]);
};

export const useUpdateWorkListParams = (
  query?: any,
  listOptionSearch?: any[]
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState(get(query, "keyword"));
  useEffect(() => {
    setKeyword(get(query, "keyword"));
  }, [query]);
  const onParamChange = (param: any) => {

    clearQuerySearch(listOptionSearch, query, param);

    // if (!param.page) {
    //   query.page = 1;
    // };


    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};