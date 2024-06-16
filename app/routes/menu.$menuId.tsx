import { Link, json, useLoaderData } from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import appStylesHref from "../styles/menu.css?url";
import { loadMenu } from "~/services/menu_service";

// CSSの設定
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

/**
 * 画面描画時に実行されます
 * 
 * @description メイン画面の情報を取得します。パラメタ不正は死にます。
 */
export async function loader({ params } : LoaderFunctionArgs) {
    const menu = await loadMenu(Number(params.menuId));
    if (menu === null) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ menu });
}

/**
 * メイン処理
 * 
 * @description スマホサイズ対応できてないけど、一応HTMLの構成的にはCSSで対応できるはず…。たぶん。
 */
export default function Menu() {

    const { menu } = useLoaderData<typeof loader>();

    return (
        <div className="main-content">

            <div className="header column2-left">
                <h2>{menu.name}</h2>
                <Link to={`/edit/${menu.menuId}`}>レシピを更新</Link>
                {menu.imageUrl && <img src={menu.imageUrl} alt={menu.name} className="main-image" />}
            </div>

            <div className="ingredients column2-right">
                <h2>材料</h2>
                {menu.ingredientGroups.map((group, index) => (
                    <div key={index} className="ingredient">
                        <ul>
                            {group.ingredients.map((detail, index) => (
                                <li key={index}>{detail.name}：{detail.amount}</li>
                            ))}
                        </ul>
                        {group.groupName && <p className="group">{group.groupName ?? ""}</p>}
                    </div>
                ))}
            </div>
            
            <div className="steps column2-left">
                <h2>手順</h2>
                <ol>
                    {menu.steps.map((step, index) => (
                        <li key={index}>{step.text}</li>
                    ))}
                </ol>
            </div>

            <div className="information column2-right">
                <h2>情報</h2>
                <div className="tags">
                    <p>タグ</p>
                    {menu.tags.map((tag, index) => (
                        <Link key={index} className="tag" to={`/?query=${tag.tag}`}>{tag.tag}</Link>
                    ))}
                </div>
                <div className="link">
                    <p>参考リンク</p>
                    {menu.links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
                    ))}
                </div>
            </div>
            
      </div>
    );
}