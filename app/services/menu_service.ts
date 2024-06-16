import { Menu, MenuIngredient, MenuIngredientGroup, MenuLink, MenuStep, MenuTag, PrismaClient } from "@prisma/client";

export type MenuAll = Menu & { steps: MenuStep[], tags: MenuTag[], links: MenuLink[], ingredientGroups: IngredientGroup[] };
export type IngredientGroup = MenuIngredientGroup & { ingredients: MenuIngredient[] };

/**
 * メニュー一覧を読み込みます
 */
export async function loadMenus(query: string | null) : Promise<Menu[]> {
    const prisma = new PrismaClient();
    if (!query) {
        return await prisma.menu.findMany({ orderBy: { menuId: "asc" } });
    } else {
        return await prisma.$queryRaw`select distinct menu.* 
from menu 
left join menu_tag 
on menu.menuId = menu_tag.menuId 
where menu.name like concat('%', ${query}, '%')
or menu_tag.tag like concat('%', ${query}, '%')
order by menu.menuId`;
    }
}

/**
 * メニューを読み込みます
 */
export async function loadMenu(menuId: number) : Promise<MenuAll | null> {
    const prisma = new PrismaClient();
    return await prisma.menu.findUnique({
        where: { menuId: menuId },
        include: { 
            ingredientGroups: {
                include: {
                    ingredients: true
                }
            },
            steps: true,
            tags: true,
            links: true,
         },
    });
}

/**
 * メニューを削除します
 */
export async function deleteMenu(menuId: number) {
    const prisma = new PrismaClient();
    await prisma.menu.deleteMany({
        where: { menuId: menuId }
    });
}

/**
 * メニューを登録します
 */
export async function saveMenu(menu: MenuAll) {
    const prisma = new PrismaClient();
    await prisma.$transaction([
        // onDelete: Cascadeなので全部消えるはず
        prisma.menu.deleteMany({
            where: { menuId: menu.menuId }
        }),
        prisma.menu.create({
            include: { 
                ingredientGroups: {
                    include: {
                        ingredients: true
                    }
                },
                steps: true,
                tags: true,
                links: true,
            },
            data: {
                menuId: menu.menuId,
                name: menu.name,
                imageUrl: menu.imageUrl,
                ingredientGroups: {
                    create: menu.ingredientGroups.map(group => ({
                        groupName: group.groupName,
                        groupId: group.groupId,
                        ingredients: {
                            create: group.ingredients
                        }
                    }))
                },
                steps: {
                    create: menu.steps.map(step => ({ seqNo: step.seqNo, text: step.text }))
                },
                tags: {
                    create: menu.tags.map(tag => ({ tag: tag.tag }))
                },
                links: {
                    create: menu.links.map(link => ({ title: link.title, url: link.url }))
                }
            }
        })
    ]);
}
