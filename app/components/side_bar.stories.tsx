import { createRemixStub } from "@remix-run/testing";
import { Meta, StoryObj } from '@storybook/react';
import Sidebar from './side_bar';
import "../styles/common.css";

// Meta情報を定義
const meta: Meta<typeof Sidebar> = {
    component: Sidebar,
    title: 'Sidebar',
    decorators: [
        Story => {
            // Remixのcomponentを利用しているためStub化
            const Stub = createRemixStub([
                {
                    path: '/',
                    Component: () => <div className="container"><Story /></div>,    // スタイルを当てたいので.containerでwrap
                },
            ]);
            return <Stub />;
        },
    ],
};
export default meta;

// Storyを定義
type Story = StoryObj<typeof Sidebar>;

/**
 * 空のメニュー
 */
export const Empty: Story = {
    args: {
        menus: [],
        query: null,
    }
};

/**
 * 通常のメニュー
 */
export const Default: Story = {
    args: {
        menus: [ { menuId: 1, name: "メニュー1", imageUrl: "" }, { menuId: 2, name: "メニュー2", imageUrl: "" } ],
        query: "hoge",
    }
};

/**
 * 多いメニュー
 */
export const Large: Story = {
    args: {
        menus: [ 
            { menuId: 1, name: "メニュー1", imageUrl: "" }, 
            { menuId: 2, name: "メニュー2", imageUrl: "" }, 
            { menuId: 3, name: "メニュー3", imageUrl: "" }, 
            { menuId: 4, name: "メニュー4", imageUrl: "" }, 
            { menuId: 5, name: "メニュー5", imageUrl: "" }, 
            { menuId: 6, name: "メニュー6", imageUrl: "" }, 
            { menuId: 7, name: "メニュー7", imageUrl: "" }, 
            { menuId: 8, name: "メニュー8", imageUrl: "" }, 
            { menuId: 9, name: "メニュー9", imageUrl: "" }, 
            { menuId: 10, name: "メニュー10", imageUrl: "" },
        ],
        query: "super long query string that is too long to display in the input field",
    }
};