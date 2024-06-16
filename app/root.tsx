import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";
import Sidebar from "./components/side_bar";
import { loadMenus } from "./services/menu_service";
import appStylesHref from "./styles/common.css?url";

// CSSの設定
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

/**
 * 画面描画時に実行されます
 * 
 * @description 左メニューの情報を取得します
 */
export async function loader({ request } : LoaderFunctionArgs) {

    const url = new URL(request.url);
    const query = url.searchParams.get("query");
    const menus = await loadMenus(query);

    return json({ menus, query });
}

/**
 * メイン処理
 */
export default function App()  {

  const { menus, query } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  // 検索ボックスの値が変更されたときにsubmit
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isFirstSearch = query === null;
    submit(event.currentTarget, {
      replace: !isFirstSearch,
    });;
  }

  // URLを検索ボックスに反映
  useEffect(() => {
      const searchField = document.getElementById("query");
      if (searchField instanceof HTMLInputElement) {
        searchField.value = query || "";
      }
  }, [query]);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container">
          <Sidebar menus={menus} query={query} onChange={onChange}/>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}