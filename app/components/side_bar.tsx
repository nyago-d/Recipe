import { Form, NavLink } from "@remix-run/react";
import { Menu } from "@prisma/client";

/**
 * 左メニュー
 * 
 * @description 通常のReactコンポーネントです。メニューが増えるとすごいことになりそう。
 */
export default function Sidebar({ menus, query, onChange }: { 
  menus: Menu[], 
  query: string | null, 
  onChange: (query: React.ChangeEvent<HTMLInputElement>) => void
}) {

    // ここでID振ると排他制御できないけど、とりあえず
    const newMenuId = (menus.at(-1)?.menuId ?? 0) + 1;

    return (
      <div className="sidebar">
        <div className="search">
        <Form>
          <input 
            type="text" 
            name="query"
            defaultValue={query || ""} 
            onChange={onChange} />
        </Form>
        </div>
        {menus.map((menu) => (
            <div key={menu.menuId} className="menu-item">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "active" : ""
                  }
                  to={`menu/${menu.menuId}`}>
                    {menu.name}
                </NavLink>
            </div>
        ))}
        <div className="menu-item">
          <NavLink 
            className={({ isActive }) => 
              isActive ? "active" : ""
            }
            to={`edit/${newMenuId}`}>
              メニューを追加 +
          </NavLink>
        </div>
      </div>
    );
}