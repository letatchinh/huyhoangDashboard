import "./index.scss";

import React from "react";
type propsType = {
    status : string,
    statusVi : string,

};
export default function StatusTag({status,statusVi}: propsType): React.JSX.Element {
  return (
    <span className={`status ${status?.toLowerCase()}`}>
      {statusVi}
    </span>
  );
};