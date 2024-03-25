import { 
    getSelectors,
    useFailed,
    useFetch,
    useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess,
 } from "~/utils/hook";
import { manufacturerSliceAction } from "./redux/reducer";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get, identity } from "lodash";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import { useSelector } from "react-redux";
const MODULE = "manufacturer";
const MODULE_VI = "hãng sản xuất";
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

  export const useManufacturerQueryParams = () => {
    const query = useQueryParams();
    const limit = query.get("limit") || 10;
    const page = query.get("page") || 1;
    const keyword = query.get("keyword");
    const status = query.get("status");
    const createSuccess = useSelector(createSuccessSelector);
    const updateSuccess = useSelector(updateSuccessSelector);
    const deleteSuccess = useSelector(deleteSuccessSelector);
    return useMemo(() => {
      const queryParams = {
        page,
        limit,
        keyword,
        status,
      };
      return [queryParams];
      //eslint-disable-next-line
    }, [page, limit,status, keyword,createSuccess,deleteSuccess,updateSuccess]);
  };
  
  export const useManufacturerParams = (
    query: any,
    listOptionSearch?: any[]
  ) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [keyword, setKeyword] = useState(get(query, "keyword"));
    useEffect(() => {
      setKeyword(get(query, "keyword"));
    }, [query]);
    const onParamChange = (param: any) => {
      // Clear Search Query when change Params
      clearQuerySearch(listOptionSearch, query, param);
  
      if (!param.page) {
        query.page = 1;
      };
  
      // Convert Query and Params to Search Url Param
      const searchString = new URLSearchParams(
        getExistProp({
          ...query,
          ...param,
        })
      ).toString();
  
      // Navigate
      navigate(`${pathname}?${searchString}`);
    };
  
    return [keyword, { setKeyword, onParamChange }];
  };
  export const useManufacturerPaging =()=> useSelector(pagingSelector)
  export const useGetManufacturerList = (query:any) => {
      return useFetchByParam({
          action: manufacturerSliceAction.getListRequest,
          loadingSelector,
          dataSelector: listSelector,
          failedSelector: getListFailedSelector,
          param: query,
      })
  }

  export const useGetManufacturerById = (id: String) => {
    return useFetchByParam({
      action: manufacturerSliceAction.getByIdRequest,
      loadingSelector: getByIdLoadingSelector,
      dataSelector: getByIdSelector,
      failedSelector: getByIdFailedSelector,
      param: id,
    });
  }

  export const useCreateManufacturer = (callBack?:any) => {
    useSuccess(createSuccessSelector, `Thêm ${MODULE_VI} thành công`, callBack);
    useFailed(createFailedSelector);
    return useSubmit({
        action: manufacturerSliceAction.createRequest,
        loadingSelector: isSubmitLoadingSelector,
  
})
}
  export const useDeleteManufacturer =(callBack?:any)=>{
    useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callBack);
    useFailed(deleteFailedSelector);
    return useSubmit({
        action: manufacturerSliceAction.deleteRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  }

  export const useUpdateManufacturer = (callBack?:any) => {
    useSuccess(updateSuccessSelector, `Cập nhật ${MODULE_VI} thành công`, callBack);
    useFailed(updateFailedSelector);
    return useSubmit({
        action: manufacturerSliceAction.updateRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  }
  export const useResetAction = () => {
    return useResetState(manufacturerSliceAction.resetAction);
  };