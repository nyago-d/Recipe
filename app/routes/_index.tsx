import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "レシピ" }
  ];
};

export default function Index() {
  return (<></>);
}
