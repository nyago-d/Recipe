import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { IngredientGroup, MenuAll, deleteMenu, loadMenu, saveMenu } from "~/services/menu_service";
import appStylesHref from "../styles/edit.css?url";
import { MenuStep, MenuTag } from "@prisma/client";

// CSSの設定
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: appStylesHref },
];

/**
 * 画面描画時に実行されます
 * 
 * @description 読み込めなかったら新規登録画面という雑な作り。
 */
export async function loader({ params } : LoaderFunctionArgs) {
    const menuId = Number(params.menuId);
    const menu = await loadMenu(menuId)
    if (menu) {
        return json({ menu, buttonName: "更新" });
    } else {
        const newMenu = { 
            menuId: menuId, 
            name: "", 
            imageUrl: "", 
            ingredientGroups: [ { 
                menuId: menuId, 
                groupId: 1, 
                groupName: "", 
                ingredients: [ { menuId: menuId, groupId: 1, seqNo: 1, name: "", amount: "" } ] 
            } ], 
            steps: [ { menuId: menuId, seqNo: 1, text: "" } ],
            tags: [ { menuId: menuId, tag: "" }], 
            links: [ { menuId: menuId, title: "", url: "" } ] 
        } as MenuAll;
        return json({ menu: newMenu, buttonName: "登 録" });
    }
}

/**
 * 登録・更新・削除処理
 * 
 * @description パス同じでForm分けて種別で分岐、完了後はリダイレクト。
 */
export async function action({ request } : ActionFunctionArgs) {

    const formData = await request.formData();
    console.log(formData.get("type"));

    // formの種別が削除の場合削除
    if (formData.get("type")?.toString() === "delete") {
        await deleteMenu(Number(formData.get("menuId")!.toString()));
        return redirect("/");

    // formの種別が更新の場合更新
    } else {
        // 特にチェックを何もしていないので、エラーが出るかも
        const menu = JSON.parse(formData.get("json")!.toString()) as MenuAll;
        console.log(menu);
        await saveMenu(menu);
        return redirect(`/menu/${menu.menuId}`);
    }
}

/**
 * メイン処理
 * 
 * @description 結構複雑な構成になってしまったので、nameでそのままpostせずにjsonでまとめてpostするようにしています。
 * @description ボタンで明示的に要素追加してるけど、全部入力終わったら新しい欄が出てきたほうが素敵かも。
 */
