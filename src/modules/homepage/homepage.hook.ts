// Please UnComment To use

import { get } from "lodash";
// import { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { clearQuerySearch, getExistProp } from "~/utils/helpers";
// import {
//     getSelectors,
//     useFailed, useFetchByParam,
//     useQueryParams,
//     useSubmit,
//     useSuccess
// } from "~/utils/hook";
// import { homepageSliceAction } from "./redux/reducer";
// const MODULE = "homepage";
// const MODULE_VI = "";

// const {
//   loadingSelector,
//   listSelector,
//   getListFailedSelector,
//   getByIdLoadingSelector,
//   getByIdSelector,
//   getByIdFailedSelector,
//   deleteSuccessSelector,
//   deleteFailedSelector,
//   isSubmitLoadingSelector,
//   createSuccessSelector,
//   createFailedSelector,
//   updateSuccessSelector,
//   updateFailedSelector,
//   pagingSelector,
// } = getSelectors(MODULE);

// export const useHomepagePaging = () => useSelector(pagingSelector);

// export const useGetHomepages = (param:any) => {
//   return useFetchByParam({
//     action: homepageSliceAction.getListRequest,
//     loadingSelector: loadingSelector,
//     dataSelector: listSelector,
//     failedSelector: getListFailedSelector,
//     param
//   });
// };
// export const useGetHomepage = (id: any) => {
//   return useFetchByParam({
//     action: homepageSliceAction.getByIdRequest,
//     loadingSelector: getByIdLoadingSelector,
//     dataSelector: getByIdSelector,
//     failedSelector: getByIdFailedSelector,
//     param: id,
//   });
// };

// export const useCreateHomepage = (callback?: any) => {
//   useSuccess(
//     createSuccessSelector,
//     `Tạo mới ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(createFailedSelector);

//   return useSubmit({
//     action: homepageSliceAction.createRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useUpdateHomepage = (callback?: any) => {
//   useSuccess(
//     updateSuccessSelector,
//     `Cập nhật ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(updateFailedSelector);

//   return useSubmit({
//     action: homepageSliceAction.updateRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useDeleteHomepage = (callback?: any) => {
//   useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
//   useFailed(deleteFailedSelector);

//   return useSubmit({
//     action: homepageSliceAction.deleteRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useHomepageQueryParams = () => {
//   const query = useQueryParams();
//   const limit = query.get("limit") || 10;
//   const page = query.get("page") || 1;
//   const keyword = query.get("keyword");
//   const createSuccess = useSelector(createSuccessSelector);
//   const deleteSuccess = useSelector(deleteSuccessSelector);
//   return useMemo(() => {
//     const queryParams = {
//       page,
//       limit,
//       keyword,
//     };
//     return [queryParams];
//     //eslint-disable-next-line
//   }, [page, limit, keyword, createSuccess, deleteSuccess]);
// };

// export const useUpdateHomepageParams = (
//   query: any,
//   listOptionSearch?: any[]
// ) => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const [keyword, setKeyword] = useState(get(query, "keyword"));
//   useEffect(() => {
//     setKeyword(get(query, "keyword"));
//   }, [query]);
//   const onParamChange = (param: any) => {
//     // Clear Search Query when change Params
//     clearQuerySearch(listOptionSearch, query, param);

//     if (!param.page) {
//       query.page = 1;
//     };

//     // Convert Query and Params to Search Url Param
//     const searchString = new URLSearchParams(
//       getExistProp({
//         ...query,
//         ...param,
//       })
//     ).toString();

//     // Navigate
//     navigate(`${pathname}?${searchString}`);
//   };

//   return [keyword, { setKeyword, onParamChange }];
// };