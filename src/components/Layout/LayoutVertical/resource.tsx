import { AppstoreFilled, AppstoreOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import POLICIES from "~/modules/policy/policy.auth";

type MenuItem = Required<MenuProps>["items"][number];
function getItem({ label, icon, children, path, key, permission }: ItemType): any {
  
  return {
    key,
    icon,
    children,
    permission,
    label: path ? (
      <NavLink
        className={() => `layoutVertical--content__navbar__navLink`}
        to={path}
      >
        {label}
      </NavLink>
    ) : (
      label
    ),
  } as MenuItem 
};
type ItemType = {
  label: string;
  icon?: React.ReactNode;
  children?: ItemType[];
  path?: string;
  key: string;
  permission?: any; 
};
export const resource: ItemType[] = [
  {
    label: "WorldPharmaVN",
    key: "WorldPharmaVN",
    icon: <AppstoreFilled />,
    children: [
      {
        label: "Cài đặt",
        key: "WorldPharmaVN-setting",
        icon: <AppstoreFilled />,
        children: [
          {
            label: "Cấu hình danh mục",
            path: PATH_APP.worldPharma.productConfig,
            key: PATH_APP.worldPharma.productConfig,
            // permission :[POLICIES.READ_USERGROUP],
          },
        ],
      },
    ],
  },

  // Nhà cung cấp
  {
    label: "Nhà cung cấp",
    icon: <AppstoreOutlined />,
    path: PATH_APP.supplier.root,
    key: PATH_APP.supplier.root,
  },

      // Chi nhánh
    {
      label : "Chi nhánh",
      key: "branch",
      permission :[POLICIES.READ_BRANCH],
      children : [
        {
          label : "Danh sách chi nhánh",
          path : PATH_APP.branch.root,
          key : PATH_APP.branch.root,
        }
      ],
      icon :<AppstoreFilled />,
    },
      //Nhân viên
      {
        label : "Nhân viên",
        icon: <FontAwesomeIcon icon ={faUsers} />,
        path : PATH_APP.employee.root,
        key: PATH_APP.employee.root,
        permission :[POLICIES.READ_EMPLOYEE],
      },
      //Người dùng
      {
        label : "Người dùng",
        icon: <FontAwesomeIcon icon = {faUser} />,
        path : PATH_APP.user.root,
        key: PATH_APP.user.root,
        permission :[POLICIES.READ_USER, POLICIES.READ_USERGROUP],
      },

        // Báo cáo
    {
      label : "Báo cáo",
      key: "report",
      children : [
        {
          label : "Thống kê bán hàng của nhà cung cấp",
          path : PATH_APP.report.supplier,
          key : PATH_APP.report.supplier,
        }
      ],
      icon :<AppstoreFilled />,
    },

 ];

//Required permission is string[][]; 
const NavbarItems = resource.map((first) => {
      if (first.children?.length) {
        const newChildFirst = first.children.map((second) => {
          if (second.children?.length) {
            const newChildSecond = second.children.map((third) => getItem(third));
            return getItem({ ...second, children: newChildSecond });
          } else {
            return getItem(second)};
        })
        return getItem({ ...first, children: newChildFirst })
      } else {
        return getItem(first)
      };
});
export default NavbarItems;