export default function EditMenu() {
    
    const { menu, buttonName } = useLoaderData<typeof loader>();
    
    const [name, setName] = useState(menu.name);
    const [imageUrl, setImageUrl] = useState(menu.imageUrl || "");
    const [ingredientGroups, setIngredientGroups] = useState(menu.ingredientGroups);
    const [steps, setSteps] = useState(menu.steps);
    const [tags, setTags] = useState(menu.tags);
    const [links, setLinks] = useState(menu.links);
    
    const navigate = useNavigate();
    const submit = useSubmit();
  
    // 材料グループを追加
    const addIngredientGroup = () => {
        setIngredientGroups([
            ...ingredientGroups, 
            { 
                menuId: menu.menuId, 
                groupId: ingredientGroups.at(-1)?.groupId ?? 0 + 1, 
                groupName: "",
                ingredients: [
                    { 
                        menuId: menu.menuId, 
                        groupId: ingredientGroups.at(-1)?.groupId ?? 0 + 1, 
                        seqNo: 1,
                        name: "",
                        amount: "" 
                    }
                ]
            } as IngredientGroup
        ]);
    };

    // 材料を追加
    const addIngredient = (group_index: number) => {
        const newIngredients = [...ingredientGroups];
        newIngredients[group_index].ingredients.push({
            menuId: menu.menuId, 
            groupId: ingredientGroups[group_index].groupId, 
            seqNo: ingredientGroups[group_index].ingredients.length + 1, 
            name: "", 
            amount: "" 
        });
        setIngredientGroups(newIngredients);
    }
  
    // 手順を追加
    const addStep = () => {
        setSteps([
            ...steps, 
            { 
                menuId: menu.menuId, 
                seqNo: steps.length + 1, 
                text: '' 
            } as MenuStep
        ]);
    };
  
    // タグを追加
    const addTag = () => {
        setTags([
            ...tags
            , {
                menuId: menu.menuId, 
                tag: '' 
            } as MenuTag
        ]);
    };
  
    // リンクを追加
    const addLink = () => {
        setLinks([
            ...links
            , {
                menuId: menu.menuId, 
                title: '', 
                url: '' 
            }
        ]);
    };

    // 更新処理
    const submitMenu = (event : React.FormEvent<HTMLFormElement>) => {
        if (!confirm("更新しますか？")) {
            event.preventDefault();
        }
        const submitMenu = {
            menuId: menu.menuId,
            name,
            imageUrl,
            ingredientGroups: ingredientGroups.filter(g => g.ingredients.some(i => i.name || i.amount)).map((group, group_index) => ({ 
                menuId: group.menuId, 
                groupId: group_index + 1, 
                groupName: group.groupName, 
                ingredients: group.ingredients.filter(i => i.name || i.amount).map((ingredient, index) => ({
                    menuId: ingredient.menuId, 
                    groupId: ingredient.groupId, 
                    seqNo: index + 1, 
                    name: ingredient.name, 
                    amount: ingredient.amount
                }))
            })),
            steps: steps.filter(s => s.text).map((step, index) => ({ 
                menuId: step.menuId, 
                seqNo: index + 1, 
                text: step.text 
            })),
            tags: tags.filter(t => t.tag).map(tag => ({
                menuId: tag.menuId, 
                tag: tag.tag
            })),
            links: links.filter(l => l.title || l.url).map(link => ({
                menuId: link.menuId, 
                title: link.title, 
                url: link.url
            }))
        } as MenuAll;
        submit({ "json": JSON.stringify(submitMenu), "type": "update" }, { method: "post" });
        event.preventDefault();
    };

    // 削除処理
    const deleteMenu = (event : React.FormEvent<HTMLFormElement>) => {
        if (!confirm("削除しますか？")) {
            event.preventDefault();
        }
        submit({ "menuId": menu.menuId, "type": "delete" }, { method: "post" });
        event.preventDefault();
    };
    
    return (
        <div className="main-content">
          <h1>メニュー登録</h1>
          <div className="form">
            <div className="form-group">
              <div className="title-area">
                  <h2>メニュー名</h2>
              </div>
              <div className="input-area full">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value) } />
              </div>
            </div>
            <div className="form-group">
              <div className="title-area">
                <h2>画像</h2>
              </div>
              <div className="input-area full">
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value) } />
              </div>
            </div>
            <div className="form-group">
                <div className="title-area">
                    <h2>材料</h2>
                    <button type="button" onClick={addIngredientGroup}>ブロック追加 +</button>
                </div>
                <div className="input-area">
                {ingredientGroups.map((group, group_index) => (
                    <div key={group_index} className="ingredient-block">
                        <input type="text" className="group-name" value={group.groupName ?? ""} onChange={(e) => {
                            const newIngredients = [...ingredientGroups];
                            newIngredients[group_index].groupName = e.target.value;
                            setIngredientGroups(newIngredients);                            
                        }} />
                        <span>（グループ名）</span>
                        <button type="button" onClick={() => addIngredient(group_index)}>材料追加 +</button>
                        <div>
                            <span className="ingredient">材料</span>
                            <span className="quantity">分量</span>
                        </div>
                        {group.ingredients.map((ingredient, index) => (
                            <div key={index}>
                                <input type="text" className="ingredient" value={ingredient.name} onChange={(e) => {
                                    const newIngredients = [...ingredientGroups];
                                    newIngredients[group_index].ingredients[index].name = e.target.value;
                                    setIngredientGroups(newIngredients);
                                }} />
                                <input type="text" className="quantity" value={ingredient.amount} onChange={(e) => {
                                    const newIngredients = [...ingredientGroups];
                                    newIngredients[group_index].ingredients[index].amount = e.target.value;
                                    setIngredientGroups(newIngredients);
                                }} />
                            </div>
                        ))}
                    </div>
                ))}
                </div>
            </div>
            <div className="form-group">
                <div className="title-area">
                    <h2>手順</h2>
                    <button type="button" onClick={addStep}>手順追加 +</button>
                </div>
                <div className="input-area">
                {steps.map((step, index) => (
                    <input key={index} type="text" className="step" value={step.text} onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].text = e.target.value;
                        setSteps(newSteps);
                    }} />
                ))}
                </div>
            </div>
            <div className="form-group">
                <div className="title-area">
                    <h2>タグ</h2>
                    <button type="button" onClick={addTag}>タグ追加 +</button>
                </div>
                <div className="input-area">
                {tags.map((tag, index) => (
                    <input key={index} type="text" className="tag" value={tag.tag} onChange={(e) => {
                        const newTags = [...tags];
                        newTags[index].tag = e.target.value;
                        setTags(newTags);
                    }} />
                ))}
                </div>
            </div>
            <div className="form-group">
                <div className="title-area">
                    <h2>リンク</h2>
                    <button type="button" onClick={addLink}>リンク追加 +</button>
                </div>
                <div className="input-area">
                    <div className="link-header">
                        <span className="link-title">タイトル</span>
                        <span className="link-url">URL</span>
                    </div>
                    {links.map((link, index) => (
                        <div key={index} className="link-block">
                            <input type="text" className="link-title" value={link.title} onChange={(e) => {
                                const newLinks = [...links];
                                newLinks[index].title = e.target.value;
                                setLinks(newLinks);
                            }} />
                            <input type="text" className="link-url" value={link.url} onChange={(e) => {
                                const newLinks = [...links];
                                newLinks[index].url = e.target.value;
                                setLinks(newLinks);
                            }} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="form-group">
                <Form method="post" onSubmit={submitMenu}>
                    <button type="submit" className="button-update">{buttonName}</button>
                </Form>
                <Form method="post" onSubmit={deleteMenu}>
                    <button type="submit" className="button-delete">削 除</button>
                </Form>
                <button type="button" className="button-cancel" onClick={() => navigate(-1)}>キャンセル</button>
            </div>
          </div>
        </div>
    );
}