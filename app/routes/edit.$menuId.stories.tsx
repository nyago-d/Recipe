import { createRemixStub } from "@remix-run/testing";
import { Meta, StoryObj } from "@storybook/react";
import { IngredientGroup, MenuAll } from "~/services/menu_service";
import { MenuStep, MenuTag, MenuLink } from "@prisma/client";
import EditMenu from "./edit.$menuId";
import editCss from "../styles/edit.css?raw";

const meta: Meta<typeof EditMenu> = {
    component: EditMenu,
    title: 'EditMenu',
};
export default meta;

// Storyを定義
type Story = StoryObj<typeof EditMenu>;

/**
 * 空
 */
export const Empty: Story = {
    decorators: [
        Story => {
            const Stub = createRemixStub([
                {
                    path: '/',
                    loader: () => ({
                        menu: { 
                            menuId: 1, 
                            name: "メニュー1", 
                            steps: [] as MenuStep[], 
                            tags: [] as MenuTag[], 
                            links: [] as MenuLink[],
                            ingredientGroups: [] as IngredientGroup[],
                        } as MenuAll,
                        buttonName: "登 録",
                    }),
                    Component: () => 
                        <>
                            <style>${editCss}</style>
                            <div className="container"><Story /></div>
                        </>,
                },
            ]);
            return <Stub />;
        },
    ],
};

/**
 * 通常
 */
export const Default: Story = {
    decorators: [
        Story => {
            const Stub = createRemixStub([
                {
                    path: '/',
                    loader: () => ({
                        menu: { 
                            menuId: 1, 
                            name: "メニュー1", 
                            imageUrl: "https://www.sirogohan.com/_files/recipe/images/hanba-gu/hanba-gu6321.JPG",
                            steps: [
                                { seqNo: 1, text: "ステップ1" },
                                { seqNo: 2, text: "ステップ2" },
                            ] as MenuStep[], 
                            tags: [
                                { tag: "タグ1" },
                                { tag: "タグ2" },
                            ] as MenuTag[], 
                            links: [
                                { title: "リンク1", url: "http://example.com" },
                                { title: "リンク2", url: "http://example.com" },
                            ] as MenuLink[],
                            ingredientGroups: [
                                { groupName: "グループ1", groupId: 1, ingredients: [ { name: "材料1", amount: "1個" }, { name: "材料2", amount: "2個" } ] },
                                { groupName: "グループ2", groupId: 2, ingredients: [ { name: "材料3", amount: "3個" }, { name: "材料4", amount: "4個" } ] },
                            ] as IngredientGroup[],
                        } as MenuAll,
                        buttonName: "更 新",
                    }),
                    Component: () => 
                        <>
                            <style>${editCss}</style>
                            <div className="container"><Story /></div>
                        </>,
                },
            ]);
            return <Stub />;
        },
    ],
};